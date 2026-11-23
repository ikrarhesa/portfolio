// Interactive AR filters. Each one reacts to the face (blendshapes + landmarks) and has its own art style:
//   gum   → bubblegum pink, glossy and translucent
//   laser → neon: hot pink-red light on a dimmed frame
// Everything is drawn with canvas paths, so there are no image assets to download.

export type TemplateId = "gum" | "laser";
export type ArEvent =
  | { kind: "gum"; size: number; best: number; popped: boolean }
  | { kind: "laser"; shots: number; power: number }
  | { kind: "reset" };

/** The words the filters put on the canvas, as a getter so they follow the language while the camera runs */
export type ArLabels = Record<
  | "gumPop" | "gumBank" | "gumCareful" | "gumKeep" | "gumStart"
  | "laserFire" | "laserCool" | "laserBlink" | "laserCharging" | "laserStart",
  string
>;
const withSize = (text: string, size: number) => text.replace("{size}", size.toFixed(1));

type P = { x: number; y: number };

/** What a filter gets every frame. Coordinates are already mirrored to match the selfie view. */
export type FaceFrame = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  now: number;
  dt: number; // seconds since the previous frame
  pt: (i: number) => P;
  faceW: number;
  roll: number; // head tilt in radians
  top: P; // top of the forehead
  chin: P;
  mouth: P;
  bs: (name: string) => number; // blendshape score 0..1
  hasIris: boolean; // landmarks 468+ (iris centres) are available
  /** Softens and brightens skin inside the face (eyes and lips stay sharp). amount 0..1, brightness 1 = unchanged */
  smooth: (amount: number, brightness?: number) => void;
  /** Outline of the visible lips (outer contour minus the open mouth), fill with "evenodd" */
  lips: () => Path2D;
  emit: (e: ArEvent) => void;
};

export interface ArFilter {
  hint: () => string;
  draw: (f: FaceFrame) => void;
}

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const TAU = Math.PI * 2;

// ---------- particles ----------
type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; rot: number; vr: number;
  color: string; kind: "star" | "bubble";
};

function spawn(list: Particle[], p: Partial<Particle> & Pick<Particle, "x" | "y" | "kind" | "color">) {
  if (list.length > 220) list.shift();
  const life = p.life ?? rand(1.2, 2);
  list.push({ vx: 0, vy: 0, size: 8, rot: 0, vr: 0, ...p, life, max: life });
}

function step(list: Particle[], dt: number, gravity: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life -= dt;
    if (p.life <= 0) {
      list.splice(i, 1);
      continue;
    }
    p.vy += gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
  }
}

function sparkle(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0);
  ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s);
  ctx.closePath();
}

function drawParticles(ctx: CanvasRenderingContext2D, list: Particle[]) {
  for (const p of list) {
    ctx.save();
    ctx.globalAlpha = clamp(p.life / (p.max * 0.4), 0, 1);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.kind === "bubble") {
      gumBubble(ctx, p.size * 0.5, p.color);
    } else {
      sparkle(ctx, p.size);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

// ---------- bubble gum ----------
// Soft candy pink, flat vector style: pale fill, a mid-pink outline, white glints. Deliberately
// not saturated: hot pink reads as red against skin and a dark camera feed.
const GUM = "#f9c9e1"; // fill
const GUM_LINE = "#ec8fc3"; // outline
const GUM_PALE = "#fde3f0"; // lightest fill

/** A small glossy gum bubble: pale fill, pink outline, a glint and a dot. Origin at its centre. */
function gumBubble(ctx: CanvasRenderingContext2D, r: number, fill: string) {
  ctx.lineWidth = Math.max(1, r * 0.2);
  ctx.strokeStyle = GUM_LINE;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1, r * 0.2);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.66, Math.PI * 1.08, Math.PI * 1.42);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.62, r * 0.1, 0, TAU);
  ctx.fill();
}

