import { useCallback, useEffect, useMemo, useState } from "react";
import { CONTENT, LANG_KEY, LangContext, type Lang } from "./lang";

export default function LangProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* storage blocked: the choice just won't persist */
    }
  }, []);

  // Keep the document in step: <html lang> drives hyphenation, screen-reader voices and the Japanese font stack
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.remove("lang-pending");
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: CONTENT[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
