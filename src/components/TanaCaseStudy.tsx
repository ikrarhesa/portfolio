import { type Mission, projectHref } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import Label from "./Label";
import { fill, useContent, useMissions } from "../i18n";

/**
 * Tana case study. Everything readable lives in src/i18n/{en,ja}/tana.ts; this file keeps the layout and the
 * language-neutral values (figures, file paths, ids). Lists in the content are in the same order as the lists here.
 */

const CONTEXT_STAT_VALUES = ["#2", "<10%", "2026"];

// Where each "I found → So I designed" row points (same order as tana.synthesis.rows)
const ROW_SCREENS = ["#tana-home", "#tana-social", "#tana-pickup", "#tana-drop", "#tana-tracking"];

// The five key screens (titles, alt text and descriptions are in tana.screens.items, same order)
const SCREENS = [
  { id: "tana-home", n: "01", src: "/tana/home.jpg" },
  { id: "tana-drop", n: "02", src: "/tana/tanadrop.jpg" },
  { id: "tana-pickup", n: "03", src: "/tana/tanapick.jpg" },
  { id: "tana-tracking", n: "04", src: "/tana/tracking.jpg" },
  { id: "tana-social", n: "05", src: "/tana/social.jpg" },
];

// Same order as tana.appendix.figures
const APPENDIX = [
  { src: "/tana/user-flows.jpg", w: 2000, h: 1611 },
  { src: "/tana/flow-scan.jpg", w: 1986, h: 782 },
  { src: "/tana/flow-rewards.jpg", w: 1508, h: 962 },
  { src: "/tana/design-foundations.jpg", w: 1246, h: 1042 },
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
  const opensFull = useContent().tana.process.opensFull;
  return (
    <figure>
      <a href={src} target="_blank" rel="noreferrer" className={`block rounded-2xl ${FOCUS}`} aria-label={fill(opensFull, { alt })}>
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
  const t = useContent();
  const c = t.tana;
  const missions = useMissions();
  const index = missions.findIndex((m) => m.id === mission.id);
  const next = missions[(index + 1) % missions.length];

  return (
    <article className="pt-10 pb-16 md:pt-14">
      <a href="/#work" className={`inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 hover:text-zinc-100 ${FOCUS}`}>
        <span aria-hidden>←</span> {t.shell.common.allWork}
      </a>

      <header className="mt-8">
        <Label>{c.caseLabel}</Label>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-50 md:text-5xl">
          {c.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">{c.lede}</p>
      </header>

      <img
        src="/tana/hero.jpg"
        alt={c.heroAlt}
        width={2400}
        height={1080}
        className="mt-10 w-full rounded-2xl border border-white/10 bg-black object-cover"
      />

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 md:grid-cols-5">
        {c.meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
            <dd className="mt-1 text-sm text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title={c.why.title}>
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>{c.why.p1}</p>
          <p>{c.why.p2}</p>
        </div>
      </Section>

      <Section title={c.problem.title} label={c.problem.label}>
        <dl className="grid gap-4 sm:grid-cols-3">
          {c.problem.stats.map((s, i) => (
            <div key={CONTEXT_STAT_VALUES[i]} className={`${CARD} p-5`}>
              <dt className="text-4xl font-bold tracking-tight text-zinc-50">{CONTEXT_STAT_VALUES[i]}</dt>
              <dd className="mt-2 text-sm leading-snug text-zinc-400">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-zinc-500">{c.problem.sources}</p>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-zinc-300">
          <p>{c.problem.p1}</p>
          <p>{c.problem.p2}</p>
        </div>
        <p className="mt-6 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">{c.problem.quote}</p>
      </Section>

      <Section title={c.research.title} label={c.research.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.research.intro}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {c.research.methods.map((m, i) => (
            <li
              key={m.kind}
              className={`${CARD} p-5 ${i === c.research.methods.length - 1 && c.research.methods.length % 2 === 1 ? "sm:col-span-2" : ""}`}
            >
              <p className="font-semibold text-zinc-50">{m.kind}</p>
              <p className="mt-1 text-sm text-zinc-500">{m.detail}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{m.found}</p>
            </li>
          ))}
        </ul>

        <div className={`mt-6 ${CARD} p-5`}>
          <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{c.research.noteLabel}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.research.note}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-semibold text-zinc-50">{c.research.interviewsHeading}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
              {c.research.interviewFindings.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-50">{c.research.surveyHeading}</h3>
            <figure className="mt-4" aria-label={c.research.surveyAria}>
              <div className="flex gap-2" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={i < 6 ? "size-6 rounded-full bg-fuchsia-400" : "size-6 rounded-full border border-white/15 bg-white/[0.06]"}
                  />
                ))}
              </div>
              <figcaption className="mt-3 text-sm leading-snug text-zinc-300">
                <span className="font-semibold text-zinc-50">{c.research.surveyStrong}</span>
                {c.research.surveyRest}
              </figcaption>
            </figure>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
              {c.research.surveyOther.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">{c.research.quote}</p>
      </Section>

      <Section title={c.synthesis.title} label={c.synthesis.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.synthesis.intro}</p>
        <ul className="mt-6 space-y-3">
          {c.synthesis.rows.map((r, i) => (
            <li key={r.from} className={`${CARD} grid gap-4 p-5 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-6`}>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">{c.synthesis.found}</p>
                <p className="mt-1 font-semibold text-zinc-50">{r.from}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.detail}</p>
              </div>
              <span aria-hidden className="hidden pt-6 text-xl text-fuchsia-300 md:block">→</span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{c.synthesis.designed}</p>
                <p className="mt-1 font-semibold text-zinc-50">{r.to}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.toDetail}</p>
                <a
                  href={ROW_SCREENS[i]}
                  className={`mt-2 inline-block rounded text-sm text-fuchsia-300 underline decoration-fuchsia-300/40 underline-offset-4 hover:text-fuchsia-200 ${FOCUS}`}
                  onClick={(e) => {
                    // Scroll to the screen on this page instead of letting the browser change the URL
                    e.preventDefault();
                    document.querySelector(ROW_SCREENS[i])?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {fill(c.synthesis.seeScreen, { screen: r.screenLabel.toLowerCase() })}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={c.process.title} label={c.process.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.process.intro}</p>
        <div className="mt-8 space-y-10">
          <Figure src="/tana/sketches.jpg" w={1378} h={1014} alt={c.process.sketchesAlt} caption={c.process.sketchesCaption} />
          <Figure src="/tana/recycle-flow.jpg" w={2000} h={440} alt={c.process.flowAlt} caption={c.process.flowCaption} />
        </div>
      </Section>

      <Section title={c.solution.title} label={c.solution.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.solution.intro}</p>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">{c.solution.loopLabel}</p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-4">
            {c.solution.loop.map((s, i) => (
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
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">{c.solution.tiersLabel}</p>
          <ol className="mt-3 flex items-end gap-2" aria-label={c.solution.tiersAria}>
            {c.solution.tiers.map((tier, i) => (
              <li key={tier} className="flex-1">
                <div
                  className="rounded-t-lg bg-lime-300/20 ring-1 ring-inset ring-lime-300/30"
                  style={{ height: `${28 + i * 18}px`, opacity: 0.45 + i * 0.18 }}
                  aria-hidden
                />
                <p className="mt-2 text-center text-sm text-zinc-200">{tier}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.solution.tiersNote}</p>
        </div>

        <figure className="mt-10">
          <img
            src="/tana/onboarding.jpg"
            alt={c.solution.onboardingAlt}
            width={2000}
            height={1219}
            loading="lazy"
            className="w-full rounded-2xl border border-white/10 bg-black"
          />
          <figcaption className="mt-3 text-sm leading-snug text-zinc-500">{c.solution.onboardingCaption}</figcaption>
        </figure>
      </Section>

      <section className="mt-20" aria-labelledby="tana-screens">
        <Label>{c.screens.label}</Label>
        <h2 id="tana-screens" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          {c.screens.heading}
        </h2>
        <div className="mt-10 space-y-16">
          {c.screens.items.map((item, i) => (
            <div
              key={SCREENS[i].id}
              id={SCREENS[i].id}
              className="grid scroll-mt-24 items-center gap-6 md:grid-cols-2 md:gap-12"
            >
              <img
                src={SCREENS[i].src}
                alt={item.alt}
                width={1110}
                height={1380}
                loading="lazy"
                className={`mx-auto aspect-[4/5] w-full max-w-md rounded-2xl border border-white/10 bg-[#111] object-cover ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{SCREENS[i].n}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">{item.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-300">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Section title={c.foundations.title} label={c.foundations.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.foundations.intro}</p>
        <div className="mt-8">
          <Figure src="/tana/components.jpg" w={1652} h={1626} alt={c.foundations.alt} caption={c.foundations.caption} />
        </div>
      </Section>

      <Section title={c.prototype.title} label={c.prototype.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.prototype.intro}</p>
        <video
          className="mt-6 aspect-video w-full rounded-2xl border border-white/10 bg-black"
          src="/tana/prototype.mp4"
          poster="/tana/prototype-poster.jpg"
          controls
          playsInline
          preload="none"
          aria-label={c.prototype.videoAria}
        />
      </Section>

      <Section title={c.testing.title} label={c.testing.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.testing.p1}</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">{c.testing.p2}</p>
      </Section>

      <Section title={c.learned.title} label={c.learned.label}>
        <ul className="space-y-4 text-base leading-relaxed text-zinc-300">
          {c.learned.items.map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={c.differently.title}>
        <dl className="grid gap-4 sm:grid-cols-2">
          {c.differently.items.map((d) => (
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
            <span className="block font-mono text-xs uppercase tracking-widest text-fuchsia-300">{c.appendix.label}</span>
            <span className="mt-1 block text-lg font-semibold text-zinc-50">{c.appendix.heading}</span>
            <span className="mt-1 block text-sm text-zinc-400">{c.appendix.blurb}</span>
          </span>
          <span aria-hidden className="text-fuchsia-300 transition-transform group-open:rotate-45 text-2xl">+</span>
        </summary>
        <div className="mt-8 space-y-10">
          {c.appendix.figures.map((f, i) => (
            <Figure key={APPENDIX[i].src} src={APPENDIX[i].src} w={APPENDIX[i].w} h={APPENDIX[i].h} alt={f.alt} caption={f.caption} />
          ))}
        </div>
      </details>

      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">{t.shell.common.toolsSkills}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {mission.stack.map((s) => (
            <span key={s} className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-zinc-300">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{t.shell.common.wantToTalk}</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-300">{c.talkBody}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {CONTACT.email && (
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
            >
              {t.shell.common.getInTouch}
            </a>
          )}
          <a
            href="/#work"
            className={`inline-block rounded py-2 text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white hover:decoration-fuchsia-300 ${FOCUS}`}
          >
            ← {t.shell.common.allWork}
          </a>
        </div>
      </section>

      {missions.length > 1 && (
        <a
          href={projectHref(next.id)}
          className={`mt-8 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-fuchsia-400/50 ${FOCUS}`}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">{t.shell.common.nextProject}</p>
          <p className="mt-2 flex items-center justify-between gap-4 text-xl font-semibold text-zinc-50">
            {next.title}
            <span aria-hidden className="text-fuchsia-300">→</span>
          </p>
        </a>
      )}
    </article>
  );
}
