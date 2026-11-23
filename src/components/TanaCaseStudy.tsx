import { MISSIONS, projectHref, type Mission } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import Label from "./Label";

/**
 * Tana case study. Content lives at the top of the file so it is easy to edit.
 * Only claims that can be backed up are made here; anything not documented is left out on purpose.
 */

const CONTEXT_STATS = [
  { value: "#2", label: "Indonesia is widely cited as the world's second-largest contributor of ocean plastic" },
  { value: "<10%", label: "of Indonesia's waste is recycled, while over 60% goes to landfill" },
  { value: "2026", label: "the year Jakarta's Bantar Gebang landfill was projected to run out of space" },
];

const METHODS = [
  {
    kind: "Secondary research",
    detail: "Reports, World Bank data and local news",
    found: "The national numbers are huge, and overflowing collection points show up in local news. The problem is felt at street level.",
  },
  {
    kind: "Interviews",
    detail: "5 residents of Jogjakarta: students, young people, small sellers",
    found: "People want to act, but collection points overflow, awareness is low, and community efforts are not coordinated.",
  },
  {
    kind: "Survey",
    detail: "10 people: students, housewives, small business owners",
    found: "Packaging from online shopping was the biggest headache for most. Housewives asked for easier daily tools.",
  },
  {
    kind: "Competitor review",
    detail: "Downloaded and used PlasticPay and Duitin, among other recycling apps",
    found: "They show where to drop waste on a map, but not whether the point can still take it. That gap became the capacity labels in Tana.",
  },
  {
    kind: "Waste bank visits",
    detail: "Local bank sampah, where sorted recyclables are collected and paid for",
    found: "A working version of the idea already exists offline: sort, hand over, get paid. Tana tries to make that loop easier to start and easier to see.",
  },
];

const INTERVIEW_FINDINGS = [
  "Overflowing collection points left residents with nowhere to take their waste.",
  "Stalls selling instant noodles, coffee and packaged goods are growing, and so is the disposable waste.",
  "Young people generate much of the waste but have low awareness of it.",
  "Waste banks and local initiatives exist, but coordination between them is inconsistent.",
];

const SURVEY_OTHER = [
  "Students often join clean-up groups, but said coordination was poor and information unreliable.",
  "Housewives wanted easier tools for managing waste every day.",
];

const INSIGHT_ROWS = [
  {
    from: "Youth awareness is low",
    detail: "Young people make much of the packaging waste, and it only changes if recycling feels relevant to them.",
    to: "Eco tiers and points",
    toDetail: "Seed, Sprout, Tree, Forest. Progress is framed as growth, not a loyalty scheme.",
    screen: "#tana-home",
    screenLabel: "Home",
  },
  {
    from: "Community efforts are fragmented",
    detail: "Waste banks and clean-ups exist, but there is no shared place to organise or find reliable information.",
    to: "Social feed, events and challenges",
    toDetail: "People post, create or join a clean-up, and book a place from the post itself.",
    screen: "#tana-social",
    screenLabel: "Social",
  },
  {
    from: "Recyclables lack perceived value",
    detail: "Without a clear financial or social value, packaging waste is seen as a burden.",
    to: "Estimated points and cash, shown first",
    toDetail: "Before confirming a pickup, the user sees what they will earn and what it costs.",
    screen: "#tana-pickup",
    screenLabel: "Pickup",
  },
  {
    from: "Collection points overflow",
    detail: "Interviewees could not dispose of waste because the nearest point was full.",
    to: "A capacity map for drop-off points",
    toDetail: "Each point is marked by how full it is, so people can head to one with room. The competing apps I tried showed locations only.",
    screen: "#tana-drop",
    screenLabel: "Drop-off",
  },
  {
    from: "Recycling feels inconvenient",
    detail: "Drop-off points are scattered and effort rarely feels rewarded.",
    to: "Scheduled pickup with live tracking",
    toDetail: "A few taps to book, and the user can see the pickup coming.",
    screen: "#tana-tracking",
    screenLabel: "Tracking",
  },
];

