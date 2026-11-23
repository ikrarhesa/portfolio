/** Header, footer, intro and the strings every page shares. Placeholders like {year} are filled by fill(). */
export const shell = {
  meta: {
    homeTitle: "Ikrar Hesa Prasetya · Product Designer | Creative Tools & Systems",
    homeDescription:
      "Designer of digital products and creative systems, currently at Shopee. Selected work, background and contact.",
    projectTitle: "{title} · Ikrar Hesa Prasetya",
  },
  nav: { work: "Work", about: "About", contact: "Contact", primary: "Primary" },
  availableForWork: "Available for work",
  language: { group: "Language", en: "English", ja: "日本語" },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    lightTitle: "Light theme",
    darkTitle: "Dark theme",
  },
  nudge: { aria: "Bored? Try the dark theme", big: "Bored?", small: "Have a look →" },
  intro: {
    loading: "Loading Ikrar Hesa Prasetya's portfolio",
    words: ["Hi,", "I'm"],
    sep: " ",
    name: "Hesa.",
    after: "",
    sub: "I design digital products and creative systems.",
    skip: "Skip",
  },
  footer: {
    tagline: "Designer of digital products and creative systems",
    nav: "Footer",
    email: "Email",
    linkedin: "LinkedIn",
    cv: "Download CV",
    copyright: "© {year} Ikrar Hesa Prasetya",
  },
  common: {
    allWork: "All work",
    getInTouch: "Get in touch",
    nextProject: "Next project",
    toolsSkills: "Tools & skills",
    wantToTalk: "Want to talk about this work?",
  },
};
export type Shell = typeof shell;
