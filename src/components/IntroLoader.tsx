import { useCallback, useEffect, useRef, useState } from "react";
import { SPRITES } from "../constants/spaceInvaders";
import CountUp from "./CountUp";
import HoloSprite from "./HoloSprite";

/**
 * The first-visit intro: a Jarvis-style hologram projected from a platform.
 *
 * One neon wireframe character from the game rises off the platform and spins in 3D, ringed by rotating HUD
 * circles, with a telemetry readout (UNIT / VALUE / SCAN %) while "Hi, I'm Hesa." forms underneath. A different
 * character is shown each time the intro plays. The curiosity gap: "what is this, is there a game in here?"
 * Nothing is downloaded: the hologram is drawn from sprite data already in the app, so it starts instantly.
 *
 * It only ends once the show has played and fonts are ready (with a cap), and it's skippable at any moment.
 *
 *  onReveal: the intro starts to fade, so mount the site underneath now (the hero animates in under it)
 *  onDone:   the overlay has fully faded and can be removed
 */

const MIN_MS = 2600; // the build-up, scan and greeting are in by ~2s; a beat to read them, then straight in
const MAX_MS = 3200; // never hold a slow connection hostage (only fonts can delay it)
const LEAVE_MS = 650;
const HOLO_KEY = "hesa_intro_hologram";

// The first visit shows your ship (the same one that opens the game from the hero); then it rotates.
const HOLOGRAMS = [
  { sprite: SPRITES.PLAYER, unit: "PLAYER-1", value: "READY" },
  { sprite: SPRITES.CRAB, unit: "CRAB-20", value: "20 PTS" },
  { sprite: SPRITES.SQUID, unit: "SQUID-30", value: "30 PTS" },
  { sprite: SPRITES.OCTOPUS, unit: "OCTO-10", value: "10 PTS" },
  { sprite: SPRITES.UFO, unit: "UFO-X", value: "50–150 PTS" },
];

const readLast = () => {
  try {
    const n = parseInt(localStorage.getItem(HOLO_KEY) ?? "-1", 10);
    return Number.isFinite(n) ? n : -1;
  } catch {
    return -1; // storage can be blocked
  }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

// Light particles lifting off the platform (fixed positions so they never jump around)
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  left: 10 + ((i * 47) % 80),
  delay: (i * 0.19) % 2.4,
  duration: 1.8 + ((i * 0.37) % 1),
  size: 2 + (i % 3),
  color: i % 3 === 0 ? "#fae8ff" : "#e879f9",
}));

// Jarvis-style HUD circles that surround the hologram
function HudRings() {
  return (
    <svg viewBox="0 0 200 200" className="hx-hud absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[47%]" style={{ width: "calc(var(--u) * 19)", height: "calc(var(--u) * 19)" }} fill="none" aria-hidden>
      <g className="hx-spin-a">
        <circle cx="100" cy="100" r="96" stroke="#d946ef" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="2 5" />
        <path d="M100 4 A96 96 0 0 1 196 100" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 196 A96 96 0 0 1 4 100" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="hx-spin-b">
        <circle cx="100" cy="100" r="84" stroke="#c026d3" strokeOpacity="0.5" strokeWidth="5" strokeDasharray="1.2 6.1" />
        <circle cx="100" cy="100" r="76" stroke="#d946ef" strokeOpacity="0.35" strokeWidth="0.7" />
      </g>
      <g className="hx-spin-a" style={{ animationDuration: "26s" }}>
        <path d="M100 30 A70 70 0 0 1 170 100" stroke="#f0abfc" strokeOpacity="0.8" strokeWidth="1.2" strokeDasharray="14 5 3 5" />
        <path d="M100 170 A70 70 0 0 1 30 100" stroke="#f0abfc" strokeOpacity="0.8" strokeWidth="1.2" strokeDasharray="14 5 3 5" />
      </g>
    </svg>
  );
}