const SCREENS = [
  {
    id: "tana-home",
    n: "01",
    title: "Home",
    src: "/tana/home.jpg",
    alt: "Tana home screen showing 70,876 points, shortcuts to Tanapick, Tanadrop and Tanabiz, a promo banner and community posts",
    body: "Home puts the two core actions first: order a pickup (Tanapick) or drop recyclables off (Tanadrop), with business (Tanabiz) alongside. Points and progress sit on top, so every visit starts with a reminder of what recycling has earned.",
  },
  {
    id: "tana-drop",
    n: "02",
    title: "Find a drop-off point",
    src: "/tana/tanadrop.jpg",
    alt: "Tanadrop screen with a search field and a map whose points are labelled Overload, Neutral and Medium",
    body: "A map shows whether each drop-off point is full, so people can find one that still has capacity. In the competing apps I tried, the map showed where a waste bank was but not whether it could take more. Interviewees told me overflowing collection points left them with nowhere to go, so I added capacity labels to close that gap.",
  },
  {
    id: "tana-pickup",
    n: "03",
    title: "Order a pickup",
    src: "/tana/tanapick.jpg",
    alt: "Tanapick screen listing plastic, glass and paper by weight, with estimated points, cash, pickup fee, location and time",
    body: "The trade is visible before the user commits: what they hand over, the estimated points and cash, the pickup fee, the address and the time slot. Sorting comes first, with a 5 kg minimum for pickups other than e-waste.",
  },
  {
    id: "tana-tracking",
    n: "04",
    title: "Track the pickup",
    src: "/tana/tracking.jpg",
    alt: "Tracking screen with a live map, estimated arrival, the ranger's name and rating, and an itemised list of recyclables with values",
    body: "After a ranger accepts, the user sees their position on a map, the arrival window, the ranger's rating and an itemised list of what is being collected, with a value for each line. Nothing about the pickup is a surprise.",
  },
  {
    id: "tana-social",
    n: "05",
    title: "Community",
    src: "/tana/social.jpg",
    alt: "Social screen with Feed, Challenges and Rewards tabs, a post about recycling 43 bottles and a clean-up event post with a Book Event button",
    body: "Feed, Challenges and Rewards in one place. A post can carry an event with a Book Event button, so “a big pile of trash by the bridge” can turn straight into a clean-up other people join.",
  },
];

const TIERS = ["Seed", "Sprout", "Tree", "Forest"];

const LEARNED = [
  "Research was the longest stage and the most useful one. Clear problem definition mattered as much as polished screens.",
  "Messy answers need synthesis. Grouping what people said into three insights is what made the design decisions easy to defend.",
  "Components and auto layout paid off. I rebuilt screens faster and more consistently once the system was in place.",
  "Separating real problems from distractions is a skill. Plenty of good ideas came up that the research did not support.",
];

const DIFFERENTLY = [
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
];

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

const CARD = "rounded-2xl border border-white/10 bg-white/[0.03]";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-fuchsia-400";

/** A process image. Click opens the full-size file in a new tab, since flows and boards have small text. */
function Figure({ src, alt, caption, w, h }: { src: string; alt: string; caption: string; w: number; h: number }) {
  return (
    <figure>
      <a href={src} target="_blank" rel="noreferrer" className={`block rounded-2xl ${FOCUS}`} aria-label={`${alt} (opens full size)`}>
        <img
          src={src}
          alt={alt}
          width={w}
          height={h}
          loading="lazy"
          className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e]"
        />
      </a>
      <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{caption}</figcaption>
    </figure>
  );
}

