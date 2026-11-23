// Rate limit for https://ikrarhesa.com/
// Netlify enforces `config.rateLimit` before this function runs; if a visitor
// is under the limit, the request just passes through to the static site.
// Docs: https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/

import type { Context } from "@netlify/edge-functions";

export default async (_request: Request, context: Context) => context.next();

export const config = {
  path: "/*",
  rateLimit: {
    // 300 requests per minute per IP, per domain. A single page load fetches
    // many assets (images, JS, CSS), so keep this generous for real visitors.
    windowLimit: 300,
    windowSize: 60, // seconds
    aggregateBy: ["ip", "domain"],
  },
};
