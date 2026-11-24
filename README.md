# Ikrar Hesa Prasetya, portfolio

Portfolio for a product designer: an interactive hero with a live face AR demo, three case studies and contact details. Available in English and Japanese.

Live at https://ikrarhesa.com/

## Pages

| URL | Content |
|---|---|
| `/` | Home: hero, selected work, about, contact |
| `/work/template` | Shopee Video templates (Malaysia) |
| `/work/video-ar` | Shopee AR effects for Video and Live (Indonesia) |
| `/work/tana` | Tana, a recycling app concept |

Each page is pre-rendered to static HTML at build time, so link previews, search engines and AI tools see the real content without running JavaScript. The browser then hydrates the same markup.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4. Face tracking uses MediaPipe and runs on the visitor's device; no video frames leave it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 (client only, no pre-rendering)
npm run build    # type check, client build, server build, then pre-render into dist/
npm run lint
```

## Where things live

- `src/constants/missions.ts`: case study content in English (titles, copy, results, timeline)
- `src/i18n/en/` and `src/i18n/ja/`: the rest of the text, per language (home, shared UI, the Tana and Template case studies, the game). `ja/missions.ts` and `ja/arFilters.ts` hold the Japanese case study text. The Japanese files are typed against the English ones, so a missing key fails `npm run build`.
- `src/constants/contact.ts`: email, LinkedIn, CV path
- `src/components/`: sections, case study pages, hero and intro
- `src/lib/faceAR.ts`: face tracking and AR filters
- `scripts/prerender.mjs`: renders each page to static HTML and writes `dist/sitemap.xml`
- `public/`: images, videos, resume PDF, `og-image.png`, `robots.txt`, and the face model in `public/mediapipe/`

## Languages

English is the default; Japanese is chosen with the `EN | 日本語` switch in the header and remembered in `localStorage` (`hesa_lang`). A link can set it too: `/?lang=ja`. Both languages share one URL, and the pre-rendered HTML is English, so there are no `hreflang` tags. To add or change text, edit the matching key in both `src/i18n/en` and `src/i18n/ja`.

## Face AR files

The 3.7 MB model (`face_landmarker.task`) is served from this site. The MediaPipe WASM engine loads from jsDelivr at the version pinned in `faceAR.ts`, which should match the `@mediapipe/tasks-vision` version in `package.json`.

## Media

Keep videos small, since they are most of the site's weight. Clips are H.264 at 30 fps, around 540 px wide for phone recordings, and load lazily. To compress a new one:

```bash
ffmpeg -i in.mp4 -vf "fps=30,scale=540:-2" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 64k out.mp4
```

## Sharing and SEO

`index.html` holds the Open Graph and Twitter tags, and the pre-render step swaps in each case study's own title, description and canonical URL. The share card is `public/og-image.png` (1200 x 630). Social apps cache it, so after changing it, refresh the link in LinkedIn's Post Inspector.

## Deploy

Pushing to GitHub triggers a Netlify build (`npm run build`, publish `dist`), configured in `netlify.toml`. That file also sets cache and security headers. `netlify/edge-functions/rate-limit.ts` limits each visitor to 300 requests a minute.
