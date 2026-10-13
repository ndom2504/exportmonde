import { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext({ lang: "fr", setLang: () => {}, t: (x) => x });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("emp-lang");
    return saved === "en" ? "en" : "fr";
  });
  useEffect(() => {
    localStorage.setItem("emp-lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "fr-CA";
  }, [lang]);
  const t = (value) => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] ?? value.fr ?? "";
  };
  return <LangContext.Provider value={{ lang, setLang: setLangState, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
