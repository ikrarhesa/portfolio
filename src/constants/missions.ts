export type MissionId = "video-ar" | "template" | "tana";

/** A visual that sits beside a story section */
export type StoryVisual =
  | { type: "image"; src: string; alt: string; caption: string }
  | { type: "timeline"; items: { when: string; text: string }[] }
  | { type: "stat"; value: string; label: string }
  | { type: "team"; count: number; mine: string; note: string };

export const MISSIONS: {
  id: MissionId;
  label: string;
  title: string;
  cardTitle: string; // short title on the home-page card
  tagline: string; // one line under it
  summary: string;
  role: string;
  focus: string;
  region?: string; // the market the case study covers; the meta row is dropped when absent
  surface: string;
  status: string;
  year: string;
  stack: string[];
  image?: string; // cover screenshot (e.g. "/work/shopee-cover.png"); replaces the placeholder illustration
  imageFit?: "cover" | "contain"; // "contain" for phone-shaped (portrait) screenshots; default "cover"
  gallery?: string[]; // extra screenshots shown on the project page
  cover?: { video: string; poster: string }[]; // looping phone clips used as the thumbnail (beats `image`)
  story?: { title: string; body: string[]; visual?: StoryVisual }[]; // case-study sections, shown after the meta strip
  movesIntro?: string; // one line above the numbered moves
  moves?: { title: string; body: string[]; image: { src: string; alt: string; caption: string } }[]; // the numbered "what I did" steps
  process?: { title: string; body: string; steps: string[] }; // tools, shown as a short flow
  showArFilters?: boolean; // embed the AR filter recordings (constants/arFilters.ts) in the page
  results?: { value: string; label: string }[]; // headline numbers
  resultsNote?: string[]; // how to read the numbers (scope, caveats)
  chart?: { title: string; note: string; bars: { label: string; value: number; display: string }[] }; // simple before/after bars
  learnings?: string[];
  highlights: string[];
}[] = [
    {
      id: "template",
      label: "Mission 01",
      cardTitle: "Shopee Video templates",
      tagline: "From 200 to 34K weekly uses in Malaysia",
      title: "Fixing low template adoption in Malaysia: 200 to 34K weekly uses",
      summary:
        "Template adoption in Malaysia was low. I reused what worked in Indonesia, researched what Malaysian users like, then designed for them. Videos posted with a template each week grew from 200 to 34,000 within three months.",
      role: "Product designer, Malaysia design direction",
      focus: "Template library, adoption, trend research",
      surface: "Video templates · Shopee Video",
      status: "Shipped",
      year: "2023",
      stack: ["Video templates", "Creative tools (SDK)", "Trend research", "TikTok tools", "CapCut", "Competitor review", "Cross-region work"],
      cover: [
        { video: "/template/desktop-album.mp4", poster: "/template/desktop-album.jpg" },
        { video: "/template/bento-grid.mp4", poster: "/template/bento-grid.jpg" },
        { video: "/template/windows-like.mp4", poster: "/template/windows-like.jpg" },
      ],
      highlights: [
        "Designer on the Shopee Video SDK, and the one who kept the Malaysia design direction and toolkit",
        "Researched Malaysian trends through TikTok tools, top content, CapCut, competitors and the local marketing team",
        "Weekly template uses grew from 200 to 34K within three months, with a single OOTD template driving around 15K",
      ],
    },
    {
      id: "video-ar",
      label: "Mission 02",
      cardTitle: "Localizing Shopee AR effects",
      tagline: "AR effects made for Indonesian users",
      title: "Localizing Shopee's AR effects for Indonesia",
      summary:
        "Replaced an effects library built for another market with one made for Indonesian users, refreshed it every week, and gave sellers commercial effects with text they can edit, for both Shopee Video and Shopee Live.",
      role: "Product designer",
      focus: "Localization, content library, commercial tools",
      region: "Indonesia",
      surface: "AR effects · Shopee Video and Live",
      status: "Shipped",
      year: "2022–present",
      stack: ["AR effects", "Adobe Illustrator", "After Effects", "Shopee Effect (in-house)", "Localization", "Content library", "Cross-region work"],
      cover: [
        { video: "/ar/diskaun-untuk-anda.mp4", poster: "/ar/diskaun-untuk-anda.jpg" },
        { video: "/ar/editable-text.mp4", poster: "/ar/editable-text.jpg" },
        { video: "/ar/nod-to-switch.mp4", poster: "/ar/nod-to-switch.jpg" },
      ],
      movesIntro: "Three moves took the library from built for another market to built for Indonesian users.",
      showArFilters: true,
      story: [
        {
          title: "Context and goal",
          body: [
            "Shopee Video launched in 2022 with an effect library built largely by the regional team in China. It spoke to that market, not to Indonesia, and in Indonesia almost nobody opened it.",
            "That mattered commercially. An effect is how a seller turns plain product footage into something a buyer stops scrolling for. A library nobody opens means sellers posting flat video into a feed that rewards attention, so this was a conversion problem wearing a cosmetic disguise.",
            "I joined in September 2022 as the second designer on the Video team. The work was the SDK, which is what we called the shared set of creative tools built into the Shopee app: the effects, stickers and templates a seller uses to make a video without leaving it. I rebuilt the library around what Indonesian sellers actually post, put it on a weekly refresh, and gave sellers effects they could write their own copy into.",
          ],
          visual: {
            type: "timeline",
            items: [
              { when: "2022", text: "Shopee Video launches, with a library built for another market" },
              { when: "Sep 2022", text: "I join as the second designer on the team" },
              { when: "2023", text: "Effects, stickers and templates keep shipping. Malaysia joins my work, and templates take off there" },
              { when: "2024", text: "Shopee Live arrives, and most video effects, such as Limited Offer, become available for livestreams too" },
              { when: "Today", text: "Still shipping, at a lower frequency. My work now leans more toward UI and UX projects" },
            ],
          },
        },
        {
          title: "The problem",
          body: [
            "In Indonesia, about 30 videos a week went out with an effect on them. The library was there; it just wasn't built for the people it was being shown to.",
          ],
        },
        {
          title: "The constraints",
          body: [
            "Indonesia is the market this case study covers, and it was shared: four designers, one per region, all designed for it. Malaysia was the market I owned, and it has its own case study. Designs travelled between markets with the copy localized for each, so an effect had to still read clearly once its words were translated and it had lost the context it was drawn for.",
            "That set the design brief. An effect could not be a one-off: it had to hold up as part of a system refreshed every week by a small team. So each one had to be fast to produce, readable as a thumbnail in a crowded grid, and legible at a glance by a seller who is mid-stream and not looking for it.",
          ],
          visual: {
            type: "team",
            count: 4,
            mine: "Me · 1 of 4 on Indonesia",
            note: "Four designers, one per region. All four designed for Indonesia, the market this study covers. Malaysia was the one I owned, and it has its own case study.",
          },
        },
      ],
      moves: [
        {
          title: "Make it local",
          body: [
            "The earlier library leaned on sparkly, kawaii looks and dense beauty filters. I replaced it with effects made for local users, starting with stickers for Indonesia: everyday use first, with copy in their own language. I kept the decoration light on purpose, so the copy and the idea did the work.",
          ],
          image: { src: "/ar/story-local.jpg", alt: "A red “Penawaran Terbatas!” sticker above a face", caption: "“Penawaran Terbatas!” is “Limited offer!” in Indonesian." },
        },
        {
          title: "Refresh every week",
          body: [
            "Use of an effect is specific and tied to a moment, so one launch fades fast. The library was refreshed every week, so users always had something new to try. Regions set their own cadence, and Indonesia ran weekly.",
          ],
          image: { src: "/ar/story-new.jpg", alt: "The effects library on its “Baru” (New) tab, with a grid of effect thumbnails", caption: "The effects library today, on the “Baru” (New) tab." },
        },
        {
          title: "Let sellers write the text",
          body: [
            "Most stickers at that point were for daily use, not e-commerce. So I designed commercial effects where the seller types their own text, such as “Big sale” or “Limited offer”. A fixed sticker can't fit every offer. Editable text can.",
            "These shipped alongside the Shopee Video launch, and what we saw from them became an early learning.",
            "The Limited Offer effect is one of those that carried over to Shopee Live. Livestreaming sellers use it to put the offer on screen while they sell, especially during double-date campaigns.",
          ],
          image: { src: "/ar/story-typing.jpg", alt: "A blue “Limited Offer!!!!” sticker above a face, with the text field below", caption: "The seller types the offer and the sticker updates live." },
        },
      ],
      process: {
        title: "How I made them",
        body: "Each effect started as artwork, was animated, exported as PNG and then built in Shopee's in-house tool.",
        steps: ["Adobe Illustrator", "After Effects", "PNG export", "Shopee Effect"],
      },
      results: [
        {
          value: "30 → 500",
          label: "videos a week published with an effect in Indonesia, before and after the library refresh",
        },
        {
          value: "16×",
          label: "more seller video carrying an effect each week, from the same seller base",
        },
        {
          value: "205,952",
          label:
            "views in a single week on Seamless, one of the effects I designed. Years later it is still the second most used magic in Indonesia, and Promo Spesial is in the top seven",
        },
      ],
      resultsNote: [
        "The business case was seller adoption, and the effects that won were the ones that removed a step. A seller who wants to go live has to be camera-ready first. The beauty and makeup effects take that away: they open the camera and start selling. That is why those travel to every market and stay at the top of the library, while a novelty effect spikes and fades.",
        "The library also outlived the surface it was built for. In 2024 most of it became available to Shopee Live, and sellers lean on it hardest during the double-date campaigns, where an offer effect puts the deal on screen while they sell.",
        "Measured on Shopee's internal dashboards. Figures are rounded and count videos published with an effect in Indonesia; they do not capture Shopee Live usage.",
      ],
      learnings: [
        "Local relevance beats polish. The effects that worked used Indonesian copy and a light touch, not heavy decoration.",
        "Commercial use needs control. Editable text made effects useful for selling, not just for fun, and it was an early learning from the launch.",
        "Small numbers can still mean real adoption. Effects will never match templates in volume, because their use is specific and short-lived. The signal to watch is whether people keep using them.",
      ],
      highlights: [
        "Designed AR effects, stickers and filters for Shopee Video and Shopee Live as a product designer on the SDK, alongside everyday UI and UX work",
        "Replaced a library built for another market with effects made for local users, and refreshed it every week",
        "Designed commercial effects with editable text, now live on the Shopee platform",
        "Built effects with Adobe Illustrator, After Effects and Shopee's in-house Shopee Effect tool",
        "Worked in a team of four designers, one per region, deciding and shipping fast",
      ],
    },
    {
      id: "tana",
      label: "Mission 03",
      cardTitle: "Tana",
      tagline: "A recycling app concept for Indonesia",
      title: "Tana: making recycling visible and rewarding",
      summary:
        "A 12-week solo concept for a recycling app in Indonesia, built from interviews, a survey and visits to local waste banks. Never launched: the work is in the research and the decisions it led to.",
      role: "Researcher & designer",
      focus: "User research, mobile UX, design systems",
      surface: "Mobile app",
      status: "Concept",
      year: "2024",
      stack: ["User research", "Interviews & surveys", "Field visits", "Figma", "Auto layout", "Components", "Interactive prototype", "Usability testing"],
      image: "/tana/hero.jpg",
      highlights: [
        "Ran field research alone: interviews, a survey and visits to local waste banks in Indonesia",
        "Turned the findings into three insights and five design decisions",
        "Designed the individual and community experience of a recycling app, from onboarding to pickup tracking",
        "Tested the prototype with five participants",
      ],
    }
  ];

export type Mission = (typeof MISSIONS)[number];

/**
 * The fields of a case study that carry readable text. English lives above; other languages (src/i18n/ja/missions.ts)
 * replace exactly these and share everything else (ids, images, videos, numbers). The unused fields
 * (label, cardTitle, tagline, highlights) are not shown anywhere, so they are not translated.
 */
export type MissionText = Pick<
  Mission,
  | "title"
  | "summary"
  | "role"
  | "focus"
  | "region"
  | "surface"
  | "status"
  | "year"
  | "stack"
  | "story"
  | "movesIntro"
  | "moves"
  | "process"
  | "results"
  | "resultsNote"
  | "chart"
  | "learnings"
>;

export const projectHref = (id: MissionId) => `/work/${id}`;
