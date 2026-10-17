"""Réponses stratégiques aux demandes de consultation."""
import re
from html import escape

SITE = "https://www.exportmondeprestigeinc.com"
PHONE = "+1 581 443 9464"

STRATEGY = {
    "solutions-numeriques": {
        "fr": "Nous proposons de commencer par situer où vit aujourd'hui l'information de projet (courriels, tableurs, dossiers) et quelles tâches répétitives méritent d'être structurées en premier. L'objectif est un outil de suivi utile à l'équipe, pas un logiciel plus large que le besoin.",
        "en": "We suggest starting by locating where project information lives today (email, spreadsheets, folders) and which repetitive tasks should be structured first. The aim is a tracking tool the team will actually use, not software larger than the need.",
    },
    "gestion-projets-construction": {
        "fr": "Nous proposons de poser d'abord une arborescence documentaire, un registre des décisions et un rythme d'échange entre les parties prenantes. C'est ce qui évite qu'un chantier perde le fil de ses livrables, de ses coûts et de ses engagements.",
        "en": "We suggest setting a document structure, a decision log and a communication rhythm between stakeholders first. That is what keeps a construction project from losing track of deliverables, costs and commitments.",
    },
    "estimation-couts": {
        "fr": "Nous proposons d'organiser les données de coûts déjà disponibles, de distinguer l'estimé et le réel, puis de suivre les écarts. Aucun montant n'est avancé tant que les hypothèses et les pièces du dossier n'ont pas été revues avec vous.",
        "en": "We suggest organizing the cost data you already have, separating estimate from actual, then tracking variances. No figure is put forward until the assumptions and the file have been reviewed with you.",
    },
    "planification-suivi": {
        "fr": "Nous proposons de clarifier les jalons, les dépendances et les risques, puis un rapport d'avancement à intervalle fixe. Le calendrier n'est confirmé qu'une fois les contraintes réelles du projet connues.",
        "en": "We suggest clarifying milestones, dependencies and risks, then a progress report on a fixed rhythm. The schedule is confirmed only once the project's real constraints are known.",
    },
    "approvisionnement": {
        "fr": "Nous proposons de qualifier les fournisseurs pertinents et de comparer les offres sur les mêmes critères : conformité, délai annoncé, conditions et risque. Aucun prix ni délai n'est garanti avant vérification auprès du fournisseur.",
        "en": "We suggest qualifying the relevant suppliers and comparing offers on the same criteria: compliance, stated lead time, terms and risk. No price or lead time is guaranteed before the supplier is checked.",
    },
    "appels-offres": {
        "fr": "Nous proposons une liste de vérification des pièces exigées, un responsable par contribution et un suivi des échéances jusqu'au dépôt. L'enjeu est d'éviter un rejet pour un document manquant, puis de tenir une réponse cohérente.",
        "en": "We suggest a checklist of required documents, an owner for each contribution and deadline tracking through to submission. The point is to avoid a rejection for a missing document, then to keep the response consistent.",
    },
    "consultation": {
        "fr": "Nous proposons un court échange de cadrage pour préciser le contexte, les parties prenantes et le résultat attendu, avant de recommander un périmètre.",
        "en": "We suggest a short scoping conversation to clarify the context, the stakeholders and the expected result, before recommending a scope.",
    },
}


def _lang(lead: dict) -> str:
    return "en" if (lead.get("lang") or "fr").lower().startswith("en") else "fr"


def _strategy(lead: dict) -> str:
    lang = _lang(lead)
    block = STRATEGY.get(lead.get("service") or "", STRATEGY["consultation"])
    return block[lang]


def _clip(value: str, limit: int = 500) -> str:
    text = re.sub(r"\s+", " ", (value or "").strip())
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def build_reply(lead: dict) -> tuple[str, str]:
    """Sujet et corps en texte brut, sans lien. Le pied de page est ajouté au HTML."""
    lang = _lang(lead)
    name = f"{lead.get('first_name', '').strip()} {lead.get('last_name', '').strip()}".strip() or ("Bonjour" if lang == "fr" else "Hello")
    company = lead.get("company") or ("votre organisation" if lang == "fr" else "your organization")
    service = lead.get("service_label") or ("votre demande" if lang == "fr" else "your request")
    need = _clip(lead.get("message") or "")
    budget = lead.get("budget") or ("non précisé" if lang == "fr" else "not stated")
    deadline = lead.get("deadline") or ("non précisée" if lang == "fr" else "not stated")
    angle = _strategy(lead)

    if lang == "en":
        subject = f"Your request — {service} — Export Monde Prestige Inc."
        body = (
            f"Hello {name},\n\n"
            f"We have received the request from {company} regarding {service}.\n\n"
            f"What we noted: {need}\n"
            f"Indicative budget: {budget}. Desired timing: {deadline}.\n\n"
            f"{angle}\n\n"
            "The next step is a scoping conversation, with no commitment, to confirm the scope, "
            "the stakeholders and the timing. The initial consultation is free. Fees are set "
            "in a quote after that review. We do not confirm a price or a deadline before then, "
            "and we do not provide regulated engineering or architecture services.\n\n"
            f"You can reply to this email or call us at {PHONE}.\n\n"
            "Export Monde Prestige Inc."
        )
    else:
        subject = f"Votre demande — {service} — Export Monde Prestige Inc."
        body = (
            f"Bonjour {name},\n\n"
            f"Nous avons bien reçu la demande de {company} au sujet de {service}.\n\n"
            f"Ce que nous retenons : {need}\n"
            f"Budget indiqué : {budget}. Échéance souhaitée : {deadline}.\n\n"
            f"{angle}\n\n"
            "La prochaine étape est un échange de cadrage, sans engagement, pour confirmer "
            "le périmètre, les parties prenantes et l'échéancier. La consultation initiale "
            "est gratuite. Les honoraires sont établis par devis après cette analyse. "
            "Nous ne confirmons aucun prix ni délai avant cet échange, et nous ne fournissons "
            "pas de services réglementés d'ingénierie ou d'architecture.\n\n"
            f"Vous pouvez répondre à ce courriel ou nous joindre au {PHONE}.\n\n"
            "Export Monde Prestige Inc."
        )
    return subject[:180], body


def reply_html(body: str) -> str:
    text = re.sub(r"https?://\S+", "", body or "").strip()
    parts = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    paragraphs = "".join(
        '<p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;'
        'line-height:1.55;color:#0A1E3C;white-space:pre-line">'
        f"{escape(part)}</p>"
        for part in parts
    )
    return f"""<div style="background:#F6F7F9;padding:24px">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;border:1px solid #E5E9F0">
    <tr><td style="padding:24px 24px 4px">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5B6575">Export Monde Prestige Inc.</p>
    </td></tr>
    <tr><td style="padding:8px 24px 24px">{paragraphs}
      <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#5B6575">
        <a href="{SITE}" style="color:#1E6FEB">www.exportmondeprestigeinc.com</a>
      </p>
    </td></tr>
  </table>
</div>"""
