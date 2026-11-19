import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";
import HoloShip from "./HoloShip";
import { INVADER } from "../constants/invader";
import { createLandmarker, openCamera, runFaceAR, type TemplateId } from "../lib/faceAR";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "neon", label: "Neon" },
  { id: "pixel", label: "Pixel" },
  { id: "glitch", label: "Glitch" },
];

// Landmark dots around the demo head centre (120, 170)
const MESH: [number, number][] = [
  [120, 118], [100, 128], [140, 128], [88, 150], [152, 150], [104, 150], [136, 150],
  [120, 158], [120, 176], [108, 192], [132, 192], [120, 204], [96, 176], [144, 176], [120, 222],
];

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
  const [template, setTemplate] = useState<TemplateId>("neon");
  const [auto, setAuto] = useState(true);
  const [cam, setCam] = useState<CamState>("off");
  const [camMsg, setCamMsg] = useState("");
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(true); // the demo pauses itself when scrolled out of view
  const rootRef = useRef<HTMLDivElement>(null);

  const phoneRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const bracketsRef = useRef<SVGGElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, t: 0 });
  const templateRef = useRef<TemplateId>("neon");
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
    if (!auto || hovering || !inView || prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setTemplate((t) => TEMPLATES[(TEMPLATES.findIndex((x) => x.id === t) + 1) % TEMPLATES.length].id);
    }, 4200);
    return () => clearInterval(timer);
  }, [auto, hovering, inView]);

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
      const { landmarker, oval } = await createLandmarker();
      if (cancelled()) {
        landmarker.close();
        return;
      }
      stopLoopRef.current = runFaceAR({
        video,
        canvas: canvasRef.current!,
        landmarker,
        oval,
        getTemplate: () => templateRef.current,
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

  const hint =
    cam === "on"
      ? "Live on your device. Your video never leaves this browser."
      : cam === "error"
        ? camMsg
        : "Camera is optional. Nothing is uploaded.";

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
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full blur-3xl opacity-40"
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

                {template === "neon" && (
                  <g>
                    <ellipse cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill="none" stroke="#e879f9" strokeWidth="2.5" filter="url(#hs-glow)" />
                    {[0, 1, 2].map((i) => (
                      <ellipse
                        key={i}
                        className="ring-pulse"
                        style={{ animationDelay: `${i * 0.8}s` }}
                        cx={HEAD.cx}
                        cy={HEAD.cy}
                        rx={HEAD.rx}
                        ry={HEAD.ry}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                )}

                {template === "pixel" && (
                  <g>
                    <g className="bob">
                      {INVADER.flatMap((row, y) =>
                        row.map((on, x) =>
                          on ? (
                            <rect key={`${x}-${y}`} x={92 + x * 5} y={64 + y * 5} width="4.4" height="4.4" fill="#f0abfc" filter="url(#hs-glow)" />
                          ) : null
                        )
                      )}
                    </g>
                    {[78, 92, 150, 164, 104, 138, 84, 158].map((x, i) => (
                      <rect
                        key={x}
                        className="pixel-float"
                        style={{ animationDelay: `${i * 0.37}s` }}
                        x={x}
                        y={210 + (i % 3) * 10}
                        width="4"
                        height="4"
                        fill={i % 2 ? "#22d3ee" : "#e879f9"}
                      />
                    ))}
                  </g>
                )}

                {template === "glitch" && (
                  <g style={{ mixBlendMode: "screen" }}>
                    <ellipse className="glitch-a" cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill="#22d3ee" opacity="0.55" />
                    <ellipse className="glitch-b" cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill="#e879f9" opacity="0.55" />
                    {[130, 172, 206].map((y, i) => (
                      <rect key={y} className={i % 2 ? "glitch-b" : "glitch-a"} x="60" y={y} width="120" height="6" fill="#ffffff" opacity="0.18" />
                    ))}
                  </g>
                )}

                {MESH.map(([x, y], i) => (
                  <circle key={i} className={i % 4 === 0 ? "blink" : undefined} style={{ animationDelay: `${i * 0.13}s` }} cx={x} cy={y} r="1.8" fill="#f0abfc" opacity="0.85" />
                ))}
              </g>

              {/* Brackets follow the cursor with a slight lag */}
              <g ref={bracketsRef} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round">
                <path d="M52 108V90H70" />
                <path d="M170 90H188V108" />
                <path d="M52 232V250H70" />
                <path d="M170 250H188V232" />
                <text x="56" y="82" fontFamily="ui-monospace, monospace" fontSize="8" fill="#22d3ee" stroke="none" letterSpacing="1">
                  DEMO · FOLLOWS CURSOR
                </text>
              </g>

              {/* Short-video UI chrome */}
              <circle className="blink" cx="18" cy="20" r="4" fill="#ef4444" />
              <text x="28" y="23.5" fontFamily="ui-monospace, monospace" fontSize="9" fill="#e4e4e7">
                REC
              </text>
              <text x="222" y="23.5" textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="9" fill="#f0abfc">
                {template.toUpperCase()}
              </text>
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
          <HoloShip onClick={onPlayInvaders} className="absolute -right-5 top-6 z-10 sm:-right-24" />
        )}

        {/* Proof badge, anchored to the phone */}
        <div className="absolute -bottom-3 -left-4 sm:-left-10 rounded-xl border border-white/15 bg-[#0b0712]/90 px-3 py-2 backdrop-blur">
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">Template uses / week</p>
          <p className="text-lg font-bold text-zinc-50">
            <CountUp from={200} to={34000} delay={500} duration={2400} />
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-2.5">
        <div role="radiogroup" aria-label="AR template" className="inline-flex rounded-full border border-white/10 p-0.5">
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
                "rounded-full px-3.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400",
                template === t.id ? "bg-white/15 text-white" : "text-zinc-400 hover:text-zinc-100",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleCamera}
          className="rounded text-xs text-zinc-400 underline decoration-zinc-600 decoration-dotted underline-offset-4 transition-colors hover:text-fuchsia-200 hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
        >
          {cam === "loading" ? "Cancel" : cam === "on" ? "Stop camera" : "◉ Try it on your face"}
        </button>

        <p
          role={cam === "error" ? "alert" : undefined}
          className={`max-w-[260px] text-center font-mono text-[11px] leading-relaxed ${cam === "error" ? "text-amber-300" : "text-zinc-400"}`}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}
