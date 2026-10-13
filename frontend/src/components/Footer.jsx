import { Link } from "react-router-dom";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { UI, SITE } from "@/content/ui";
import { SERVICES } from "@/content/services";
import { useLang } from "@/lib/lang";

export default function Footer() {
  const { t, lang } = useLang();
  return (
    <footer className="bg-paper text-ink" data-testid="site-footer">
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src="/logo.png" alt="Logo Export Monde Prestige Inc." className="h-32 w-auto" loading="lazy" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-graphite">{t(UI.footer.tagline)}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest2 text-navy-800">{t(UI.footer.navTitle)}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/">{t(UI.nav.home)}</Link></li>
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/secteurs">{t(UI.nav.sectors)}</Link></li>
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/solutions">{t(UI.nav.solutions)}</Link></li>
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/a-propos">{t(UI.nav.about)}</Link></li>
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/ressources">{t(UI.nav.resources)}</Link></li>
              <li><Link className="text-graphite transition-colors hover:text-electric" to="/contact">{t(UI.nav.contact)}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest2 text-navy-800">{t(UI.footer.servicesTitle)}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link className="text-graphite transition-colors hover:text-electric" to={`/services/${s.slug}`}>
                    {t(s.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest2 text-navy-800">{t(UI.footer.contactTitle)}</h3>
            <ul className="mt-5 space-y-4 text-sm text-graphite">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-electric" />
                <a href={`mailto:${SITE.email}`} data-testid="footer-email-link" className="transition-colors hover:text-electric">{SITE.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-electric" />
                <a href={SITE.phoneHref} data-testid="footer-phone-link" className="transition-colors hover:text-electric">{SITE.phoneDisplay}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-electric" />
                <span>{t(UI.footer.address)}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-electric" />
                <span>Canada — Ontario · Ottawa · Québec</span>
              </li>
            </ul>
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest2 text-navy-800">{t(UI.footer.legal)}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link className="text-graphite transition-colors hover:text-electric" to="/confidentialite">{t(UI.footer.privacy)}</Link></li>
                <li><Link className="text-graphite transition-colors hover:text-electric" to="/mentions-legales">{t(UI.footer.mentions)}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-7 text-xs text-steel md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. {t(UI.footer.rights)}</p>
          <p>{lang === "fr" ? "Solutions numériques · Ingénierie · Gestion de projets · Construction · Approvisionnements" : "Digital solutions · Engineering · Project management · Construction · Procurement"}</p>
        </div>
      </div>
    </footer>
  );
}
