import { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { LangProvider } from "@/lib/lang";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Secteurs from "@/pages/Secteurs";
import APropos from "@/pages/APropos";
import Contact from "@/pages/Contact";
import Ressources from "@/pages/Ressources";
import Article from "@/pages/Article";
import Solutions from "@/pages/Solutions";
import Legal from "@/pages/Legal";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import ConsentBanner from "@/components/ConsentBanner";
import { initAnalytics } from "@/lib/analytics";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis;
    let rafId;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/secteurs" element={<Secteurs />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/ressources/:slug" element={<Article />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/confidentialite" element={<Legal kind="privacy" />} />
        <Route path="/mentions-legales" element={<Legal kind="mentions" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/tableau-de-bord" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 text-center">
          <div>
            <h1 className="font-display text-2xl text-white">Une erreur est survenue.</h1>
            <a href="/" className="mt-6 inline-block rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white">Recharger</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <ErrorBoundary>
      <LangProvider>
        <BrowserRouter>
          <ScrollToTop />
          <SmoothScroll />
          <Shell />
          <ConsentBanner />
        </BrowserRouter>
      </LangProvider>
    </ErrorBoundary>
  );
}

export default App;
