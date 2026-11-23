import { MISSIONS, projectHref, type Mission } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import Label from "./Label";
import FilterVideo from "./FilterVideo";
import ProjectThumb from "./ProjectThumb";
import CountUp from "./CountUp";

/**
 * Shopee Video templates, Malaysia. Content lives at the top of the file so it is easy to edit.
 * Everything here comes from the designer's own account. Nothing is invented.
 *
 * Not available (so not shown): before/after screenshots of the library, a Malaysia-region recording of the flow.
 * TODO(Ikrar): if you remember them, add an example for each trend and what a typical weekly batch held.
 */

const HEADLINE = [
  { from: 200, to: 34000, suffix: "", label: "weekly uses of video templates in Malaysia, up from 200 when the work began" },
  { from: 0, to: 3, suffix: " months", label: "from low adoption to 34K weekly uses" },
  { from: 0, to: 15000, suffix: "", label: "weekly uses from one OOTD-themed template alone. The rest followed with thousands each" },
];

const GROWTH = [
  { label: "Start of the work", value: 200, display: "200" },
  { label: "Month 2", value: 7000, display: "7K" },
  { label: "End of month 3", value: 34000, display: "34K" },
];

const FLOW = [
  ["Open the camera", "Switch to the Template tab next to Photo, Video and Live."],
  ["Pick a template", "Browse the library by tab. Each cover says how many photos or videos it needs."],
  ["Add media", "Choose the photos or clips, here three videos of a product."],
  ["Preview", "See the template filled with your own footage and tap a clip to swap it."],
  ["Caption and attach a product", "Write a caption, add a product and voucher, then post."],
  ["Live in the feed", "The finished video appears in Shopee Video, template and all."],
];

const TIMELINE = [
  { when: "Weeks 1–3", text: "A slow start. Weekly refreshes, little change in usage." },
  { when: "Month 2", text: "Adoption picks up and reaches 7K weekly uses." },
  { when: "Month 3", text: "Usage climbs to 34K weekly uses by the end of the month." },
];

const STEPS = [
  {
    n: "01",
    title: "Reuse what worked in Indonesia",
    body: "Templates had gone out in Indonesia before Malaysia. Many of them already filled the gap, so I started by bringing those over instead of waiting to design from scratch.",
  },
  {
    n: "02",
    title: "Research what Malaysia likes",
    body: "I looked at what was trending locally through TikTok tools, TikTok top content, CapCut, competitors, and input from the regional team.",
  },
  {
    n: "03",
    title: "Design for Malaysia",
    body: "Once we saw momentum and pickup, I started designing templates for Malaysian needs and preferences, in the direction the research pointed to.",
  },
];

const TRENDS = ["Fast-paced music", "Minimal elements", "Rapid transitions"];

const LEARNED = [
  "Reuse before you create. Templates that already worked in Indonesia gave Malaysia a head start and showed us where the real gaps were.",
  "Read the market, then design. Fast music, minimal elements and rapid transitions were what people already enjoyed, so the templates followed that.",
  "Listen to the people who live there. The regional team are locals and know better than I do. When their view differed from mine, I followed it.",
  "Adoption needs a rhythm, not a launch. A weekly refresh keeps the library worth coming back to.",
];

const TEMPLATES = [
  {
    id: "six-frames",
    n: "01",
    title: "Six frames of happiness",
    video: "/template/six-frames.mp4",
    poster: "/template/six-frames.jpg",
    blurb:
      "A six-photo collage that fills a vertical frame, with hand-made stickers (a plaster, a star, a CD) laid over the seams.",
    tags: ["6 photos", "Collage", "Stickers"],
  },
  {
    id: "bento-grid",
    n: "02",
    title: "Bento grid",
    video: "/template/bento-grid.mp4",
    poster: "/template/bento-grid.jpg",
    blurb:
      "Photos land in a bento-style grid of rounded tiles, with a Shopee logo tile and a vertical hashtag tile built into the layout. It starts on a single photo and opens out into the full grid.",
    tags: ["Grid layout", "Brand tile", "Hashtag"],
  },
  {
    id: "windows-like",
    n: "03",
    title: "Shopee.exe",
    video: "/template/windows-like.mp4",
    poster: "/template/windows-like.jpg",
    blurb:
      "A retro desktop window: title bar, menu, Back and Next buttons and a row of thumbnails with film-style names. Stepping through changes the main photo and its colour grade.",
    tags: ["Retro UI", "Colour grades", "Interactive feel"],
  },
];

