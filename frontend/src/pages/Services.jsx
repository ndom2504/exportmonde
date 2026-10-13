import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { SERVICES } from "@/content/services";
import { PAGE_HEADERS } from "@/content/pages";
import { useLang } from "@/lib/lang";

const ICONS = { Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack };

export default function Services() {
  const { t, lang } = useLang();
  return (
    <main data-testid="services-page">
      <Seo
        title={lang === "fr"
          ? "Nos services — gestion de projets, estimation, approvisionnement | Export Monde Prestige Inc."
          : "Our services — project management, estimation, procurement | Export Monde Prestige Inc."}
        description={t(PAGE_HEADERS.services.sub)}
        path="/services"
      />
      <section className="bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(PAGE_HEADERS.services.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl" data-testid="services-title">{t(PAGE_HEADERS.services.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(PAGE_HEADERS.services.sub)}</p>
            <p className="mt-8 max-w-2xl border-l-2 border-electric pl-4 text-[13px] leading-relaxed text-white/50">{t(PAGE_HEADERS.services.availability)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <Reveal key={s.slug} delay={i * 0.05} className="h-full">
                  <Link
                    to={`/services/${s.slug}`}
                    data-testid={`services-detail-card-${s.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-line bg-paper p-8 transition-all duration-400 hover:-translate-y-1.5 hover:border-electric/40 hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800 text-white transition-colors duration-300 group-hover:bg-electric">
                        <Icon size={22} strokeWidth={1.8} />
                      </span>
                      <span className="font-display text-4xl text-line transition-colors duration-300 group-hover:text-electric/40">{s.num}</span>
                    </div>
                    <h2 className="mt-6 font-display text-2xl leading-snug text-navy-800">{t(s.title)}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-graphite">{t(s.short)}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-semibold text-electric">
                      {lang === "fr" ? "Voir le service" : "View service"}
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Un besoin précis ? Parons-le." : "A specific need? Let's tackle it."}
        sub={t(PAGE_HEADERS.services.sub)}
      />
    </main>
  );
}
