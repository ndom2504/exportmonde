import { useEffect, useState } from "react";
import { grantConsent, denyConsent, consentGiven } from "@/lib/analytics";
import { useLang } from "@/lib/lang";

const COPY = {
  text: {
    fr: "Nous utilisons des témoins (cookies) pour mesurer le trafic du site et améliorer votre expérience. Aucun suivi n'est activé sans votre consentement.",
    en: "We use cookies to measure site traffic and improve your experience. No tracking is activated without your consent.",
  },
  accept: { fr: "Accepter", en: "Accept" },
  deny: { fr: "Refuser", en: "Decline" },
  policy: { fr: "Politique de confidentialité", en: "Privacy Policy" },
};

export default function ConsentBanner() {
  const { t, lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!consentGiven()) setVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const choose = (fn) => () => {
    fn();
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={lang === "fr" ? "Consentement aux témoins" : "Cookie consent"}
      className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-white/10 bg-navy-900/95 p-5 shadow-lift backdrop-blur-xl md:p-6"
      data-testid="consent-banner"
    >
      <p className="text-[13px] leading-relaxed text-white/80">
        {t(COPY.text)}{" "}
        <a href="/confidentialite" className="font-semibold text-electric-bright underline" data-testid="consent-policy-link">{t(COPY.policy)}</a>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={choose(grantConsent)}
          data-testid="consent-accept-button"
          className="rounded-full bg-electric px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-electric-dark"
        >
          {t(COPY.accept)}
        </button>
        <button
          onClick={choose(denyConsent)}
          data-testid="consent-deny-button"
          className="rounded-full border border-white/25 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-white"
        >
          {t(COPY.deny)}
        </button>
      </div>
    </div>
  );
}
