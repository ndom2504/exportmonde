import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { RESOURCES } from "@/content/pages";
import { useLang } from "@/lib/lang";
import api, { formatApiErrorDetail } from "@/lib/api";

export function formatDate(iso, lang) {
  try {
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-CA" : "fr-CA", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export default function Ressources() {
  const { t, lang } = useLang();
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/articles", { params: { lang } })
      .then(({ data }) => setArticles(data))
      .catch((e) => { setError(formatApiErrorDetail(e.response?.data?.detail)); setArticles([]); });
  }, [lang]);

  return (
    <main data-testid="resources-page">
      <Seo
        title={lang === "fr"
          ? "Ressources et expertise — gestion de projets, estimation, appels d'offres | Export Monde Prestige Inc."
          : "Insights & expertise — project management, estimation, tenders | Export Monde Prestige Inc."}
        description={t(RESOURCES.header.sub)}
        path="/ressources"
      />
      <section className="bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(RESOURCES.header.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl">{t(RESOURCES.header.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(RESOURCES.header.sub)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {!articles && <p className="text-sm text-steel">{t(RESOURCES.loading)}</p>}
          {articles && articles.length === 0 && <p className="text-sm text-steel" data-testid="resources-empty">{t(RESOURCES.empty)}</p>}
          {articles && articles.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="resources-grid">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 0.05} className="h-full">
                  <Link
                    to={`/ressources/${a.slug}`}
                    data-testid={`resource-card-${a.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/40 hover:shadow-lift"
                  >
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-electric/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-electric">
                      <CalendarDays size={12} /> {formatDate(a.created_at, lang)}
                    </span>
                    <h2 className="mt-5 font-display text-xl leading-snug text-navy-800 group-hover:text-electric">{a.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-graphite">{a.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-semibold text-electric">
                      {t(RESOURCES.readMore)}
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Un sujet qui vous parle ?" : "A topic that speaks to you?"}
        sub={lang === "fr"
          ? "Discutons de la façon dont ces méthodes s'appliqueraient à vos projets."
          : "Let's discuss how these methods would apply to your projects."}
      />
    </main>
  );
}
