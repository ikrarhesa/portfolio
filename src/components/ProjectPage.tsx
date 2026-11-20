import { MISSIONS, projectHref, type Mission, type StoryVisual } from "../constants/missions";
import { CONTACT } from "../constants/contact";
import { AR_FILTERS } from "../constants/arFilters";
import Label from "./Label";
import ProjectThumb from "./ProjectThumb";
import FilterVideo from "./FilterVideo";

export default function ProjectPage({ mission }: { mission: Mission }) {
  const index = MISSIONS.findIndex((m) => m.id === mission.id);
  const next = MISSIONS[(index + 1) % MISSIONS.length];

  const meta = [
    ["Role", mission.role],
    ["Focus", mission.focus],
    ["Surface", mission.surface],
    ["Status", mission.status],
    ["Year", mission.year],
  ];

  return (
    <article className="pt-10 pb-16 md:pt-14">
      <a
        href="#work"
        className="inline-flex items-center gap-2 rounded py-2 text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
      >
        <span aria-hidden>←</span> All work
      </a>

      <header className="mt-8">
        <Label>Case study · {mission.status}</Label>
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
              alt={`${mission.title} screenshot ${i + 2}`}
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

      {/* AR filters, as evidence */}
      {mission.showArFilters && (
        <section className="mt-20" aria-labelledby="ar-filters-heading">
          <Label>The work</Label>
          <h2 id="ar-filters-heading" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
            AR filters I developed
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            Screen recordings of the effects. Each one reacts to something different, or to nothing at all. They loop while on screen, and a tap pauses or plays.
          </p>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {AR_FILTERS.map((f, i) => (
              <figure key={f.id} className="w-full max-w-[260px]">
                <FilterVideo src={f.video} poster={f.poster} title={f.title} />
                <figcaption className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                    Filter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.blurb}</p>
                  <dl className="mt-3 space-y-1.5 text-xs">
                    {f.purpose && (
                      <div className="flex gap-2">
                        <dt className="w-14 shrink-0 font-mono uppercase tracking-widest text-zinc-500">Why</dt>
                        <dd className="text-zinc-300">{f.purpose}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="w-14 shrink-0 font-mono uppercase tracking-widest text-zinc-500">Trigger</dt>
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
          <h2 className="text-xl font-semibold text-zinc-50">Results</h2>
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
          <h2 className="text-xl font-semibold text-zinc-50">What I learned</h2>
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
            className="inline-block rounded py-2 text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
          >
            ← All work
          </a>
        </div>
      </section>

      {MISSIONS.length > 1 && (
        <a
          href={projectHref(next.id)}
          className="mt-8 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-fuchsia-400/50 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
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
