import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { getService, SERVICES } from "@/content/services";
import { useLang } from "@/lib/lang";

const ICONS = { Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack };

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const service = getService(slug);
  if (!service) {
    return (
      <main className="bg-navy-950 pb-24 pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 text-center md:px-8">
          <h1 className="font-display text-4xl text-white">404</h1>
          <Link to="/services" className="mt-6 inline-block text-electric-bright underline">{lang === "fr" ? "Voir nos services" : "View our services"}</Link>
        </div>
      </main>
    );
  }
  const Icon = ICONS[service.icon];
  const others = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <main data-testid="service-detail-page">
      <Seo
        title={`${t(service.title)} | Export Monde Prestige Inc.`}
        description={t(service.short)}
        path={`/services/${service.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: t(service.title),
          description: t(service.short),
          provider: { "@type": "Organization", name: "Export Monde Prestige Inc.", url: "https://www.exportmondeprestigeinc.com" },
          areaServed: "CA",
        }}
      />

      <section className="relative overflow-hidden bg-navy-950 pb-16 pt-[152px] md:pb-20 md:pt-[200px]">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-electric/20 blur-[110px]" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <Link to="/services" className="inline-flex items-center gap-2 text-[13px] font-medium text-white/50 transition-colors hover:text-white" data-testid="service-back-link">
              <ArrowLeft size={15} /> {lang === "fr" ? "Tous les services" : "All services"}
            </Link>
            <div className="mt-8 flex items-center gap-5">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-electric text-white">
                <Icon size={26} strokeWidth={1.8} />
              </span>
              <span className="font-display text-5xl text-white/15 md:text-6xl">{service.num}</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-[3.4rem]" data-testid="service-detail-title">{t(service.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(service.short)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-display text-2xl text-navy-800 md:text-3xl">{lang === "fr" ? "Le problème que vous vivez" : "The challenge you face"}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-graphite">{t(service.problem)}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-12 font-display text-2xl text-navy-800 md:text-3xl">{lang === "fr" ? "Notre solution" : "Our solution"}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-graphite">{t(service.solution)}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-12 font-display text-2xl text-navy-800 md:text-3xl">{lang === "fr" ? "Notre processus d'intervention" : "How we work"}</h2>
              <ol className="mt-6 space-y-0 border-t border-line">
                {service.process[lang].map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-b border-line py-5">
                    <span className="font-display text-xl text-electric/40">0{i + 1}</span>
                    <span className="text-[15px] text-navy-800">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-12 font-display text-2xl text-navy-800 md:text-3xl">{lang === "fr" ? "Bénéfices attendus" : "Expected benefits"}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.benefits[lang].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-line bg-paper p-4 text-sm leading-relaxed text-navy-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-electric" /> {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="sticky top-28 rounded-xl border border-line bg-paper p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest2 text-electric">{lang === "fr" ? "Livrables possibles" : "Possible deliverables"}</h3>
                <ul className="mt-5 space-y-3.5">
                  {service.deliverables[lang].map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-navy-800">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" /> {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-line pt-7">
                  <p className="font-display text-xl leading-snug text-navy-800">
                    {lang === "fr" ? "Discutons de votre contexte." : "Let's discuss your context."}
                  </p>
                  <Link
                    to="/contact"
                    data-testid="service-detail-cta"
                    className="group mt-5 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-electric-dark"
                  >
                    {lang === "fr" ? "Demander une soumission" : "Request a quote"}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <h2 className="font-display text-2xl text-navy-800">{lang === "fr" ? "Autres services" : "Other services"}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {others.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group rounded-xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card" data-testid={`service-other-${s.slug}`}>
                <span className="font-display text-lg text-electric/40">{s.num}</span>
                <h3 className="mt-2 font-display text-lg leading-snug text-navy-800 group-hover:text-electric">{t(s.title)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={lang === "fr" ? "Parlez-nous de votre projet." : "Tell us about your project."}
        sub={t(service.short)}
      />
    </main>
  );
}