const CARD = "rounded-2xl border border-white/10 bg-white/[0.03]";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-fuchsia-400";

function Section({ title, label, children }: { title: string; label?: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
      <div>
        {label && <Label>{label}</Label>}
        <h2 className={`${label ? "mt-2" : ""} text-xl font-semibold text-zinc-50`}>{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** Labelled bars with the value written on each. Three points only, so nothing is implied between them. */
function GrowthBars() {
  const max = Math.max(...GROWTH.map((g) => g.value));
  return (
    <figure className="mt-8 max-w-2xl" aria-label="Weekly template uses in Malaysia">
      <figcaption className="text-sm font-medium text-zinc-200">Weekly template uses, Malaysia</figcaption>
      <div className="mt-4 space-y-4">
        {GROWTH.map((g, i) => (
          <div key={g.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-zinc-400">{g.label}</span>
              <span className="font-semibold tabular-nums text-zinc-50">{g.display}</span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-r bg-white/[0.04]" aria-hidden>
              <div
                className={`h-full rounded-r-[4px] ${i === GROWTH.length - 1 ? "bg-fuchsia-400" : "bg-zinc-500"}`}
                style={{ width: `${Math.max(2, (g.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">Three points only: nothing is shown between them.</p>
    </figure>
  );
}

export default function TemplateCaseStudy({ mission }: { mission: Mission }) {
  const index = MISSIONS.findIndex((m) => m.id === mission.id);
  const next = MISSIONS[(index + 1) % MISSIONS.length];

  const meta = [
    ["Role", "Designer · SDK"],
    ["Region", "Malaysia"],
    ["Surface", "Shopee Video templates"],
    ["Year", "2023 · 3 months"],
    ["Status", "Shipped"],
  ];

  return (
    <article className="pt-10 pb-16 md:pt-14">
      <a href="#work" className={`inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 hover:text-zinc-100 ${FOCUS}`}>
        <span aria-hidden>←</span> All work
      </a>

      <header className="mt-8">
        <Label>Case study · Shipped</Label>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-50 md:text-5xl">
          Fixing low template adoption in Malaysia: 200 to 34K weekly uses
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
          Templates let sellers go from zero to a finished video in a few clicks, but in Malaysia hardly anyone used
          them. I reused what had worked in Indonesia, researched what Malaysian users actually like, and then designed
          templates to match. Within three months, weekly uses grew from 200 to 34,000.
        </p>
      </header>

      <ProjectThumb mission={mission} className="mt-10 w-full aspect-video rounded-2xl border border-white/10" />

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 md:grid-cols-5">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
            <dd className="mt-1 text-sm text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title="The result" label="Headline">
        <dl className="grid gap-4 sm:grid-cols-3">
          {HEADLINE.map((h) => (
            <div key={h.label} className={`${CARD} p-5`}>
              <dt className="text-4xl font-bold tracking-tight text-zinc-50">
                <CountUp from={h.from} to={h.to} suffix={h.suffix} />
              </dt>
              <dd className="mt-2 text-sm leading-snug text-zinc-400">{h.label}</dd>
            </div>
          ))}
        </dl>
        <GrowthBars />
      </Section>

      <Section title="The problem" label="Context">
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>
            Templates sit under the same SDK as effects and stickers. My designs shipped to every market, but each region
            set its own strategy for the library.
          </p>
          <p>
            In Malaysia the problem was adoption. The library existed, but very few people were using it: 200 uses a
            week.
          </p>
        </div>
        <p className="mt-6 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">
          Templates only matter if people use them. How do we get sellers to start?
        </p>
      </Section>

      <section className="mt-20" aria-labelledby="flow-heading">
        <Label>Purpose</Label>
        <h2 id="flow-heading" className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          Zero to one in a few clicks
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
          A template exists to make content creation easier for sellers. They shoot a photo or video of their product,
          pick a template, and a few clicks later the video is finished and ready to post in Shopee Video. No editing
          skills and no blank timeline.
        </p>
        <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,260px)_1fr] lg:gap-14">
          <figure className="w-full max-w-[260px]">
            <FilterVideo src="/template/full-flow.mp4" poster="/template/full-flow.jpg" title="The full template flow" aspect="576 / 1248" />
            <figcaption className="mt-3 text-xs leading-snug text-zinc-500">
              Screen recording of the full flow, from camera to feed, in the Indonesian version of the app. Tap to pause or play.
            </figcaption>
          </figure>
          <ol className="space-y-5">
            {FLOW.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-mono text-sm text-fuchsia-300">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold text-zinc-50">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section title="My role and the team" label="Role">
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>
            I was a designer on the SDK, designing templates alongside the other designers. Each of them focused on their
            own region. For Malaysia I was the one who collaborated with the region and kept its design direction and its
            part of the SDK toolkit in order.
          </p>
          <p>Day to day I worked with the Malaysian marketing team and the PM.</p>
          <p>
            The regional team are locals and know the market better than I do. They often had their own perspective and
            feedback, and when they did, I followed it.
          </p>
        </div>
      </Section>

      <Section title="A slow start, then a spike" label="The turn">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
          <div className="space-y-4 text-base leading-relaxed text-zinc-300">
            <p>
              For the first three weeks the weekly refresh moved very little. By month two usage had reached 7K a week,
              and by the end of month three it was 34K.
            </p>
            <p>Here is what we did, in order:</p>
          </div>
          <ol className="space-y-4 border-l border-white/15 pl-4">
            {TIMELINE.map((it) => (
              <li key={it.when} className="relative">
                <span aria-hidden className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-fuchsia-400" />
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{it.when}</p>
                <p className="mt-1 text-sm leading-snug text-zinc-300">{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <ol className="mt-8 grid gap-4">
          {STEPS.map((st) => (
            <li key={st.n} className={`${CARD} flex gap-4 p-5`}>
              <span className="font-mono text-sm text-fuchsia-300">{st.n}</span>
              <div>
                <p className="font-semibold text-zinc-50">{st.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What Malaysia liked" label="Research">
        <p className="text-base leading-relaxed text-zinc-300">
          Looking across TikTok tools, TikTok top content, CapCut and competitors, with input from the Malaysian
          marketing team, three things kept showing up:
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {TRENDS.map((t) => (
            <li key={t} className={`${CARD} p-5`}>
              <p className="font-semibold text-zinc-50">{t}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-relaxed text-zinc-300">
          That is the direction I designed toward. The result was clearest in one template: an OOTD-themed one drove
          around 15K weekly uses by itself, and the rest followed with thousands each.
        </p>
        <figure className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src="/template/library.jpg"
            alt="The Template tab in Shopee Video: a OneClip banner, category tabs, and a grid of template covers with the number of photos or videos each needs"
            width={647}
            height={1400}
            loading="lazy"
            className="w-full max-w-[260px] rounded-2xl border border-white/10 bg-black"
          />
          <figcaption className="max-w-sm text-sm leading-relaxed text-zinc-400">
            The template library, the shelf the weekly refresh kept filling. Category tabs along the top, and a cover
            and a photo count on every card.
          </figcaption>
        </figure>
      </Section>

      <section className="mt-20" aria-labelledby="templates-heading">
        <Label>The work</Label>
        <h2 id="templates-heading" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          Templates I designed
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
          Three examples of templates I designed. They loop while on screen, and a tap pauses or plays.
        </p>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <figure key={t.id} className="w-full max-w-[260px]">
              <FilterVideo src={t.video} poster={t.poster} title={t.title} />
              <figcaption className="mt-5">
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">Template {t.n}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <li key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300">
                      {tag}
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Section title="What I learned">
        <ul className="space-y-4 text-base leading-relaxed text-zinc-300">
          {LEARNED.map((l) => (
            <li key={l} className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Section>

      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Tools &amp; skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {mission.stack.map((t) => (
            <span key={t} className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-zinc-300">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Want to talk about this work?</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-300">
          I'm happy to go deeper on the decisions, the trade-offs or the numbers.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {CONTACT.email && (
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
            >
              Get in touch
            </a>
          )}
          <a
            href="#work"
            className={`inline-block rounded py-2 text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white hover:decoration-fuchsia-300 ${FOCUS}`}
          >
            ← All work
          </a>
        </div>
      </section>

      {MISSIONS.length > 1 && (
        <a
          href={projectHref(next.id)}
          className={`mt-8 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-fuchsia-400/50 ${FOCUS}`}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Next project</p>
          <p className="mt-2 flex items-center justify-between gap-4 text-xl font-semibold text-zinc-50">
            {next.title}
            <span aria-hidden className="text-fuchsia-300">→</span>
          </p>
        </a>
      )}
    </article>
  );
}
