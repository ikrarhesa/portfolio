import { useEffect, useRef } from "react";

/**
 * The Skyrim dragon-soul absorb, in fuchsia.
 *
 * Drawn on a 2D canvas rather than as SVG: the effect is volumetric light, so it needs soft
 * sprites, additive blending and motion trails. Vector shapes can't give any of that — they come
 * out hard-edged and spiky.
 *
 * Three populations of particles feed one core:
 *   filaments — fast, short, nearly straight, the dense converging streaks
 *   ribbons   — slow, long, strongly curved, leaving the wide sweeping arcs
 *   embers    — bright soft points drifting in
 */

type Particle = {
  radius: number;
  angle: number;
  speed: number;
  spin: number;
  length: number;
  width: number;
  alpha: number;
  kind: 0 | 1 | 2; // filament | ribbon | ember
};

const FILAMENTS = 52;
const RIBBONS = 16;
const EMBERS = 12;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** A soft comet: bright head at the right edge, fading tail to the left, feathered top and bottom. */
function makeStreakSprite() {
  const w = 160;
  const h = 26;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;

  const tail = g.createLinearGradient(0, 0, w, 0);
  tail.addColorStop(0, "rgba(168, 85, 247, 0)");
  tail.addColorStop(0.3, "rgba(192, 132, 252, 0.16)");
  tail.addColorStop(0.62, "rgba(217, 70, 239, 0.42)");
  tail.addColorStop(0.86, "rgba(240, 171, 252, 0.62)");
  tail.addColorStop(1, "rgba(250, 232, 255, 0.85)");
  g.fillStyle = tail;
  g.fillRect(0, 0, w, h);

  // Feather the long edges so the streak has no hard boundary
  const feather = g.createLinearGradient(0, 0, 0, h);
  feather.addColorStop(0, "rgba(0, 0, 0, 0)");
  feather.addColorStop(0.5, "rgba(0, 0, 0, 1)");
  feather.addColorStop(1, "rgba(0, 0, 0, 0)");
  g.globalCompositeOperation = "destination-in";
  g.fillStyle = feather;
  g.fillRect(0, 0, w, h);

  return c;
}

/** A plain round glow, used for the core and the embers. */
function makeGlowSprite() {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.1, "rgba(253, 244, 255, 0.72)");
  grad.addColorStop(0.28, "rgba(240, 171, 252, 0.34)");
  grad.addColorStop(0.55, "rgba(217, 70, 239, 0.12)");
  grad.addColorStop(1, "rgba(162, 28, 175, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

function spawn(kind: Particle["kind"], atEdge: boolean): Particle {
  if (kind === 1) {
    return {
      radius: atEdge ? rand(0.72, 1.05) : rand(0.2, 1.05),
      angle: rand(0, Math.PI * 2),
      speed: rand(0.035, 0.07),
      spin: rand(0.5, 1.15) * (Math.random() < 0.5 ? -1 : 1),
      length: rand(0.5, 0.95),
      width: rand(0.022, 0.05),
      alpha: rand(0.1, 0.2),
      kind,
    };
  }
  if (kind === 2) {
    return {
      radius: atEdge ? rand(0.6, 1) : rand(0.12, 1),
      angle: rand(0, Math.PI * 2),
      speed: rand(0.03, 0.075),
      spin: rand(-0.22, 0.22),
      length: rand(0.01, 0.02),
      width: rand(0.01, 0.02),
      alpha: rand(0.25, 0.45),
      kind,
    };
  }
  return {
    radius: atEdge ? rand(0.8, 1.25) : rand(0.14, 1.25),
    angle: rand(0, Math.PI * 2),
    speed: rand(0.14, 0.4),
    spin: rand(-0.3, 0.3),
    length: rand(0.34, 0.86),
    width: rand(0.005, 0.014),
    alpha: rand(0.1, 0.26),
    kind: 0,
  };
}

export default function SoulLight({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The draw loop reads this instead of `paused` directly, so pausing never restarts the animation
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const streak = makeStreakSprite();
    const glow = makeGlowSprite();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particles: Particle[] = [
      ...Array.from({ length: FILAMENTS }, () => spawn(0, false)),
      ...Array.from({ length: RIBBONS }, () => spawn(1, false)),
      ...Array.from({ length: EMBERS }, () => spawn(2, false)),
    ];

    let width = 0;
    let height = 0;
    let reach = 0; // half-diagonal: radius 1 lands at the corners, so the burst fills the screen
    let scale = 0; // half the narrow side: sets streak and core size, independent of how tall it is

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reach = Math.hypot(width, height) / 2;
      scale = Math.min(width, height) / 2;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (dt: number, time: number) => {
      const cx = width / 2;
      const cy = height * 0.45; // a touch above centre, clear of the label

      // Fade the previous frame instead of clearing it: that's what leaves the trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${still ? 1 : 0.17})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        if (!still) {
          // Light accelerates as it falls into the core
          const pull = 1 + (1.1 - Math.min(p.radius, 1.1)) * 1.1;
          p.radius -= p.speed * pull * dt;
          p.angle += p.spin * dt * (0.4 + (1.2 - Math.min(p.radius, 1.2)));
        }

        if (p.radius <= 0.06) {
          Object.assign(p, spawn(p.kind, true));
          continue;
        }

        // Fade in on arrival, and out again as it is swallowed
        const fade = Math.min(1, (1.25 - p.radius) * 2.4) * Math.min(1, p.radius * 5.5);
        const alpha = p.alpha * Math.max(0, fade);
        if (alpha <= 0.01) continue;

        const x = cx + Math.cos(p.angle) * p.radius * reach;
        const y = cy + Math.sin(p.angle) * p.radius * reach;

        ctx.globalAlpha = alpha;
        if (p.kind === 2) {
          const size = p.width * scale * 5;
          ctx.drawImage(glow, x - size / 2, y - size / 2, size, size);
        } else {
          const len = p.length * scale;
          const w = Math.max(1.2, p.width * scale);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.angle + Math.PI); // head points at the core
          ctx.drawImage(streak, -len, -w / 2, len, w);
          ctx.restore();
        }
      }

      // The core, pulsing on two cycles so it never looks like a plain loop
      ctx.globalAlpha = 1;
      const pulse = still ? 1 : 0.86 + Math.sin(time * 0.0019) * 0.1 + Math.sin(time * 0.0043) * 0.04;
      const outer = scale * 0.62 * pulse;
      ctx.drawImage(glow, cx - outer / 2, cy - outer / 2, outer, outer);
      const inner = scale * 0.2 * pulse;
      ctx.drawImage(glow, cx - inner / 2, cy - inner / 2, inner, inner);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    // Settle the trails before the first painted frame, so it doesn't start from nothing
    for (let i = 0; i < 90; i++) draw(1 / 60, 0);

    if (still) {
      return () => observer.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (pausedRef.current) return;
      draw(dt, now);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full"
      aria-hidden
    />
  );
}
