/** Strings on the generic case-study page (ProjectPage) and the media components it uses */
export const project = {
  caseStudy: "Case study · {status}",
  screenshotAlt: "{title} screenshot {n}",
  meta: { role: "Role", focus: "Focus", surface: "Surface", status: "Status", year: "Year" },
  moves: { label: "What I did", heading: "{n} moves", move: "Move {n}" },
  filters: {
    label: "The work",
    heading: "Effects I designed",
    intro:
      "Three effects from the library: one for selling, two made for local users. Screen recordings, looping while on screen. A tap pauses or plays.",
    filter: "Filter {n}",
    why: "Why",
    trigger: "Trigger",
  },
  results: "Results",
  learned: "What I learned",
  talkBody: "I'm happy to go deeper on the decisions, the trade-offs or the numbers.",
  thumb: {
    previews: "{title}: looping previews of AR filters",
    screenshot: "{title} screenshot",
    soon: "{title} preview coming soon",
  },
  video: { pause: "Pause preview: {title}", play: "Play preview: {title}" },
};
export type Project = typeof project;
