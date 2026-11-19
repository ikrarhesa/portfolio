import type { Mission } from "../constants/missions";
import LoopVideo from "./LoopVideo";

/** Three looping phone clips, staggered, for projects that have AR/video footage */
function ClipCollage({ mission, className }: { mission: Mission; className: string }) {
  const clips = mission.cover ?? [];
  return (
    <div
      className={`relative flex items-center justify-center gap-[3%] overflow-hidden bg-gradient-to-br from-[#2a1238] via-[#140a1f] to-[#07060b] ${className}`}
      role="img"
      aria-label={`${mission.title}: looping previews of AR filters`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(217,70,239,0.28), transparent 62%)" }}
        aria-hidden
      />
      {clips.map((clip, i) => {
        const center = i === Math.floor(clips.length / 2);
        return (
          <div
            key={clip.video}
            className={[
              "relative aspect-[540/962] shrink-0 overflow-hidden rounded-[10%/5.6%] border border-fuchsia-300/40 bg-black shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
              center ? "h-[88%] z-10 shadow-[0_0_40px_rgba(217,70,239,0.35)]" : "h-[72%] opacity-90",
            ].join(" ")}
          >
            <LoopVideo src={clip.video} poster={clip.poster} className="h-full w-full object-cover" />
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectThumb({ mission, className = "" }: { mission: Mission; className?: string }) {
  if (mission.cover?.length) return <ClipCollage mission={mission} className={className} />;
  if (mission.image) {
    const contain = mission.imageFit === "contain";
    return (
      <div className={`overflow-hidden bg-gradient-to-br from-[#1a0f24] to-[#07060b] ${className}`}>
        <img
          src={mission.image}
          alt={`${mission.title} screenshot`}
          loading="lazy"
          className={`h-full w-full ${contain ? "object-contain p-4" : "object-cover object-top"}`}
        />
      </div>
    );
  }
  // No footage or screenshot yet: a calm neutral panel instead of illustration clutter
  return (
    <div
      role="img"
      aria-label={`${mission.title} preview coming soon`}
      className={`bg-gradient-to-br from-[#1a0f24] to-[#07060b] ${className}`}
    />
  );
}
