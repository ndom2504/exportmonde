import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, User, X, FileText, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/lang";
import api, { formatApiErrorDetail } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { EASE } from "./Reveal";

const COPY = {
  title: { fr: "Assistant EMP", en: "EMP Assistant" },
  status: { fr: "En ligne — répond en quelques secondes", en: "Online — replies in seconds" },
  greeting: {
    fr: "Bonjour, je suis l'assistant d'Export Monde Prestige Inc. Posez vos questions sur nos services, ou créez une demande de soumission.",
    en: "Hello, I'm the Export Monde Prestige Inc. assistant. Ask about our services, or create a quote request.",
  },
  chips: {
    fr: ["Quels services offrez-vous ?", "Comment obtenir une soumission ?", "Travaillez-vous au Québec ?"],
    en: ["What services do you offer?", "How do I get a quote?", "Do you work in Quebec?"],
  },
  placeholder: { fr: "Écrivez votre question…", en: "Type your question…" },
  lead: { fr: "Créer une demande de soumission", en: "Create a quote request" },
  leadTitle: { fr: "Vos coordonnées", en: "Your details" },
  close: { fr: "Fermer l'assistant", en: "Close assistant" },
  disclaimer: { fr: "Réponses générées par IA — vérifiez les informations importantes.", en: "AI-generated answers — verify important information." },
  sent: { fr: "Demande envoyée ! Notre équipe vous répondra par courriel.", en: "Request sent! Our team will reply by email." },
  error: { fr: "Erreur — veuillez réessayer.", en: "Error — please try again." },
  sending: { fr: "Envoi…", en: "Sending…" },
};

const LEAD_LABELS = {
  first: { fr: "Prénom", en: "First name" },
  last: { fr: "Nom", en: "Last name" },
  company: { fr: "Entreprise", en: "Company" },
  email: { fr: "Courriel", en: "Email" },
  message: { fr: "Votre besoin en quelques lignes", en: "Your need in a few lines" },
  submit: { fr: "Envoyer ma demande", en: "Send my request" },
};

function sessionKey() {
  let id = sessionStorage.getItem("emp-chat-session");
  if (!id) {
    id = `web-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    sessionStorage.setItem("emp-chat-session", id);
  }
  return id;
}

export default function AssistantWidget() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [lead, setLead] = useState({ first_name: "", last_name: "", company: "", email: "", message: "" });
  const scrollRef = useRef(null);
  const openedOnce = useRef(false);

  useEffect(() => {
    if (open) {
      setMessages((m) => (m[0].text ? m : [{ role: "assistant", text: t(COPY.greeting) }]));
      if (!openedOnce.current) {
        openedOnce.current = true;
        trackEvent("assistant_open");
      }
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, showLead]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: content }, { role: "assistant", text: "" }]);
    setBusy(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionKey(), message: content, lang }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const { delta, error } = JSON.parse(payload);
            if (delta) setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: c[c.length - 1].text + delta }; return c; });
            if (error) setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: t(COPY.error) }; return c; });
          } catch { /* ignore malformed chunk */ }
        }
      }
    } catch {
      setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", text: t(COPY.error) }; return c; });
    } finally {
      setBusy(false);
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadError("");
    if (!lead.first_name.trim() || !lead.last_name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || lead.message.trim().length < 20) {
      setLeadError(t(COPY.error));
      return;
    }
    try {
      await api.post("/ai/leads", { ...lead, session_id: sessionKey(), lang });
      setLeadSent(true);
      setMessages((m) => [...m, { role: "assistant", text: t(COPY.sent) }]);
    } catch (err) {
      setLeadError(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label={open ? t(COPY.close) : "Assistant EMP"}
        aria-expanded={open}
        data-testid="assistant-toggle-button"
        className="fixed bottom-6 right-6 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-electric text-white shadow-lift transition-colors hover:bg-electric-dark"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-24 right-5 z-[70] flex h-[560px] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift md:right-6"
            data-testid="assistant-panel"
          >
            <div className="flex items-center gap-3 bg-navy-800 px-5 py-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-electric/20 text-electric-bright"><Bot size={20} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{t(COPY.title)}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-turquoise" /> {t(COPY.status)}
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4" data-testid="assistant-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`} data-testid={`assistant-message-${msg.role}`}>
                  {msg.role === "assistant" && <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white"><Bot size={14} /></span>}
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${msg.role === "user" ? "rounded-br-md bg-electric text-white" : "rounded-bl-md border border-line bg-white text-ink"}`}>
                    {msg.text || (busy && i === messages.length - 1 ? "…" : "")}
                  </div>
                  {msg.role === "user" && <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric"><User size={14} /></span>}
                </div>
              ))}

              {!leadSent && messages.filter((m) => m.role === "user").length >= 0 && (
                <button
                  onClick={() => setShowLead(!showLead)}
                  data-testid="assistant-lead-button"
                  className="mx-auto flex items-center gap-2 rounded-full border border-electric/40 bg-white px-4 py-2 text-xs font-semibold text-electric transition-colors hover:bg-electric hover:text-white"
                >
                  <FileText size={14} /> {t(COPY.lead)}
                </button>
              )}

              {showLead && !leadSent && (
                <form onSubmit={submitLead} className="space-y-2 rounded-xl border border-line bg-white p-4" data-testid="assistant-lead-form">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-800">{t(COPY.leadTitle)}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input required placeholder={t(LEAD_LABELS.first)} data-testid="assistant-lead-first-name" value={lead.first_name} onChange={(e) => setLead({ ...lead, first_name: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-xs outline-none focus:border-electric" />
                    <input required placeholder={t(LEAD_LABELS.last)} data-testid="assistant-lead-last-name" value={lead.last_name} onChange={(e) => setLead({ ...lead, last_name: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-xs outline-none focus:border-electric" />
                  </div>
                  <input required placeholder={t(LEAD_LABELS.company)} data-testid="assistant-lead-company" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-xs outline-none focus:border-electric" />
                  <input required type="email" placeholder={t(LEAD_LABELS.email)} data-testid="assistant-lead-email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-xs outline-none focus:border-electric" />
                  <textarea required rows={3} placeholder={t(LEAD_LABELS.message)} data-testid="assistant-lead-message" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-xs outline-none focus:border-electric" />
                  {leadError && <p role="alert" className="text-[11px] text-red-500">{leadError}</p>}
                  <button type="submit" disabled={leadSent} data-testid="assistant-lead-submit" className="w-full rounded-full bg-electric py-2.5 text-xs font-semibold text-white transition-colors hover:bg-electric-dark disabled:opacity-60">
                    {t(LEAD_LABELS.submit)}
                  </button>
                </form>
              )}
              {leadSent && (
                <p className="flex items-center gap-2 text-xs text-turquoise" data-testid="assistant-lead-sent"><CheckCircle2 size={14} /> {t(COPY.sent)}</p>
              )}
            </div>

            <div className="border-t border-line bg-white px-4 pb-2 pt-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {COPY.chips[lang].map((chip) => (
                  <button key={chip} onClick={() => send(chip)} disabled={busy} data-testid={`assistant-chip-${chip.slice(0, 12)}`} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-graphite transition-colors hover:border-electric hover:text-electric disabled:opacity-50">
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t(COPY.placeholder)}
                  data-testid="assistant-input"
                  className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-electric"
                  maxLength={1000}
                />
                <button onClick={() => send()} disabled={busy || !input.trim()} aria-label="Envoyer" data-testid="assistant-send-button" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric text-white transition-colors hover:bg-electric-dark disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-steel">{t(COPY.disclaimer)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
