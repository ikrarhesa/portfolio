import { MISSIONS, projectHref, type Mission } from "../constants/missions";
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
        className="inline-flex items-center gap-2 rounded text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
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

      {/* Case-study narrative */}
      {mission.story?.map((section) => (
        <section key={section.title} className="mt-14 grid gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
          <h2 className="text-xl font-semibold text-zinc-50">{section.title}</h2>
          <div className="space-y-4 text-base leading-relaxed text-zinc-300">
            {section.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      {/* AR filters, as evidence */}
      {mission.showArFilters && (
        <section className="mt-16" aria-labelledby="ar-filters-heading">
          <Label>The work</Label>
          <h2 id="ar-filters-heading" className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
            AR filters I developed
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            A selection of the filters, shown as screen recordings from the preview tool. Each one loops while it's on
            screen. Tap a phone to pause or play.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-14">
            {AR_FILTERS.map((f, i) => (
              <figure key={f.id} className="w-[240px]">
                <FilterVideo src={f.video} poster={f.poster} title={f.title} />
                <figcaption className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                    Filter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.blurb}</p>
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
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-zinc-50">Results</h2>
          <dl className={`mt-6 grid gap-8 ${mission.results.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {mission.results.map((r) => (
              <div key={r.label} className="border-t border-fuchsia-400/40 pt-4">
                <dt className="text-4xl font-bold tracking-tight text-zinc-50">{r.value}</dt>
                <dd className="mt-2 text-sm leading-snug text-zinc-400">{r.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-16 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <section>
          <h2 className="text-xl font-semibold text-zinc-50">What I did</h2>
          <ul className="mt-5 space-y-4 text-base leading-relaxed text-zinc-300">
            {mission.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-zinc-50">Tools &amp; skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {mission.stack.map((t) => (
              <span key={t} className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-zinc-300">
                {t}
              </span>
            ))}
          </div>
        </section>
      </div>

      {MISSIONS.length > 1 && (
        <a
          href={projectHref(next.id)}
          className="mt-16 block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-fuchsia-400/50 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
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
