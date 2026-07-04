"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Locale = "en" | "ar";
type Direction = "ltr" | "rtl";

interface I18nContextType {
  locale: Locale;
  dir: Direction;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  changeLanguage: (lang: Locale) => void;
}

const translations: Record<Locale, any> = { en, ar };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper to resolve nested keys like "home.stats.travelers"
function getNestedValue(obj: any, path: string): string {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current == null) return path;
    current = current[part];
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [dir, setDir] = useState<Direction>("ltr");

  // Load language from Cookie or localStorage on mount
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
      return null;
    };

    const savedLocale = (getCookie("NEXT_LOCALE") || localStorage.getItem("locale") || "en") as Locale;
    setLocale(savedLocale);
    setDir(savedLocale === "ar" ? "rtl" : "ltr");
  }, []);

  const changeLanguage = (lang: Locale) => {
    setLocale(lang);
    const newDir = lang === "ar" ? "rtl" : "ltr";
    setDir(newDir);

    // Save language selection to cookies (for Server Component root rendering) and localStorage
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("locale", lang);

    // Update user profile preference if API is available and logged in (simulated or real profile endpoint)
    fetch("/api/profile/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: lang }),
    }).catch(() => {
      // Ignore if user is not logged in / profile settings doesn't exist yet
    });

    // Force DOM update and reload direction
    document.documentElement.dir = newDir;
    document.documentElement.lang = lang;

    // Reload page to re-render server-side route components with correct language
    window.location.reload();
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const dict = translations[locale] || translations.en;
    let text = getNestedValue(dict, key);

    if (replacements && typeof text === "string") {
      Object.entries(replacements).forEach(([k, val]) => {
        text = text.replace(`{${k}}`, String(val));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, dir, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