/**
 * An ink-style gum splash. The silhouette comes from a metaball field: a fat core with tapered,
 * gently curving tendrils, all summed into one smooth surface. Where shapes meet the field fills
 * in with soft concave joins instead of hard corners, which is what makes it read as liquid
 * rather than as a star with spokes.
 *
 * It is rasterised once, when the bubble pops, then just drawn each frame.
 */
type Splat = { x: number; y: number; img: HTMLCanvasElement; scale: number; arms: number[] };

type Ball = { x: number; y: number; r: number };

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function makeSplat(x: number, y: number, s: number, line: number): Splat {
  const balls: Ball[] = [{ x: 0, y: 0, r: s }];
  const arms: number[] = [];

  // A couple of lumps so the core is not a perfect circle
  for (let i = 0; i < 3; i++) {
    const a = rand(0, TAU);
    balls.push({ x: Math.cos(a) * s * 0.55, y: Math.sin(a) * s * 0.55, r: s * rand(0.55, 0.8) });
  }

  // Tendrils: a chain of shrinking balls that bends as it goes, so it flows rather than pokes
  const n = Math.floor(rand(5, 8));
  const start = rand(0, TAU);
  for (let i = 0; i < n; i++) {
    let a = start + (i / n) * TAU + rand(-0.35, 0.35);
    const len = s * rand(1.1, 2.5);
    const base = s * rand(0.3, 0.46);
    const bend = rand(-0.5, 0.5);
    arms.push(a);
    let d = s * 0.5;
    let px = Math.cos(a) * d;
    let py = Math.sin(a) * d;
    while (d < len) {
      const t = d / len;
      const r = base * (1 - 0.6 * t);
      balls.push({ x: px, y: py, r });
      const step = Math.max(1, r * 0.55);
      a += (bend * step) / len;
      d += step;
      px += Math.cos(a) * step;
      py += Math.sin(a) * step;
    }
    // A slightly fuller end, like a drop about to let go
    balls.push({ x: px, y: py, r: base * 0.42 * (Math.random() < 0.5 ? 1.25 : 1) });
  }

  // Extent, so the offscreen canvas fits the whole splash
  const support = 1.84; // field radius as a multiple of ball radius
  let ext = 0;
  for (const b of balls) ext = Math.max(ext, Math.hypot(b.x, b.y) + b.r * support);
  ext += line * 3;

  const q = 0.8; // raster scale: high enough that the upscale does not show stair-steps
  const size = Math.max(8, Math.ceil(ext * 2 * q));
  const half = size / 2;
  const field = new Float32Array(size * size);

  for (const b of balls) {
    const R = b.r * support * q;
    const cx = half + b.x * q;
    const cy = half + b.y * q;
    const x0 = Math.max(0, Math.floor(cx - R));
    const x1 = Math.min(size - 1, Math.ceil(cx + R));
    const y0 = Math.max(0, Math.floor(cy - R));
    const y1 = Math.min(size - 1, Math.ceil(cy + R));
    for (let yy = y0; yy <= y1; yy++) {
      for (let xx = x0; xx <= x1; xx++) {
        const d2 = ((xx - cx) * (xx - cx) + (yy - cy) * (yy - cy)) / (R * R);
        if (d2 < 1) {
          const k = 1 - d2;
          field[yy * size + xx] += k * k * k;
        }
      }
    }
  }

  const T = 0.35;
  const mk = (color: [number, number, number]) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d")!;
    const im = g.createImageData(size, size);
    for (let i = 0; i < field.length; i++) {
      const al = smoothstep(T - 0.11, T + 0.11, field[i]); // a soft edge antialiases the threshold
      im.data[i * 4] = color[0];
      im.data[i * 4 + 1] = color[1];
      im.data[i * 4 + 2] = color[2];
      im.data[i * 4 + 3] = Math.round(al * 255);
    }
    g.putImageData(im, 0, 0);
    return c;
  };

  const fill = mk([249, 201, 225]);
  const edge = mk([236, 143, 195]);
  const white = mk([255, 255, 255]);

  const img = document.createElement("canvas");
  img.width = img.height = size;
  const g = img.getContext("2d")!;

  // Outline: the edge colour stamped around a ring, then the fill on top
  const lw = Math.max(1, line * q);
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * TAU;
    g.drawImage(edge, Math.cos(a) * lw, Math.sin(a) * lw);
  }
  g.drawImage(fill, 0, 0);

  // Gloss: a rim of light along the upper-left inside edge, made by shifting the shape and
  // cutting it out of itself
  const rim = document.createElement("canvas");
  rim.width = rim.height = size;
  const rg = rim.getContext("2d")!;
  rg.drawImage(white, 0, 0);
  rg.globalCompositeOperation = "destination-out";
  const off = Math.max(2, s * q * 0.16);
  rg.drawImage(white, off * 0.8, off);
  g.globalAlpha = 0.85;
  g.drawImage(rim, 0, 0);
  g.globalAlpha = 1;

  return { x, y, img, scale: 1 / q, arms };
}

