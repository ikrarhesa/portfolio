export type MissionId = "video-ar" | "tana";

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
      title: "~16× more videos using AR effects: localizing Shopee Video for Indonesia",
      summary:
        "Replaced an effects library built for another market with one made for Indonesian users, refreshed it every week, and gave sellers commercial effects with text they can edit.",
      role: "Product designer · SDK",
      focus: "Localization, content library, commercial tools",
      surface: "AR effects · Shopee Video",
      status: "Shipped",
      year: "2022–2023",
      stack: ["AR effects", "Stickers", "Content library", "Localization", "Cross-region work"],
      cover: [
        { video: "/ar/holo-glasses.mp4", poster: "/ar/holo-glasses.jpg" },
        { video: "/ar/editable-text.mp4", poster: "/ar/editable-text.jpg" },
        { video: "/ar/nod-to-switch.mp4", poster: "/ar/nod-to-switch.jpg" },
      ],
      showArFilters: true,
      story: [
        {
          title: "Context and goal",
          body: [
            "In 2022, Shopee launched Shopee Video. The effect library at launch was mostly built by the regional team in China, so it spoke to that market and not to Indonesia or Malaysia.",
            "I joined in September 2022 as the second designer on the Video team. My title was product designer. The work was designing for the SDK, the toolkit behind effects, stickers and templates, and day to day it also included UI and UX.",
            "The goal was to help sellers make videos that hold attention, and to give buyers a reason to stop when they see one. AR effects, which Shopee calls magic, were one of the ways to do that.",
          ],
          visual: {
            type: "timeline",
            items: [
              { when: "2022", text: "Shopee Video launches, with a library built for another market" },
              { when: "Sep 2022", text: "I join as the second designer on the team" },
              { when: "2023", text: "Effects, stickers and templates keep shipping" },
            ],
          },
        },
        {
          title: "The problem",
          body: ["The library was not localized, and in Indonesia few people used it."],
          visual: { type: "stat", value: "~30", label: "videos a week using an effect in Indonesia (approximate)" },
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
        {
          title: "1. Make it local",
          body: [
            "The earlier library leaned on sparkly, kawaii looks and dense beauty filters. I replaced it with effects made for local users, starting with stickers for Indonesia: everyday use first, with copy in their own language.",
          ],
          visual: {
            type: "image",
            src: "/ar/story-local.jpg",
            alt: "A red “Penawaran Terbatas!” sticker above a face",
            caption: "“Penawaran Terbatas!” is “Limited offer!” in Indonesian.",
          },
        },
        {
          title: "2. Refresh every week",
          body: [
            "Use of an effect is specific and tied to a moment, so one launch fades fast. The library was refreshed every week, so users always had something new to try. Regions set their own cadence, and Indonesia ran weekly.",
          ],
          visual: {
            type: "image",
            src: "/ar/story-new.jpg",
            alt: "The effects library on its “Baru” (New) tab, with a grid of effect thumbnails",
            caption: "The effects library today, on the “Baru” (New) tab.",
          },
        },
        {
          title: "3. Let sellers write the text",
          body: [
            "Most stickers at that point were for daily use, not e-commerce. So I designed commercial effects where the seller types their own text, such as “Big sale” or “Limited offer”. A fixed sticker can't fit every offer. Editable text can.",
            "These shipped alongside the Shopee Video launch, and what we saw from them became an early learning.",
          ],
          visual: {
            type: "image",
            src: "/ar/story-typing.jpg",
            alt: "A blue “Limited Offer!!!!” sticker above a face, with the text field below",
            caption: "The seller types the offer and the sticker updates live.",
          },
        },
        {
          title: "4. Templates in Malaysia",
          body: [
            "Stickers and templates are different kinds of visual, but both sit under the same SDK, and my designs shipped to every market. As the designer for Malaysia, my regional focus was templates rather than stickers.",
            "Weekly uses of Malaysia video templates grew from about 200 to about 34K.",
          ],
          visual: { type: "stat", value: "~200 → ~34K", label: "weekly uses of Malaysia video templates (approximate)" },
        },
      ],
      results: [
        {
          value: "~30 → ~500",
          label: "videos a week using AR effects in Indonesia, before and after the library refresh (approximate)",
        },
        {
          value: "~16×",
          label: "growth in weekly videos using effects (500 ÷ 30, worked out from the approximate figures)",
        },
        {
          value: "~200 → ~34K",
          label: "weekly uses of Malaysia video templates, the region I owned (approximate)",
        },
      ],
      resultsNote: [
        "These numbers are approximate. Effects are smaller than templates, because each one is used for something specific and for a short time. A new effect usually got only about 5 to 6 uses in its first two months. Across a library that is refreshed every week, those add up to hundreds of videos a week.",
        "The same designs were pushed to every market, but each region ran its own strategy, so numbers differ by region. I report Indonesia, the region this figure comes from.",
      ],
      chart: {
        title: "Videos a week using AR effects, Indonesia",
        note: "Approximate. Two points only: nothing is shown between them.",
        bars: [
          { label: "Before the library refresh", value: 30, display: "~30" },
          { label: "After", value: 500, display: "~500" },
        ],
      },
      learnings: [
        "Adoption needs a rhythm, not a launch. The weekly refresh is what increased usage.",
        "Commercial use needs control. Editable text made effects useful for selling, not just for fun, and it was an early learning from the launch.",
        "Small numbers can still mean real adoption. Effects will never match templates in volume, because their use is specific and short-lived. The signal to watch is whether people keep using them.",
      ],
      highlights: [
        "Designed AR effects, stickers and filters for Shopee Video as a product designer on the SDK, alongside everyday UI and UX work",
        "Owned design for the Malaysia region, where the focus was templates, which grew from ~200 to ~34K weekly uses",
        "Replaced a library built for another market with effects made for local users, and refreshed it every week",
        "Designed commercial effects with editable text, now live on the Shopee platform",
        "Worked in a team of four designers, one per region, deciding and shipping fast",
      ],
    },
    {
      id: "tana",
      label: "Mission 02",
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

export const projectHref = (id: MissionId) => `#/work/${id}`;
