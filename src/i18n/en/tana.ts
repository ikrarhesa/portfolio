/**
 * Tana case study. Only claims that can be backed up are made here; anything not documented is left out on purpose.
 * Figures, counts and screen names are language-neutral values kept in the component; everything readable is here.
 */
export const tana = {
  caseLabel: "Case study · Concept project",
  title: "Tana: making recycling visible and rewarding",
  lede: "A 12-week solo concept for a mobile app that connects households, communities and businesses around recycling in Indonesia. Nothing shipped. The point was the process: field research, turning messy answers into decisions, and building the screens properly.",
  heroAlt: "A hand holding a phone that shows the Tana home screen with points, shortcuts and community posts",
  meta: [
    ["Role", "Researcher & designer, solo"],
    ["Type", "Concept project"],
    ["Duration", "12 weeks"],
    ["Timeline", "Q3 2024"],
    ["Status", "Not launched"],
  ] as [string, string][],

  why: {
    title: "Why I made it",
    p1: "I took this project to learn UI and UX in depth: to get faster and cleaner with auto layout and components, and to practise design thinking and problem solving on a problem I had to understand before I could design for it.",
    p2: "There was no client and no product team, so every decision had to come from something I had gathered myself: reading, talking to people, and visiting the places where waste already turns into money.",
  },

  problem: {
    title: "The problem",
    label: "Context",
    stats: [
      { label: "Indonesia is widely cited as the world's second-largest contributor of ocean plastic" },
      { label: "of Indonesia's waste is recycled, while over 60% goes to landfill" },
      { label: "the year Jakarta's Bantar Gebang landfill was projected to run out of space" },
    ],
    sources: "Figures are from the public reports and news I read in 2024.",
    p1: "Indonesia generates over 60 million tons of waste a year, and only a small fraction is recycled. Most ends up in landfills, rivers or fires, with the pollution and health risks that follow.",
    p2: "For individuals, recycling feels inconvenient and unrewarding. Drop-off points are scattered and people rarely see the effect of their effort. For businesses, measuring sustainability is costly and unreliable, which leaves gaps in ESG reporting.",
    quote:
      "How might we make recycling convenient, rewarding and trackable for ordinary people, so the waste they already produce is treated as a resource?",
  },

  research: {
    title: "How I researched it",
    label: "Research",
    intro:
      "I combined secondary research with primary research done by myself in and around Jogjakarta. The first told me the scale. The second told me what it looks like from the street.",
    methods: [
      {
        kind: "Secondary research",
        detail: "Reports, World Bank data and local news",
        found:
          "The national numbers are huge, and overflowing collection points show up in local news. The problem is felt at street level.",
      },
      {
        kind: "Interviews",
        detail: "5 residents of Jogjakarta: students, young people, small sellers",
        found:
          "People want to act, but collection points overflow, awareness is low, and community efforts are not coordinated.",
      },
      {
        kind: "Survey",
        detail: "10 people: students, housewives, small business owners",
        found:
          "Packaging from online shopping was the biggest headache for most. Housewives asked for easier daily tools.",
      },
      {
        kind: "Competitor review",
        detail: "Downloaded and used PlasticPay and Duitin, among other recycling apps",
        found:
          "They show where to drop waste on a map, but not whether the point can still take it. That gap became the capacity labels in Tana.",
      },
      {
        kind: "Waste bank visits",
        detail: "Local bank sampah, where sorted recyclables are collected and paid for",
        found:
          "A working version of the idea already exists offline: sort, hand over, get paid. Tana tries to make that loop easier to start and easier to see.",
      },
    ],
    noteLabel: "A note on the evidence",
    note: "I didn't screenshot the interviews or save the survey responses, so I can't show raw data. What follows is my synthesis, kept at the size it was: 5 interviews and 10 survey answers are enough to find a direction, not to prove one.",
    interviewsHeading: "What the interviews said",
    interviewFindings: [
      "Overflowing collection points left residents with nowhere to take their waste.",
      "Stalls selling instant noodles, coffee and packaged goods are growing, and so is the disposable waste.",
      "Young people generate much of the waste but have low awareness of it.",
      "Waste banks and local initiatives exist, but coordination between them is inconsistent.",
    ],
    surveyHeading: "What the survey said",
    surveyAria: "6 of 10 respondents named e-commerce packaging waste as their biggest challenge",
    surveyStrong: "6 of 10",
    surveyRest: " named packaging waste from e-commerce (plastic, cardboard) as their biggest challenge.",
    surveyOther: [
      "Students often join clean-up groups, but said coordination was poor and information unreliable.",
      "Housewives wanted easier tools for managing waste every day.",
    ],
    quote: "People want to act, but the options on offer are fragmented, inconvenient and uninspiring.",
  },

  synthesis: {
    title: "From insight to design",
    label: "Synthesis",
    intro:
      "Grouping everything I had heard gave three insights. Two more findings from the interviews and survey became decisions of their own. Each row below points at the screen where the decision shows up.",
    found: "I found",
    designed: "So I designed",
    seeScreen: "See the {screen} screen ↓",
    rows: [
      {
        from: "Youth awareness is low",
        detail: "Young people make much of the packaging waste, and it only changes if recycling feels relevant to them.",
        to: "Eco tiers and points",
        toDetail: "Seed, Sprout, Tree, Forest. Progress is framed as growth, not a loyalty scheme.",
        screenLabel: "Home",
      },
      {
        from: "Community efforts are fragmented",
        detail:
          "Waste banks and clean-ups exist, but there is no shared place to organise or find reliable information.",
        to: "Social feed, events and challenges",
        toDetail: "People post, create or join a clean-up, and book a place from the post itself.",
        screenLabel: "Social",
      },
      {
        from: "Recyclables lack perceived value",
        detail: "Without a clear financial or social value, packaging waste is seen as a burden.",
        to: "Estimated points and cash, shown first",
        toDetail: "Before confirming a pickup, the user sees what they will earn and what it costs.",
        screenLabel: "Pickup",
      },
      {
        from: "Collection points overflow",
        detail: "Interviewees could not dispose of waste because the nearest point was full.",
        to: "A capacity map for drop-off points",
        toDetail:
          "Each point is marked by how full it is, so people can head to one with room. The competing apps I tried showed locations only.",
        screenLabel: "Drop-off",
      },
      {
        from: "Recycling feels inconvenient",
        detail: "Drop-off points are scattered and effort rarely feels rewarded.",
        to: "Scheduled pickup with live tracking",
        toDetail: "A few taps to book, and the user can see the pickup coming.",
        screenLabel: "Tracking",
      },
    ],
  },

  process: {
    title: "From sketches to flows",
    label: "Process",
    intro:
      "Before any screen, I sketched the structure on paper and mapped how people would move through it. Both were cheap to change, which is why I did them first. The full user flows are in the working files at the end of this page.",
    sketchesAlt:
      "A sheet of eight pencil wireframes: home, locate recycle point, scan, social, leaderboard, waste pick-up, voucher and trash alert",
    sketchesCaption:
      "Eight pencil wireframes on one sheet: home, find a recycle point, scan, social, leaderboard, waste pick-up, voucher and trash alert. This is where the app's shape was decided.",
    opensFull: "{alt} (opens full size)",
  },

  solution: {
    title: "The solution",
    label: "Design",
    intro:
      "Tana is a community-driven recycling platform. It connects individual habits to collective impact and, through Tanabiz, to business accountability. This page focuses on the individual and community experience.",
    loopLabel: "Core loop",
    loop: ["Drop off or schedule a pickup", "Earn points", "Progress through tiers", "See your impact"],
    tiersLabel: "Eco tiers instead of silver, gold, platinum",
    tiers: ["Seed", "Sprout", "Tree", "Forest"],
    tiersAria: "Tiers: Seed, Sprout, Tree, Forest",
    tiersNote:
      "Recycling is framed as growth, for the individual and for the community, rather than as a status ladder.",
    onboardingAlt:
      "Four onboarding screens: Redefine Recycling, Connect with other like-minded individuals, Schedule a waste picker, Earn points from recycling and challenges",
    onboardingCaption:
      "Onboarding introduces the four things the app does: recycle, connect, schedule a pickup, earn points.",
  },

  screens: {
    label: "Key screens",
    heading: "The screens, and the decision behind each",
    items: [
      {
        title: "Home",
        alt: "Tana home screen showing 70,876 points, shortcuts to Tanapick, Tanadrop and Tanabiz, a promo banner and community posts",
        body: "Home puts the two core actions first: order a pickup (Tanapick) or drop recyclables off (Tanadrop), with business (Tanabiz) alongside. Points and progress sit on top, so every visit starts with a reminder of what recycling has earned.",
      },
      {
        title: "Find a drop-off point",
        alt: "Tanadrop screen with a search field and a map whose points are labelled Overload, Neutral and Medium",
        body: "A map shows whether each drop-off point is full, so people can find one that still has capacity. In the competing apps I tried, the map showed where a waste bank was but not whether it could take more. Interviewees told me overflowing collection points left them with nowhere to go, so I added capacity labels to close that gap.",
      },
      {
        title: "Order a pickup",
        alt: "Tanapick screen listing plastic, glass and paper by weight, with estimated points, cash, pickup fee, location and time",
        body: "The trade is visible before the user commits: what they hand over, the estimated points and cash, the pickup fee, the address and the time slot. Sorting comes first, with a 5 kg minimum for pickups other than e-waste.",
      },
      {
        title: "Track the pickup",
        alt: "Tracking screen with a live map, estimated arrival, the ranger's name and rating, and an itemised list of recyclables with values",
        body: "After a ranger accepts, the user sees their position on a map, the arrival window, the ranger's rating and an itemised list of what is being collected, with a value for each line. Nothing about the pickup is a surprise.",
      },
      {
        title: "Community",
        alt: "Social screen with Feed, Challenges and Rewards tabs, a post about recycling 43 bottles and a clean-up event post with a Book Event button",
        body: "Feed, Challenges and Rewards in one place. A post can carry an event with a Book Event button, so “a big pile of trash by the bridge” can turn straight into a clean-up other people join.",
      },
    ],
  },

  foundations: {
    title: "Built on a system",
    label: "Foundations",
    intro:
      "This project was my practice ground for auto layout and components. I set type and colour styles first, then built each screen from reusable components, so one change carried through the whole file.",
    alt: "A board of Tana components: voucher cards, points header, banner, location search, post cards, leaderboard rows, buttons, logo variants and mascot cards",
    caption:
      "The component board: voucher cards, points header, banners, location search, feed posts, leaderboard rows, buttons and logo variants.",
  },

  prototype: {
    title: "The prototype in motion",
    label: "Prototype",
    intro:
      "A 35-second walkthrough of the prototype: scanning and earning points, scheduling a pickup, and organising a clean-up from the community feed. The prototype and working files are in Figma.",
    videoAria: "Walkthrough video of the Tana prototype",
  },

  testing: {
    title: "Testing it",
    label: "Validation",
    p1: "I ran usability tests with five participants. They found the tasks clearer after I iterated on the flow, and they engaged strongly with the rewards system.",
    p2: "Five people is a small group and I didn't keep task-level scores, so I'm not quoting success rates.",
  },

  learned: {
    title: "What I learned",
    label: "Reflection",
    items: [
      "Research was the longest stage and the most useful one. Clear problem definition mattered as much as polished screens.",
      "Messy answers need synthesis. Grouping what people said into three insights is what made the design decisions easy to defend.",
      "Components and auto layout paid off. I rebuilt screens faster and more consistently once the system was in place.",
      "Separating real problems from distractions is a skill. Plenty of good ideas came up that the research did not support.",
    ],
  },

  differently: {
    title: "What I would do differently",
    items: [
      {
        t: "Capture evidence as I go",
        d: "I didn't screenshot the interviews or save the survey responses, so I can't show raw data today. Now I record with consent, or at least photograph notes, and export responses the same day.",
      },
      {
        t: "Widen the sample",
        d: "Fifteen people, all in one city, can point a direction. They can't size a market. I would add other cities and people who are not already sympathetic to recycling.",
      },
      {
        t: "Check the numbers behind the screens",
        d: "Prices, points and the pickup fee in the mockups are illustrative. A real version needs what waste banks actually pay, and an answer to who funds the rangers.",
      },
      {
        t: "Test the business side",
        d: "The ESG dashboard (Tanabiz) is a hypothesis. I didn't test it with a real company, and I would before calling it part of the solution.",
      },
    ],
  },

  appendix: {
    label: "Appendix",
    heading: "Working files",
    blurb: "All five user flows, the scan and rewards screens, and the type and colour foundations.",
    figures: [
      {
        alt: "Five user flow diagrams: Recycle Point, Waste picker, Trash Alert, Event and Leaderboard",
        caption: "All five user flows: Recycle Point, Waste picker, Trash Alert, Event and Leaderboard.",
      },
      {
        alt: "Five screens: scan a QR code at a Tanadrop, insert items, two calculating screens, and a result showing points earned",
        caption:
          "Scan and earn: scan the QR at a Tanadrop, insert items, wait while the app calculates, then see points and carbon saved.",
      },
      {
        alt: "Four reward screens: the rewards list, the full list with filters, a voucher detail page and a voucher with a barcode",
        caption: "Rewards: points become vouchers, with terms and a barcode for in-store use. Brands and prices are placeholders.",
      },
      {
        alt: "Typography and colour documentation in Satoshi Variable with primary, neutral and semantic colour tokens",
        caption:
          "Foundations: a type scale in Satoshi Variable and colour tokens in three groups, each with a usage note.",
      },
    ],
  },

  talkBody: "I'm happy to go deeper on the research, the decisions or what I would change.",
};
export type Tana = typeof tana;