export default function IntroLoader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  // A different hologram each time the intro plays. The read is pure, the write is in an effect.
  const [index] = useState(() => (readLast() + 1) % HOLOGRAMS.length);
  const holo = HOLOGRAMS[index];

  useEffect(() => {
    try {
      localStorage.setItem(HOLO_KEY, String(index));
    } catch {
      /* ignore */
    }
  }, [index]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    rootRef.current?.classList.add("intro-leave");
    onReveal();
    setTimeout(onDone, prefersReducedMotion() ? 0 : LEAVE_MS);
  }, [onReveal, onDone]);

  // End automatically once the show has played AND fonts are ready
  useEffect(() => {
    let cancelled = false;
    const ready = Promise.resolve(document.fonts?.ready);
    const minimum = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 900 : MIN_MS));
    const cap = new Promise((r) => setTimeout(r, MAX_MS));
    void Promise.race([Promise.all([ready, minimum]), cap]).then(() => {
      if (!cancelled) finish();
    });
    return () => {
      cancelled = true;
    };
  }, [finish]);

  // Skip with Enter / Space / Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const words = ["Hi,", "I'm"];

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Ikrar Hesa Prasetya's portfolio"
      onClick={finish}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#0a0512] px-6"
    >
      {/* Atmosphere: deep purple with a fuchsia glow behind the projection */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 56%, rgba(217,70,239,0.17), transparent 50%), radial-gradient(ellipse at 50% 22%, rgba(168,85,247,0.12), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,121,249,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />

      {/* The platform and what it projects. --u is the size of one sprite pixel. */}
      <div
        className="hx-stage relative flex flex-col items-center"
        style={css({ "--u": "clamp(7px, calc((100svh - 25rem) / 11), 16px)" })}
      >
        {/* Light cone */}
        <div className="hx-beam pointer-events-none absolute bottom-[calc(var(--u)*1.4)] left-1/2 h-[calc(var(--u)*12)] w-[calc(var(--u)*17)] -translate-x-1/2" aria-hidden />

        {/* The hologram, framed by HUD brackets and rings. Fixed-size box, so nothing shifts. */}
        <div className="relative z-10 flex items-end justify-center" style={{ height: "calc(var(--u) * 11)", width: "calc(var(--u) * 16)" }}>
          <HudRings />
          {[
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "left-0 bottom-0 border-b-2 border-l-2",
            "right-0 bottom-0 border-b-2 border-r-2",
          ].map((pos) => (
            <span key={pos} className={`hx-bracket pointer-events-none absolute size-4 border-fuchsia-300/70 ${pos}`} aria-hidden />
          ))}
          <div className="relative">
            <div className="hx-holo hx-item" style={{ animationDelay: "0.55s, 1.2s, 1.2s" }}>
              <HoloSprite sprite={holo.sprite} />
            </div>
            <div className="hx-edge hx-edge-fast" style={{ animationDelay: "0.55s" }} aria-hidden />
          </div>
        </div>

        {/* Platform */}
        <svg viewBox="0 0 300 60" className="relative -mt-2 overflow-visible" style={{ width: "calc(var(--u) * 21)" }} aria-hidden>
          {[0, 0.7, 1.4].map((d) => (
            <ellipse key={d} className="hx-ring" style={css({ animationDelay: `${d}s` })} cx="150" cy="30" rx="120" ry="17" fill="none" stroke="#d946ef" strokeWidth="1.2" />
          ))}
          <ellipse cx="150" cy="38" rx="122" ry="17" fill="#2a0b33" stroke="#d946ef" strokeOpacity="0.35" />
          <ellipse cx="150" cy="30" rx="118" ry="17" fill="#170622" stroke="#d946ef" strokeOpacity="0.9" strokeWidth="1.6" />
          <ellipse className="hx-dash" cx="150" cy="30" rx="96" ry="13" fill="none" stroke="#e879f9" strokeOpacity="0.8" strokeWidth="1.2" strokeDasharray="10 6" />
          <ellipse className="hx-dash hx-dash-rev" cx="150" cy="30" rx="74" ry="10" fill="none" stroke="#f0abfc" strokeOpacity="0.7" strokeWidth="1" strokeDasharray="3 5" />
          <ellipse cx="150" cy="30" rx="30" ry="4.5" fill="#e879f9" fillOpacity="0.35" />
          <ellipse cx="150" cy="30" rx="12" ry="2" fill="#fff" fillOpacity="0.8" />
        </svg>

        {/* Sparks lifting off the platform */}
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="hx-spark absolute rounded-full"
            aria-hidden
            style={css({ left: `${s.left}%`, bottom: "calc(var(--u) * 1.4)", width: s.size, height: s.size, background: s.color, boxShadow: `0 0 6px ${s.color}`, animationDelay: `${0.4 + s.delay}s`, animationDuration: `${s.duration}s` })}
          />
        ))}
      </div>

      {/* Telemetry readout + greeting */}
      <div className="relative mt-5 text-center">
        <div
          className="intro-in flex items-center justify-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[#f0abfc]/80 sm:gap-5 sm:text-[11px] sm:tracking-[0.24em]"
          style={css({ animationDelay: "0.7s" })}
          aria-hidden
        >
          <span>
            Unit <b className="font-semibold text-[#fae8ff]">{holo.unit}</b>
          </span>
          <span className="h-3 w-px bg-fuchsia-300/30" />
          <span>
            Value <b className="font-semibold text-[#fae8ff]">{holo.value}</b>
          </span>
          <span className="h-3 w-px bg-fuchsia-300/30" />
          <span>
            Scan{" "}
            <b className="font-semibold text-[#fae8ff]">
              <CountUp to={100} suffix="%" delay={700} duration={1500} />
            </b>
          </span>
        </div>
        <div role="presentation" className="mt-4 text-4xl font-bold tracking-tight text-[#ffffff] md:text-5xl">
          {words.map((w, i) => (
            <span key={w} className="intro-word inline-block" style={css({ animationDelay: `${1.5 + i * 0.12}s` })}>
              {w}&nbsp;
            </span>
          ))}
          <span className="intro-word inline-block" style={css({ animationDelay: "1.76s" })}>
            <span className="shimmer-cyan">Hesa.</span>
          </span>
        </div>
        <p className="intro-sub mt-3 text-base text-[#a1a1aa] md:text-lg" style={css({ animationDelay: "2s" })}>
          I design digital products and creative systems.
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="intro-skip absolute bottom-6 right-6 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/[0.04] px-4 py-2 font-mono text-xs text-fuchsia-100/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-fuchsia-300"
      >
        Skip <span aria-hidden>↵</span>
      </button>
    </div>
  );
}
