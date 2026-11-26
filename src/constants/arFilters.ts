export type ARFilter = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  purpose?: string; // why it exists
  trigger: string; // what the effect reacts to
  video: string; // /public/ar/<id>.mp4 (cropped, no audio)
  poster: string; // /public/ar/<id>.jpg
};

/** The readable fields; other languages (src/i18n/ja/arFilters.ts) replace these and share the video and poster */
export type ARFilterText = Pick<ARFilter, "title" | "blurb" | "tags" | "purpose" | "trigger">;

// Written from what's visible in each recording. Edit titles and blurbs freely,
// and add details only you know (brief, results, tools, your role on each).
export const AR_FILTERS: ARFilter[] = [
  {
    id: "editable-text",
    title: "Editable-text sticker",
    blurb:
      "A commercial sticker above the head. Pick a text sticker from the effects library, type your own message and it updates live: “Promo Spesial”, “Limited Offer!”, or anything else. One effect, any offer. Recorded in the live Shopee app.",
    tags: ["Commercial", "Editable text", "Head anchor"],
    purpose: "Commercial: sellers write their own offer",
    trigger: "Typed text, live",
    video: "/ar/editable-text.mp4",
    poster: "/ar/editable-text.jpg",
  },
  {
    id: "diskaun-untuk-anda",
    title: "Diskaun untuk anda",
    blurb:
      "A campaign effect built for Malaysia. Shopee-branded offer badges float around the seller's head while they film or stream: an orange “Diskaun untuk anda!” and a blue “Penghantaran percuma”. The copy is Malay, not Indonesian, because the market got its own wording rather than a translation.",
    tags: ["Commercial", "Malay copy", "Campaign"],
    purpose: "Commercial: put the offer on screen while selling",
    trigger: "Face tracking",
    video: "/ar/diskaun-untuk-anda.mp4",
    poster: "/ar/diskaun-untuk-anda.jpg",
  },
  {
    id: "nod-to-switch",
    title: "Nod to switch",
    blurb:
      "A blank canvas of a face with hand-drawn expressions: sad, smirking, mischievous. Nod your head to switch between them (“Angguk kepala untuk mengganti”). Each nod changes the face.",
    tags: ["Nod detection", "Face mesh", "Hand-drawn"],
    purpose: "Local copy, kept simple",
    trigger: "Nod detection",
    video: "/ar/nod-to-switch.mp4",
    poster: "/ar/nod-to-switch.jpg",
  },
];
