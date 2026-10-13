import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { RESOURCES } from "@/content/pages";
import { useLang } from "@/lib/lang";
import api, { formatApiErrorDetail } from "@/lib/api";
import { formatDate } from "./Ressources";

export default function Article() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setArticle(null);
    setNotFound(false);
    api.get(`/articles/${slug}`, { params: { lang } })
      .then(({ data }) => setArticle(data))
      .catch(() => setNotFound(true));
  }, [slug, lang]);

  const paragraphs = article ? (article.body || "").split(/\n{2,}/).filter(Boolean) : [];

  return (
    <main data-testid="article-page">
      {article && (
        <Seo title={`${article.title} | Export Monde Prestige Inc.`} description={article.excerpt} path={`/ressources/${slug}`} />
      )}
      <section className="bg-navy-950 pb-14 pt-[152px] md:pt-[200px]">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          {article ? (
            <Reveal>
              <Link to="/ressources" className="inline-flex items-center gap-2 text-[13px] font-medium text-white/50 transition-colors hover:text-white" data-testid="article-back-link">
                <ArrowLeft size={15} /> {t(RESOURCES.back)}
              </Link>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-turquoise">
                <CalendarDays size={12} /> {formatDate(article.created_at, lang)} · {article.category}
              </span>
              <h1 className="mt-6 font-display text-3xl leading-[1.12] text-white md:text-5xl" data-testid="article-title">{article.title}</h1>
              <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">{article.excerpt}</p>
            </Reveal>
          ) : notFound ? (
            <div className="text-center">
              <h1 className="font-display text-3xl text-white">{t(RESOURCES.notFound)}</h1>
              <Link to="/ressources" className="mt-6 inline-block text-electric-bright underline" data-testid="article-notfound-back">{t(RESOURCES.back)}</Link>
            </div>
          ) : (
            <p className="text-sm text-white/50">{t(RESOURCES.loading)}</p>
          )}
        </div>
      </section>

      {article && (
        <section className="bg-white py-14 md:py-20">
          <article className="mx-auto max-w-3xl px-5 md:px-8" data-testid="article-body">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-6 text-[16px] leading-[1.85] text-graphite first:text-lg first:text-navy-800">{p}</p>
            ))}
          </article>
        </section>
      )}

      <CtaBand
        title={lang === "fr" ? "Envie d'appliquer ces idées à vos projets ?" : "Want to apply these ideas to your projects?"}
        sub={article?.excerpt || ""}
      />
    </main>
  );
}
