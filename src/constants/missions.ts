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
      id: "video-ar",
      label: "Mission 01",
      cardTitle: "Localizing Shopee AR effects",
      tagline: "AR effects made for Indonesian users",
      title: "Localizing Shopee's AR effects for Indonesia",
      summary:
        "Replaced an effects library built for another market with one made for Indonesian users, refreshed it every week, and gave sellers commercial effects with text they can edit, for both Shopee Video and Shopee Live.",
      role: "Product designer · SDK",
      focus: "Localization, content library, commercial tools",
      surface: "AR effects · Shopee Video and Live",
      status: "Shipped",
      year: "2022–present",
      stack: ["AR effects", "Adobe Illustrator", "After Effects", "Shopee Effect (in-house)", "Localization", "Content library", "Cross-region work"],
      cover: [
        { video: "/ar/ngantuk-ya.mp4", poster: "/ar/ngantuk-ya.jpg" },
        { video: "/ar/editable-text.mp4", poster: "/ar/editable-text.jpg" },
        { video: "/ar/nod-to-switch.mp4", poster: "/ar/nod-to-switch.jpg" },
      ],
      movesIntro: "Three moves took the library from built for another market to built for Indonesian users.",
      showArFilters: true,
      story: [
        {
          title: "Context and goal",
          body: [
            "In 2022, Shopee launched Shopee Video. The effect library at launch was mostly built by the regional team in China, so it spoke to that market and not to Indonesia or Malaysia.",
            "I joined in September 2022 as the second designer on the Video team. My title was product designer. The work was designing for the SDK, the toolkit behind effects, stickers and templates, and day to day it also included UI and UX.",
            "The goal was to help sellers make videos and live streams that hold attention, and to give buyers a reason to stop when they see one. AR effects, which Shopee calls magic, were one of the ways to do that.",
            "The effects were not only for video. In 2024 Shopee Live came to the same toolkit, and most of the effects available for video became available for live as well. Sellers who livestream use them while they sell, and they lean on them most during campaigns such as the double-date sales.",
          ],
          visual: {
            type: "timeline",
            items: [
              { when: "2022", text: "Shopee Video launches, with a library built for another market" },
              { when: "Sep 2022", text: "I join as the second designer on the team" },
              { when: "2023", text: "Effects, stickers and templates keep shipping, and templates take off in Malaysia" },
              { when: "2024", text: "Shopee Live arrives, and most video effects, such as Limited Offer, become available for livestreams too" },
              { when: "Today", text: "Still shipping, at a lower frequency. My work now leans more toward UI and UX projects" },
            ],
          },
        },
        {
          title: "The problem",
          body: ["The library was not localized, and in Indonesia few people used it."],
        },
        {
          title: "The constraints",
          body: [
            "There were four designers, one per region, and I owned Malaysia. My designs shipped to every market, but each regional designer set their own strategy, such as how often to refresh the library and where to place effects. The team was small and had to decide and ship fast.",
            "The Malaysia side changed often and never had one fixed owner. Before each planning round I had to find out who was responsible, bring them together and agree the plan again. The constraint was not engineering capacity. It was people and time.",
          ],
          visual: {
            type: "team",
            count: 4,
            mine: "Me · Malaysia",
            note: "Four designers, one per region. The Malaysia owner kept changing.",
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
          label: "videos a week using AR effects in Indonesia, before and after the library refresh",
        },
        {
          value: "16×",
          label: "growth in weekly videos using effects (500 ÷ 30)",
        },
      ],
      resultsNote: [
        "Figures come from Shopee's internal dashboards, Data Studio and DataZoo, which track views, videos posted, completion rate, conversion rate, comments and likes. The numbers here are rounded, and they count videos posted using an effect. They do not capture how sellers use effects on Shopee Live.",
        "Effects are smaller than templates, because each one is used for something specific and for a short time. A new effect usually got only about 5 to 6 uses in its first two months. Across a library that is refreshed every week, those add up to hundreds of videos a week.",
        "The same designs were pushed to every market, but each region ran its own strategy, so numbers differ by region. I report Indonesia, the region this figure comes from.",
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
      id: "template",
      label: "Mission 02",
      cardTitle: "Shopee Video templates",
      tagline: "From 200 to 34K weekly uses in Malaysia",
      title: "Fixing low template adoption in Malaysia: 200 to 34K weekly uses",
      summary:
        "Template adoption in Malaysia was low. I reused what worked in Indonesia, researched what Malaysian users like, then designed for them. Weekly uses grew from 200 to 34,000 within three months.",
      role: "Designer · SDK, Malaysia design direction",
      focus: "Template library, adoption, trend research",
      surface: "Video templates · Shopee Video",
      status: "Shipped",
      year: "2023",
      stack: ["Video templates", "SDK toolkit", "Trend research", "TikTok tools", "CapCut", "Competitor review", "Cross-region work"],
      cover: [
        { video: "/template/six-frames.mp4", poster: "/template/six-frames.jpg" },
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

export const projectHref = (id: MissionId) => `/work/${id}`;
