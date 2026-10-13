# PRD — Site web corporatif Export Monde Prestige Inc.

## Énoncé du problème original
Concevoir, développer, tester et documenter le site web corporatif complet d'Export Monde Prestige Inc., entreprise canadienne de solutions numériques, de coordination opérationnelle et de services de gestion de projets de construction. Le site doit être crédible auprès de décideurs B2B, générer des demandes de soumission, être bilingue FR/EN, optimisé SEO, sécurisé, accessible et prêt pour la production.

## Personas
- Directeur des opérations / gestionnaire de projet (entreprise manufacturière ou de construction) cherchant à structurer ses processus et coûts.
- Entrepreneur général préparant des soumissions et gérant plusieurs chantiers.
- Responsable des achats voulant des approvisionnements rigoureux et documentés.
- Propriétaire de l'entreprise (admin du site) : consulter les demandes, publier des articles.

## Exigences principales
1. Pages : accueil, services (x6 détaillées), secteurs, à propos, contact/soumission, ressources (articles), solutions numériques, confidentialité, mentions légales, admin.
2. Formulaire de soumission traité réellement (DB + courriel via Resend géré) avec validations, antispam, consentement.
3. Espace admin protégé : consultation des demandes, gestion des statuts, publication d'articles bilingues.
4. Bilinguisme FR (défaut) / EN avec architecture extensible.
5. SEO : titles/metas/canonical uniques, JSON-LD, sitemap, robots, OG.
6. Aucun fait inventé (pas de fausses stats, références, adresses) ; mentions légales précises sur les services réglementés.

## Architecture réalisée
- Frontend React (CRA) : pages dans `src/pages`, contenu bilingue centralisé dans `src/content/` (ui.js, home.js, services.js, pages.js), i18n par contexte (`src/lib/lang.jsx`), API client (`src/lib/api.js`).
- Backend FastAPI (`backend/server.py`) : /api/leads, /api/articles (+ slug), /api/auth/*, /api/admin/*, /api/health. MongoDB via Motor. Seed admin + articles.
- Courriel : proxy Resend géré Emergent, gabarit HTML serveur, garde-fous G1-G5 implémentés.
- Sécurité : bcrypt, JWT httpOnly (30 min / 7 j), verrouillage 5 tentatives/15 min, honeypot, rate limit 5/h/IP, validation Pydantic, échappement HTML.

## Réalisé (avec dates — 2026-10-13)
- Système de design complet (bleu nuit/électrique/turquoise, Fraunces + Instrument Sans), nav fixe, footer complet avec logo fourni.
- Accueil : hero cinétique (révélation masquée ligne par ligne), parallaxe image, marquee éditorial, bento 6 services aligné, défis/solutions, méthode 4 étapes, avantages, secteurs, FAQ accordéon, CTA final.
- 6 pages services complètes (problème, solution, livrables, bénéfices, processus, CTA) FR/EN.
- Secteurs (5), À propos, Solutions & innovation (sans mention CAPITUNE, selon instruction du client).
- Contact : formulaire complet avec tous les champs demandés, états chargement/succès/erreur, soumission réelle vérifiée (courriel envoyé à info@misterdil.ca).
- Ressources : liste + détail dynamiques depuis MongoDB, 4 articles bilingues pré-rédigés.
- Admin : connexion, tableau des demandes avec statuts, éditeur d'articles bilingue.
- SEO complet, favicon SVG EMP, robots.txt, sitemap.xml, données structurées.

## Backlog priorisé
- P1 : brancher Google Analytics (renseigner REACT_APP_GA_MEASUREMENT_ID dans frontend/.env) et valider la propriété Google Search Console (DNS ou balise meta) à la mise en ligne. Le consentement et les événements de conversion (generate_lead, contact_email_click, contact_phone_click, consultation_request_click) sont déjà implémentés.
- P2 : blog avec catégories/recherche côté public ; images d'articles.
- P2 : version anglaise du sitemap (hreflang) si trafic EN le justifie.
- P2 : formulaire multi-étapes et pièce jointe pour appels d'offres.

## Prochaines étapes
1. Renseigner REACT_APP_GA_MEASUREMENT_ID (GA4) et valider Search Console lors de la mise en production.
2. Activer les campagnes Google Ads avec les pages services comme destinations.
3. Compléter les métadonnées « dernière mise à jour » des pages légales à la publication.

## Coordonnées (intégrées au site — 2026-10-13)
- Courriel : info@misterdil.ca · Téléphone : +1 581 443 9464
- Adresse : 127 Rue Tablot, Laurier-Station, QC G0S 1N0 · Numéro d'entreprise : 1178887007
- Affichées dans : pied de page, page contact, mentions légales, politique de confidentialité, JSON-LD (index.html).

## Identifiants de test
Voir /app/memory/test_credentials.md — admin@exportmondeprestigeinc.com / Prestige2026!Emp#admin (identifiants de test).
