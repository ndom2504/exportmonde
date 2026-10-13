import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { SECTORS } from "@/content/pages";
import { useLang } from "@/lib/lang";

export default function Secteurs() {
  const { t, lang } = useLang();
  return (
    <main data-testid="sectors-page">
      <Seo
        title={lang === "fr"
          ? "Secteurs d'activité — construction, industrie, énergie | Export Monde Prestige Inc."
          : "Industries — construction, manufacturing, energy | Export Monde Prestige Inc."}
        description={t(SECTORS.intro)}
        path="/secteurs"
      />
      <section className="bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(SECTORS.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl" data-testid="sectors-title">{t(SECTORS.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(SECTORS.intro)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] space-y-6 px-5 md:px-8">
          {SECTORS.items.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <article id={s.slug} className="scroll-mt-28 rounded-xl border border-line bg-paper p-8 md:p-10" data-testid={`sector-card-${s.slug}`}>
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <span className="font-display text-5xl text-electric/25">0{i + 1}</span>
                    <h2 className="mt-3 font-display text-2xl leading-snug text-navy-800 md:text-3xl">{t(s.title)}</h2>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-[15px] leading-relaxed text-graphite">{t(s.desc)}</p>
                    <ul className="mt-6 flex flex-wrap gap-3">
                      {s.points[lang].map((p, j) => (
                        <li key={j} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-navy-800">
                          <CheckCircle2 size={14} className="text-electric" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal>
            <p className="pt-2 text-[13px] italic text-steel">{t(SECTORS.disclaimer)}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Votre secteur n'est pas listé ?" : "Your sector isn't listed?"}
        sub={lang === "fr"
          ? "Nos méthodes s'appliquent partout où des projets doivent être planifiés, chiffrés et coordonnés. Parlons-en."
          : "Our methods apply wherever projects need to be planned, costed and coordinated. Let's talk."}
      />
    </main>
  );
}
