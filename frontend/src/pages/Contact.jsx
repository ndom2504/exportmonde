import { useState } from "react";
import { Mail, Clock, MapPin, Phone, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { SITE, UI, SERVICE_OPTIONS } from "@/content/ui";
import { PAGE_HEADERS } from "@/content/pages";
import { useLang } from "@/lib/lang";
import api, { formatApiErrorDetail } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

const initial = { first_name: "", last_name: "", company: "", email: "", phone: "", service: "", message: "", budget: "", deadline: "", consent: false, company_website: "" };

export default function Contact() {
  const { t, lang } = useLang();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [emailSent, setEmailSent] = useState(true);
  const [serverError, setServerError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = t(UI.form.required);
    if (!form.last_name.trim()) errs.last_name = t(UI.form.required);
    if (!form.company.trim()) errs.company = t(UI.form.required);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t(UI.form.invalidEmail);
    if (!form.service) errs.service = t(UI.form.required);
    if (form.message.trim().length < 20) errs.message = t(UI.form.shortMessage);
    if (!form.consent) errs.consent = t(UI.form.consentRequired);
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    setServerError("");
    try {
      const payload = { ...form };
      ["budget", "deadline", "phone"].forEach((k) => { if (!payload[k]) delete payload[k]; });
      const { data } = await api.post("/leads", payload);
      setEmailSent(data.email_sent !== false);
      trackEvent("generate_lead");
      setStatus("success");
    } catch (err) {
      setServerError(formatApiErrorDetail(err.response?.data?.detail));
      setStatus("error");
    }
  };

  const inputCls = (key) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-sm text-navy-800 outline-none transition-colors placeholder:text-steel/60 focus:border-electric ${errors[key] ? "border-red-400" : "border-line"}`;

  if (status === "success") {
    return (
      <main className="bg-paper pb-24 pt-[152px] md:pt-[200px]" data-testid="contact-success-page">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-card">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-turquoise/15 text-turquoise">
              <CheckCircle2 size={32} />
            </span>
            <h1 className="mt-6 font-display text-3xl text-navy-800" data-testid="contact-success-title">{t(UI.form.success)}</h1>
            {!emailSent && <p className="mt-3 text-sm text-graphite">{t(UI.form.successNoEmail)}</p>}
            <button onClick={() => { setForm(initial); setStatus("idle"); }} className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-electric hover:text-electric" data-testid="contact-success-reset">
              {lang === "fr" ? "Envoyer une autre demande" : "Send another request"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="contact-page">
      <Seo
        title={lang === "fr"
          ? "Contact et demande de soumission | Export Monde Prestige Inc."
          : "Contact & quote request | Export Monde Prestige Inc."}
        description={t(PAGE_HEADERS.contact.sub)}
        path="/contact"
      />
      <section className="bg-navy-950 pb-14 pt-[152px] md:pt-[200px]">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest2 text-turquoise">{t(PAGE_HEADERS.contact.eyebrow)}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.06] text-white md:text-6xl">{t(PAGE_HEADERS.contact.title)}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">{t(PAGE_HEADERS.contact.sub)}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="rounded-xl bg-navy-800 p-8 text-white">
                <h2 className="font-display text-2xl">{lang === "fr" ? "Nous joindre directement" : "Reach us directly"}</h2>
                <ul className="mt-8 space-y-6 text-sm">
                  <li>
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest2 text-turquoise"><Mail size={13} /> {t(PAGE_HEADERS.contact.emailLabel)}</p>
                    <a href={`mailto:${SITE.email}`} data-testid="contact-email-link" className="mt-2 block text-lg text-white transition-colors hover:text-turquoise">{SITE.email}</a>
                  </li>
                  <li>
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest2 text-turquoise"><Phone size={13} /> {t(PAGE_HEADERS.contact.phoneLabel)}</p>
                    <a href={SITE.phoneHref} data-testid="contact-phone-link" className="mt-2 block text-lg text-white transition-colors hover:text-turquoise">{SITE.phoneDisplay}</a>
                  </li>
                  <li>
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest2 text-turquoise"><MapPin size={13} /> {t(PAGE_HEADERS.contact.addressLabel)}</p>
                    <p className="mt-2 text-white/80">{SITE.address}</p>
                  </li>
                  <li>
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest2 text-turquoise"><Clock size={13} /> {t(PAGE_HEADERS.contact.hoursLabel)}</p>
                    <p className="mt-2 text-white/80">{t(PAGE_HEADERS.contact.hours)}</p>
                  </li>
                  <li>
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest2 text-turquoise"><MapPin size={13} /> {t(PAGE_HEADERS.contact.regionLabel)}</p>
                    <p className="mt-2 text-white/80">{t(PAGE_HEADERS.contact.region)}</p>
                  </li>
                </ul>
                <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/50">
                  {lang === "fr"
                    ? "Vos informations servent uniquement à traiter votre demande. Consultez notre politique de confidentialité."
                    : "Your information is used only to process your request. See our privacy policy."}
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <form onSubmit={onSubmit} noValidate className="rounded-xl border border-line bg-white p-7 shadow-card md:p-10" data-testid="quote-form">
                <h2 className="font-display text-2xl text-navy-800">{t(UI.form.title)}</h2>
                <p className="mt-2 text-sm text-graphite">{t(UI.form.intro)}</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-first" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.firstName)} *</label>
                    <input id="f-first" data-testid="quote-first-name-input" className={inputCls("first_name")} value={form.first_name} onChange={set("first_name")} aria-invalid={!!errors.first_name} />
                    {errors.first_name && <p role="alert" className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-last" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.lastName)} *</label>
                    <input id="f-last" data-testid="quote-last-name-input" className={inputCls("last_name")} value={form.last_name} onChange={set("last_name")} aria-invalid={!!errors.last_name} />
                    {errors.last_name && <p role="alert" className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-company" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.company)} *</label>
                    <input id="f-company" data-testid="quote-company-input" className={inputCls("company")} value={form.company} onChange={set("company")} aria-invalid={!!errors.company} />
                    {errors.company && <p role="alert" className="mt-1 text-xs text-red-500">{errors.company}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-email" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.email)} *</label>
                    <input id="f-email" type="email" data-testid="quote-email-input" className={inputCls("email")} value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
                    {errors.email && <p role="alert" className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-phone" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.phone)}</label>
                    <input id="f-phone" type="tel" data-testid="quote-phone-input" className={inputCls("phone")} value={form.phone} onChange={set("phone")} />
                  </div>
                  <div>
                    <label htmlFor="f-service" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.service)} *</label>
                    <select id="f-service" data-testid="quote-service-select" className={inputCls("service")} value={form.service} onChange={set("service")} aria-invalid={!!errors.service}>
                      <option value="">{t(UI.form.servicePlaceholder)}</option>
                      {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                    </select>
                    {errors.service && <p role="alert" className="mt-1 text-xs text-red-500">{errors.service}</p>}
                  </div>
                  <div>
                    <label htmlFor="f-budget" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.budget)}</label>
                    <select id="f-budget" data-testid="quote-budget-select" className={inputCls("budget")} value={form.budget} onChange={set("budget")}>
                      <option value="">—</option>
                      {UI.form.budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-deadline" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.deadline)}</label>
                    <input id="f-deadline" data-testid="quote-deadline-input" placeholder={lang === "fr" ? "ex. : fin du 2e trimestre" : "e.g. end of Q2"} className={inputCls("deadline")} value={form.deadline} onChange={set("deadline")} />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="f-message" className="mb-1.5 block text-[13px] font-semibold text-navy-800">{t(UI.form.message)} *</label>
                  <textarea id="f-message" rows={6} data-testid="quote-message-textarea" className={inputCls("message")} value={form.message} onChange={set("message")} aria-invalid={!!errors.message} />
                  <p className="mt-1 text-xs text-steel">{t(UI.form.messageHint)}</p>
                  {errors.message && <p role="alert" className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                {/* Honeypot antispam — invisible pour les humains */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="f-website">Ne pas remplir</label>
                  <input id="f-website" type="text" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={set("company_website")} />
                </div>

                <div className="mt-6">
                  <label className="flex cursor-pointer items-start gap-3" data-testid="quote-consent-checkbox">
                    <input type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-1 h-4 w-4 rounded border-line accent-electric" aria-invalid={!!errors.consent} />
                    <span className="text-[13px] leading-relaxed text-graphite">{t(UI.form.consent)}</span>
                  </label>
                  {errors.consent && <p role="alert" className="mt-1 text-xs text-red-500">{errors.consent}</p>}
                </div>

                {status === "error" && (
                  <div role="alert" className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" data-testid="quote-form-error">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{t(UI.form.error)} {serverError && `(${serverError})`}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-testid="quote-form-submit"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-electric px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-electric-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? t(UI.form.sending) : t(UI.form.submit)}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
