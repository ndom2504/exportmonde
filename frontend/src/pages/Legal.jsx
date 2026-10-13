import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { LEGAL } from "@/content/pages";
import { useLang } from "@/lib/lang";

export default function Legal({ kind = "privacy" }) {
  const { t, lang } = useLang();
  const data = LEGAL[kind];
  const path = kind === "privacy" ? "/confidentialite" : "/mentions-legales";
  const seoTitle = lang === "fr" ? `${t(data.title)} | Export Monde Prestige Inc.` : `${t(data.title)} | Export Monde Prestige Inc.`;
  return (
    <main data-testid={`legal-page-${kind}`}>
      <Seo title={seoTitle} description={t(data.sections[0].body)} path={path} />
      <section className="bg-navy-950 pb-12 pt-[152px] md:pt-[200px]">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <h1 className="font-display text-4xl text-white md:text-5xl">{t(data.title)}</h1>
            {data.updated && <p className="mt-4 text-xs uppercase tracking-widest2 text-white/40">{t(data.updated)}</p>}
          </Reveal>
        </div>
      </section>
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-5 md:px-8">
          {data.sections.map((s, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div data-testid={`legal-section-${i}`}>
                <h2 className="font-display text-xl text-navy-800 md:text-2xl">{t(s.title)}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-graphite">{t(s.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
