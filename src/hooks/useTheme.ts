import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "hesa_theme";

// Light is the default. The inline script in index.html applies the stored choice before first paint.
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage blocked: the choice just won't persist */
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
