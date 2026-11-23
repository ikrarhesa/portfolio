/** Shopee Video templates case study (Malaysia). Everything here comes from the designer's own account. */
export const template = {
  caseLabel: "Case study · Shipped",
  lede: "Templates let sellers go from zero to a finished video in a few clicks, but in Malaysia hardly anyone used them. I reused what had worked in Indonesia, researched what Malaysian users actually like, and then designed templates to match. Within three months, weekly uses grew from 200 to 34,000.",
  meta: [
    ["Role", "Designer · SDK"],
    ["Region", "Malaysia"],
    ["Surface", "Shopee Video templates"],
    ["Year", "2023 · 3 months"],
    ["Status", "Shipped"],
  ] as [string, string][],

  result: {
    title: "The result",
    label: "Headline",
    headline: [
      { suffix: "", label: "videos posted with a template in a week in Malaysia, up from 200 when the work began" },
      { suffix: " months", label: "from low adoption to 34K weekly uses" },
      { suffix: "", label: "weekly uses from one OOTD-themed template alone. The rest followed with thousands each" },
    ],
    growthAria: "Weekly template uses in Malaysia",
    growthCaption: "Weekly template uses, Malaysia",
    growthNote: "Three points only: nothing is shown between them.",
    growth: [
      { label: "Start of the work", display: "200" },
      { label: "Month 2", display: "7K" },
      { label: "End of month 3", display: "34K" },
    ],
    howToRead:
      "How to read the numbers: a “weekly use” is one video posted on Shopee Video using a template, in Malaysia, in that week. Sellers can post without a template too, so this counts how many videos used one, not the total number of videos posted. The growth shows that more of the videos going out were made with templates.",
  },

  problem: {
    title: "The problem",
    label: "Context",
    p1: "Templates sit under the same SDK as effects and stickers. Most of my designs shipped to the other markets too, but each region set its own strategy for the library.",
    p2: "In Malaysia the problem was adoption. The library existed, but very few people were using it: about 200 videos a week were posted with a template.",
    quote: "Templates only matter if people use them. How do we get sellers to start?",
  },

  purpose: {
    label: "Purpose",
    heading: "Zero to one in a few clicks",
    intro:
      "A template exists to make content creation easier for sellers. They shoot a photo or video of their product, pick a template, and a few clicks later the video is finished and ready to post in Shopee Video. No editing skills and no blank timeline.",
    videoTitle: "The full template flow",
    videoCaption:
      "Screen recording of the full flow, from camera to feed, in the Indonesian version of the app. Tap to pause or play.",
    flow: [
      ["Open the camera", "Switch to the Template tab next to Photo, Video and Live."],
      ["Pick a template", "Browse the library by tab. Each cover says how many photos or videos it needs."],
      ["Add media", "Choose the photos or clips, here three videos of a product."],
      ["Preview", "See the template filled with your own footage and tap a clip to swap it."],
      ["Caption and attach a product", "Write a caption, add a product and voucher, then post."],
      ["Live in the feed", "The finished video appears in Shopee Video, template and all."],
    ] as [string, string][],
  },

  role: {
    title: "My role and the team",
    label: "Role",
    p1: "I was a designer on the SDK, designing templates alongside the other designers. Each of them focused on their own region. For Malaysia I was the one who collaborated with the region and kept its design direction and its part of the SDK toolkit in order.",
    p2: "Day to day I worked with the Malaysian marketing team and the PM.",
    p3: "The regional team are locals and know the market better than I do. They often had their own perspective and feedback, and when they did, I followed it.",
  },

  turn: {
    title: "A slow start, then a spike",
    label: "The turn",
    p1: "For the first three weeks the weekly refresh moved very little. By month two usage had reached 7K a week, and by the end of month three it was 34K.",
    p2: "Here is what we did, in order:",
    timeline: [
      { when: "Weeks 1–3", text: "A slow start. Weekly refreshes, little change in usage." },
      { when: "Month 2", text: "Adoption picks up and reaches 7K weekly uses." },
      { when: "Month 3", text: "Usage climbs to 34K weekly uses by the end of the month." },
    ],
    steps: [
      {
        title: "Reuse what worked in Indonesia",
        body: "Templates had gone out in Indonesia before Malaysia. Many of them already filled the gap, so I started by bringing those over instead of waiting to design from scratch.",
      },
      {
        title: "Research what Malaysia likes",
        body: "I looked at what was trending locally through TikTok tools, TikTok top content, CapCut, competitors, and input from the regional team.",
      },
      {
        title: "Design for Malaysia",
        body: "Once we saw momentum and pickup, I started designing templates for Malaysian needs and preferences, in the direction the research pointed to.",
      },
    ],
  },

  research: {
    title: "What Malaysia liked",
    label: "Research",
    intro:
      "Looking across TikTok tools, TikTok top content, CapCut and competitors, with input from the Malaysian marketing team, three things kept showing up:",
    trends: ["Fast-paced music", "Minimal elements", "Rapid transitions"],
    outro:
      "That is the direction I designed toward. The result was clearest in one template: an OOTD-themed one drove around 15K weekly uses by itself, and the rest followed with thousands each.",
    libraryAlt:
      "The Template tab in Shopee Video: a OneClip banner, category tabs, and a grid of template covers with the number of photos or videos each needs",
    libraryCaption:
      "The template library, the shelf the weekly refresh kept filling. Category tabs along the top, and a cover and a photo count on every card.",
  },

  work: {
    label: "The work",
    heading: "Templates I designed",
    intro: "Three examples of templates I designed. They loop while on screen, and a tap pauses or plays.",
    template: "Template {n}",
    items: [
      {
        title: "Six frames of happiness",
        blurb:
          "A six-photo collage that fills a vertical frame, with hand-made stickers (a plaster, a star, a CD) laid over the seams.",
        tags: ["6 photos", "Collage", "Stickers"],
      },
      {
        title: "Bento grid",
        blurb:
          "Photos land in a bento-style grid of rounded tiles, with a Shopee logo tile and a vertical hashtag tile built into the layout. It starts on a single photo and opens out into the full grid.",
        tags: ["Grid layout", "Brand tile", "Hashtag"],
      },
      {
        title: "Shopee.exe",
        blurb:
          "A retro desktop window: title bar, menu, Back and Next buttons and a row of thumbnails with film-style names. Stepping through changes the main photo and its colour grade.",
        tags: ["Retro UI", "Colour grades", "Interactive feel"],
      },
    ],
  },

  learned: {
    title: "What I learned",
    items: [
      "Reuse before you create. Templates that already worked in Indonesia gave Malaysia a head start and showed us where the real gaps were.",
      "Read the market, then design. Fast music, minimal elements and rapid transitions were what people already enjoyed, so the templates followed that.",
      "Listen to the people who live there. The regional team are locals and know better than I do. When their view differed from mine, I followed it.",
      "Adoption needs a rhythm, not a launch. A weekly refresh keeps the library worth coming back to.",
    ],
  },
};
export type Template = typeof template;
