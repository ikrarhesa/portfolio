// Runs after `vite build` and the SSR build (see the "build" script in package.json).
// Renders each page of the app to static HTML, so crawlers, link previews and AI tools get the real content
// without running JavaScript. The browser then hydrates the same markup.
//
//   dist/index.html                  -> home
//   dist/work/<id>/index.html        -> one per case study (Netlify serves these at /work/<id>)
//   dist/sitemap.xml                 -> generated from the same list of pages

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://ikrarhesa.com";

// The components were written for the browser. A few read window, document or storage while rendering, so give
// them harmless stand-ins. Effects never run on the server, so nothing here is ever really used.
const noop = () => {};
const mql = { matches: false, addEventListener: noop, removeEventListener: noop };
globalThis.window = {
  location: { pathname: "/", search: "", hash: "", href: SITE + "/", origin: SITE },
  matchMedia: () => mql,
  addEventListener: noop,
  removeEventListener: noop,
  innerWidth: 1280,
  innerHeight: 800,
  scrollY: 0,
};
globalThis.document = {
  documentElement: { dataset: {}, classList: { add: noop, remove: noop }, style: {} },
  fonts: undefined,
  getElementById: () => null,
  querySelector: () => null,
  addEventListener: noop,
  removeEventListener: noop,
};
globalThis.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };

const { render, ROUTES } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
const template = await readFile(resolve(root, "dist/index.html"), "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("dist/index.html has no <!--app-html--> marker");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Swap the page-specific head tags. The home page keeps what index.html already says.
function withHead(html, { path, title, description }) {
  const url = SITE + (path === "/" ? "/" : path);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  if (title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
    html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  }
  if (description) {
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
    html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  }
  return html;
}

for (const route of ROUTES) {
  window.location.pathname = route.path;
  const app = render(route.path);
  const html = withHead(template.replace("<!--app-html-->", () => app), route);
  const file = route.path === "/" ? "dist/index.html" : `dist${route.path}/index.html`;
  await mkdir(dirname(resolve(root, file)), { recursive: true });
  await writeFile(resolve(root, file), html);
  console.log(`prerendered ${route.path.padEnd(24)} ${(html.length / 1024).toFixed(1)} kB -> ${file}`);
}

const urls = ROUTES.map((r) => `  <url>\n    <loc>${SITE}${r.path === "/" ? "/" : r.path}</loc>\n  </url>`).join("\n");
await writeFile(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`wrote sitemap.xml (${ROUTES.length} urls)`);
