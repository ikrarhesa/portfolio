import { renderToString } from "react-dom/server";
import App from "./App";
import { MISSIONS } from "./constants/missions";

/** Build-time only: render a page to an HTML string (see scripts/prerender.mjs). Never shipped to the browser. */
export const render = (path: string) => renderToString(<App initialPath={path} />);

/** Every page that gets its own HTML file, with the head tags that belong to it. */
export const ROUTES = [
  { path: "/", title: null, description: null },
  ...MISSIONS.map((m) => ({
    path: `/work/${m.id}`,
    title: `${m.title} · Ikrar Hesa Prasetya`,
    description: m.summary,
  })),
];
