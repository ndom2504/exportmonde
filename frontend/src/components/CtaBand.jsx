import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { UI } from "@/content/ui";
import { useLang } from "@/lib/lang";

export default function CtaBand({ title, sub }) {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-electric/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-turquoise/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(UI.cta.talk)} —</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-white md:text-5xl">{title}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">{sub}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/contact"
              data-testid="cta-band-quote-button"
              className="group inline-flex items-center gap-2 rounded-full bg-electric px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-electric-dark"
            >
              {t(UI.cta.quote)}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              data-testid="cta-band-consult-button"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:border-white"
            >
              {t(UI.cta.consult)}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
