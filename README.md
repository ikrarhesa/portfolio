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

- `src/constants/missions.ts`: case study content (titles, copy, results, timeline)
- `src/constants/contact.ts`: email, LinkedIn, CV path
- `src/components/`: sections, case study pages, hero and intro
- `public/`: images, videos, resume PDF, `og-image.png`, `robots.txt`, `sitemap.xml`
- `netlify.toml` and `netlify/edge-functions/rate-limit.ts`: hosting and rate limit config

## Deploy

Pushing to GitHub triggers a Netlify build (`npm run build`, publish `dist`).