export default function TanaCaseStudy({ mission }: { mission: Mission }) {
  const index = MISSIONS.findIndex((m) => m.id === mission.id);
  const next = MISSIONS[(index + 1) % MISSIONS.length];

  const meta = [
    ["Role", "Researcher & designer, solo"],
    ["Type", "Concept project"],
    ["Duration", "12 weeks"],
    ["Timeline", "Q3 2024"],
    ["Status", "Not launched"],
  ];

  return (
    <article className="pt-10 pb-16 md:pt-14">
      <a href="/#work" className={`inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 hover:text-zinc-100 ${FOCUS}`}>
        <span aria-hidden>←</span> All work
      </a>

      <header className="mt-8">
        <Label>Case study · Concept project</Label>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-50 md:text-5xl">
          Tana: making recycling visible and rewarding
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
          A 12-week solo concept for a mobile app that connects households, communities and businesses around recycling
          in Indonesia. Nothing shipped. The point was the process: field research, turning messy answers into
          decisions, and building the screens properly.
        </p>
      </header>

      <img
        src="/tana/hero.jpg"
        alt="A hand holding a phone that shows the Tana home screen with points, shortcuts and community posts"
        width={2400}
        height={1080}
        className="mt-10 w-full rounded-2xl border border-white/10 bg-black object-cover"
      />

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 md:grid-cols-5">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
            <dd className="mt-1 text-sm text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title="Why I made it">
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>
            I took this project to learn UI and UX in depth: to get faster and cleaner with auto layout and components,
            and to practise design thinking and problem solving on a problem I had to understand before I could design
            for it.
          </p>
          <p>
            There was no client and no product team, so every decision had to come from something I had gathered myself:
            reading, talking to people, and visiting the places where waste already turns into money.
          </p>
        </div>
      </Section>

      <Section title="The problem" label="Context">
        <dl className="grid gap-4 sm:grid-cols-3">
          {CONTEXT_STATS.map((s) => (
            <div key={s.value} className={`${CARD} p-5`}>
              <dt className="text-4xl font-bold tracking-tight text-zinc-50">{s.value}</dt>
              <dd className="mt-2 text-sm leading-snug text-zinc-400">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-zinc-500">Figures are from the public reports and news I read in 2024.</p>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-zinc-300">
          <p>
            Indonesia generates over 60 million tons of waste a year, and only a small fraction is recycled. Most ends
            up in landfills, rivers or fires, with the pollution and health risks that follow.
          </p>
          <p>
            For individuals, recycling feels inconvenient and unrewarding. Drop-off points are scattered and people
            rarely see the effect of their effort. For businesses, measuring sustainability is costly and unreliable,
            which leaves gaps in ESG reporting.
          </p>
        </div>
        <p className="mt-6 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">
          How might we make recycling convenient, rewarding and trackable for ordinary people, so the waste they already
          produce is treated as a resource?
        </p>
      </Section>

      <Section title="How I researched it" label="Research">
        <p className="text-base leading-relaxed text-zinc-300">
          I combined secondary research with primary research done by myself in and around Jogjakarta. The first told me
          the scale. The second told me what it looks like from the street.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {METHODS.map((m, i) => (
            <li key={m.kind} className={`${CARD} p-5 ${i === METHODS.length - 1 && METHODS.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
              <p className="font-semibold text-zinc-50">{m.kind}</p>
              <p className="mt-1 text-sm text-zinc-500">{m.detail}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{m.found}</p>
            </li>
          ))}
        </ul>

        <div className={`mt-6 ${CARD} p-5`}>
          <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">A note on the evidence</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            I didn't screenshot the interviews or save the survey responses, so I can't show raw data. What follows is my
            synthesis, kept at the size it was: 5 interviews and 10 survey answers are enough to find a direction, not to
            prove one.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-semibold text-zinc-50">What the interviews said</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
              {INTERVIEW_FINDINGS.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-50">What the survey said</h3>
            <figure className="mt-4" aria-label="6 of 10 respondents named e-commerce packaging waste as their biggest challenge">
              <div className="flex gap-2" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={i < 6 ? "size-6 rounded-full bg-fuchsia-400" : "size-6 rounded-full border border-white/15 bg-white/[0.06]"}
                  />
                ))}
              </div>
              <figcaption className="mt-3 text-sm leading-snug text-zinc-300">
                <span className="font-semibold text-zinc-50">6 of 10</span> named packaging waste from e-commerce
                (plastic, cardboard) as their biggest challenge.
              </figcaption>
            </figure>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
              {SURVEY_OTHER.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">
          People want to act, but the options on offer are fragmented, inconvenient and uninspiring.
        </p>
      </Section>

      <Section title="From insight to design" label="Synthesis">
        <p className="text-base leading-relaxed text-zinc-300">
          Grouping everything I had heard gave three insights. Two more findings from the interviews and survey became
          decisions of their own. Each row below points at the screen where the decision shows up.
        </p>
        <ul className="mt-6 space-y-3">
          {INSIGHT_ROWS.map((r) => (
            <li key={r.from} className={`${CARD} grid gap-4 p-5 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-6`}>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">I found</p>
                <p className="mt-1 font-semibold text-zinc-50">{r.from}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.detail}</p>
              </div>
              <span aria-hidden className="hidden pt-6 text-xl text-fuchsia-300 md:block">→</span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">So I designed</p>
                <p className="mt-1 font-semibold text-zinc-50">{r.to}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.toDetail}</p>
                <a
                  href={r.screen}
                  className={`mt-2 inline-block rounded text-sm text-fuchsia-300 underline decoration-fuchsia-300/40 underline-offset-4 hover:text-fuchsia-200 ${FOCUS}`}
                  onClick={(e) => {
                    // The site uses the hash for routing, so scroll to the screen instead of changing it
                    e.preventDefault();
                    document.querySelector(r.screen)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  See the {r.screenLabel.toLowerCase()} screen ↓
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="From sketches to flows" label="Process">
        <p className="text-base leading-relaxed text-zinc-300">
          Before any screen, I sketched the structure on paper and mapped how people would move through it. Both were
          cheap to change, which is why I did them first.
        </p>
        <div className="mt-8 space-y-10">
          <Figure
            src="/tana/sketches.jpg"
            w={1378}
            h={1014}
            alt="A sheet of eight pencil wireframes: home, locate recycle point, scan, social, leaderboard, waste pick-up, voucher and trash alert"
            caption="Eight pencil wireframes on one sheet: home, find a recycle point, scan, social, leaderboard, waste pick-up, voucher and trash alert. This is where the app's shape was decided."
          />
          <Figure
            src="/tana/recycle-flow.jpg"
            w={2000}
            h={440}
            alt="User flow for finding a recycle point: allow location, find the nearest point, walk or drive there, drop off, then collect cash or rewards, with a path for when recycling fails"
            caption="The Recycle Point flow, one of five I mapped. It includes the unhappy paths: location access refused, a point too far to walk, and a drop-off that fails. Click to open full size."
          />
        </div>
      </Section>

      <Section title="The solution" label="Design">
        <p className="text-base leading-relaxed text-zinc-300">
          Tana is a community-driven recycling platform. It connects individual habits to collective impact and, through
          Tanabiz, to business accountability. This page focuses on the individual and community experience.
        </p>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Core loop</p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-4">
            {["Drop off or schedule a pickup", "Earn points", "Progress through tiers", "See your impact"].map((s, i) => (
              <li key={s} className={`${CARD} relative p-4`}>
                <span className="font-mono text-xs text-fuchsia-300">0{i + 1}</span>
                <p className="mt-1 text-sm font-medium text-zinc-100">{s}</p>
                {i < 3 && (
                  <span aria-hidden className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-fuchsia-300 sm:block">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Eco tiers instead of silver, gold, platinum</p>
          <ol className="mt-3 flex items-end gap-2" aria-label="Tiers: Seed, Sprout, Tree, Forest">
            {TIERS.map((t, i) => (
              <li key={t} className="flex-1">
                <div
                  className="rounded-t-lg bg-lime-300/20 ring-1 ring-inset ring-lime-300/30"
                  style={{ height: `${28 + i * 18}px`, opacity: 0.45 + i * 0.18 }}
                  aria-hidden
                />
                <p className="mt-2 text-center text-sm text-zinc-200">{t}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Recycling is framed as growth, for the individual and for the community, rather than as a status ladder.
          </p>
        </div>

        <figure className="mt-10">
          <img
            src="/tana/onboarding.jpg"
            alt="Four onboarding screens: Redefine Recycling, Connect with other like-minded individuals, Schedule a waste picker, Earn points from recycling and challenges"
            width={2000}
            height={1219}
            loading="lazy"
            className="w-full rounded-2xl border border-white/10 bg-black"
          />
          <figcaption className="mt-3 text-sm leading-snug text-zinc-500">
            Onboarding introduces the four things the app does: recycle, connect, schedule a pickup, earn points.
          </figcaption>
        </figure>
      </Section>

      <section className="mt-20" aria-labelledby="tana-screens">
        <Label>Key screens</Label>
        <h2 id="tana-screens" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          The screens, and the decision behind each
        </h2>
        <div className="mt-10 space-y-16">
          {SCREENS.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="grid scroll-mt-24 items-center gap-6 md:grid-cols-2 md:gap-12"
            >
              <img
                src={s.src}
                alt={s.alt}
                width={1110}
                height={1380}
                loading="lazy"
                className={`mx-auto aspect-[4/5] w-full max-w-md rounded-2xl border border-white/10 bg-[#111] object-cover ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{s.n}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">{s.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-300">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Built on a system" label="Foundations">
        <p className="text-base leading-relaxed text-zinc-300">
          This project was my practice ground for auto layout and components. I set type and colour styles first, then
          built each screen from reusable components, so one change carried through the whole file.
        </p>
        <div className="mt-8">
          <Figure
            src="/tana/components.jpg"
            w={1652}
            h={1626}
            alt="A board of Tana components: voucher cards, points header, banner, location search, post cards, leaderboard rows, buttons, logo variants and mascot cards"
            caption="The component board: voucher cards, points header, banners, location search, feed posts, leaderboard rows, buttons and logo variants."
          />
        </div>
      </Section>

      <Section title="The prototype in motion" label="Prototype">
        <p className="text-base leading-relaxed text-zinc-300">
          A 35-second walkthrough of the prototype: scanning and earning points, scheduling a pickup, and organising a
          clean-up from the community feed. The prototype and working files are in Figma.
        </p>
        <video
          className="mt-6 aspect-video w-full rounded-2xl border border-white/10 bg-black"
          src="/tana/prototype.mp4"
          poster="/tana/prototype-poster.jpg"
          controls
          playsInline
          preload="none"
          aria-label="Walkthrough video of the Tana prototype"
        />
      </Section>

      <Section title="Testing it" label="Validation">
        <p className="text-base leading-relaxed text-zinc-300">
          I ran usability tests with five participants. They found the tasks clearer after I iterated on the flow, and
          they engaged strongly with the rewards system.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Five people is a small group and I didn't keep task-level scores, so I'm not quoting success rates.
        </p>
      </Section>

      <Section title="What I learned" label="Reflection">
        <ul className="space-y-4 text-base leading-relaxed text-zinc-300">
          {LEARNED.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What I would do differently">
        <dl className="grid gap-4 sm:grid-cols-2">
          {DIFFERENTLY.map((d) => (
            <div key={d.t} className={`${CARD} p-5`}>
              <dt className="font-semibold text-zinc-50">{d.t}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-400">{d.d}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <details className={`group mt-16 ${CARD} p-5 md:p-6`}>
        <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded ${FOCUS}`}>
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-fuchsia-300">Appendix</span>
            <span className="mt-1 block text-lg font-semibold text-zinc-50">Working files</span>
            <span className="mt-1 block text-sm text-zinc-400">All five user flows, the scan and rewards screens, and the type and colour foundations.</span>
          </span>
          <span aria-hidden className="text-fuchsia-300 transition-transform group-open:rotate-45 text-2xl">+</span>
        </summary>
        <div className="mt-8 space-y-10">
          <Figure
            src="/tana/user-flows.jpg"
            w={2000}
            h={1611}
            alt="Five user flow diagrams: Recycle Point, Waste picker, Trash Alert, Event and Leaderboard"
            caption="All five user flows: Recycle Point, Waste picker, Trash Alert, Event and Leaderboard."
          />
          <Figure
            src="/tana/flow-scan.jpg"
            w={1986}
            h={782}
            alt="Five screens: scan a QR code at a Tanadrop, insert items, two calculating screens, and a result showing points earned"
            caption="Scan and earn: scan the QR at a Tanadrop, insert items, wait while the app calculates, then see points and carbon saved."
          />
          <Figure
            src="/tana/flow-rewards.jpg"
            w={1508}
            h={962}
            alt="Four reward screens: the rewards list, the full list with filters, a voucher detail page and a voucher with a barcode"
            caption="Rewards: points become vouchers, with terms and a barcode for in-store use. Brands and prices are placeholders."
          />
          <Figure
            src="/tana/design-foundations.jpg"
            w={1246}
            h={1042}
            alt="Typography and colour documentation in Satoshi Variable with primary, neutral and semantic colour tokens"
            caption="Foundations: a type scale in Satoshi Variable and colour tokens in three groups, each with a usage note."
          />
        </div>
      </details>

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
          I'm happy to go deeper on the research, the decisions or what I would change.
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
            href="/#work"
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
