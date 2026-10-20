// src/lib/i18n.ts
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export type Locale = "ar" | "en";

const dictionaries = { ar, en } as const;

export function getDict(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.ar;
}

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";
