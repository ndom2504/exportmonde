import { ArrowRight, BarChart3, Workflow, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { INNOVATION } from "@/content/pages";
import { useLang } from "@/lib/lang";

const ICONS = { BarChart3, Workflow, Database, FileText };

export default function Solutions() {
  const { t, lang } = useLang();
  return (
    <main data-testid="solutions-page">
      <Seo
        title={lang === "fr"
          ? "Solutions numériques et innovation | Export Monde Prestige Inc."
          : "Digital Solutions & Innovation | Export Monde Prestige Inc."}
        description={t(INNOVATION.header.sub)}
        path="/solutions"
      />
      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-turquoise/15 blur-[110px]" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(INNOVATION.header.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl">{t(INNOVATION.header.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(INNOVATION.header.sub)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {INNOVATION.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-xl border border-line bg-paper p-8 transition-all duration-300 hover:border-electric/40 hover:shadow-card" data-testid={`innovation-card-${i}`}>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800 text-white">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <h2 className="mt-6 font-display text-2xl text-navy-800">{t(item.title)}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-graphite">{t(item.desc)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-16 rounded-xl bg-navy-800 p-8 md:p-12">
              <h2 className="font-display text-2xl text-white md:text-3xl">{t(INNOVATION.method.title)}</h2>
              <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {INNOVATION.method.steps.map((s, i) => (
                  <li key={i} className="border-t-2 border-turquoise/50 pt-4">
                    <span className="font-display text-3xl text-turquoise/40">0{i + 1}</span>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{t(s)}</p>
                  </li>
                ))}
              </ol>
              <Link
                to="/contact"
                data-testid="solutions-cta-button"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-electric px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-electric-dark"
              >
                {t(INNOVATION.cta)}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Imaginons ensemble votre outil idéal." : "Let's imagine your ideal tool together."}
        sub={t(INNOVATION.header.sub)}
      />
    </main>
  );
}
