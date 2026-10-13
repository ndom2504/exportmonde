import os
import re
import uuid
import ipaddress
import logging
import time
import asyncio
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from datetime import datetime, timezone, timedelta

import httpx
import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
NOTIF_EMAIL = os.environ.get("NOTIF_EMAIL", "info@misterdil.ca")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
SITE_URL = "https://www.exportmondeprestigeinc.com"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("emp")

app = FastAPI(title="Export Monde Prestige Inc. API")
api_router = APIRouter(prefix="/api")

origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ---------- helpers ----------
def now_iso():
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(minutes=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response, user_id: str, email: str):
    response.set_cookie(key="access_token", value=create_access_token(user_id, email),
                        httponly=True, secure=True, samesite="none", max_age=1800, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user_id),
                        httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Jeton invalide")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Jeton invalide")
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


def client_ip(request: Request) -> str:
    return request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0].strip()


_LEAD_HITS = {}

def rate_ok(ip: str, limit: int = 5, window: int = 3600) -> bool:
    t = time.time()
    hits = [h for h in _LEAD_HITS.get(ip, []) if t - h < window]
    if len(hits) >= limit:
        _LEAD_HITS[ip] = hits
        return False
    hits.append(t)
    _LEAD_HITS[ip] = hits
    return True


def clean(value: str, max_len: int = 500) -> str:
    return value.strip()[:max_len]


