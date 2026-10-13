import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Target, Eye, Gauge, ShieldCheck, Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal, MaskLines, Marquee, EASE } from "@/components/Reveal";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { HOME } from "@/content/home";
import { SERVICES } from "@/content/services";
import { SECTORS } from "@/content/pages";
import { UI } from "@/content/ui";
import { useLang } from "@/lib/lang";

const ICONS = { Layers, HardHat, Calculator, CalendarRange, PackageSearch, FileStack, Target, Eye, Gauge, ShieldCheck };

const HERO_IMG = "https://images.unsplash.com/photo-1764129669382-ec26da02a313?auto=format&fit=crop&w=1400&q=80";

export default function Home() {
  const { t, lang } = useLang();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const bentoSpans = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4", "md:col-span-3", "md:col-span-3"];

  return (
    <main data-testid="home-page">
      <Seo
        title={lang === "fr"
          ? "Export Monde Prestige Inc. | Solutions numériques et gestion de projets de construction"
          : "Export Monde Prestige Inc. | Digital Solutions & Construction Project Management"}
        description={t(HOME.hero.sub)}
        path="/"
      />

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden bg-navy-950 pt-[76px]" data-testid="home-hero">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <motion.div style={{ y: glowY }} className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-electric/25 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-turquoise/10 blur-[110px]" />

        <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest2 text-white/80 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-turquoise" />
              {t(HOME.hero.eyebrow)}
            </motion.p>
            <h1 className="font-display text-[2.6rem] font-medium leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]" data-testid="hero-title">
              <MaskLines lines={HOME.hero.lines[lang]} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
              data-testid="hero-subtitle"
            >
              {t(HOME.hero.sub)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/contact" data-testid="hero-cta-quote" className="group inline-flex items-center gap-2 rounded-full bg-electric px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-electric-bright">
                {t(UI.cta.quote)}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/services" data-testid="hero-cta-services" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/5">
                {t(UI.cta.discover)}
              </Link>
            </motion.div>
          </div>

          <div className="relative lg:col-span-5">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.5, ease: EASE }} className="relative">
              <div className="absolute -inset-3 rounded-2xl border border-electric/30" style={{ transform: "translate(14px, 14px)" }} />
              <motion.div style={{ y: imgY }} className="relative overflow-hidden rounded-2xl" data-testid="hero-image-frame">
                <img src={HERO_IMG} alt={t(HOME.hero.imgAlt)} className="aspect-[4/5] w-full object-cover" loading="eager" fetchpriority="high" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
                className="absolute -bottom-8 -left-4 max-w-[260px] rounded-xl border border-white/10 bg-navy-900/90 p-5 shadow-lift backdrop-blur-xl md:-left-12"
                data-testid="hero-floating-card"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest2 text-turquoise">{lang === "fr" ? "Nos expertises" : "Our expertise"}</p>
                <ul className="mt-3 space-y-2 text-[13px] text-white/85">
                  {(lang === "fr"
                    ? ["Gestion de projets", "Estimation des coûts", "Approvisionnement", "Appels d'offres"]
                    : ["Project management", "Cost estimation", "Procurement", "Tenders & bids"]).map((x) => (
                    <li key={x} className="flex items-center gap-2"><span className="h-1 w-3 rounded-full bg-electric-bright" />{x}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee items={HOME.marquee[lang]} />

      {/* DOMAINES — BENTO */}
      <section className="bg-white py-20 md:py-28" data-testid="home-services-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.domains.eyebrow)}</p>
            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-xl font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.domains.title)}</h2>
              <p className="max-w-md text-[15px] leading-relaxed text-graphite">{t(HOME.domains.intro)}</p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-6">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <Reveal key={s.slug} delay={i * 0.06} className={`${bentoSpans[i]} h-full`}>
                  <Link
                    to={`/services/${s.slug}`}
                    data-testid={`home-service-card-${s.slug}`}
                    className="group flex h-full flex-col justify-between rounded-xl border border-line bg-paper p-7 transition-all duration-400 hover:-translate-y-1.5 hover:border-electric/40 hover:shadow-lift"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy-800 text-white transition-colors duration-300 group-hover:bg-electric">
                          <Icon size={20} strokeWidth={1.8} />
                        </span>
                        <span className="font-display text-3xl text-line transition-colors duration-300 group-hover:text-electric/40">{s.num}</span>
                      </div>
                      <h3 className="mt-6 font-display text-xl leading-snug text-navy-800">{t(s.title)}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-graphite">{t(s.short)}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-electric">
                      {lang === "fr" ? "En savoir plus" : "Learn more"}
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DÉFIS & SOLUTIONS */}
      <section className="bg-navy-800 py-20 md:py-28" data-testid="home-challenges-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(HOME.challenges.eyebrow)}</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] text-white md:text-5xl">{t(HOME.challenges.title)}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {HOME.challenges.items.map((item, i) => (
              <Reveal key={i} delay={i * 0.05} className="h-full">
                <div className="flex h-full flex-col gap-4 bg-navy-800 p-7 transition-colors duration-300 hover:bg-navy-700" data-testid={`challenge-card-${i}`}>
                  <p className="text-[15px] font-medium leading-relaxed text-white/90">{t(item.challenge)}</p>
                  <div className="mt-auto border-t border-white/10 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest2 text-turquoise">{lang === "fr" ? "Notre solution" : "Our solution"}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{t(item.solution)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTHODE */}
      <section className="bg-paper py-20 md:py-28" data-testid="home-method-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.method.eyebrow)}</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.method.title)}</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            {HOME.method.steps.map((step, i) => (
              <Reveal key={i} delay={i * 0.08} className="h-full">
                <div className="relative h-full border-t-2 border-navy-800 pt-6" data-testid={`method-step-${i}`}>
                  <span className="font-display text-5xl font-light text-electric/25">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-navy-800">{t(step.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{t(step.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="bg-white py-20 md:py-28" data-testid="home-advantages-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.advantages.eyebrow)}</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.advantages.title)}</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOME.advantages.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-xl border border-line p-7 transition-all duration-300 hover:border-electric/40 hover:shadow-card" data-testid={`advantage-card-${i}`}>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-electric/10 text-electric">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 font-display text-lg text-navy-800">{t(item.title)}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-graphite">{t(item.desc)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section className="bg-paper py-20 md:py-28" data-testid="home-sectors-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.sectors.eyebrow)}</p>
            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-xl font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.sectors.title)}</h2>
              <p className="max-w-md text-[15px] leading-relaxed text-graphite">{t(HOME.sectors.intro)}</p>
            </div>
          </Reveal>
          <div className="mt-12 border-t border-line">
            {SECTORS.items.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <Link
                  to={`/secteurs#${s.slug}`}
                  data-testid={`home-sector-row-${s.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-6 transition-colors duration-300 hover:bg-white md:gap-8 md:px-4"
                >
                  <span className="font-display text-lg text-steel">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl text-navy-800 transition-colors duration-300 group-hover:text-electric md:text-2xl">{t(s.title)}</h3>
                    <p className="mt-1 hidden max-w-2xl text-sm text-graphite md:block">{t(s.desc)}</p>
                  </div>
                  <ArrowUpRight size={20} className="text-steel transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-electric" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS TEASER */}
      <section className="bg-white py-20 md:py-28" data-testid="home-about-section">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?auto=format&fit=crop&w=1200&q=80" alt={lang === "fr" ? "Tour de bureaux en verre contemporaine" : "Contemporary glass office tower"} className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
              <div className="absolute -bottom-6 -right-4 hidden h-28 w-28 items-center justify-center rounded-xl bg-electric p-4 text-center md:flex">
                <p className="font-display text-sm leading-snug text-white">{lang === "fr" ? "Bâti sur la rigueur." : "Built on rigour."}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.aboutTeaser.eyebrow)}</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.aboutTeaser.title)}</h2>
            <p className="mt-6 text-base leading-relaxed text-graphite">{t(HOME.aboutTeaser.body)}</p>
            <Link to="/a-propos" data-testid="home-about-link" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric">
              {t(HOME.aboutTeaser.link)}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 md:py-28" data-testid="home-faq-section">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-widest2 text-electric">{t(HOME.faq.eyebrow)}</p>
            <h2 className="mt-4 text-center font-display text-4xl leading-[1.08] text-navy-800 md:text-5xl">{t(HOME.faq.title)}</h2>
          </Reveal>
          <div className="mt-12">
            <Faq items={HOME.faq.items} />
          </div>
        </div>
      </section>

      <CtaBand title={t(HOME.finalCta.title)} sub={t(HOME.finalCta.sub)} />
    </main>
  );
}
