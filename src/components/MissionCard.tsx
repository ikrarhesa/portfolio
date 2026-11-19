import { projectHref, type Mission } from "../constants/missions";
import ProjectThumb from "./ProjectThumb";

export default function MissionCard({ mission, featured }: { mission: Mission; featured: boolean }) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-fuchsia-400/50 focus-within:border-fuchsia-400/60",
        featured ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]" : "",
      ].join(" ")}
    >
      <ProjectThumb
        mission={mission}
        className={`w-full border-b border-white/10 aspect-video ${featured ? "md:h-full md:border-b-0 md:border-r" : ""}`}
      />
      <div className="p-6 md:p-7 flex flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-zinc-400">
          <span className="text-fuchsia-300">{mission.status}</span>
          <span aria-hidden>·</span>
          <span>{mission.year}</span>
          <span aria-hidden>·</span>
          <span>{mission.surface}</span>
        </div>
        <h3 className={`mt-3 font-semibold tracking-tight text-zinc-50 ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
          {/* Stretched link: the whole card is clickable, one tab stop */}
          <a
            href={projectHref(mission.id)}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {mission.title}
          </a>
        </h3>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">{mission.summary}</p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-fuchsia-300 group-hover:text-fuchsia-200">
          View case study
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      </div>
    </article>
  );
}
