"use client";

import React, { createContext, useContext, useMemo } from "react";

export type Messages = Record<string, string>;

export interface I18nContextValue {
  locale: string;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
  formatDate: (value: string | number | Date, opts?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export default function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      const template = messages[key] ?? key;
      if (!vars) return template;
      return Object.keys(vars).reduce(
        (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k])),
        template
      );
    };

    const formatDate = (value: string | number | Date, opts?: Intl.DateTimeFormatOptions) => {
      try {
        const d = value instanceof Date ? value : new Date(value);
        return new Intl.DateTimeFormat(locale || "fr-FR", opts).format(d);
      } catch {
        return String(value);
      }
    };

    return { locale, messages, t, formatDate };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslations() {
  const { t } = useI18n();
  return t;
}
