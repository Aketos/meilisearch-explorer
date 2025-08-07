"use client";

import { useI18n } from "@/components/I18nProvider";
import { useCallback } from "react";

export default function LocaleSwitcher() {
  const { locale } = useI18n();

  const setLocale = useCallback((loc: string) => {
    try {
      // Persist for 1 year
      document.cookie = `locale=${loc}; path=/; max-age=31536000; samesite=Lax`;
      window.location.reload();
    } catch {
      // Fallback if cookies fail
      window.location.href = window.location.href;
    }
  }, []);

  const isActive = (loc: string) => locale?.toLowerCase().startsWith(loc);

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-lg shadow-black/5 ring-1 ring-black/5 hover:ring-blue-500/20 hover:shadow-black/10 transition-all duration-200 p-0.5">
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-label="Basculer en français"
        title="Français"
        aria-pressed={isActive("fr")}
        className={`relative overflow-hidden group px-3 py-1.5 text-sm font-medium flex items-center gap-2 rounded-l-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 active:scale-95 ${
          isActive("fr")
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-500/20 cursor-default"
            : "text-gray-700/90 dark:text-gray-200/90 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:text-blue-700 dark:hover:bg-white/5  hover:shadow-md cursor-pointer"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/40 to-transparent dark:from-white/10"
        />
        <span className="text-lg transition-transform duration-200 group-hover:scale-110">🇫🇷</span>
        <span className="hidden sm:inline">FR</span>
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-label="Switch to English"
        title="English"
        aria-pressed={isActive("en")}
        className={`relative overflow-hidden group px-3 py-1.5 text-sm font-medium flex items-center gap-2 rounded-r-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 active:scale-95 ${
          isActive("en")
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700  ring-1 ring-blue-500/20 cursor-default"
            : "text-gray-700/90 dark:text-gray-200/90 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:text-blue-700 dark:hover:bg-white/5 hover:shadow-md cursor-pointer"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/40 to-transparent dark:from-white/10"
        />
        <span className="text-lg transition-transform duration-200 group-hover:scale-110">🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
