import { useEffect, useRef, useState } from "react";
import { fill, useContent } from "../i18n";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A phone-shaped looping preview. The video only downloads when it's near the screen, plays while it's
 * in view, and pauses when it isn't. Click/tap toggles play. Reduced-motion users get a still poster
 * until they press play.
 */
export default function FilterVideo({
  src,
  poster,
  title,
  aspect = "540 / 962",
}: {
  src: string;
  poster: string;
  title: string;
  aspect?: string; // CSS aspect-ratio of the clip, "width / height"
}) {
  const t = useContent();
  const wrapRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false); // close enough to start downloading
  const [inView, setInView] = useState(false); // mostly visible
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        setInView(entry.intersectionRatio >= 0.5);
      },
      { rootMargin: "300px", threshold: [0, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = inView && (choice === "play" || (choice === "auto" && !reduce));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near) return;
    if (shouldPlay) video.play().catch(() => {});
    else video.pause();
  }, [shouldPlay, near]);

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={() => setChoice(playing ? "pause" : "play")}
      aria-label={fill(playing ? t.project.video.pause : t.project.video.play, { title })}
      className="group relative block w-full rounded-[2.2rem] border border-fuchsia-400/40 bg-black p-2 text-left shadow-[0_0_50px_rgba(217,70,239,0.18)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(217,70,239,0.32)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-400"
    >
      <div className="relative overflow-hidden rounded-[1.7rem] bg-[#0b0712]" style={{ aspectRatio: aspect }}>
        <video
          ref={videoRef}
          src={near ? src : undefined}
          poster={near ? poster : undefined}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
        {/* Play affordance whenever it isn't playing */}
        {!playing && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25" aria-hidden>
            <span className="flex size-14 items-center justify-center rounded-full border border-white/40 bg-black/50 pl-1 text-xl text-white backdrop-blur transition-transform group-hover:scale-110">
              ▶
            </span>
          </span>
        )}
      </div>
    </button>
  );
}
