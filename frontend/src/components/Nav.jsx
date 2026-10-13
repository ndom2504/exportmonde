import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Wordmark from "./Wordmark";
import { UI } from "@/content/ui";
import { useLang } from "@/lib/lang";

const navItems = [
  { to: "/services", key: "services" },
  { to: "/secteurs", key: "sectors" },
  { to: "/solutions", key: "solutions" },
  { to: "/a-propos", key: "about" },
  { to: "/ressources", key: "resources" },
  { to: "/contact", key: "contact" },
];

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-navy-950/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.08)]" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 md:px-8">
        <Link to="/" data-testid="nav-logo-link" aria-label="Export Monde Prestige Inc. — Accueil">
          <Wordmark light />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-${item.key}-link`}
              className={({ isActive }) =>
                `text-[13.5px] font-medium tracking-wide transition-colors duration-300 ${isActive ? "text-turquoise" : "text-white/75 hover:text-white"}`}
            >
              {t(UI.nav[item.key])}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-white/20 p-0.5" role="group" aria-label="Langue">
            {["fr", "en"].map((l) => (
              <button
                key={l}
                data-testid={`lang-switch-${l}`}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${lang === l ? "bg-white text-navy-800" : "text-white/60 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            to="/contact"
            data-testid="nav-cta-button"
            className="group hidden items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-electric-dark md:inline-flex"
          >
            {t(UI.nav.cta)}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <button
            className="inline-flex rounded-md p-2 text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? t(UI.nav.close) : t(UI.nav.menu)}
            aria-expanded={open}
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[76px] bottom-0 z-40 overflow-y-auto bg-navy-950 px-6 pb-10 pt-6 backdrop-blur-xl lg:hidden"
            data-testid="nav-mobile-menu"
          >
            <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
              {[{ to: "/", key: "home" }, ...navItems].map((item, i) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `block border-b border-white/10 py-4 font-display text-2xl ${isActive ? "text-turquoise" : "text-white"}`}
                  >
                    {t(UI.nav[item.key])}
                  </NavLink>
                </motion.div>
              ))}
              <Link to="/contact" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric px-6 py-4 text-base font-semibold text-white">
                {t(UI.nav.cta)} <ArrowRight size={17} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