function drawSplat(ctx: CanvasRenderingContext2D, sp: Splat, scale: number) {
  ctx.save();
  ctx.translate(sp.x, sp.y);
  ctx.scale(scale * sp.scale, scale * sp.scale);
  ctx.drawImage(sp.img, -sp.img.width / 2, -sp.img.height / 2);
  ctx.restore();
}

/**
 * Blow a bubble by puffing your cheeks. It grows while you blow and strains as it gets big;
 * push past this round's limit and it pops across your face. Ease off in time and you bank it.
 *
 * The limit is random each round, so the tension is real: the wobble and the pale, thinning
 * skin are the only warning you get.
 */
function gumFilter(labels: () => ArLabels): ArFilter {
  const bits: Particle[] = [];
  let splats: Splat[] = [];
  let poppedAt = 0;
  let pop = { x: 0, y: 0, r: 0 };
  let phase: "chew" | "blow" | "pop" | "bank" = "chew";
  let r = 0; // current radius, px
  let peak = 0; // biggest it got this round, so easing off still pays out
  let limit = 0; // this round's popping point, px
  let quiet = 0; // seconds of not blowing
  let until = 0; // when the pop/bank message clears
  let shown = 0; // the size being reported, in face widths
  let best = 0;
  let puff = 0; // smoothed input

  const newRound = (u: number) => {
    r = 0;
    peak = 0;
    quiet = 0;
    limit = u * rand(0.5, 0.92);
  };

  return {
    hint: () => {
      const l = labels();
      if (phase === "pop") return withSize(l.gumPop, shown);
      if (phase === "bank") return withSize(l.gumBank, shown);
      if (phase === "blow") return r / limit > 0.72 ? l.gumCareful : l.gumKeep;
      return l.gumStart;
    },
    draw(f) {
      const { ctx, W, H, faceW: u, roll, now, dt, mouth } = f;
      if (limit === 0) newRound(u);

      // cheekPuff is the real signal but it reads weakly on some faces, so pucker backs it up.
      // jawOpen cancels it: a gaping mouth means they are not blowing a bubble.
      const raw = Math.max(f.bs("cheekPuff"), f.bs("mouthPucker") * 0.85) * (1 - clamp(f.bs("jawOpen") * 1.4, 0, 1));
      puff += (raw - puff) * Math.min(1, dt * 9); // heavy smoothing: this blendshape is noisy

      if (phase === "chew" || phase === "blow") {
        if (puff > 0.3) {
          phase = "blow";
          r += puff * u * 0.62 * dt;
          peak = Math.max(peak, r);
          quiet = 0;
        } else {
          quiet += dt;
          r = Math.max(0, r - u * 0.18 * dt);
          if (phase === "blow" && peak > u * 0.3 && quiet > 0.45) {
            // Eased off in time: bank it
            phase = "bank";
            shown = (peak * 2) / u;
            best = Math.max(best, shown);
            until = now + 1600;
            f.emit({ kind: "gum", size: shown, best, popped: false });
            for (let i = 0; i < 22; i++) {
              const a = rand(0, TAU);
              spawn(bits, {
                kind: "star", color: pick([GUM_PALE, "#ffffff", GUM_LINE]),
                x: mouth.x, y: mouth.y + r * 0.5,
                vx: Math.cos(a) * rand(40, 150), vy: Math.sin(a) * rand(40, 150) - 60,
                size: rand(5, 10), rot: rand(0, 6), vr: rand(-6, 6), life: rand(0.7, 1.2),
              });
            }
          } else if (phase === "blow" && r <= 1) {
            phase = "chew";
          }
        }

        if (phase === "blow" && r >= limit) {
          phase = "pop";
          shown = (r * 2) / u;
          best = Math.max(best, shown);
          until = now + 1900;
          const cx = mouth.x;
          const cy = mouth.y + r * 0.68;
          poppedAt = now;
          pop = { x: cx, y: cy, r };
          const line = Math.max(1.5, u * 0.016);

          // One big splash where the bubble was, and a few smaller ones thrown nearby
          const bigS = Math.min(u * 0.48, r * 0.55);
          const big = makeSplat(cx, cy, bigS, line);
          splats = [big];
          for (let i = 0; i < 3; i++) {
            const a = rand(0, TAU);
            const dist = r * rand(0.7, 1.1);
            splats.push(makeSplat(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist * 0.8, bigS * rand(0.3, 0.5), line));
          }

          // Drops flung out along the splash's own tendrils, so they look like part of it
          for (const a0 of big.arms) {
            for (let k = 0; k < 2; k++) {
              const a = a0 + rand(-0.12, 0.12);
              const sp = rand(240, 620);
              spawn(bits, {
                kind: "bubble",
                color: pick([GUM, GUM_PALE]),
                x: cx + Math.cos(a) * bigS * 0.6, y: cy + Math.sin(a) * bigS * 0.6,
                vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
                size: rand(7, 22), rot: 0, vr: 0, life: rand(0.8, 1.5),
              });
            }
          }
          f.emit({ kind: "gum", size: shown, best, popped: true });
        }
      } else if (now > until) {
        phase = "chew";
        splats = [];
        newRound(u);
      }

      // ---- the bubble ----
      if (r > 2 && (phase === "chew" || phase === "blow")) {
        const strain = clamp(r / limit, 0, 1);
        // Wobble grows with strain, so the warning is felt before it is understood
        const wob = strain ** 3 * r * 0.09;
        const rx = r + Math.sin(now * 0.013) * wob;
        const ry = r + Math.cos(now * 0.017) * wob;
        const cx = mouth.x;
        const cy = mouth.y + r * 0.68;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(roll);

        // The neck joining lips to bubble
        ctx.fillStyle = GUM;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.62, r * 0.17, r * 0.34, 0, 0, TAU);
        ctx.fill();

        // Skin: thins and pales as it stretches
        const g = ctx.createRadialGradient(-rx * 0.3, -ry * 0.35, rx * 0.05, 0, 0, rx);
        g.addColorStop(0, `rgba(255,240,248,${0.8 - strain * 0.2})`);
        g.addColorStop(0.5, `rgba(249,190,220,${0.82 - strain * 0.22})`);
        g.addColorStop(1, `rgba(236,143,195,${0.92 - strain * 0.25})`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
        ctx.fill();

        ctx.lineWidth = Math.max(1.5, u * 0.02 * (1 - strain * 0.45));
        ctx.strokeStyle = `rgba(236,143,195,${1 - strain * 0.35})`;
        ctx.stroke();

        // Specular highlight
        ctx.globalAlpha = 0.85 - strain * 0.3;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(-rx * 0.38, -ry * 0.42, rx * 0.17, ry * 0.1, -0.6, 0, TAU);
        ctx.fill();

        // Stretch marks once it is close to going
        if (strain > 0.62) {
          ctx.globalAlpha = (strain - 0.62) * 1.6;
          ctx.strokeStyle = "rgba(255,255,255,0.75)";
          ctx.lineWidth = Math.max(1, u * 0.01);
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * TAU + now * 0.0004;
            ctx.beginPath();
            ctx.arc(0, 0, rx * 0.78, a, a + 0.5);
            ctx.stroke();
          }
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // ---- gum stuck on the face after a pop ----
      if (splats.length) {
        const fade = clamp((until - now) / 700, 0, 1);
        const t = clamp((now - poppedAt) / 230, 0, 1);

        // A flash at the instant of the pop gives it some punch
        const flash = 1 - clamp((now - poppedAt) / 170, 0, 1);
        if (flash > 0) {
          const fr = pop.r * (1.2 + (1 - flash) * 0.6);
          const fg = ctx.createRadialGradient(pop.x, pop.y, 0, pop.x, pop.y, fr);
          fg.addColorStop(0, `rgba(255,236,246,${0.7 * flash})`);
          fg.addColorStop(1, "rgba(255,236,246,0)");
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(pop.x, pop.y, fr, 0, TAU);
          ctx.fill();
        }

        // Burst out fast, overshoot, settle: the splash should feel thrown, not faded in
        const c1 = 1.9;
        const back = 1 + (c1 + 1) * (t - 1) ** 3 + c1 * (t - 1) ** 2;
        ctx.save();
        ctx.globalAlpha = 0.97 * fade;
        for (const sp of splats) drawSplat(ctx, sp, 0.15 + 0.85 * back);
        ctx.restore();
      }

      step(bits, dt, 620);
      drawParticles(ctx, bits);
      void W;
      void H;
    },
  };
}


// ---------- laser eyes ----------
const LASER = "#ff2d75";

type Spark = { x: number; y: number; life: number; max: number };

const midPt = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function glowDisc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  if (r <= 0 || alpha <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,255,255,${alpha})`);
  g.addColorStop(0.25, `rgba(255,214,230,${alpha * 0.8})`);
  g.addColorStop(0.6, `rgba(255,45,117,${alpha * 0.35})`);
  g.addColorStop(1, "rgba(255,45,117,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/** A four-point lens flare: the light seems to come straight at the camera. */
function flare(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  if (r <= 0 || alpha <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = `rgba(255,236,244,${alpha})`;
  for (const rot of [0, Math.PI / 2]) {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.quadraticCurveTo(0, -r * 0.07, r, 0);
    ctx.quadraticCurveTo(0, r * 0.07, -r, 0);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Raise your eyebrows and your eyes charge; blink to fire.
 *
 * Charge-then-release is deliberate. A face moves constantly, so a filter that fires on a single
 * expression goes off by accident. Asking for a held brow first, then a blink, means the shot is
 * always intentional, and the pause between the two is where people perform for the camera.
 */
function laserFilter(labels: () => ArLabels): ArFilter {
  const sparks: Spark[] = [];
  const rings: { x: number; y: number; at: number }[] = [];
  let phase: "idle" | "charge" | "fire" | "cool" = "idle";
  let charge = 0; // 0..1
  let raise = 0; // smoothed brow input
  let openFor = 0; // how long the eyes have been open, so a held-shut blink cannot re-fire
  let firedAt = 0;
  let power = 0;
  let shots = 0;
  let shake = 0;

  const FIRE_MS = 650;
  const COOL_MS = 1500;

  return {
    hint: () => {
      const l = labels();
      if (phase === "fire") return l.laserFire;
      if (phase === "cool") return l.laserCool;
      if (phase === "charge") return charge > 0.6 ? l.laserBlink : l.laserCharging;
      return l.laserStart;
    },
    draw(f) {
      const { ctx, W, H, faceW: u, roll, now, dt } = f;

      const eyeL = f.hasIris ? f.pt(468) : midPt(f.pt(33), f.pt(133));
      const eyeR = f.hasIris ? f.pt(473) : midPt(f.pt(362), f.pt(263));
      const centre = midPt(eyeL, eyeR);
      const eyes = [eyeL, eyeR];

      // ---- input ----
      const rawRaise = (f.bs("browInnerUp") + (f.bs("browOuterUpLeft") + f.bs("browOuterUpRight")) / 2) / 2;
      raise += (rawRaise - raise) * Math.min(1, dt * 10);
      const blink = Math.min(f.bs("eyeBlinkLeft"), f.bs("eyeBlinkRight"));
      const closed = blink > 0.5;
      openFor = closed ? 0 : openFor + dt;

      const sinceFire = now - firedAt;
      if (phase === "fire" && sinceFire > FIRE_MS) phase = "cool";
      if (phase === "cool" && sinceFire > COOL_MS) {
        phase = "idle";
        charge = 0;
        f.emit({ kind: "reset" });
      }

      if (phase === "idle" || phase === "charge") {
        if (raise > 0.22) {
          charge = Math.min(1, charge + dt / 1.05);
        } else {
          charge = Math.max(0, charge - dt * 2.2); // drops fast, so expressive brows do not stay armed
        }
        phase = charge > 0.02 ? "charge" : "idle";

        if (closed && openFor === 0 && charge > 0.55 && sinceFire > COOL_MS) {
          phase = "fire";
          firedAt = now;
          power = charge;
          shots++;
          charge = 0;
          shake = 1;
          for (const e of eyes) rings.push({ x: e.x, y: e.y, at: now });
          f.emit({ kind: "laser", shots, power });
        }
      }

      ctx.save();

      // ---- the frame dims while charging, so the light has something to stand out from ----
      const t = clamp(sinceFire / FIRE_MS, 0, 1);
      const dim = phase === "fire" ? 0.34 * (1 - t) : 0.4 * charge;
      if (dim > 0.005) {
        ctx.fillStyle = `rgba(14,0,24,${dim})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "lighter";

      // ---- charging ----
      if (phase === "charge" && charge > 0.02) {
        const ready = charge > 0.97;
        const flicker = ready ? 0.85 + Math.sin(now * 0.04) * 0.15 : 1;

        for (const e of eyes) {
          glowDisc(ctx, e.x, e.y, u * (0.05 + 0.14 * charge) * flicker, 0.35 + 0.65 * charge);

          // Rings collapsing onto the eye
          for (let i = 0; i < 2; i++) {
            const ph = (now / 1000 * (1.1 + charge) + i * 0.5) % 1;
            ctx.strokeStyle = `rgba(255,150,190,${(1 - ph) * charge * 0.8})`;
            ctx.lineWidth = Math.max(1, u * 0.012);
            ctx.beginPath();
            ctx.arc(e.x, e.y, u * (0.05 + 0.3 * (1 - ph) * (0.4 + 0.6 * charge)), 0, TAU);
            ctx.stroke();
          }

          // Light drawn in from around the face
          if (Math.random() < charge * dt * 70) {
            const a = rand(0, TAU);
            const d = u * rand(0.2, 0.42);
            sparks.push({ x: e.x + Math.cos(a) * d, y: e.y + Math.sin(a) * d, life: 0.32, max: 0.32 });
          }
          if (ready) flare(ctx, e.x, e.y, u * 0.2 * flicker, 0.55);
        }
      }

      // Sparks fall toward the nearest eye
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life -= dt;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const e = Math.hypot(sp.x - eyeL.x, sp.y - eyeL.y) < Math.hypot(sp.x - eyeR.x, sp.y - eyeR.y) ? eyeL : eyeR;
        const k = Math.min(1, dt * 7);
        const px = sp.x;
        const py = sp.y;
        sp.x += (e.x - sp.x) * k;
        sp.y += (e.y - sp.y) * k;
        const a = sp.life / sp.max;
        ctx.strokeStyle = `rgba(255,214,230,${a})`;
        ctx.lineWidth = Math.max(1, u * 0.012);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sp.x, sp.y);
        ctx.stroke();
      }

      // ---- firing ----
      if (phase === "fire" || (phase === "cool" && sinceFire < FIRE_MS + 120)) {
        const grow = 1 - (1 - clamp(t / 0.14, 0, 1)) ** 3;
        const fade = t < 0.42 ? 1 : clamp(1 - (t - 0.42) / 0.58, 0, 1);
        const pulse = 1 + Math.sin(now * 0.05) * 0.08;
        const len = Math.hypot(W, H) * 1.15;
        shake = Math.max(0, shake - dt * 3.2);

        for (let i = 0; i < 2; i++) {
          const e = eyes[i];
          // Out and down, away from the middle of the face, tilted with the head
          const side = e.x < centre.x ? -1 : 1;
          const down = Math.atan2(0.55, 1); // about 29 degrees below horizontal
          const dirA = (side < 0 ? Math.PI - down : down) + roll * 0.6;
          const jx = (Math.random() - 0.5) * u * 0.02 * shake * 6;
          const jy = (Math.random() - 0.5) * u * 0.02 * shake * 6;

          if (fade > 0) {
            ctx.save();
            ctx.translate(e.x + jx, e.y + jy);
            ctx.rotate(dirA);
            const L = len * grow;
            const k = 0.6 + power * 0.6;
            const w0 = u * 0.04 * k;
            const w1 = u * 0.25 * k * pulse;

            const g = ctx.createLinearGradient(0, 0, L, 0);
            g.addColorStop(0, `rgba(255,255,255,${fade})`);
            g.addColorStop(0.1, `rgba(255,214,230,${fade * 0.9})`);
            g.addColorStop(0.45, `rgba(255,45,117,${fade * 0.7})`);
            g.addColorStop(1, "rgba(255,45,117,0)");

            // Wide glow, then body, then white-hot core
            for (const [scale, alpha, blur] of [[1, 0.4, u * 0.25], [0.55, 0.85, u * 0.1], [0.22, 1, 0]] as const) {
              ctx.globalAlpha = alpha;
              ctx.shadowColor = LASER;
              ctx.shadowBlur = blur;
              ctx.fillStyle = scale === 0.22 ? `rgba(255,255,255,${fade})` : g;
              ctx.beginPath();
              ctx.moveTo(0, -w0 * scale);
              ctx.lineTo(L, -w1 * scale);
              ctx.lineTo(L, w1 * scale);
              ctx.lineTo(0, w0 * scale);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          }

          // The light seems to come straight at the camera
          const fl = clamp(1 - t * 1.4, 0, 1);
          glowDisc(ctx, e.x, e.y, u * (0.18 + 0.3 * power) * (0.6 + fl * 0.6), fl * 0.95);
          flare(ctx, e.x, e.y, u * (0.35 + 0.35 * power) * (0.5 + fl), fl * 0.9);
        }

        // Shockwaves
        for (let i = rings.length - 1; i >= 0; i--) {
          const rg = rings[i];
          const age = (now - rg.at) / 520;
          if (age >= 1) {
            rings.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(255,170,205,${(1 - age) * 0.85})`;
          ctx.lineWidth = Math.max(1.5, u * 0.03 * (1 - age));
          ctx.beginPath();
          ctx.arc(rg.x, rg.y, u * (0.08 + age * 0.55), 0, TAU);
          ctx.stroke();
        }

        // A white flash at the moment of firing
        const flash = clamp(1 - sinceFire / 150, 0, 1);
        if (flash > 0) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = `rgba(255,225,238,${flash * 0.5})`;
          ctx.fillRect(0, 0, W, H);
        }
      }

      ctx.restore();
    },
  };
}

export function createFilter(id: TemplateId, labels: () => ArLabels): ArFilter {
  switch (id) {
    case "gum":
      return gumFilter(labels);
    case "laser":
      return laserFilter(labels);
  }
}
