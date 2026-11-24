import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A silent looping clip that only downloads near the screen and only plays while visible. */
export default function LoopVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        setInView(entry.intersectionRatio >= 0.4);
      },
      { rootMargin: "300px", threshold: [0, 0.4] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near) return;
    if (inView && !reduce) video.play().catch(() => {});
    else video.pause();
  }, [near, inView, reduce]);

  return (
    <video
      ref={videoRef}
      src={near && !reduce ? src : undefined}
      poster={near ? poster : undefined} // posters load with the video, so off-screen ones don't compete with the page
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={className}
    />
  );
}
