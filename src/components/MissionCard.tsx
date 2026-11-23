import { useRef } from "react";
import { projectHref, type Mission } from "../constants/missions";
import ProjectThumb from "./ProjectThumb";
import { useContent } from "../i18n";

export default function MissionCard({ mission, featured }: { mission: Mission; featured: boolean }) {
  const t = useContent();
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
          featured ? "md:grid md:grid-cols-[1.1fr_1fr]" : "flex flex-col",
        ].join(" ")}
      >
        <ProjectThumb
          mission={mission}
          className={[
            "tilt-layer-thumb w-full border-b border-white/10 aspect-video rounded-t-2xl",
            featured ? "md:h-full md:border-b-0 md:border-r md:rounded-tr-none md:rounded-l-2xl" : "",
          ].join(" ")}
        />
        <div className="tilt-layer-text p-6 md:p-7 flex flex-col flex-1">
          <p className="font-mono text-xs text-fuchsia-300">{mission.status}</p>
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
          {/* Looks like a button; the stretched title link above is the real (single) tab stop */}
          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(217,70,239,0.3)] transition-colors group-hover:bg-fuchsia-400 group-focus-within:bg-fuchsia-400">
              {t.home.work.viewCase}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
        <div className="tilt-sheen" aria-hidden />
      </article>
    </div>
  );
}
