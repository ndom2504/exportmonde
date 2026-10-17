import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Printer, Trash2 } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";

const STATUS = ["nouveau", "en_cours", "traite"];

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function printDocument(title, body) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0A1E3C; margin: 24px; }
      h1 { font-size: 18px; margin: 0 0 4px; }
      .meta { color: #5B6575; font-size: 12px; margin: 0 0 18px; }
      dt { margin-top: 12px; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #5B6575; }
      dd { margin: 2px 0 0; font-size: 14px; }
      .block { margin-top: 16px; white-space: pre-line; font-size: 14px; line-height: 1.5; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border-bottom: 1px solid #E5E9F0; text-align: left; vertical-align: top; padding: 8px 6px; }
      th { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #5B6575; }
      @media print { body { margin: 12mm; } }
    </style></head><body>${body}</body></html>`);
  doc.close();
  const win = frame.contentWindow;
  win.focus();
  win.print();
  setTimeout(() => frame.remove(), 1500);
}

function leadSheet(lead) {
  const rows = [
    ["Date", new Date(lead.created_at).toLocaleString("fr-CA")],
    ["Nom", `${lead.first_name} ${lead.last_name}`],
    ["Entreprise", lead.company],
    ["Courriel", lead.email],
    ["Téléphone", lead.phone || "—"],
    ["Service", lead.service_label],
    ["Budget", lead.budget || "—"],
    ["Échéance", lead.deadline || "—"],
    ["Statut", lead.status],
  ];
  return `<h1>Consultation — ${esc(lead.company)}</h1>
    <p class="meta">Export Monde Prestige Inc.</p>
    ${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}
    <dt>Besoin</dt><dd class="block">${esc(lead.message)}</dd>
    <dt>Réponse envoyée</dt><dd class="block">${esc(lead.reply_body || "Aucune réponse enregistrée.")}</dd>`;
}

function LeadsTab() {
  const [leads, setLeads] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.get("/admin/leads").then(({ data }) => setLeads(data)).catch(() => setLeads([]));
  }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/admin/leads/${id}`, { status });
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const resend = async (id) => {
    setBusyId(id);
    setNote("");
    try {
      const { data } = await api.post(`/admin/leads/${id}/reply`);
      setLeads(leads.map((l) => (l.id === id ? { ...l, ...data } : l)));
      setOpenId(id);
      setNote(data.reply_sent ? "Réponse envoyée au demandeur." : "La réponse n'a pas pu être envoyée. Le texte est enregistré.");
    } catch (err) {
      setNote(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusyId(null);
    }
  };

  const printOne = (lead) => printDocument(`Consultation ${lead.company}`, leadSheet(lead));

  const printAll = () => {
    const rows = (leads || []).map((l) => `<tr>
      <td>${esc(new Date(l.created_at).toLocaleString("fr-CA"))}</td>
      <td>${esc(`${l.first_name} ${l.last_name}`)}<br>${esc(l.company)}</td>
      <td>${esc(l.email)}</td>
      <td>${esc(l.service_label)}</td>
      <td>${esc(l.message)}</td>
      <td>${esc(l.reply_sent ? "Envoyée" : "Non envoyée")}</td>
    </tr>`).join("");
    printDocument("Consultations reçues", `<h1>Consultations reçues</h1>
      <p class="meta">Export Monde Prestige Inc. — ${esc(new Date().toLocaleString("fr-CA"))}</p>
      <table><thead><tr><th>Date</th><th>Contact</th><th>Courriel</th><th>Service</th><th>Besoin</th><th>Réponse</th></tr></thead>
      <tbody>${rows}</tbody></table>`);
  };

  if (!leads) return <p className="text-sm text-steel">…</p>;
  if (leads.length === 0) return <p className="text-sm text-steel" data-testid="admin-leads-empty">Aucune demande reçue pour le moment.</p>;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-steel">{leads.length} consultation{leads.length > 1 ? "s" : ""}</p>
        <button type="button" onClick={printAll} data-testid="admin-leads-print"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:border-electric hover:text-electric">
          <Printer size={14} /> Imprimer la liste
        </button>
      </div>
      {note && <p className="mb-4 rounded-lg border border-line bg-white px-4 py-3 text-sm text-navy-800" role="status">{note}</p>}
      <div className="overflow-x-auto rounded-xl border border-line" data-testid="admin-leads-table">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wider text-steel">
            <tr>
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Nom</th><th className="px-4 py-3">Entreprise</th>
              <th className="px-4 py-3">Courriel</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Besoin</th>
              <th className="px-4 py-3">Réponse</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <Fragment key={l.id}>
                <tr className="border-t border-line align-top" data-testid={`admin-lead-row-${l.id}`}>
                  <td className="px-4 py-3 text-steel">{new Date(l.created_at).toLocaleString("fr-CA")}</td>
                  <td className="px-4 py-3 font-medium text-navy-800">{l.first_name} {l.last_name}</td>
                  <td className="px-4 py-3">{l.company}{l.source === "assistant_ia" && <span className="ml-1 text-[10px] font-semibold uppercase text-electric">IA</span>}</td>
                  <td className="px-4 py-3"><a className="text-electric underline" href={`mailto:${l.email}`}>{l.email}</a>{l.phone && <span className="block text-xs text-steel">{l.phone}</span>}</td>
                  <td className="px-4 py-3">{l.service_label}</td>
                  <td className="max-w-[280px] px-4 py-3 text-graphite">
                    {l.message.length > 140 ? `${l.message.slice(0, 140)}…` : l.message}
                    {(l.budget || l.deadline) && <span className="mt-1 block text-xs text-steel">{[l.budget, l.deadline].filter(Boolean).join(" · ")}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">{l.reply_sent ? "Envoyée" : "Non envoyée"}</td>
                  <td className="px-4 py-3">
                    <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} data-testid={`admin-lead-status-${l.id}`}
                      className="rounded border border-line bg-white px-2 py-1 text-xs">
                      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1.5">
                      <button type="button" onClick={() => printOne(l)} data-testid={`admin-lead-print-${l.id}`}
                        className="inline-flex items-center gap-1 rounded border border-line px-2.5 py-1 text-xs font-semibold text-navy-800 hover:border-electric hover:text-electric">
                        <Printer size={12} /> Imprimer
                      </button>
                      <button type="button" onClick={() => setOpenId(openId === l.id ? null : l.id)} data-testid={`admin-lead-reply-toggle-${l.id}`}
                        className="rounded border border-line px-2.5 py-1 text-xs font-semibold text-navy-800 hover:border-electric hover:text-electric">
                        {openId === l.id ? "Masquer" : "Voir la réponse"}
                      </button>
                    </div>
                  </td>
                </tr>
                {openId === l.id && (
                  <tr className="border-t border-line bg-paper" data-testid={`admin-lead-reply-${l.id}`}>
                    <td colSpan={9} className="px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-steel">{l.reply_subject || "Réponse"} · {l.reply_source === "ia" ? "rédigée par l'assistant" : "modèle stratégique"}</p>
                      <p className="mt-2 max-w-3xl whitespace-pre-line text-sm text-navy-800">{l.reply_body || "Aucune réponse n'a encore été préparée pour cette demande."}</p>
                      {l.reply_error && <p className="mt-2 text-xs text-red-600">{l.reply_error}</p>}
                      <button type="button" onClick={() => resend(l.id)} disabled={busyId === l.id} data-testid={`admin-lead-resend-${l.id}`}
                        className="mt-3 rounded-full bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-electric disabled:opacity-60">
                        {busyId === l.id ? "Envoi…" : "Rédiger et envoyer la réponse"}
                      </button>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const emptyArticle = { title_fr: "", title_en: "", excerpt_fr: "", excerpt_en: "", body_fr: "", body_en: "", category: "", published: true };

function ArticlesTab() {
  const [articles, setArticles] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyArticle);
  const [error, setError] = useState("");

  const load = () => api.get("/admin/articles").then(({ data }) => setArticles(data)).catch(() => setArticles([]));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/admin/articles/${editing}`, form);
      } else {
        await api.post("/admin/articles", form);
      }
      setEditing(null); setForm(emptyArticle); load();
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  const remove = async (id) => {
    await api.delete(`/admin/articles/${id}`);
    load();
  };

  const edit = (a) => {
    setEditing(a.id);
    setForm({
      title_fr: a.title_fr || "", title_en: a.title_en || "", excerpt_fr: a.excerpt_fr || "", excerpt_en: a.excerpt_en || "",
      body_fr: a.body_fr || "", body_en: a.body_en || "", category: a.category || "", published: a.published,
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-navy-800">Articles</h2>
          <button onClick={() => { setEditing(null); setForm(emptyArticle); }} data-testid="admin-article-new"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-electric">
            <Plus size={14} /> Nouveau
          </button>
        </div>
        {!articles && <p className="mt-4 text-sm text-steel">…</p>}
        <ul className="mt-4 space-y-2">
          {(articles || []).map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-line bg-white p-4" data-testid={`admin-article-item-${a.id}`}>
              <div>
                <p className="text-sm font-semibold text-navy-800">{a.title_fr}</p>
                <p className="mt-0.5 text-xs text-steel">{a.category} · {a.published ? "publié" : "brouillon"} · /{a.slug}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => edit(a)} data-testid={`admin-article-edit-${a.id}`} className="rounded border border-line px-2.5 py-1 text-xs font-semibold text-navy-800 hover:border-electric hover:text-electric">Modifier</button>
                <button onClick={() => remove(a.id)} data-testid={`admin-article-delete-${a.id}`} aria-label="Supprimer" className="rounded border border-red-200 p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7">
        <form onSubmit={save} className="rounded-xl border border-line bg-white p-7" data-testid="admin-article-form">
          <h2 className="font-display text-xl text-navy-800">{editing ? "Modifier l'article" : "Nouvel article"}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input required placeholder="Titre (FR)" data-testid="admin-article-title-fr" value={form.title_fr} onChange={set("title_fr")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric" />
            <input placeholder="Title (EN)" data-testid="admin-article-title-en" value={form.title_en} onChange={set("title_en")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric" />
            <input required placeholder="Catégorie" data-testid="admin-article-category" value={form.category} onChange={set("category")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric" />
            <label className="flex items-center gap-2 text-sm text-navy-800">
              <input type="checkbox" checked={form.published} onChange={set("published")} data-testid="admin-article-published" className="h-4 w-4 accent-electric" /> Publié
            </label>
            <textarea required placeholder="Extrait (FR)" rows={2} data-testid="admin-article-excerpt-fr" value={form.excerpt_fr} onChange={set("excerpt_fr")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric sm:col-span-2" />
            <textarea placeholder="Excerpt (EN)" rows={2} data-testid="admin-article-excerpt-en" value={form.excerpt_en} onChange={set("excerpt_en")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric sm:col-span-2" />
            <textarea required placeholder="Contenu (FR) — séparer les paragraphes par une ligne vide" rows={9} data-testid="admin-article-body-fr" value={form.body_fr} onChange={set("body_fr")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric sm:col-span-2" />
            <textarea placeholder="Body (EN) — separate paragraphs with a blank line" rows={9} data-testid="admin-article-body-en" value={form.body_en} onChange={set("body_en")} className="rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-electric sm:col-span-2" />
          </div>
          {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" data-testid="admin-article-save" className="mt-5 rounded-full bg-electric px-7 py-3 text-sm font-semibold text-white hover:bg-electric-dark">
            {editing ? "Enregistrer" : "Publier"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("leads");
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then(({ data }) => setMe(data)).catch(() => navigate("/admin"));
  }, [navigate]);

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    navigate("/admin");
  };

  return (
    <main className="min-h-screen bg-paper" data-testid="admin-dashboard">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-8">
            <span className="font-display text-xl font-semibold text-navy-800">EMP — Admin</span>
            <nav className="flex gap-1" aria-label="Sections admin">
              <button onClick={() => setTab("leads")} data-testid="admin-tab-leads"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === "leads" ? "bg-navy-800 text-white" : "text-graphite hover:text-navy-800"}`}>
                Consultations
              </button>
              <button onClick={() => setTab("articles")} data-testid="admin-tab-articles"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === "articles" ? "bg-navy-800 text-white" : "text-graphite hover:text-navy-800"}`}>
                Articles
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {me && <span className="hidden text-xs text-steel sm:block" data-testid="admin-user-email">{me.email}</span>}
            <button onClick={logout} data-testid="admin-logout-button" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-navy-800 hover:border-red-300 hover:text-red-600">
              <LogOut size={14} /> Quitter
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1320px] px-5 py-10 md:px-8">
        {tab === "leads" ? <LeadsTab /> : <ArticlesTab />}
      </div>
    </main>
  );
}
