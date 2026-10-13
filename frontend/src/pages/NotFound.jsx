import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { useLang } from "@/lib/lang";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-5 text-center" data-testid="not-found-page">
      <Seo title={lang === "fr" ? "Page introuvable | Export Monde Prestige Inc." : "Page not found | Export Monde Prestige Inc."} description="404" path="/404" />
      <p className="font-display text-7xl text-electric/40">404</p>
      <h1 className="mt-4 font-display text-2xl text-white">
        {lang === "fr" ? "Cette page n'existe pas ou a été déplacée." : "This page doesn't exist or has moved."}
      </h1>
      <Link to="/" className="mt-8 rounded-full bg-electric px-7 py-3.5 text-sm font-semibold text-white hover:bg-electric-dark" data-testid="notfound-home-link">
        {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
      </Link>
    </main>
  );
}
