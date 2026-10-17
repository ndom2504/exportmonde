# Export Monde Prestige Inc. — Site corporatif

Site corporatif B2B complet : solutions numériques d'ingénierie, gestion de projets de construction, estimation des coûts, planification, approvisionnement et appels d'offres. Bilingue FR/EN, SEO configuré, formulaire de soumission avec courriel réel, espace administratif.

## Stack
- **Frontend** : React (CRA) + Tailwind CSS + framer-motion + lenis, routage react-router
- **Backend** : FastAPI + MongoDB (Motor), JWT httpOnly (bcrypt)
- **Courriel** : Resend via le proxy géré Emergent (`EMERGENT_EMAIL_KEY`)
- **Design** : bleu nuit `#0A1E3C`, électrique `#1E6FEB`, turquoise `#14C0B0` ; Fraunces (titres) + Instrument Sans (texte)

## Installation locale
1. Backend : `cd backend && pip install -r requirements.txt`, configurer `.env` (voir backend/.env.example), `uvicorn server:app --port 8001`
2. Frontend : `cd frontend && yarn install && yarn start`, `REACT_APP_BACKEND_URL` pointé vers l'API
3. MongoDB : requiert une instance locale (MONGO_URL)

L'admin est seedé au démarrage du backend (ADMIN_EMAIL / ADMIN_PASSWORD). Les 4 articles de départ sont insérés si la collection est vide.

## Variables d'environnement (backend/.env)
| Clé | Rôle |
|---|---|
| MONGO_URL / DB_NAME | Base de données (ne pas modifier) |
| CORS_ORIGINS | Origines autorisées (séparées par virgules) |
| JWT_SECRET | Signature des jetons admin |
| ADMIN_EMAIL / ADMIN_PASSWORD | Compte administratif seedé |
| NOTIF_EMAIL | Destinataire des notifications admin et adresse de réponse des courriels automatiques (morelstevensndong@gmail.com) |
| EMERGENT_EMAIL_KEY | Clé du service de courriel géré |
| EMAIL_FROM_NAME / EMAIL_REPLY_TO | Nom d'expédition / reply-to |
| FRONTEND_URL | URL du frontend (CORS) |

## Pages
`/` accueil · `/services` + 6 pages détaillées · `/secteurs` · `/a-propos` · `/contact` (formulaire) · `/ressources` + `/ressources/:slug` · `/solutions` · `/confidentialite` · `/mentions-legales` · `/admin` (connexion) · `/admin/tableau-de-bord`

## SEO
Titles/metas/canonicals par page (composant `Seo`), Open Graph, JSON-LD (Organization + Service), `robots.txt`, `sitemap.xml`, alt descriptifs, hiérarchie H1-H3. Domaine canonique : `https://www.exportmondeprestigeinc.com`. Emplacements prévus pour Google Search Console / Google Analytics (à brancher à la mise en ligne — aucun suivi non essentiel avant consentement).

## Sécurité
Validation Pydantic côté serveur + validation côté client, honeypot antispam, limite de débit (5 demandes/heure/IP), échappement HTML dans les gabarits de courriel, cookies httpOnly + verrouillage après 5 tentatives de connexion (15 min), secrets uniquement en variables d'environnement.

## Google Analytics, Search Console et événements de conversion
Le suivi est **consentement d'abord** (conforme aux exigences canadiennes/québécoises) : rien ne se charge avant que le visiteur ait accepté la bannière de consentement. Aucune donnée personnelle n'est envoyée dans les événements.

1. **Google Analytics** : créez une propriété GA4, copiez l'identifiant de mesure (G-XXXXXXX), puis dans `frontend/.env` renseignez `REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX` et redémarrez le frontend.
2. **Google Search Console** : ajoutez la propriété `https://www.exportmondeprestigeinc.com`, validez par DNS (TXT) ou par balise meta dans `public/index.html`, puis soumettez `https://www.exportmondeprestigeinc.com/sitemap.xml`.
3. **Événements de conversion configurés** (à lier comme conversions dans GA4) :
   - `generate_lead` — soumission réussie du formulaire de demande de soumission
   - `contact_email_click` — clic sur une adresse courriel
   - `contact_phone_click` — clic sur un numéro de téléphone
   - `consultation_request_click` — clic sur « Planifier une consultation »
4. Les clics `tel:` / `mailto:` et la soumission sont suivis automatiquement dès que le consentement est accordé et l'identifiant configuré. Sans identifiant, le site fonctionne normalement (aucun script chargé).

## Services externes à configurer
- **Google Analytics** : renseigner `REACT_APP_GA_MEASUREMENT_ID` (voir ci-dessus).
- **Google Search Console** : validation du domaine requise (DNS ou balise meta).
- Les services réglementés (ingénierie, architecture) ne sont pas offerts : les pages le précisent et recommandent des professionnels autorisés.

## Coordonnées de l'entreprise (affichées sur le site)
- Courriel de notification : morelstevensndong@gmail.com
- Téléphone : +1 581 443 9464
- Adresse : 127 Rue Tablot, Laurier-Station, QC G0S 1N0
- Numéro d'entreprise : 1178887007

## Assistant IA (ChatGPT)
Widget « Assistant EMP » sur toutes les pages publiques : questions-réponses sur les services (réponses générées par IA, modèle gpt-5.4 via la clé universelle Emergent, réglages `EMERGENT_LLM_KEY` / `AI_MODEL`), streaming mot à mot, et mini-formulaire intégré qui crée une demande de soumission visible dans l'espace admin (source : assistant_ia, avec notification courriel). Garde-fous : l'assistant ne peut pas inventer de faits, tarifs ou promesses ; il refuse les services réglementés et oriente vers des professionnels autorisés ; limite de 20 messages/heure/IP ; historique conservé dans MongoDB (`ai_chats`).

## Tests exécutés (résultats réels)
- POST /api/leads valide → `{"ok":true,"email_sent":true}` (courriel reçu par le destinataire configuré)
- Honeypot → `{"filtered":true}` ; entrées invalides → 422 détaillé ; limite de débit active
- POST /api/auth/login admin → cookies émis ; GET /api/auth/me → 200 ; leads visibles dans /api/admin/leads
- GET /api/articles (fr/en) et détail par slug → 200 ; JSON-LD et title par page vérifiés
- Parcours UI vérifiés par capture d'écran (desktop 1440 / mobile 390) : accueil, service détaillé, contact (soumission réussie), admin (connexion, tableau des demandes, éditeur d'articles)
