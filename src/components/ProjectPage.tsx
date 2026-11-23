import { projectHref, type Mission, type StoryVisual } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import { fill, useArFilters, useContent, useMissions } from "../i18n";
import Label from "./Label";
import ProjectThumb from "./ProjectThumb";
import FilterVideo from "./FilterVideo";
import TanaCaseStudy from "./TanaCaseStudy";
import TemplateCaseStudy from "./TemplateCaseStudy";

export default function ProjectPage({ mission }: { mission: Mission }) {
  const t = useContent();
  const p = t.project;
  const missions = useMissions();
  const filters = useArFilters();
  if (mission.id === "tana") return <TanaCaseStudy mission={mission} />;
  if (mission.id === "template") return <TemplateCaseStudy mission={mission} />;

  const index = missions.findIndex((m) => m.id === mission.id);
  const next = missions[(index + 1) % missions.length];

  const meta = [
    [p.meta.role, mission.role],
    [p.meta.focus, mission.focus],
    [p.meta.surface, mission.surface],
    [p.meta.status, mission.status],
    [p.meta.year, mission.year],
  ];

  return (
    <article className="pt-10 pb-16 md:pt-14">
      <a
        href="/#work"
        className="inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
      >
        <span aria-hidden>←</span> {t.shell.common.allWork}
      </a>

      <header className="mt-8">
        <Label>{fill(p.caseStudy, { status: mission.status })}</Label>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-50 md:text-5xl">
          {mission.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">{mission.summary}</p>
      </header>

      <ProjectThumb mission={mission} className="mt-10 w-full aspect-video rounded-2xl border border-white/10" />

      {mission.gallery && mission.gallery.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {mission.gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={fill(p.screenshotAlt, { title: mission.title, n: i + 2 })}
              loading="lazy"
              className="w-full rounded-xl border border-white/10 bg-black/40 object-contain"
            />
          ))}
        </div>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/10 py-6 md:grid-cols-5">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
            <dd className="mt-1 text-sm text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Case-study narrative: every section keeps its visual next to the text */}
      {mission.story?.map((section) => (
        <section key={section.title} className="mt-14 grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
          <h2 className="text-xl font-semibold text-zinc-50">{section.title}</h2>
          <div className={section.visual ? "grid items-start gap-6 lg:grid-cols-[1fr_240px] lg:gap-8" : ""}>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {section.visual && <Visual visual={section.visual} />}
          </div>
        </section>
      ))}

      {/* The numbered moves: one group, so 1-2-3 reads as steps rather than as unrelated sections */}
      {mission.moves && mission.moves.length > 0 && (
        <section className="mt-14 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-10" aria-labelledby="moves-heading">
          <div>
            <Label>{p.moves.label}</Label>
            <h2 id="moves-heading" className="mt-2 text-xl font-semibold text-zinc-50">
              {fill(p.moves.heading, { n: mission.moves.length })}
            </h2>
            {mission.movesIntro && <p className="mt-3 text-sm leading-relaxed text-zinc-400">{mission.movesIntro}</p>}
          </div>
          <div className="min-w-0 space-y-5">
            <ol className="space-y-5">
              {mission.moves.map((m, i) => (
                <li
                  key={m.title}
                  className="grid items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-[1fr_190px] md:p-6"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                      {fill(p.moves.move, { n: String(i + 1).padStart(2, "0") })}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{m.title}</h3>
                    <div className="mt-3 space-y-3 text-base leading-relaxed text-zinc-300">
                      {m.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                  <figure className="mx-auto w-full max-w-[190px] sm:mx-0">
                    <img
                      src={m.image.src}
                      alt={m.image.alt}
                      loading="lazy"
                      className="w-full rounded-xl border border-white/10 bg-black/40 object-cover"
                    />
                    <figcaption className="mt-2 text-xs leading-snug text-zinc-500">{m.image.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ol>

            {mission.process && (
              <div className="rounded-2xl border border-white/10 p-5 md:p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">{mission.process.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{mission.process.body}</p>
                <ol className="mt-4 flex flex-wrap items-center gap-2">
                  {mission.process.steps.map((st, i) => (
                    <li key={st} className="flex items-center gap-2">
                      {i > 0 && (
                        <span aria-hidden className="text-zinc-500">
                          →
                        </span>
                      )}
                      <span className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-zinc-200">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {/* AR filters, as evidence */}
      {mission.showArFilters && (
        <section className="mt-20" aria-labelledby="ar-filters-heading">
          <Label>{p.filters.label}</Label>
          <h2 id="ar-filters-heading" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
            {p.filters.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            {p.filters.intro}
          </p>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filters.map((f, i) => (
              <figure key={f.id} className="w-full max-w-[260px]">
                <FilterVideo src={f.video} poster={f.poster} title={f.title} />
                <figcaption className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                    {fill(p.filters.filter, { n: String(i + 1).padStart(2, "0") })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.blurb}</p>
                  <dl className="mt-3 space-y-1.5 text-xs">
                    {f.purpose && (
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 font-mono uppercase tracking-widest text-zinc-500">{p.filters.why}</dt>
                        <dd className="text-zinc-300">{f.purpose}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="w-14 shrink-0 font-mono uppercase tracking-widest text-zinc-500">{p.filters.trigger}</dt>
                      <dd className="text-zinc-300">{f.trigger}</dd>
                    </div>
                  </dl>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <li key={t} className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300">
                        {t}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {mission.results && mission.results.length > 0 && (
        <section className="mt-20 grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
          <h2 className="text-xl font-semibold text-zinc-50">{p.results}</h2>
          <div>
            <dl className="grid gap-8 sm:grid-cols-2">
              {mission.results.map((r) => (
                <div key={r.label} className="border-t border-fuchsia-400/40 pt-4">
                  <dt className="text-4xl font-bold tracking-tight text-zinc-50">{r.value}</dt>
                  <dd className="mt-2 text-sm leading-snug text-zinc-400">{r.label}</dd>
                </div>
              ))}
            </dl>

            {mission.chart && <BeforeAfterBars chart={mission.chart} />}

            {mission.resultsNote && (
              <div className="mt-8 max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-400">
                {mission.resultsNote.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {mission.learnings && mission.learnings.length > 0 && (
        <section className="mt-20 grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
          <h2 className="text-xl font-semibold text-zinc-50">{p.learned}</h2>
          <ul className="space-y-4 text-base leading-relaxed text-zinc-300">
            {mission.learnings.map((l) => (
              <li key={l} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">{t.shell.common.toolsSkills}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {mission.stack.map((t) => (
            <span key={t} className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-zinc-300">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{t.shell.common.wantToTalk}</h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-300">
          {p.talkBody}
        </p>
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
            className="inline-block rounded py-2 text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
          >
            ← {t.shell.common.allWork}
          </a>
        </div>
      </section>

      {missions.length > 1 && (
        <a
          href={projectHref(next.id)}
          className="mt-8 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-fuchsia-400/50 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
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

/** Two horizontal bars: gray for "before", the accent colour for "after". Values are labelled directly. */
function BeforeAfterBars({ chart }: { chart: NonNullable<Mission["chart"]> }) {
  const max = Math.max(...chart.bars.map((b) => b.value));
  return (
    <figure className="mt-10 max-w-2xl" aria-label={chart.title}>
      <figcaption className="text-sm font-medium text-zinc-200">{chart.title}</figcaption>
      <div className="mt-4 space-y-4">
        {chart.bars.map((b, i) => (
          <div key={b.label} title={`${b.label}: ${b.display}`}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-zinc-400">{b.label}</span>
              <span className="font-semibold tabular-nums text-zinc-50">{b.display}</span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-r bg-white/[0.04]" aria-hidden>
              <div
                className={`h-full rounded-r-[4px] ${i === chart.bars.length - 1 ? "bg-fuchsia-400" : "bg-zinc-500"}`}
                style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">{chart.note}</p>
      <table className="sr-only">
        <caption>{chart.title}</caption>
        <tbody>
          {chart.bars.map((b) => (
            <tr key={b.label}>
              <th scope="row">{b.label}</th>
              <td>{b.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Small visuals that sit beside a story section */
function Visual({ visual }: { visual: StoryVisual }) {
  if (visual.type === "image") {
    return (
      <figure className="mx-auto w-full max-w-[240px] lg:mx-0">
        <img
          src={visual.src}
          alt={visual.alt}
          loading="lazy"
          className="w-full rounded-xl border border-white/10 bg-black/40 object-cover"
        />
        <figcaption className="mt-2 text-xs leading-snug text-zinc-500">{visual.caption}</figcaption>
      </figure>
    );
  }
  if (visual.type === "stat") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-5xl font-bold tracking-tight text-zinc-50">{visual.value}</p>
        <p className="mt-2 text-sm leading-snug text-zinc-400">{visual.label}</p>
      </div>
    );
  }
  if (visual.type === "timeline") {
    return (
      <ol className="space-y-4 border-l border-white/15 pl-4">
        {visual.items.map((it) => (
          <li key={it.when} className="relative">
            <span aria-hidden className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-fuchsia-400" />
            <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">{it.when}</p>
            <p className="mt-1 text-sm leading-snug text-zinc-300">{it.text}</p>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <figure className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3" role="img" aria-label={visual.note}>
        {Array.from({ length: visual.count }, (_, i) => (
          <span
            key={i}
            className={
              i === 0
                ? "size-9 rounded-full bg-fuchsia-400 ring-4 ring-fuchsia-400/25"
                : "size-9 rounded-full border border-white/15 bg-white/[0.06]"
            }
          />
        ))}
      </div>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-fuchsia-300">{visual.mine}</p>
      <figcaption className="mt-1 text-sm leading-snug text-zinc-400">{visual.note}</figcaption>
    </figure>
  );
}
