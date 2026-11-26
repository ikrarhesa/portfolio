import { type Mission, projectHref } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import Label from "./Label";
import FilterVideo from "./FilterVideo";
import ProjectThumb from "./ProjectThumb";
import CountUp from "./CountUp";
import { fill, useContent, useMissions } from "../i18n";

/**
 * Shopee Video templates, Malaysia. Everything readable lives in src/i18n/{en,ja}/template.ts; this file keeps the
 * layout and the figures, which are the same in every language.
 *
 * Not available (so not shown): before/after screenshots of the library, a Malaysia-region recording of the flow.
 * TODO(Ikrar): if you remember them, add an example for each trend and what a typical weekly batch held.
 */

// Counted up in the "result" cards. The labels and unit suffixes are in the content (template.result.headline).
// 16,900% is (34,000 - 200) / 200: the growth in weekly template uses over the three months.
// 59% is the dashboard's conversion rate: template videos posted / clicks into the template.
const HEADLINE = [
  { from: 0, to: 16900 },
  { from: 0, to: 15000 },
  { from: 0, to: 59 },
];

// Bar lengths. The labels and the printed values are in the content (template.result.growth), same order.
const GROWTH_VALUES = [200, 7000, 34000];

// The clips behind the three example templates (their names and descriptions are in the content, same order)
const TEMPLATE_CLIPS = [
  { id: "desktop-album", video: "/template/desktop-album.mp4", poster: "/template/desktop-album.jpg" },
  { id: "bento-grid", video: "/template/bento-grid.mp4", poster: "/template/bento-grid.jpg" },
  { id: "windows-like", video: "/template/windows-like.mp4", poster: "/template/windows-like.jpg" },
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
  const r = useContent().template.result;
  const max = Math.max(...GROWTH_VALUES);
  return (
    <figure className="mt-8 max-w-2xl" aria-label={r.growthAria}>
      <figcaption className="text-sm font-medium text-zinc-200">{r.growthCaption}</figcaption>
      <div className="mt-4 space-y-4">
        {r.growth.map((g, i) => (
          <div key={g.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-zinc-400">{g.label}</span>
              <span className="font-semibold tabular-nums text-zinc-50">{g.display}</span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-r bg-white/[0.04]" aria-hidden>
              <div
                className={`h-full rounded-r-[4px] ${i === r.growth.length - 1 ? "bg-fuchsia-400" : "bg-zinc-500"}`}
                style={{ width: `${Math.max(2, (GROWTH_VALUES[i] / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">{r.growthNote}</p>
    </figure>
  );
}

export default function TemplateCaseStudy({ mission }: { mission: Mission }) {
  const t = useContent();
  const c = t.template;
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
          {mission.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">{c.lede}</p>
      </header>

      <ProjectThumb mission={mission} className="mt-10 w-full aspect-video rounded-2xl border border-white/10" />

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 md:grid-cols-5">
        {c.meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
            <dd className="mt-1 text-sm text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>

      <Section title={c.result.title} label={c.result.label}>
        <dl className="grid gap-4 sm:grid-cols-3">
          {c.result.headline.map((h, i) => (
            <div key={h.label} className={`${CARD} p-5`}>
              {/* nowrap: Japanese breaks between any two characters, which split "16,900" from its "%" */}
              <dt className="whitespace-nowrap text-4xl font-bold tracking-tight text-zinc-50">
                <CountUp from={HEADLINE[i].from} to={HEADLINE[i].to} suffix={h.suffix} />
              </dt>
              <dd className="mt-2 text-sm leading-snug text-zinc-400">{h.label}</dd>
            </div>
          ))}
        </dl>
        <GrowthBars />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-400">{c.result.howToRead}</p>
      </Section>

      <Section title={c.problem.title} label={c.problem.label}>
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>{c.problem.p1}</p>
          <p>{c.problem.p2}</p>
        </div>
        <p className="mt-6 border-l-2 border-fuchsia-400 pl-4 text-lg leading-snug text-zinc-100">{c.problem.quote}</p>
      </Section>

      <section className="mt-20" aria-labelledby="flow-heading">
        <Label>{c.purpose.label}</Label>
        <h2 id="flow-heading" className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
          {c.purpose.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">{c.purpose.intro}</p>
        <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,260px)_1fr] lg:gap-14">
          <figure className="w-full max-w-[260px]">
            <FilterVideo src="/template/full-flow.mp4" poster="/template/full-flow.jpg" title={c.purpose.videoTitle} aspect="576 / 1248" />
            <figcaption className="mt-3 text-xs leading-snug text-zinc-500">{c.purpose.videoCaption}</figcaption>
          </figure>
          <ol className="space-y-5">
            {c.purpose.flow.map(([title, body], i) => (
              <li key={title} className="flex gap-4">
                <span className="font-mono text-sm text-fuchsia-300">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold text-zinc-50">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section title={c.role.title} label={c.role.label}>
        <div className="space-y-4 text-base leading-relaxed text-zinc-300">
          <p>{c.role.p1}</p>
          <p>{c.role.p2}</p>
          <p>{c.role.p3}</p>
        </div>
      </Section>

      <Section title={c.turn.title} label={c.turn.label}>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
          <div className="space-y-4 text-base leading-relaxed text-zinc-300">
            <p>{c.turn.p1}</p>
            <p>{c.turn.p2}</p>
          </div>
          <ol className="space-y-4 border-l border-white/15 pl-4">
            {c.turn.timeline.map((it) => (
              <li key={it.when} className="relative">
                <span aria-hidden className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-fuchsia-400" />
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{it.when}</p>
                <p className="mt-1 text-sm leading-snug text-zinc-300">{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <ol className="mt-8 grid gap-4">
          {c.turn.steps.map((st, i) => (
            <li key={st.title} className={`${CARD} flex gap-4 p-5`}>
              <span className="font-mono text-sm text-fuchsia-300">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold text-zinc-50">{st.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={c.research.title} label={c.research.label}>
        <p className="text-base leading-relaxed text-zinc-300">{c.research.intro}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {c.research.trends.map((trend) => (
            <li key={trend} className={`${CARD} p-5`}>
              <p className="font-semibold text-zinc-50">{trend}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-relaxed text-zinc-300">{c.research.outro}</p>
        <figure className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src="/template/library.jpg"
            alt={c.research.libraryAlt}
            width={647}
            height={1400}
            loading="lazy"
            className="w-full max-w-[260px] rounded-2xl border border-white/10 bg-black"
          />
          <figcaption className="max-w-sm text-sm leading-relaxed text-zinc-400">{c.research.libraryCaption}</figcaption>
        </figure>
      </Section>

      <section className="mt-20" aria-labelledby="templates-heading">
        <Label>{c.work.label}</Label>
        <h2 id="templates-heading" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          {c.work.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">{c.work.intro}</p>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {c.work.items.map((item, i) => (
            <figure key={TEMPLATE_CLIPS[i].id} className="w-full max-w-[260px]">
              <FilterVideo src={TEMPLATE_CLIPS[i].video} poster={TEMPLATE_CLIPS[i].poster} title={item.title} />
              <figcaption className="mt-5">
                <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                  {fill(c.work.template, { n: String(i + 1).padStart(2, "0") })}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{item.title}</h3>
                {item.uses && <p className="mt-2 text-sm font-semibold text-zinc-200">{item.uses}</p>}
                {item.share && (
                  <p className="mt-2 border-l-2 border-fuchsia-400 pl-3 text-sm leading-snug text-zinc-300">
                    {item.share}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
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

      <Section title={c.learned.title}>
        <ul className="space-y-4 text-base leading-relaxed text-zinc-300">
          {c.learned.items.map((l) => (
            <li key={l} className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Section>

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
        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-300">{t.project.talkBody}</p>
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
