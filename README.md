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
| NOTIF_EMAIL | Destinataire des demandes de soumission (info@misterdil.ca) |
| EMERGENT_EMAIL_KEY | Clé du service de courriel géré |
| EMAIL_FROM_NAME / EMAIL_REPLY_TO | Nom d'expédition / reply-to |
| FRONTEND_URL | URL du frontend (CORS) |

## Pages
`/` accueil · `/services` + 6 pages détaillées · `/secteurs` · `/a-propos` · `/contact` (formulaire) · `/ressources` + `/ressources/:slug` · `/solutions` · `/confidentialite` · `/mentions-legales` · `/admin` (connexion) · `/admin/tableau-de-bord`

## SEO
Titles/metas/canonicals par page (composant `Seo`), Open Graph, JSON-LD (Organization + Service), `robots.txt`, `sitemap.xml`, alt descriptifs, hiérarchie H1-H3. Domaine canonique : `https://www.exportmondeprestigeinc.com`. Emplacements prévus pour Google Search Console / Google Analytics (à brancher à la mise en ligne — aucun suivi non essentiel avant consentement).

## Sécurité
Validation Pydantic côté serveur + validation côté client, honeypot antispam, limite de débit (5 demandes/heure/IP), échappement HTML dans les gabarits de courriel, cookies httpOnly + verrouillage après 5 tentatives de connexion (15 min), secrets uniquement en variables d'environnement.

## Services externes à configurer / à compléter
- **Adresse postale, téléphone, numéro d'enregistrement de l'entreprise** : champs « à compléter » dans le pied de page, la politique de confidentialité et les mentions légales.
- **Google Search Console / Analytics** : à activer lors de la mise en production.
- Les services réglementés (ingénierie, architecture) ne sont pas offerts : les pages le précisent et recommandent des professionnels autorisés.

## Tests exécutés (résultats réels)
- POST /api/leads valide → `{"ok":true,"email_sent":true}` (courriel reçu par le destinataire configuré)
- Honeypot → `{"filtered":true}` ; entrées invalides → 422 détaillé ; limite de débit active
- POST /api/auth/login admin → cookies émis ; GET /api/auth/me → 200 ; leads visibles dans /api/admin/leads
- GET /api/articles (fr/en) et détail par slug → 200 ; JSON-LD et title par page vérifiés
- Parcours UI vérifiés par capture d'écran (desktop 1440 / mobile 390) : accueil, service détaillé, contact (soumission réussie), admin (connexion, tableau des demandes, éditeur d'articles)
