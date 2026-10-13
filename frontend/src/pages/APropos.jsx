import { Info } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { ABOUT } from "@/content/pages";
import { HOME } from "@/content/home";
import { useLang } from "@/lib/lang";

export default function APropos() {
  const { t, lang } = useLang();
  return (
    <main data-testid="about-page">
      <Seo
        title={lang === "fr" ? "À propos | Export Monde Prestige Inc." : "About us | Export Monde Prestige Inc."}
        description={t(ABOUT.mission.body)}
        path="/a-propos"
      />
      <section className="bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(HOME.aboutTeaser.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl">{t(ABOUT.header.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(ABOUT.header.sub)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 md:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-line bg-paper p-8 md:p-10" data-testid="about-mission">
              <h2 className="font-display text-2xl text-navy-800 md:text-3xl">{t(ABOUT.mission.title)}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-graphite">{t(ABOUT.mission.body)}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-xl bg-navy-800 p-8 text-white md:p-10" data-testid="about-vision">
              <h2 className="font-display text-2xl md:text-3xl">{t(ABOUT.vision.title)}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70">{t(ABOUT.vision.body)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-3xl text-navy-800 md:text-4xl">{t(ABOUT.values.title)}</h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {ABOUT.values.items.map((v, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <span className="inline-block rounded-full border border-line bg-white px-6 py-3.5 font-display text-lg text-navy-800 transition-colors duration-300 hover:border-electric hover:text-electric" data-testid={`about-value-${i}`}>
                  {t(v)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] space-y-14 px-5 md:px-8">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-12">
              <h2 className="font-display text-2xl leading-snug text-navy-800 md:text-3xl lg:col-span-4">{t(ABOUT.approach.title)}</h2>
              <p className="text-[15px] leading-relaxed text-graphite lg:col-span-8">{t(ABOUT.approach.body)}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid gap-8 lg:grid-cols-12">
              <h2 className="font-display text-2xl leading-snug text-navy-800 md:text-3xl lg:col-span-4">{t(HOME.method.eyebrow)}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
                {HOME.method.steps.map((step, i) => (
                  <div key={i} className="border-t-2 border-electric/30 pt-4" data-testid={`about-method-step-${i}`}>
                    <span className="font-display text-3xl text-electric/30">0{i + 1}</span>
                    <h3 className="mt-2 font-display text-lg text-navy-800">{t(step.title)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite">{t(step.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl text-navy-800 md:text-3xl">{t(ABOUT.commitment.title)}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {ABOUT.commitment.items.map((item, i) => (
                <div key={i} className="h-full rounded-xl border border-line p-7" data-testid={`about-commitment-${i}`}>
                  <h3 className="font-display text-xl text-navy-800">{t(item.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{t(item.desc)}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="flex items-start gap-3 rounded-xl border border-line bg-paper p-6 text-[13px] leading-relaxed text-graphite">
              <Info size={18} className="mt-0.5 shrink-0 text-electric" />
              {t(ABOUT.limits)}
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Travaillons avec rigueur, dès aujourd'hui." : "Let's work with rigour, starting today."}
        sub={t(ABOUT.mission.body)}
      />
    </main>
  );
}