def slugify(text: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", text.lower().strip()).strip("-")
    return text[:80] or uuid.uuid4().hex[:12]


# ---------- email (Emergent managed Resend) ----------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                               headers={"X-Email-Key": EMAIL_KEY}, json=payload)
    resp.raise_for_status()
    return resp.json().get("id")


def notif_email_html(lead: dict) -> str:
    rows = [
        ("Nom", f"{lead.get('first_name', '')} {lead.get('last_name', '')}"),
        ("Entreprise", lead.get("company", "-")),
        ("Courriel", lead.get("email", "-")),
        ("Téléphone", lead.get("phone") or "-"),
        ("Service", lead.get("service_label", "-")),
        ("Budget indicatif", lead.get("budget") or "-"),
        ("Échéance souhaitée", lead.get("deadline") or "-"),
    ]
    trs = "".join(
        f'<tr><td style="padding:8px 12px;border-bottom:1px solid #E5E9F0;font-family:Arial,sans-serif;'
        f'font-size:13px;color:#5B6575">{escape(k)}</td>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #E5E9F0;font-family:Arial,sans-serif;'
        f'font-size:13px;color:#0A1E3C"><strong>{escape(v)}</strong></td></tr>'
        for k, v in rows
    )
    return f"""<div style="background:#F6F7F9;padding:24px">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #E5E9F0">
    <tr><td style="padding:24px;border-bottom:3px solid #0A1E3C">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#0A1E3C">Nouvelle demande de soumission</p>
      <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#5B6575">Export Monde Prestige Inc. — reçue le {escape(datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M UTC'))}</p>
    </td></tr>
    <tr><td style="padding:8px 0">{trs}</td></tr>
    <tr><td style="padding:12px">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#5B6575">Description du besoin :</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#0A1E3C;white-space:pre-line">{escape(lead.get('message', ''))}</p>
    </td></tr>
    <tr><td style="padding:20px 24px;background:#F6F7F9">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#5B6575">Consultez et gérez cette demande dans l'espace administratif de votre site :
        <a href="{SITE_URL}/admin" style="color:#1E6FEB">{SITE_URL}</a></p>
      <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#5B6575">Envoyé par Export Monde Prestige Inc. — <a href="mailto:{escape(NOTIF_EMAIL)}" style="color:#1E6FEB">{escape(NOTIF_EMAIL)}</a></p>
    </td></tr>
  </table>
</div>"""


# ---------- models ----------
class LeadCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    company: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    service: str = Field(min_length=1, max_length=60)
    message: str = Field(min_length=20, max_length=4000)
    budget: Optional[str] = Field(default=None, max_length=60)
    deadline: Optional[str] = Field(default=None, max_length=60)
    consent: bool
    company_website: Optional[str] = Field(default=None, max_length=200)
    lang: Optional[str] = Field(default="fr", max_length=5)

    @field_validator("first_name", "last_name", "company", "phone", "budget", "deadline")
    @classmethod
    def strip_fields(cls, v):
        return v.strip() if isinstance(v, str) else v


class LeadStatusUpdate(BaseModel):
    status: str = Field(pattern="^(nouveau|en_cours|traite)$")


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class ArticleIn(BaseModel):
    title_fr: str = Field(min_length=3, max_length=160)
    title_en: Optional[str] = Field(default=None, max_length=160)
    excerpt_fr: str = Field(min_length=10, max_length=400)
    excerpt_en: Optional[str] = Field(default=None, max_length=400)
    body_fr: str = Field(min_length=50, max_length=30000)
    body_en: Optional[str] = Field(default=None, max_length=30000)
    category: str = Field(min_length=2, max_length=60)
    published: bool = True
    slug: Optional[str] = Field(default=None, max_length=90)


# ---------- public routes ----------
@api_router.get("/health")
async def health():
    return {"status": "ok", "email_configured": bool(EMAIL_KEY and EMAIL_FROM_NAME)}


@api_router.post("/leads")
async def create_lead(input: LeadCreate, request: Request):
    if input.company_website:
        return {"ok": True, "filtered": True}
    if not input.consent:
        raise HTTPException(status_code=422, detail="Le consentement est requis pour traiter votre demande.")
    ip = client_ip(request)
    if not rate_ok(ip):
        raise HTTPException(status_code=429, detail="Trop de demandes. Veuillez réessayer plus tard.")

    services = {
        "solutions-numeriques": "Solutions numériques d'ingénierie",
        "gestion-projets-construction": "Gestion numérique et administrative de projets de construction",
        "estimation-couts": "Estimation et contrôle des coûts",
        "planification-suivi": "Planification et suivi de projet",
        "approvisionnement": "Approvisionnement et coordination des fournisseurs",
        "appels-offres": "Appels d'offres et gestion des soumissions",
        "consultation": "Consultation générale",
    }
    lead = {
        "id": uuid.uuid4().hex,
        "first_name": clean(input.first_name, 80),
        "last_name": clean(input.last_name, 80),
        "company": clean(input.company, 120),
        "email": input.email.lower(),
        "phone": clean(input.phone or "", 30) or None,
        "service": input.service,
        "service_label": services.get(input.service, input.service),
        "message": clean(input.message, 4000),
        "budget": clean(input.budget or "", 60) or None,
        "deadline": clean(input.deadline or "", 60) or None,
        "consent": True,
        "lang": input.lang or "fr",
        "status": "nouveau",
        "created_at": now_iso(),
    }
    await db.leads.insert_one(lead.copy())
    email_sent = True
    try:
        await send_email(to=NOTIF_EMAIL, subject=f"Nouvelle demande — {lead['service_label']} — {lead['company']}",
                         html=notif_email_html(lead))
    except httpx.HTTPStatusError as e:
        email_sent = False
        logger.warning(f"Email notification failed: {e.response.status_code} {e.response.text[:200]}")
    except Exception as e:
        email_sent = False
        logger.warning(f"Email notification error: {e}")
    lead.pop("_id", None)
    return {"ok": True, "id": lead["id"], "email_sent": email_sent}


@api_router.get("/articles")
async def list_articles(lang: str = "fr", limit: int = 50):
    lg = lang if lang in ("fr", "en") else "fr"
    docs = await db.articles.find({"published": True}, {"_id": 0, "body_fr": 0, "body_en": 0}).sort("created_at", -1).to_list(limit)
    out = []
    for d in docs:
        title = d.get(f"title_{lg}") or d.get("title_fr", "")
        excerpt = d.get(f"excerpt_{lg}") or d.get("excerpt_fr", "")
        out.append({"id": d.get("id"), "slug": d.get("slug"), "title": title, "excerpt": excerpt,
                    "category": d.get("category"), "created_at": d.get("created_at")})
    return out


@api_router.get("/articles/{slug}")
async def get_article(slug: str, lang: str = "fr"):
    lg = lang if lang in ("fr", "en") else "fr"
    d = await db.articles.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not d:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return {
        "slug": d.get("slug"), "title": d.get(f"title_{lg}") or d.get("title_fr"),
        "excerpt": d.get(f"excerpt_{lg}") or d.get("excerpt_fr"),
        "body": d.get(f"body_{lg}") or d.get("body_fr"),
        "category": d.get("category"), "created_at": d.get("created_at"),
    }


# ---------- auth ----------
@api_router.post("/auth/login")
async def login(input: LoginIn, request: Request):
    email = input.email.lower()
    identifier = f"{client_ip(request)}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5 and time.time() - attempt.get("updated_at", 0) < 900:
        raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user.get("password_hash", "")):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"updated_at": time.time()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Identifiants invalides.")
    await db.login_attempts.delete_one({"identifier": identifier})
    resp = JSONResponse({"ok": True, "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}})
    set_auth_cookies(resp, user["user_id"], user["email"])
    return resp


@api_router.post("/auth/logout")
async def logout():
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("access_token", path="/")
    resp.delete_cookie("refresh_token", path="/")
    return resp


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


# ---------- admin ----------
@api_router.get("/admin/leads")
async def admin_leads(user: dict = Depends(get_current_user)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, input: LeadStatusUpdate, user: dict = Depends(get_current_user)):
    res = await db.leads.update_one({"id": lead_id}, {"$set": {"status": input.status}})
    if not res.matched_count:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"ok": True}


@api_router.get("/admin/articles")
async def admin_articles(user: dict = Depends(get_current_user)):
    return await db.articles.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.post("/admin/articles")
async def create_article(input: ArticleIn, user: dict = Depends(get_current_user)):
    slug = slugify(input.slug or input.title_fr)
    if await db.articles.find_one({"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:5]}"
    doc = {"id": uuid.uuid4().hex, "slug": slug,
           "title_fr": clean(input.title_fr, 160), "title_en": clean(input.title_en or "", 160) or None,
           "excerpt_fr": clean(input.excerpt_fr, 400), "excerpt_en": clean(input.excerpt_en or "", 400) or None,
           "body_fr": input.body_fr[:30000], "body_en": (input.body_en or "")[:30000] or None,
           "category": clean(input.category, 60), "published": input.published,
           "created_at": now_iso(), "updated_at": now_iso()}
    await db.articles.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/articles/{article_id}")
async def update_article(article_id: str, input: ArticleIn, user: dict = Depends(get_current_user)):
    updates = {"title_fr": clean(input.title_fr, 160), "title_en": clean(input.title_en or "", 160) or None,
               "excerpt_fr": clean(input.excerpt_fr, 400), "excerpt_en": clean(input.excerpt_en or "", 400) or None,
               "body_fr": input.body_fr[:30000], "body_en": (input.body_en or "")[:30000] or None,
               "category": clean(input.category, 60), "published": input.published, "updated_at": now_iso()}
    res = await db.articles.update_one({"id": article_id}, {"$set": updates})
    if not res.matched_count:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return {"ok": True}


@api_router.delete("/admin/articles/{article_id}")
async def delete_article(article_id: str, user: dict = Depends(get_current_user)):
    res = await db.articles.delete_one({"id": article_id})
    if not res.deleted_count:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return {"ok": True}


# ---------- startup ----------
SEED_ARTICLES = [
    {
        "slug": "structurer-la-gestion-documentaire-de-vos-projets",
        "title_fr": "Structurer la gestion documentaire de vos projets de construction",
        "title_en": "Structuring document control for your construction projects",
        "excerpt_fr": "Un dossier de projet bien structuré réduit les retards, les erreurs et les litiges. Voici une méthode simple pour organiser vos documents dès le premier jour.",
        "excerpt_en": "A well-structured project file reduces delays, errors and disputes. Here is a simple method to organize your documents from day one.",
        "category": "Gestion de projets",
        "body_fr": """Sur un projet de construction, l'information est dispersée : plans, devis, bons de commande, courriels, photos de chantier, procès-verbaux. Lorsque cette information n'est pas structurée, les décisions tardent et les coûts grimpent.

Une structure documentaire efficace repose sur trois principes. D'abord, une arborescence unique et connue de tous : plans, contrats, achats, correspondance, finances. Ensuite, une règle de nommage cohérente qui indique le projet, le type de document, la version et la date. Enfin, un accès contrôlé : chaque partie prenante consulte ce qu'elle doit consulter, sans plus.

La centralisation n'exige pas un logiciel complexe. Elle exige de la rigueur : un emplacement officiel par type de document, une personne responsable de la mise à jour, et un rituel hebdomadaire de classement. Les équipes qui appliquent ces trois règles constatent des échanges plus clairs et une traçabilité accrue des décisions.

Enfin, documentez vos décisions clés dans un registre daté : qui a décidé quoi, quand et pourquoi. Ce registre devient votre meilleure protection en cas de litige, et un outil d'apprentissage pour les projets suivants.""",
        "body_en": """On a construction project, information is scattered: drawings, specifications, purchase orders, emails, site photos, meeting minutes. When that information is not structured, decisions stall and costs rise.

Effective document control rests on three principles. First, a single file structure known to everyone: drawings, contracts, procurement, correspondence, finance. Second, a consistent naming rule covering project, document type, version and date. Third, controlled access: each stakeholder sees what they need to see, and nothing more.

Centralisation does not require complex software. It requires discipline: one official location per document type, one person responsible for updates, and a weekly filing routine. Teams that apply these three rules report clearer communication and better traceability of decisions.

Finally, record key decisions in a dated log: who decided what, when and why. That log becomes your best protection in a dispute, and a learning tool for future projects.""",
    },
    {
        "slug": "estimation-des-couts-eviter-les-ecarts-budgetaires",
        "title_fr": "Estimation des coûts : éviter les écarts budgétaires dès la préparation",
        "title_en": "Cost estimation: avoiding budget overruns from the start",
        "excerpt_fr": "La plupart des écarts budgétaires naissent dans la phase de préparation : hypothèses non documentées, coûts oubliés, comparaisons impossibles. Trois pratiques changent la donne.",
        "excerpt_en": "Most budget overruns are born during preparation: undocumented assumptions, forgotten costs, impossible comparisons. Three practices change the game.",
        "category": "Estimation des coûts",
        "body_fr": """Un budget prévisionnel crédible n'est pas une liste de montants : c'est un ensemble d'hypothèses documentées. Pour chaque poste, notez la source du prix, la date de la donnée et le niveau de confiance. Ces trois informations transforment une estimation fragile en un outil de pilotage.

Première pratique : standardisez la structure des coûts. Utilisez la même ventilation d'un projet à l'autre — préliminaires, structure, finitions, logistique, imprévus, frais généraux. Vous pourrez alors comparer les estimations aux coûts réels, poste par poste.

Deuxième pratique : consignez les exclusions. Ce qu'une estimation ne couvre pas doit être écrit noir sur blanc. La majorité des malentendus commerciaux viennent d'exclusions implicites.

Troisième pratique : suivez les écarts en continu. Comparez chaque mois l'estimé au réel, expliquez les écarts et ajustez les prévisions. Un écart compris tôt coûte peu ; un écart découvert tard coûte cher.""",
        "body_en": """A credible budget is not a list of amounts: it is a set of documented assumptions. For each line, record the price source, the data date and the confidence level. Those three pieces of information turn a fragile estimate into a management tool.

First practice: standardise the cost structure. Use the same breakdown on every project — preliminaries, structure, finishes, logistics, contingencies, overheads. You can then compare estimates to actuals, line by line.

Second practice: record exclusions. What an estimate does not cover must be stated in writing. Most commercial misunderstandings come from implicit exclusions.

Third practice: track variances continuously. Compare estimate to actuals monthly, explain the differences and update forecasts. An understood variance is cheap; a late one is expensive.""",
    },
    {
        "slug": "repondre-a-un-appel-d-offres-public-au-canada",
        "title_fr": "Répondre à un appel d'offres public au Canada : les fondamentaux",
        "title_en": "Responding to a public tender in Canada: the fundamentals",
        "excerpt_fr": "Conformité administrative, délais, preuves d'expérience : ce qui fait vraiment la différence entre une soumission retenue et une soumission rejetée.",
        "excerpt_en": "Administrative compliance, deadlines, proof of experience: what really separates an accepted submission from a rejected one.",
        "category": "Appels d'offres",
        "body_fr": """La majorité des soumissions rejetées le sont pour des motifs administratifs : formulaire incomplet, pièce manquante, dépôt tardif, signature absente. Avant même de rédiger votre proposition technique, analysez le dossier sous l'angle de la conformité.

Construisez une liste de vérification à partir du document d'appel d'offres : chaque exigence devient une ligne, avec un responsable et une échéance. Vérifiez les exigences de forme (format, nombre d'exemplaires, annexe obligatoire) avec la même rigueur que le contenu.

Structurez ensuite votre réponse en trois volets : la démonstration de compréhension du besoin, la méthode proposée, et les preuves. Les évaluateurs cherchent des preuves concrètes : projets similaires, références, méthodologie éprouvée.

Enfin, respectez le calendrier à rebours : date limite de questions, réunion de préparation, dépôt. Prévoyez une marge de sécurité sur le dépôt : un fichier trop lourd qui télécharge lentement a déjà coûté des contrats à des entreprises solides.""",
        "body_en": """Most submissions are rejected on administrative grounds: incomplete form, missing attachment, late deposit, missing signature. Before writing your technical proposal, analyse the package from a compliance angle.

Build a checklist from the tender document: every requirement becomes a line item, with an owner and a deadline. Check formal requirements (format, number of copies, mandatory attachments) as rigorously as content.

Then structure your answer in three parts: demonstrating you understand the need, the proposed method, and the evidence. Evaluators look for concrete proof: similar projects, references, a proven methodology.

Finally, work the calendar backwards: question deadline, pre-bid meeting, submission date. Build a safety margin into the deposit: a heavy file on a slow connection has already cost solid companies real contracts.""",
    },
    {
        "slug": "digitaliser-la-coordination-de-vos-fournisseurs",
        "title_fr": "Numériser la coordination de vos fournisseurs sans tout bouleverser",
        "title_en": "Digitising supplier coordination without turning everything upside down",
        "excerpt_fr": "Informatiser sa gestion d'approvisionnement ne signifie pas imposer un nouvel outil à tous. Une progression en quatre étapes limites la friction et maximise l'adhésion.",
        "excerpt_en": "Digitising procurement does not mean forcing a new tool on everyone. A four-step progression limits friction and maximises adoption.",
        "category": "Approvisionnement",
        "body_fr": """La transformation numérique des approvisionnements échoue rarement pour des raisons techniques : elle échoue parce qu'elle bouleverse les habitudes en une seule fois. Une progression en quatre étapes donne de meilleurs résultats.

Étape 1 — Cartographiez le parcours actuel : demande de prix, comparaison, commande, livraison, réception. Identifiez où l'information se perd.

Étape 2 — Centralisez les données de référence : liste des fournisseurs, conditions, contacts, documents à jour. C'est le socle, avec ou sans logiciel.

Étape 3 — Standardisez les demandes de prix : un gabarit unique, des critères de comparaison définis à l'avance (prix, délai, conformité, risque). Les décisions deviennent plus rapides et plus objectives.

Étape 4 — Automatisez les rappels : relances de soumissions, suivis de livraison, documents expirés. L'automatisation ne remplace pas le jugement ; elle libère du temps pour l'exercer.""",
        "body_en": """Digital transformation of procurement rarely fails for technical reasons: it fails because it overturns everyone's habits at once. A four-step progression works better.

Step 1 — Map the current journey: price request, comparison, order, delivery, receipt. Identify where information gets lost.

Step 2 — Centralise reference data: supplier list, terms, contacts, up-to-date documents. That is the foundation, with or without software.

Step 3 — Standardise price requests: one template, comparison criteria defined in advance (price, lead time, compliance, risk). Decisions get faster and more objective.

Step 4 — Automate reminders: quote follow-ups, delivery tracking, expiring documents. Automation does not replace judgement; it frees time to exercise it.""",
    },
]


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.articles.create_index("slug", unique=True)
    admin_email = ADMIN_EMAIL.lower()
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "user_id": uuid.uuid4().hex, "email": admin_email,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Administrateur", "role": "admin", "created_at": now_iso(),
        })
        logger.info("Admin user seeded")
    if await db.articles.count_documents({}) == 0:
        for a in SEED_ARTICLES:
            await db.articles.insert_one({"id": uuid.uuid4().hex, "published": True,
                                          "created_at": now_iso(), "updated_at": now_iso(), **a})
        logger.info("Seed articles inserted")


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api_router)
