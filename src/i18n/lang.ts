import { createContext, useContext, useMemo } from "react";
import { MISSIONS, type Mission } from "../constants/missions";
import { AR_FILTERS, type ARFilter } from "../constants/arFilters";
import { en, type Content } from "./en";
import { ja, jaMissions, jaArFilters } from "./ja";

/**
 * Language switching, kept deliberately small: a context that holds the language and the matching content
 * (the provider is in LangProvider.tsx).
 *
 *  - English is the default and the only language in the pre-rendered HTML. Both languages share one URL, so
 *    there are no hreflang tags and nothing is chosen from the visitor's location or browser settings.
 *  - The choice is stored in localStorage and can also be set with a link: /?lang=ja (or ?lang=en).
 *  - English and Japanese text live in src/i18n/en and src/i18n/ja. The Japanese files are typed against the
 *    English shapes, so a missing translation fails the type check.
 */

export type Lang = "en" | "ja";
export const LANGS: Lang[] = ["en", "ja"];

export const LANG_KEY = "hesa_lang";
export const CONTENT: Record<Lang, Content> = { en, ja };

/**
 * The language to start in. Browser only. A ?lang= link wins and is remembered, then the stored choice.
 * index.html has a tiny inline copy of this (it sets <html lang> and hides the page until React mounts),
 * so keep the two in step.
 */
export function readLang(): Lang {
  try {
    const fromLink = new URLSearchParams(window.location.search).get("lang");
    if (fromLink === "ja" || fromLink === "en") {
      localStorage.setItem(LANG_KEY, fromLink);
      return fromLink;
    }
    return localStorage.getItem(LANG_KEY) === "ja" ? "ja" : "en";
  } catch {
    return "en"; // storage blocked: the switcher still works for this visit
  }
}

export type LangValue = { lang: Lang; setLang: (next: Lang) => void; t: Content };
export const LangContext = createContext<LangValue | null>(null);

export function useLang(): LangValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside <LangProvider>");
  return value;
}

/** The text for the current language */
export const useContent = () => useLang().t;

/** A case study in the given language: the structure is shared, only the text differs */
export function localizeMission(mission: Mission, lang: Lang): Mission {
  return lang === "en" ? mission : { ...mission, ...jaMissions[mission.id] };
}

export function useMissions(): Mission[] {
  const { lang } = useLang();
  return useMemo(() => MISSIONS.map((m) => localizeMission(m, lang)), [lang]);
}

export function useArFilters(): ARFilter[] {
  const { lang } = useLang();
  return useMemo(() => AR_FILTERS.map((f) => (lang === "en" ? f : { ...f, ...jaArFilters[f.id] })), [lang]);
}

/** Replaces {name} placeholders, for the few strings that carry a number or a name */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
