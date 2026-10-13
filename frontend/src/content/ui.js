export const SITE = {
  name: "Export Monde Prestige Inc.",
  domain: "www.exportmondeprestigeinc.com",
  url: "https://www.exportmondeprestigeinc.com",
  email: "info@misterdil.ca",
};

export const IMG = {
  hero: "https://images.unsplash.com/photo-1764129669382-ec26da02a313?auto=format&fit=crop&w=1400&q=80",
  blueprints: "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?auto=format&fit=crop&w=1400&q=80",
  tablet: "https://images.unsplash.com/photo-1778074762022-c33cc42f79ae?auto=format&fit=crop&w=1400&q=80",
  warehouse: "https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?auto=format&fit=crop&w=1400&q=80",
  tower: "https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?auto=format&fit=crop&w=1400&q=80",
};

export const UI = {
  nav: {
    home: { fr: "Accueil", en: "Home" },
    services: { fr: "Services", en: "Services" },
    sectors: { fr: "Secteurs", en: "Sectors" },
    about: { fr: "À propos", en: "About" },
    resources: { fr: "Ressources", en: "Insights" },
    solutions: { fr: "Solutions numériques", en: "Digital Solutions" },
    contact: { fr: "Contact", en: "Contact" },
    cta: { fr: "Demander une soumission", en: "Request a quote" },
    menu: { fr: "Menu", en: "Menu" },
    close: { fr: "Fermer", en: "Close" },
  },
  cta: {
    quote: { fr: "Demander une soumission", en: "Request a quote" },
    consult: { fr: "Planifier une consultation", en: "Book a consultation" },
    discover: { fr: "Découvrir nos services", en: "Explore our services" },
    talk: { fr: "Parler à un expert", en: "Talk to an expert" },
    describe: { fr: "Décrire mon projet", en: "Describe my project" },
  },
  footer: {
    tagline: {
      fr: "Solutions numériques, coordination opérationnelle et gestion de projets de construction pour les organisations industrielles canadiennes.",
      en: "Digital solutions, operational coordination and construction project management for Canadian industrial organizations.",
    },
    navTitle: { fr: "Navigation", en: "Navigation" },
    servicesTitle: { fr: "Services", en: "Services" },
    contactTitle: { fr: "Coordonnées", en: "Contact" },
    address: { fr: "Canada — adresse postale à compléter", en: "Canada — mailing address to be confirmed" },
    legal: { fr: "Légal", en: "Legal" },
    privacy: { fr: "Politique de confidentialité", en: "Privacy Policy" },
    mentions: { fr: "Mentions légales", en: "Legal Notice" },
    rights: { fr: "Tous droits réservés.", en: "All rights reserved." },
  },
  form: {
    title: { fr: "Demande de soumission", en: "Quote request" },
    intro: {
      fr: "Décrivez votre besoin en quelques lignes. Nous revenons vers vous avec une proposition structurée.",
      en: "Describe your need in a few lines. We will come back to you with a structured proposal.",
    },
    firstName: { fr: "Prénom", en: "First name" },
    lastName: { fr: "Nom", en: "Last name" },
    company: { fr: "Entreprise", en: "Company" },
    email: { fr: "Courriel professionnel", en: "Business email" },
    phone: { fr: "Téléphone (facultatif)", en: "Phone (optional)" },
    service: { fr: "Type de service recherché", en: "Type of service" },
    servicePlaceholder: { fr: "Sélectionnez un service", en: "Select a service" },
    message: { fr: "Description du besoin", en: "Description of your need" },
    messageHint: { fr: "Contexte, enjeux, échéance visée… (20 caractères minimum)", en: "Context, challenges, target deadline… (20 characters minimum)" },
    budget: { fr: "Budget indicatif (facultatif)", en: "Indicative budget (optional)" },
    deadline: { fr: "Échéance souhaitée (facultatif)", en: "Target deadline (optional)" },
    consent: {
      fr: "J'accepte que mes informations soient utilisées pour répondre à ma demande de soumission et pour les communications liées à celle-ci.",
      en: "I agree that my information may be used to answer my quote request and for communications related to it.",
    },
    submit: { fr: "Envoyer ma demande", en: "Send my request" },
    sending: { fr: "Envoi en cours…", en: "Sending…" },
    success: {
      fr: "Votre demande a bien été reçue. Nous vous répondrons dans un délai raisonnable à l'adresse courriel fournie.",
      en: "Your request has been received. We will reply at the email address you provided.",
    },
    successNoEmail: {
      fr: "Votre demande a bien été enregistrée. La notification par courriel sera envoyée dès que le service de messagerie sera actif.",
      en: "Your request has been saved. The email notification will be sent once the email service is activated.",
    },
    error: { fr: "Une erreur est survenue. Veuillez réessayer ou nous écrire directement.", en: "Something went wrong. Please try again or email us directly." },
    required: { fr: "Ce champ est requis.", en: "This field is required." },
    invalidEmail: { fr: "Veuillez saisir un courriel valide.", en: "Please enter a valid email." },
    shortMessage: { fr: "Veuillez décrire votre besoin (20 caractères minimum).", en: "Please describe your need (20 characters minimum)." },
    consentRequired: { fr: "Votre consentement est requis pour traiter la demande.", en: "Your consent is required to process the request." },
    budgetOptions: ["Moins de 25 000 $", "25 000 $ – 100 000 $", "100 000 $ – 500 000 $", "Plus de 500 000 $", "À déterminer"],
  },
};

export const SERVICE_OPTIONS = [
  { value: "solutions-numeriques", label: { fr: "Solutions numériques d'ingénierie", en: "Digital engineering solutions" } },
  { value: "gestion-projets-construction", label: { fr: "Gestion de projets de construction", en: "Construction project management" } },
  { value: "estimation-couts", label: { fr: "Estimation et contrôle des coûts", en: "Cost estimation & control" } },
  { value: "planification-suivi", label: { fr: "Planification et suivi de projet", en: "Project planning & tracking" } },
  { value: "approvisionnement", label: { fr: "Approvisionnement et fournisseurs", en: "Procurement & suppliers" } },
  { value: "appels-offres", label: { fr: "Appels d'offres et soumissions", en: "Tenders & bids" } },
  { value: "consultation", label: { fr: "Consultation générale", en: "General consultation" } },
];
