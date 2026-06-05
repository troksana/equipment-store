"use client";

// React context utilities
import { createContext, useContext, useEffect, useState } from "react";

// Translation dictionaries
import { pl } from "@/messages/pl";
import { en } from "@/messages/en";

// Supported language types
type Lang = "pl" | "en";

// Combined translations object
const translations = { pl, en };

// Create language context (initially null)
const LanguageContext = createContext<any>(null);

/**
 * LanguageProvider
 * Provides global language state and translation object to the app.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Current selected language
  const [lang, setLang] = useState<Lang>("pl");

  /**
   * Load saved language from localStorage on first render
   */
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved) setLang(saved);
  }, []);

  /**
   * Change active language and persist it in localStorage
   */
  const changeLanguage = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLang(l);
  };

  /**
   * Current translation dictionary based on active language
   */
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook for accessing translations and language state
 */
export function useTranslation() {
  return useContext(LanguageContext);
}