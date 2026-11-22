import { useRef } from "react";
import { projectHref, type Mission } from "../constants/missions";
import ProjectThumb from "./ProjectThumb";

export default function MissionCard({ mission, featured }: { mission: Mission; featured: boolean }) {
  const cardRef = useRef<HTMLElement>(null);

  // The pointer is measured on the still wrapper, not on the tilting card, so the tilt can't feed back into itself
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = cardRef.current;
    if (!card) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const tilt = featured ? 6 : 10; // the wide featured card tilts a little less
    card.style.setProperty("--rx", `${((0.5 - py) * tilt).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${((px - 0.5) * tilt * 1.4).toFixed(2)}deg`);
    card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    for (const v of ["--rx", "--ry"]) card.style.setProperty(v, "0deg");
    card.style.setProperty("--gx", "50%");
    card.style.setProperty("--gy", "50%");
  };

  return (
    <div className={`tilt-scene ${featured ? "md:col-span-2" : ""}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <article
        ref={cardRef}
        className={[
          "tilt-card group relative h-full rounded-2xl border border-white/10 bg-[var(--surface)] focus-within:border-fuchsia-400/60",
          featured ? "md:grid md:grid-cols-[1.1fr_1fr]" : "",
        ].join(" ")}
      >
        <ProjectThumb
          mission={mission}
          className={[
            "tilt-layer-thumb w-full border-b border-white/10 aspect-video rounded-t-2xl",
            featured ? "md:h-full md:border-b-0 md:border-r md:rounded-tr-none md:rounded-l-2xl" : "",
          ].join(" ")}
        />
        <div className="tilt-layer-text p-6 md:p-7 flex flex-col">
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
        <div className="tilt-sheen" aria-hidden />
      </article>
    </div>
  );
}
