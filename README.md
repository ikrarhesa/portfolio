# Ikrar Hesa Prasetya, portfolio

Single page portfolio for a product designer: an interactive hero with a live face AR demo, three case studies (Shopee AR effects, Shopee Video templates, Tana) and contact details.

Live at https://ikrarhesa.com/

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4. Face tracking uses MediaPipe and runs on the visitor's device.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type check and production build into dist/
npm run lint
```

## Where things live

- `src/constants/missions.ts`: case study content in English (titles, copy, results, timeline)
- `src/i18n/en/` and `src/i18n/ja/`: the rest of the text, per language (home, shared UI, the Tana and Template case studies, the game). `ja/missions.ts` and `ja/arFilters.ts` hold the Japanese case study text. The Japanese files are typed against the English ones, so a missing key fails `npm run build`.
- `src/constants/contact.ts`: email, LinkedIn, CV path
- `src/components/`: sections, case study pages, hero and intro
- `public/`: images, videos, resume PDF, `og-image.png`, `robots.txt`, `sitemap.xml`
- `netlify.toml` and `netlify/edge-functions/rate-limit.ts`: hosting and rate limit config

## Languages

English is the default; Japanese is chosen with the `EN | 日本語` switch in the header and remembered in `localStorage` (`hesa_lang`). A link can set it too: `/?lang=ja`. Both languages share one URL, and the pre-rendered HTML is English, so there are no `hreflang` tags. To add or change text, edit the matching key in both `src/i18n/en` and `src/i18n/ja`.

## Deploy

Pushing to GitHub triggers a Netlify build (`npm run build`, publish `dist`).
