import { renderToString } from "react-dom/server";
import App from "./App";
import { MISSIONS } from "./constants/missions";
import { LangProvider } from "./i18n";

/** Build-time only: render a page to an HTML string (see scripts/prerender.mjs). Never shipped to the browser. */
// The pre-rendered HTML is always English; Japanese is applied in the browser (same URL, no hreflang).
export const render = (path: string) =>
  renderToString(
    <LangProvider initialLang="en">
      <App initialPath={path} />
    </LangProvider>
  );

/** Every page that gets its own HTML file, with the head tags that belong to it. */
export const ROUTES = [
  { path: "/", title: null, description: null },
  ...MISSIONS.map((m) => ({
    path: `/work/${m.id}`,
    title: `${m.title} · Ikrar Hesa Prasetya`,
    description: m.summary,
  })),
];
