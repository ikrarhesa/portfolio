export type MissionId = "video-ar";

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
  story?: { title: string; body: string[] }[]; // case-study sections, shown after the meta strip
  showArFilters?: boolean; // embed the AR filter recordings (constants/arFilters.ts) in the page
  results?: { value: string; label: string }[]; // headline numbers
  highlights: string[];
}[] = [
    {
      id: "video-ar",
      label: "Mission 01",
      title: "Large-scale Video & AR Surface",
      summary:
        "Designing video & AR experiences deployed across multiple markets, balancing engagement, performance, and content tooling.",
      role: "Product & motion design",
      focus: "Interaction, systems, experimentation",
      surface: "AR & video · Shopee",
      status: "Shipped",
      year: "2022–Present",
      stack: ["AR filters", "Video player", "Design systems", "A/B testing", "Cross-platform"],
      cover: [
        { video: "/ar/holo-glasses.mp4", poster: "/ar/holo-glasses.jpg" },
        { video: "/ar/summer-fruit.mp4", poster: "/ar/summer-fruit.jpg" },
        { video: "/ar/nod-to-switch.mp4", poster: "/ar/nod-to-switch.jpg" },
      ],
      showArFilters: true,
      // DRAFT: written only from the highlights and numbers already on this site. Replace with the real story.
      story: [
        {
          title: "The challenge",
          body: [
            "Shopee Video and its AR effects had to work across markets. I owned the Shopee Video Malaysia SDK (templates and filters) and later shipped design iterations for Shopee Video Indonesia. The surfaces had to do three jobs at once: keep people watching and creating, stay performant, and give content teams the tooling to move quickly.",
            "My role was product design across all three: the video entry points, the AR experience, and the template system behind it.",
          ],
        },
        {
          title: "What I designed",
          body: [
            "A reusable AR template system. Instead of one-off effects, I designed templates as a system, so content teams could ship new filters without waiting on engineering.",
            "Video entry points that balance engagement and conversion. I worked with PMs and engineers to define experiments, so we could iterate quickly and let the numbers decide.",
          ],
        },
      ],
      results: [
        { value: "200 → 34K", label: "weekly uses of Malaysia video templates" },
        { value: "24%", label: "Shopee Video Indonesia usage uplift, Q1–Q2 2024" },
      ],
      highlights: [
        "Owned the Shopee Video Malaysia SDK (templates and filters), growing weekly template usage from ~200 to 5,000 (+2,400%), then to 34,000 weekly uses (+16,900%) through localized content strategy and UX improvements",
        "Designed reusable AR template system enabling content teams to ship effects without engineering",
        "Built interaction patterns for video entry points that balanced engagement and conversion goals",
        "Collaborated with PMs and engineers to define experiment frameworks for rapid iteration",
        "Delivered Q1–Q2 2024 design iterations that contributed to a 24% increase in Shopee Video Indonesia usage and improved conversion rates"
      ],
    }
  ];

export type Mission = (typeof MISSIONS)[number];

export const projectHref = (id: MissionId) => `#/work/${id}`;
