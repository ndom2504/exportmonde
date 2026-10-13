const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || "";

export const consentGiven = () => localStorage.getItem("emp-consent");

function gtagFn() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
}

function loadScript() {
  if (!GA_ID || document.getElementById("ga-script")) return;
  const s = document.createElement("script");
  s.async = true;
  s.id = "ga-script";
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

export function initAnalytics() {
  gtagFn();
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("tel:")) trackEvent("contact_phone_click");
    else if (href.startsWith("mailto:")) trackEvent("contact_email_click");
    const id = a.getAttribute("data-testid") || "";
    if (id.includes("consult")) trackEvent("consultation_request_click");
  });
  if (consentGiven() === "granted") loadScript();
}

export function grantConsent() {
  localStorage.setItem("emp-consent", "granted");
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  loadScript();
}

export function denyConsent() {
  localStorage.setItem("emp-consent", "denied");
}

export function trackEvent(name) {
  if (!GA_ID || consentGiven() !== "granted" || !window.gtag) return;
  window.gtag("event", name);
}
