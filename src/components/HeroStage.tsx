import { useEffect, useRef, useState } from "react";
import HoloShip from "./HoloShip";

import SoulLight from "./SoulLight";
import { createLandmarker, openCamera, runFaceAR, type ArEvent, type TemplateId } from "../lib/faceAR";
import { fill, useContent } from "../i18n";

// The filter names come from the content files (home.demo.filters)
const FILTERS: { id: TemplateId; icon: string }[] = [
  { id: "gum", icon: "🫧" },
  { id: "laser", icon: "⚡" },
];

// Demo head centre (120, 170)
const HEAD = { cx: 120, cy: 250 };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CamState = "off" | "loading" | "on" | "error";

type CamError = "blocked" | "none" | "other";

// The kind of failure, not its wording, so the message follows the language
function cameraErrorKind(err: unknown): CamError {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "blocked";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "none";
  return "other";
}

export default function HeroStage({ onPlayInvaders }: { onPlayInvaders?: () => void }) {
  const d = useContent().home.demo;
  const [filter, setFilter] = useState<TemplateId>("gum");
  const [cam, setCam] = useState<CamState>("off");
  const [camError, setCamError] = useState<CamError | null>(null);
  const [note, setNote] = useState<ArEvent | null>(null); // result of a filter (how big the bubble got)
  const [inView, setInView] = useState(true); // the demo pauses itself when scrolled out of view
  const rootRef = useRef<HTMLDivElement>(null);

  const phoneRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const bracketsRef = useRef<SVGGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, t: 0 });
  const filterRef = useRef<TemplateId>("gum");
  const labelsRef = useRef(d.hud); // read by the camera loop, so switching language updates the canvas text too
  const camOnRef = useRef(false);
  const stopLoopRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runIdRef = useRef(0); // lets a cancelled start ignore results that arrive late

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);
  useEffect(() => {
    labelsRef.current = d.hud;
  }, [d]);
  useEffect(() => {
    camOnRef.current = cam === "on";
  }, [cam]);

  // Demo mode: the fake face follows the cursor, the brackets lag slightly, the phone tilts.
  // With no pointer movement (e.g. touch devices) it drifts on its own.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const phone = phoneRef.current;
      if (!phone) return;
      const r = phone.getBoundingClientRect();
      pointer.current = {
        x: clamp((e.clientX - (r.left + r.width / 2)) / 450, -1, 1),
        y: clamp((e.clientY - (r.top + r.height / 2)) / 450, -1, 1),
        t: performance.now(),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let running = false;
    let fx = 0, fy = 0, bx = 0, by = 0;
    const loop = (now: number) => {
      const live = camOnRef.current; // keep the phone still while the real camera is on
      const active = now - pointer.current.t < 2500;
      const tx = live ? 0 : active ? pointer.current.x : Math.sin(now / 1500) * 0.8;
      const ty = live ? 0 : active ? pointer.current.y : Math.cos(now / 1900) * 0.5;
      fx += (tx - fx) * 0.09;
      fy += (ty - fy) * 0.09;
      bx += (tx - bx) * 0.045;
      by += (ty - by) * 0.045;
      faceRef.current?.setAttribute(
        "transform",
        `translate(${(fx * 4).toFixed(2)} ${(fy * 3).toFixed(2)}) rotate(${(fx * 2.5).toFixed(2)} ${HEAD.cx} ${HEAD.cy})`
      );
      bracketsRef.current?.setAttribute("transform", `translate(${(bx * 4).toFixed(2)} ${(by * 3).toFixed(2)})`);
      if (phoneRef.current) {
        phoneRef.current.style.transform = `perspective(900px) rotateY(${(fx * 9).toFixed(2)}deg) rotateX(${(-fy * 6).toFixed(2)}deg)`;
      }
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.05 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      stop();
    };
  }, []);

  // Track visibility for the rest of the demo (CSS animations, the canvas loops)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stopCamera = () => {
    stopLoopRef.current?.();
    stopLoopRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // Release the camera if the visitor navigates away
  useEffect(() => {
    return () => {
      stopLoopRef.current?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCamera = async () => {
    const runId = ++runIdRef.current;
    const cancelled = () => runIdRef.current !== runId;
    setCam("loading");
    setCamError(null);
    setNote(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      // Ask for the camera first, so a "no" never triggers the model download
      const stream = await openCamera();
      if (cancelled()) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      const { landmarker } = await createLandmarker({ blendshapes: true });
      if (cancelled()) {
        landmarker.close();
        return;
      }
      stopLoopRef.current = runFaceAR({
        video,
        canvas: canvasRef.current!,
        landmarker,
        getTemplate: () => filterRef.current,
        getLabels: () => labelsRef.current,
        onEvent: (e) => setNote(e.kind === "reset" ? null : e),
      });
      setCam("on");
    } catch (err) {
      if (cancelled()) return;
      stopCamera();
      setCam("error");
      setCamError(cameraErrorKind(err));
    }
  };

  const toggleCamera = () => {
    if (cam === "on" || cam === "loading") {
      runIdRef.current++; // cancel any start still in flight
      stopCamera();
      setCam("off");
    } else {
      void startCamera();
    }
  };

  const hint =
    cam === "on"
      ? d.hintOn
      : cam === "error"
        ? camError
          ? d.errors[camError]
          : ""
        : d.hintOff;

  return (
    <div
      ref={rootRef}
      data-paused={!inView}
      className="relative mx-auto"
      // Sized against the viewport width. This used to track the hero's height, back when the stage sat
      // in the hero and its height decided where the work section started; in its own section further
      // down the page there is nothing to fit it into, so it just scales with the column it is given.
      style={{ width: "clamp(200px, 24vw, 280px)" }}
      role="group"
      aria-label={d.group}
    >
      {/* Glow behind the phone */}
      <div
        className="dark-only pointer-events-none absolute -inset-10 -z-10 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.35), rgba(34,211,238,0.12) 60%, transparent 75%)" }}
        aria-hidden
      />

      <div className="relative">
        {/* iPhone-style device: titanium rim, black bezel, dynamic island, side buttons */}
        <div ref={phoneRef} className="hero-phone relative rounded-[2.1rem] p-[3px] will-change-transform"
          style={{ background: "linear-gradient(145deg, #8b8b93 0%, #3a3a40 30%, #1c1c20 55%, #6e6e76 100%)" }}>
          <span aria-hidden className="absolute -left-[3px] top-[17%] h-[5%] w-[3px] rounded-l bg-zinc-600" />
          <span aria-hidden className="absolute -left-[3px] top-[26%] h-[9%] w-[3px] rounded-l bg-zinc-600" />
          <span aria-hidden className="absolute -left-[3px] top-[37%] h-[9%] w-[3px] rounded-l bg-zinc-600" />
          <span aria-hidden className="absolute -right-[3px] top-[30%] h-[14%] w-[3px] rounded-r bg-zinc-600" />
          <div className="rounded-[2rem] bg-black p-[6px]">
            <div className="@container relative overflow-hidden rounded-[1.7rem]">
              <svg viewBox="0 0 240 496" className="block w-full" aria-hidden>
                <defs>
                  <linearGradient id="hs-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#120a1c" />
                    <stop offset="1" stopColor="#07040b" />
                  </linearGradient>
                  <radialGradient id="core-halo" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#d946ef" stopOpacity="0.55" />
                    <stop offset="0.45" stopColor="#a855f7" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="240" height="496" fill="url(#hs-bg)" />

                {/* Pulsating purple energy core. The group follows the cursor a little. */}
                {/* Soft halo behind the 3D orb */}
                <g ref={faceRef}>
                  <circle className="core-anim core-halo" cx="120" cy="223" r="128" fill="url(#core-halo)" />
                </g>
              </svg>

              {/* The soul-absorb light where the camera preview will appear */}
              {cam !== "on" && (
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <SoulLight paused={!inView} />
                </div>
              )}

              <span aria-hidden className="pointer-events-none absolute left-1/2 top-[1.7%] z-10 h-[4.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />

            {/* Camera mode: real video + real face landmarks drawn here */}
            <video ref={videoRef} playsInline muted className="pointer-events-none absolute h-px w-px opacity-0" />
            <canvas
              ref={canvasRef}
              aria-label={d.canvas}
              className={`absolute inset-0 h-full w-full rounded-[1.7rem] ${cam === "on" ? "" : "hidden"}`}
            />
            {cam === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[1.7rem] bg-black/70 px-6 text-center font-mono text-xs text-zinc-200">
                {d.loading}
              </div>
            )}

            <button
              type="button"
              onClick={toggleCamera}
              className={[
                "absolute left-1/2 z-20 inline-flex -translate-x-1/2 cursor-pointer items-center whitespace-nowrap rounded-full border border-white/25 bg-black/55 font-semibold text-white backdrop-blur transition-colors hover:border-fuchsia-300/70 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300",
                cam === "on" ? "top-[8.5%] gap-1.5 px-3 py-1.5 text-[11px]" : "bottom-[6%] gap-2 px-3.5 py-2 text-xs @max-[210px]:gap-1.5 @max-[210px]:px-3 @max-[210px]:text-[11px] @max-[175px]:[&>svg]:hidden",
              ].join(" ")}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              {cam === "loading" ? d.cancel : cam === "on" ? d.stop : d.start}
            </button>
            </div>
          </div>
        </div>

        {/* Easter egg entry: a holographic projection of the game's ship */}
        {onPlayInvaders && (
          <HoloShip onClick={onPlayInvaders} className="absolute left-full top-6 z-10 ml-1 sm:ml-5" />
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-2.5">
        {cam === "on" ? (
          <div role="radiogroup" aria-label={d.filterGroup} className="flex w-[260px] max-w-[92vw] gap-1.5">
            {FILTERS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={filter === t.id}
                onClick={() => {
                  setFilter(t.id);
                  setNote(null);
                }}
                className={[
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400",
                  filter === t.id
                    ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-zinc-100"
                    : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-100",
                ].join(" ")}
              >
                <span aria-hidden className="text-lg leading-none">{t.icon}</span>
                <span className="text-[10px] font-medium">{d.filters[t.id]}</span>
              </button>
            ))}
          </div>
        ) : null}

        {note?.kind === "laser" && (
          <p className="text-center font-mono text-[11px] text-fuchsia-200" role="status">
            {fill(d.laser, { shots: note.shots })}
            <span className="text-zinc-400">{fill(d.laserCharge, { power: Math.round(note.power * 100) })}</span>
          </p>
        )}
        {note?.kind === "gum" && (
          <p className="text-center font-mono text-[11px] text-fuchsia-200" role="status">
            {note.popped ? d.gumPop : d.gumSaved}
            {fill(d.gumSize, { size: note.size.toFixed(1) })}
            {note.best > note.size + 0.05 && (
              <span className="text-zinc-400">{fill(d.gumBest, { best: note.best.toFixed(1) })}</span>
            )}
          </p>
        )}

        <p
          role={cam === "error" ? "alert" : undefined}
          className={`max-w-[260px] text-center font-mono text-[10px] leading-relaxed ${cam === "error" ? "text-amber-300" : "text-zinc-500"}`}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}
