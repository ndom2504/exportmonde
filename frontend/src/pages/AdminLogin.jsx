import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useLang } from "@/lib/lang";

export default function AdminLogin() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      navigate("/admin/tableau-de-bord");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-5" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={15} /> {lang === "fr" ? "Retour au site" : "Back to site"}
        </Link>
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-navy-900 p-9" data-testid="admin-login-form">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-electric/15 text-electric-bright">
            <Lock size={22} />
          </span>
          <h1 className="mt-5 font-display text-2xl text-white">
            {lang === "fr" ? "Espace administratif" : "Admin area"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {lang === "fr" ? "Accès réservé — demandes et publications." : "Restricted access — leads and publications."}
          </p>
          <div className="mt-7 space-y-4">
            <div>
              <label htmlFor="a-email" className="mb-1.5 block text-[13px] font-semibold text-white/80">Email</label>
              <input id="a-email" type="email" required data-testid="admin-email-input" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-navy-950 px-4 py-3 text-sm text-white outline-none focus:border-electric" />
            </div>
            <div>
              <label htmlFor="a-pass" className="mb-1.5 block text-[13px] font-semibold text-white/80">
                {lang === "fr" ? "Mot de passe" : "Password"}
              </label>
              <input id="a-pass" type="password" required data-testid="admin-password-input" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-navy-950 px-4 py-3 text-sm text-white outline-none focus:border-electric" />
            </div>
          </div>
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300" data-testid="admin-login-error">{error}</p>}
          <button type="submit" disabled={loading} data-testid="admin-login-submit"
            className="mt-6 w-full rounded-full bg-electric py-3.5 text-sm font-semibold text-white transition-colors hover:bg-electric-dark disabled:opacity-60">
            {loading ? "…" : lang === "fr" ? "Se connecter" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
