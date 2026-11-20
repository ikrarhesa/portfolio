import { useEffect, useRef, useState } from "react";
import HoloShip from "./HoloShip";
import { createLandmarker, openCamera, runFaceAR, type ArEvent, type TemplateId } from "../lib/faceAR";

const TEMPLATES: { id: TemplateId; label: string; icon: string; hint: string }[] = [
  { id: "cat", label: "Cutie Bear", icon: "🧸", hint: "Smile and raise your brows" },
  { id: "wish", label: "Make a wish", icon: "🎂", hint: "Open your mouth to blow the candles" },
  { id: "match", label: "Face Match", icon: "😜", hint: "Copy the doodle face in time" },
];

// Demo head centre (120, 170)
const HEAD = { cx: 120, cy: 170, rx: 48, ry: 62 };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CamState = "off" | "loading" | "on" | "error";

function describeCameraError(err: unknown) {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Camera access was blocked. Allow it in your browser's site settings to try this.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No camera found on this device.";
  return "Couldn't start face tracking on this device. The animated demo still works.";
}

export default function HeroStage({ onPlayInvaders }: { onPlayInvaders?: () => void }) {
  const [template, setTemplate] = useState<TemplateId>("cat");
  const [auto, setAuto] = useState(true);
  const [cam, setCam] = useState<CamState>("off");
  const [camMsg, setCamMsg] = useState("");
  const [hovering, setHovering] = useState(false);
  const [note, setNote] = useState<ArEvent | null>(null); // result of a filter (wish granted, match score)
  const [inView, setInView] = useState(true); // the demo pauses itself when scrolled out of view
  const rootRef = useRef<HTMLDivElement>(null);

  const phoneRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const bracketsRef = useRef<SVGGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, t: 0 });
  const templateRef = useRef<TemplateId>("cat");
  const camOnRef = useRef(false);
  const stopLoopRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runIdRef = useRef(0); // lets a cancelled start ignore results that arrive late

  useEffect(() => {
    templateRef.current = template;
  }, [template]);
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
        `translate(${(fx * 24).toFixed(2)} ${(fy * 14).toFixed(2)}) rotate(${(fx * 7).toFixed(2)} ${HEAD.cx} ${HEAD.cy})`
      );
      bracketsRef.current?.setAttribute("transform", `translate(${(bx * 24).toFixed(2)} ${(by * 14).toFixed(2)})`);
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

  // Track visibility for the rest of the demo (template cycling, CSS animations)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cycle templates on its own until the visitor picks one
  useEffect(() => {
    if (!auto || cam !== "off" || hovering || !inView || prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setTemplate((t) => TEMPLATES[(TEMPLATES.findIndex((x) => x.id === t) + 1) % TEMPLATES.length].id);
    }, 4200);
    return () => clearInterval(timer);
  }, [auto, cam, hovering, inView]);

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
    setCamMsg("");
    setAuto(false);
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
        getTemplate: () => templateRef.current,
        onEvent: (e) => setNote(e.kind === "reset" ? null : e),
      });
      setCam("on");
    } catch (err) {
      if (cancelled()) return;
      stopCamera();
      setCam("error");
      setCamMsg(describeCameraError(err));
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

  const current = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];
  const hint =
    cam === "on"
      ? "Runs on your device. Your video never leaves this browser."
      : cam === "error"
        ? camMsg
        : "On your device. Nothing uploaded.";

  return (
    <div
      ref={rootRef}
      data-paused={!inView}
      className="relative mx-auto"
      // Width follows the viewport height (phone + controls take roughly 24rem of height plus 1.75 × width), capped for big screens
      style={{ width: "clamp(180px, calc((100svh - 24.5rem) / 1.75), 270px)" }}
      role="group"
      aria-label="Interactive AR template demo"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* Glow behind the phone */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.35), rgba(34,211,238,0.12) 60%, transparent 75%)" }}
        aria-hidden
      />

      <div className="relative">
        <div
          ref={phoneRef}
          className="rounded-[2.2rem] border border-fuchsia-400/40 bg-black p-2 shadow-[0_0_60px_rgba(217,70,239,0.14)] will-change-transform"
        >
          <div className="relative">
            <svg viewBox="0 0 240 420" className="block w-full rounded-[1.7rem]" aria-hidden>
              <defs>
                <linearGradient id="hs-bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2a1238" />
                  <stop offset="1" stopColor="#0a0610" />
                </linearGradient>
                <linearGradient id="hs-skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#5b3a78" />
                  <stop offset="1" stopColor="#2b1a40" />
                </linearGradient>
                <linearGradient id="hs-ear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#a06b48" />
                  <stop offset="0.6" stopColor="#8a5a3b" />
                  <stop offset="1" stopColor="#8a5a3b" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hs-ear-in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f8c9cf" />
                  <stop offset="0.6" stopColor="#ee9fae" />
                  <stop offset="1" stopColor="#ee9fae" stopOpacity="0" />
                </linearGradient>
                <pattern id="hs-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.9" fill="#e879f9" opacity="0.2" />
                </pattern>
                <filter id="hs-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="240" height="420" fill="url(#hs-bg)" />
              <rect width="240" height="420" fill="url(#hs-dots)" />

              {/* Demo figure + template effects, all moving together */}
              <g ref={faceRef}>
                <path d="M30 420C36 306 78 248 120 248C162 248 204 306 210 420Z" fill="url(#hs-skin)" opacity="0.85" />
                <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill="url(#hs-skin)" />

                {template === "cat" && (
                  <g strokeLinejoin="round" strokeLinecap="round">
                    <g className="bob">
                      {[-1, 1].map((side) => (
                        <g key={side} transform={`translate(${120 + side * 42} 98) rotate(${side * 16})`}>
                          <ellipse rx="20" ry="19" fill="url(#hs-ear)" stroke="#4e2f1e" strokeOpacity="0.7" strokeWidth="3" />
                          <ellipse cy="2.5" rx="11.5" ry="10" fill="url(#hs-ear-in)" />
                        </g>
                      ))}
                    </g>
                    {[-1, 1].map((side) => (
                      <ellipse key={side} cx={120 + side * 28} cy="186" rx="11" ry="7" fill="#ff7091" opacity="0.65" />
                    ))}
                    <ellipse cx="120" cy="172" rx="11" ry="8" fill="#6b4129" />
                    <ellipse cx="116" cy="168.5" rx="3.4" ry="2" fill="#fff" opacity="0.85" />
                    <path d="M98 150q7-8 14 0M128 150q7-8 14 0" fill="none" stroke="#6b4129" strokeWidth="3.5" />
                  </g>
                )}

                {template === "wish" && (
                  <g stroke="#141414" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
                    <clipPath id="hs-hat">
                      <path d="M120 50L148 116H92Z" />
                    </clipPath>
                    <path d="M120 50L148 116H92Z" fill="#ee4266" />
                    <g clipPath="url(#hs-hat)" stroke="none" fill="#ffd23f">
                      <rect x="90" y="96" width="60" height="9" />
                      <rect x="90" y="76" width="60" height="9" />
                      <rect x="90" y="58" width="60" height="9" />
                    </g>
                    <path d="M120 50L148 116H92Z" fill="none" />
                    <circle cx="120" cy="50" r="6" fill="#ffd23f" />
                    <rect x="82" y="266" width="76" height="24" rx="5" fill="#3a86ff" />
                    <rect x="88" y="248" width="64" height="20" rx="5" fill="#ffd23f" />
                    {[102, 120, 138].map((x, i) => (
                      <g key={x}>
                        <rect x={x - 3} y="230" width="6" height="20" rx="2" fill={i % 2 ? "#2ec4b6" : "#ee4266"} strokeWidth="2.5" />
                        <path className="blink" d={`M${x} 214c5 6 6 11 0 16c-6-5-5-10 0-16Z`} fill="#ff9f1c" strokeWidth="2.5" />
                      </g>
                    ))}
                  </g>
                )}

                {template === "match" && (
                  <g strokeLinejoin="round" strokeLinecap="round">
                    <ellipse cx="120" cy="70" rx="48" ry="42" fill="#fffdf5" stroke="#1f2a44" strokeWidth="3" />
                    <g className="bob">
                      <circle cx="120" cy="64" r="21" fill="#ffe66d" stroke="#1f2a44" strokeWidth="3" />
                      <circle cx="111" cy="59" r="2.4" fill="#1f2a44" />
                      <circle cx="129" cy="59" r="2.4" fill="#1f2a44" />
                      <path d="M108 68q12 14 24 0" fill="none" stroke="#1f2a44" strokeWidth="3" />
                    </g>
                    <path d="M92 94h56" stroke="#ff6b5b" strokeWidth="4" />
                  </g>
                )}

              </g>

              {/* Brackets follow the cursor with a slight lag */}
              <g ref={bracketsRef} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round">
                <path d="M52 108V90H70" />
                <path d="M170 90H188V108" />
                <path d="M52 232V250H70" />
                <path d="M170 250H188V232" />
              </g>
              {/* Short-video progress bar */}
              <rect x="18" y="396" width="204" height="3" rx="1.5" fill="#ffffff" opacity="0.2" />
              <rect key={template} className="video-progress" x="18" y="396" width="204" height="3" rx="1.5" fill="#e879f9" />
            </svg>

            {/* Camera mode: real video + real face landmarks drawn here */}
            <video ref={videoRef} playsInline muted className="pointer-events-none absolute h-px w-px opacity-0" />
            <canvas
              ref={canvasRef}
              aria-label="Live camera with the selected AR template"
              className={`absolute inset-0 h-full w-full rounded-[1.7rem] ${cam === "on" ? "" : "hidden"}`}
            />
            {cam === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[1.7rem] bg-black/70 px-6 text-center font-mono text-xs text-zinc-200">
                Starting camera and loading face tracking…
              </div>
            )}
          </div>
        </div>

        {/* Easter egg entry: a holographic projection of the game's ship */}
        {onPlayInvaders && (
          <HoloShip onClick={onPlayInvaders} className="absolute -right-3 top-6 z-10 sm:-right-16" />
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-2.5">
        {cam === "on" ? (
          <div role="radiogroup" aria-label="AR filter" className="flex w-[300px] max-w-[92vw] gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={template === t.id}
                onClick={() => {
                  setTemplate(t.id);
                  setAuto(false);
                }}
                className={[
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl border px-1.5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400",
                  template === t.id
                    ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-white"
                    : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-100",
                ].join(" ")}
              >
                <span aria-hidden className="text-lg leading-none">{t.icon}</span>
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="max-w-[270px] text-center font-mono text-[11px] leading-relaxed text-zinc-300" aria-live="off">
            <span aria-hidden>{current.icon} </span>
            {current.label} · {current.hint}
          </p>
        )}

        <button
          type="button"
          onClick={toggleCamera}
          className="rounded text-xs text-zinc-400 underline decoration-zinc-600 decoration-dotted underline-offset-4 transition-colors hover:text-fuchsia-200 hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
        >
          {cam === "loading" ? "Cancel" : cam === "on" ? "Stop camera" : "◉ Try it on your face"}
        </button>

        {note?.kind === "wish" && (
          <a
            href="#contact"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-fuchsia-200 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
          >
            Wish granted. Let's build it →
          </a>
        )}
        {note?.kind === "match" && (
          <p className="text-center font-mono text-[11px] text-fuchsia-200" role="status">
            You read {note.score}/{note.total} faces.{" "}
            <a href="#contact" className="underline decoration-dotted underline-offset-4 hover:text-white">
              Say hi
            </a>
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
