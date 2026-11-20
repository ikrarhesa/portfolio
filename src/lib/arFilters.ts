// Interactive AR filters. Each one reacts to the face (blendshapes + landmarks) and has its own art style:
//   cat   → kawaii bear: pastel, soft, thick brown outlines
//   wish  → comic-book party: flat primary colours, black ink outlines, "POOF!" bursts
//   match → hand-drawn doodles on paper: wobbly marker lines
// Everything is drawn with canvas paths, so there are no image assets to download.

export type TemplateId = "cat" | "wish" | "match";
export type ArEvent =
  | { kind: "wish" }
  | { kind: "match"; score: number; total: number }
  | { kind: "reset" };

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
const mid = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const TAU = Math.PI * 2;

// ---------- particles ----------
type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; rot: number; vr: number;
  color: string; kind: "heart" | "confetti" | "dot" | "star" | "flower" | "puff";
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

function heartPath(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.45, -s * 1.05, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.45, -s * 1.05, s, -s * 0.3, 0, s * 0.35);
  ctx.closePath();
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

function flower(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ff9db4";
  ctx.lineWidth = Math.max(1, s * 0.12);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, s * 0.45, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.32, 0, TAU);
  ctx.fill();
}

function drawParticles(ctx: CanvasRenderingContext2D, list: Particle[]) {
  for (const p of list) {
    ctx.save();
    ctx.globalAlpha = clamp(p.life / (p.max * 0.4), 0, 1);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.kind === "heart") {
      heartPath(ctx, p.size);
      ctx.fill();
    } else if (p.kind === "star") {
      sparkle(ctx, p.size);
      ctx.fill();
    } else if (p.kind === "flower") {
      flower(ctx, p.size);
    } else if (p.kind === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.4, 0, TAU);
      ctx.fill();
    } else if (p.kind === "puff") {
      ctx.strokeStyle = "#141414";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * (1.4 - p.life / p.max), 0, TAU);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

// ====================================================================================
// 1. Cutie Bear: kawaii pastel. Ears wiggle, brows perk them up, smiles pop flowers.
// ====================================================================================
const BEAR_OUT = "#6b4129";

function bearFilter(): ArFilter {
  const bits: Particle[] = [];
  let perk = 0;
  let kick = 0; // short ear wiggle after a blink
  let wasBlink = false;
  let lastPetal = 0;

  return {
    hint: () => "Smile · raise your eyebrows · blink",
    draw(f) {
      const { ctx, pt, faceW: u, roll, top, now, dt } = f;
      perk += (f.bs("browInnerUp") - perk) * 0.25;
      kick = Math.max(0, kick - dt * 3);
      const smile = (f.bs("mouthSmileLeft") + f.bs("mouthSmileRight")) / 2;
      const blink = Math.min(f.bs("eyeBlinkLeft"), f.bs("eyeBlinkRight"));
      const lw = Math.max(2.5, u * 0.035);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // 1. Beauty pass: soft, bright skin (eyes and lips stay sharp)
      f.smooth(0.22, 1.03);

      // Lipstick with a little gloss
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(235,95,125,0.2)";
      ctx.fill(f.lips(), "evenodd");
      ctx.restore();
      if (f.bs("jawOpen") < 0.3) {
        const lc = pt(17);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.ellipse(lc.x, lc.y - u * 0.012, u * 0.07, u * 0.014, roll, 0, TAU);
        ctx.fill();
      }

      const eyeA = mid(pt(159), pt(145));
      const eyeB = mid(pt(386), pt(374));

      // A blink pops a burst of sparkles and wiggles the ears
      const blinking = blink > 0.4;
      if (blinking && !wasBlink) {
        kick = 1;
        for (const e of [eyeA, eyeB]) {
          for (let i = 0; i < 8; i++) {
            const a = rand(-Math.PI * 0.95, -Math.PI * 0.05);
            const sp = rand(60, 170);
            spawn(bits, {
              kind: "star",
              color: pick(["#ffffff", "#fff3a6", "#ffc2d4", "#d9c2ff"]),
              x: e.x,
              y: e.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              size: rand(u * 0.05, u * 0.1),
              rot: rand(0, 3),
              vr: rand(-4, 4),
              life: rand(0.7, 1.1),
            });
          }
        }
      }
      wasBlink = blinking;

      // 2. Soft brown bear ears. The base fades out so they look tucked into the hair, not stuck on.
      ctx.save();
      ctx.translate(top.x, top.y);
      ctx.rotate(roll);
      for (const side of [-1, 1]) {
        ctx.save();
        const lift = perk * 0.07 + kick * 0.05;
        ctx.translate(side * u * 0.37, -u * 0.1 - lift * u);
        ctx.rotate(side * (0.28 + perk * 0.1) + Math.sin(now / 90) * kick * 0.18 * side + Math.sin(now / 260 + side * 1.7) * 0.04);
        const r = u * 0.21 * (1 + perk * 0.12);

        const fur = ctx.createLinearGradient(0, -r, 0, r * 0.95);
        fur.addColorStop(0, "#a06b48");
        fur.addColorStop(0.55, "#8a5a3b");
        fur.addColorStop(1, "rgba(138,90,59,0)");
        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.95, 0, 0, TAU);
        ctx.fill();

        const rim = ctx.createLinearGradient(0, -r, 0, r * 0.75);
        rim.addColorStop(0, "#4e2f1e");
        rim.addColorStop(0.65, "rgba(78,47,30,0.85)");
        rim.addColorStop(1, "rgba(78,47,30,0)");
        ctx.strokeStyle = rim;
        ctx.lineWidth = lw * 0.9;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.95, 0, 0, TAU);
        ctx.stroke();

        const inner = ctx.createLinearGradient(0, -r * 0.45, 0, r * 0.75);
        inner.addColorStop(0, "#f8c9cf");
        inner.addColorStop(0.6, "#ee9fae");
        inner.addColorStop(1, "rgba(238,159,174,0)");
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.ellipse(0, r * 0.12, r * 0.56, r * 0.5, 0, 0, TAU);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.55, r * 0.22, r * 0.09, -0.6, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 3. Soft blush that glows more as you smile
      for (const [idx, edge] of [[205, 234], [425, 454]] as const) {
        const e = pt(edge);
        const q = pt(idx);
        const c = { x: q.x + (e.x - q.x) * 0.25, y: q.y + (e.y - q.y) * 0.25 };
        const r = u * 0.17;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        g.addColorStop(0, `rgba(255,110,140,${0.18 + smile * 0.14})`);
        g.addColorStop(1, "rgba(255,98,135,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, r, r * 0.72, roll, 0, TAU);
        ctx.fill();
      }

      // 4. Button nose
      const n = pt(1);
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(roll);
      ctx.fillStyle = BEAR_OUT;
      ctx.beginPath();
      ctx.ellipse(0, 0, u * 0.09, u * 0.068, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.ellipse(-u * 0.033, -u * 0.024, u * 0.03, u * 0.018, -0.3, 0, TAU);
      ctx.fill();
      ctx.restore();

      // 5. Eyes: sparkly catchlights, or happy closed eyes while blinking
      if (blinking) {
        ctx.strokeStyle = "#8a4a3a";
        ctx.lineWidth = lw * 1.2;
        for (const e of [eyeA, eyeB]) {
          ctx.beginPath();
          ctx.arc(e.x, e.y + u * 0.04, u * 0.065, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        }
      } else if (f.hasIris) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        for (const idx of [468, 473]) {
          const ir = pt(idx);
          ctx.beginPath();
          ctx.arc(ir.x + u * 0.016, ir.y - u * 0.018, u * 0.011, 0, TAU);
          ctx.fill();
        }
      }

      // 6. Glitter that twinkles on the cheekbones and temples
      ctx.fillStyle = "#fff8c9";
      for (const [k, idx] of ([116, 345, 54, 284] as const).entries()) {
        const gp = pt(idx);
        const tw = 0.5 + 0.5 * Math.sin(now / 260 + k * 1.9);
        ctx.save();
        ctx.globalAlpha = 0.25 + tw * 0.75;
        ctx.translate(gp.x + (k % 2 ? 1 : -1) * u * 0.06, gp.y - u * 0.02);
        sparkle(ctx, u * (0.016 + tw * 0.022));
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // 7. Smiling floats little flowers up beside the head
      if (smile > 0.5 && now - lastPetal > 150) {
        lastPetal = now;
        const side = Math.random() < 0.5 ? -1 : 1;
        const base = pt(side < 0 ? 234 : 454);
        spawn(bits, {
          kind: "flower",
          color: "#fff",
          x: base.x,
          y: base.y - u * 0.15,
          vx: rand(10, 45) * (base.x < f.mouth.x ? -1 : 1),
          vy: rand(-70, -130),
          size: rand(u * 0.06, u * 0.1),
          rot: rand(-0.5, 0.5),
          vr: rand(-1.5, 1.5),
        });
      }
      step(bits, dt, -10);
      drawParticles(ctx, bits);
    },
  };
}

// ====================================================================================
// 2. Make a wish: comic-book pop. Flat colours, black ink, halftone-free but bold.
// ====================================================================================
const INK = "#141414";
const RED = "#ee4266";
const YEL = "#ffd23f";
const TEAL = "#2ec4b6";
const BLUE = "#3a86ff";
const ORANGE = "#ff9f1c";
const POP = [RED, YEL, TEAL, BLUE, ORANGE, "#ffffff"];
const COMIC_FONT = '900 italic %spx "Arial Black", Impact, "Helvetica Neue", sans-serif';

function comicBurst(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, spikes: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = rot + (i * Math.PI) / spikes;
    const rr = i % 2 ? r * 0.66 : r;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function flameShape(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, lean: number) {
  ctx.beginPath();
  ctx.moveTo(x + lean, y - 15 * s);
  ctx.bezierCurveTo(x + 8 * s + lean * 0.4, y - 6 * s, x + 7 * s, y + 4 * s, x, y + 4 * s);
  ctx.bezierCurveTo(x - 7 * s, y + 4 * s, x - 8 * s + lean * 0.2, y - 6 * s, x + lean, y - 15 * s);
  ctx.closePath();
}

function wishFilter(): ArFilter {
  const confetti: Particle[] = [];
  let lit = true;
  let blowT = 0;
  let outAt = 0;

  return {
    hint: () => (lit ? "Open your mouth to blow out the candles" : "Wish granted!"),
    draw(f) {
      const { ctx, W, H, faceW: u, roll, top, chin, now, dt } = f;
      const blow = Math.max(f.bs("jawOpen"), f.bs("mouthPucker"));
      const lw = Math.max(2.5, u * 0.035);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = INK;

      if (lit) {
        blowT = blow > 0.4 ? blowT + dt : Math.max(0, blowT - dt * 2);
        if (blowT > 0.3) {
          lit = false;
          outAt = now;
          for (let i = 0; i < 100; i++) {
            const a = rand(-Math.PI, 0);
            const sp = rand(140, 540);
            spawn(confetti, {
              kind: Math.random() < 0.3 ? "dot" : "confetti",
              color: pick(POP),
              x: f.mouth.x,
              y: f.mouth.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              size: rand(8, 15),
              rot: rand(0, 6),
              vr: rand(-9, 9),
              life: rand(1.6, 2.8),
            });
          }
          f.emit({ kind: "wish" });
        }
      } else if (now - outAt > 6000) {
        lit = true;
        blowT = 0;
        f.emit({ kind: "reset" });
      }

      // Party hat: red cone with yellow bands, inked outline
      ctx.save();
      ctx.translate(top.x, top.y);
      ctx.rotate(roll);
      ctx.translate(u * 0.12, -u * 0.06);
      ctx.rotate(0.22);
      const hw = u * 0.6;
      const hh = u * 0.9;
      ctx.beginPath();
      ctx.moveTo(-hw / 2, 0);
      ctx.lineTo(0, -hh);
      ctx.lineTo(hw / 2, 0);
      ctx.closePath();
      ctx.fillStyle = RED;
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = YEL;
      for (const k of [0.22, 0.48, 0.74]) ctx.fillRect(-hw / 2, -hh * k - hh * 0.05, hw, hh * 0.09);
      ctx.restore();
      ctx.lineWidth = lw * 1.2;
      ctx.stroke();
      ctx.fillStyle = YEL;
      ctx.beginPath();
      ctx.arc(0, -hh, u * 0.07, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Cake below the chin
      const cw = u * 1.1;
      const chh = u * 0.42;
      const cx = chin.x;
      const cy = Math.min(H - chh - 28, chin.y + u * 0.3);
      ctx.lineWidth = lw;
      ctx.fillStyle = BLUE;
      ctx.beginPath();
      ctx.roundRect(cx - cw / 2, cy + chh * 0.4, cw, chh * 0.6, u * 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = YEL;
      ctx.beginPath();
      ctx.roundRect(cx - cw * 0.42, cy, cw * 0.84, chh * 0.5, u * 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(cx - cw * 0.42, cy + chh * 0.1);
      for (let i = 0; i < 5; i++) {
        const x0 = cx - cw * 0.42 + cw * 0.84 * (i / 5);
        const x1 = cx - cw * 0.42 + cw * 0.84 * ((i + 1) / 5);
        ctx.quadraticCurveTo((x0 + x1) / 2, cy + chh * (i % 2 ? 0.42 : 0.3), x1, cy + chh * 0.1);
      }
      ctx.lineTo(cx + cw * 0.42, cy);
      ctx.lineTo(cx - cw * 0.42, cy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (const [i, dx] of [-0.3, 0, 0.3].entries()) {
        const x = cx + dx * cw;
        const cH = u * 0.22;
        ctx.fillStyle = i % 2 ? TEAL : RED;
        ctx.beginPath();
        ctx.roundRect(x - u * 0.03, cy - cH, u * 0.06, cH + 2, 2);
        ctx.fill();
        ctx.lineWidth = lw * 0.8;
        ctx.stroke();
        if (lit) {
          const b = clamp(blow, 0, 1);
          const s = (1 - b * 0.45) * (u / 100) * 1.1;
          const lean = b * 8 + Math.sin(now / 80 + i * 2) * 1.4;
          ctx.fillStyle = ORANGE;
          ctx.lineWidth = lw * 0.7;
          flameShape(ctx, x, cy - cH - 3, s, lean);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = YEL;
          flameShape(ctx, x, cy - cH - 1, s * 0.5, lean * 0.5);
          ctx.fill();
        } else if (now - outAt < 1000) {
          spawn(confetti, { kind: "puff", color: "#e5e5e5", x, y: cy - cH - 6, vy: -50, vx: rand(-8, 8), size: 6, life: 0.9 });
        }
      }

      step(confetti, dt, 540);
      for (const p of confetti) if (p.kind !== "puff") p.vx *= 0.995;
      drawParticles(ctx, confetti);

      // "POOF!" burst, then a banner
      const since = now - outAt;
      if (!lit && since < 1100) {
        const t = clamp(since / 220, 0, 1);
        const pop = 1 - Math.pow(1 - t, 3);
        // Beside the head so it never sits on the hat or the face
        const bx = top.x + u * 0.95 > W - 60 ? top.x - u * 0.95 : top.x + u * 0.95;
        const by = Math.max(70, top.y + u * 0.35);
        ctx.save();
        ctx.translate(clamp(bx, 60, W - 60), by);
        ctx.rotate(-0.1);
        ctx.scale(pop, pop);
        ctx.fillStyle = YEL;
        ctx.lineWidth = lw;
        comicBurst(ctx, 0, 0, u * 0.55, 11, 0);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.font = COMIC_FONT.replace("%s", String(Math.round(u * 0.2)));
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("POOF!", 0, 2);
        ctx.restore();
      } else if (!lit && since < 4800) {
        ctx.save();
        ctx.translate(W / 2, 40);
        ctx.rotate(-0.05);
        ctx.font = COMIC_FONT.replace("%s", "15");
        const tw = ctx.measureText("WISH GRANTED!").width + 26;
        ctx.fillStyle = YEL;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -17, tw, 34, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("WISH GRANTED!", 0, 1);
        ctx.restore();
      }
      ctx.textBaseline = "alphabetic";
    },
  };
}

// ====================================================================================
// 3. Face Match: hand-drawn doodles on paper. Wobbly marker lines that "boil".
// ====================================================================================
const MARK = "#1f2a44";
const PAPER = "#fffdf5";
const CORAL = "#ff6b5b";
const SUN = "#ffe66d";
const SKY = "#6bcbef";
const DOODLE_FONT = '700 %spx "Marker Felt","Bradley Hand","Segoe Print","Comic Sans MS",cursive';

const wob = (i: number, tick: number) => Math.sin(i * 12.9898 + tick * 78.233);

function wobbleEllipse(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, tick: number, amp = 0.045, n = 28
) {
  ctx.beginPath();
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * TAU;
    const j = 1 + amp * wob(k % n, tick);
    const x = cx + Math.cos(a) * rx * j;
    const y = cy + Math.sin(a) * ry * j;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

type DoodleKind = "smile" | "wow" | "wink" | "kiss" | "brows";

function doodleFace(ctx: CanvasRenderingContext2D, kind: DoodleKind, cx: number, cy: number, r: number, tick: number) {
  ctx.lineWidth = Math.max(2, r * 0.11);
  ctx.strokeStyle = MARK;
  ctx.fillStyle = SUN;
  wobbleEllipse(ctx, cx, cy, r, r, tick);
  ctx.fill();
  ctx.stroke();

  const ex = r * 0.38;
  const ey = -r * 0.18;
  const dot = (x: number, y: number) => {
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(cx + x, cy + y, r * 0.09, 0, TAU);
    ctx.fill();
  };
  const smileArc = (y: number, w: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy + y, w, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  };

  if (kind === "smile") {
    dot(-ex, ey);
    dot(ex, ey);
    smileArc(r * 0.02, r * 0.55);
  } else if (kind === "wow") {
    dot(-ex, ey);
    dot(ex, ey);
    ctx.fillStyle = CORAL;
    wobbleEllipse(ctx, cx, cy + r * 0.42, r * 0.2, r * 0.28, tick + 3);
    ctx.fill();
    ctx.stroke();
  } else if (kind === "wink") {
    dot(-ex, ey);
    ctx.beginPath();
    ctx.moveTo(cx + ex - r * 0.16, ey + cy);
    ctx.lineTo(cx + ex + r * 0.16, ey + cy);
    ctx.stroke();
    smileArc(r * 0.05, r * 0.45);
  } else if (kind === "kiss") {
    dot(-ex, ey);
    dot(ex, ey);
    ctx.fillStyle = CORAL;
    wobbleEllipse(ctx, cx - r * 0.04, cy + r * 0.42, r * 0.13, r * 0.1, tick + 5);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(cx + r * 0.62, cy + r * 0.12);
    ctx.rotate(0.3);
    ctx.fillStyle = CORAL;
    heartPath(ctx, r * 0.22);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else {
    dot(-ex, ey);
    dot(ex, ey);
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + s * ex, cy + ey - r * 0.3, r * 0.22, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.42, r * 0.1, r * 0.12, 0, 0, TAU);
    ctx.stroke();
  }
}

type Expression = { kind: DoodleKind; label: string; test: (f: FaceFrame) => boolean };

const EXPRESSIONS: Expression[] = [
  { kind: "smile", label: "Big smile!", test: (f) => (f.bs("mouthSmileLeft") + f.bs("mouthSmileRight")) / 2 > 0.55 },
  { kind: "wow", label: "Open wide!", test: (f) => f.bs("jawOpen") > 0.5 },
  {
    kind: "wink",
    label: "Wink!",
    test: (f) => {
      const l = f.bs("eyeBlinkLeft");
      const r = f.bs("eyeBlinkRight");
      return (l > 0.55 && r < 0.3) || (r > 0.55 && l < 0.3);
    },
  },
  { kind: "kiss", label: "Blow a kiss!", test: (f) => f.bs("mouthPucker") > 0.5 && f.bs("jawOpen") < 0.4 },
  {
    kind: "brows",
    label: "Raise your brows!",
    test: (f) => (f.bs("browInnerUp") + f.bs("browOuterUpLeft") + f.bs("browOuterUpRight")) / 3 > 0.5,
  },
];

const ROUND_TIME = 4;
const HOLD_TIME = 0.3;
const PAUSE_TIME = 0.8;
const DONE_TIME = 5;

function starRow(ctx: CanvasRenderingContext2D, cx: number, y: number, total: number, score: number, s: number, tick: number) {
  const gap = s * 2.4;
  for (let i = 0; i < total; i++) {
    ctx.save();
    ctx.translate(cx + (i - (total - 1) / 2) * gap, y);
    ctx.rotate(wob(i, tick) * 0.12);
    ctx.lineWidth = Math.max(1.8, s * 0.2);
    ctx.strokeStyle = MARK;
    ctx.fillStyle = i < score ? SUN : "rgba(255,255,255,0)";
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const rr = k % 2 ? s * 0.45 : s;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function matchFilter(): ArFilter {
  const bits: Particle[] = [];
  const total = EXPRESSIONS.length;
  let order: number[] = [];
  let round = 0;
  let score = 0;
  let roundT = 0;
  let holdT = 0;
  let phase: "play" | "between" | "done" = "play";
  let phaseT = 0;
  let lastWon = false;

  const restart = () => {
    order = EXPRESSIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
    round = 0;
    score = 0;
    roundT = 0;
    holdT = 0;
    phase = "play";
    phaseT = 0;
  };
  restart();

  const burst = (x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) {
      spawn(bits, {
        kind: "star",
        color: pick([SUN, CORAL, SKY]),
        x,
        y,
        vx: rand(-150, 150),
        vy: rand(-230, -60),
        size: rand(5, 10),
        rot: rand(-0.5, 0.5),
        vr: rand(-3, 3),
        life: rand(0.8, 1.4),
      });
    }
  };

  return {
    hint: () => (phase === "done" ? "Nice! Replaying in a moment" : EXPRESSIONS[order[round]].label),
    draw(f) {
      const { ctx, W, faceW: u, top, dt, now } = f;
      const tick = Math.floor(now / 140); // lines re-wobble a few times a second, like a flip-book
      const cur = EXPRESSIONS[order[round]];
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      if (phase === "play") {
        roundT += dt;
        holdT = cur.test(f) ? holdT + dt : Math.max(0, holdT - dt);
        if (holdT >= HOLD_TIME) {
          score++;
          lastWon = true;
          phase = "between";
          phaseT = 0;
        } else if (roundT >= ROUND_TIME) {
          lastWon = false;
          phase = "between";
          phaseT = 0;
        }
      } else if (phase === "between") {
        phaseT += dt;
        if (phaseT >= PAUSE_TIME) {
          round++;
          roundT = 0;
          holdT = 0;
          phaseT = 0;
          if (round >= total) {
            phase = "done";
            f.emit({ kind: "match", score, total });
          } else {
            phase = "play";
          }
        }
      } else {
        phaseT += dt;
        if (phaseT >= DONE_TIME) {
          restart();
          f.emit({ kind: "reset" });
        }
      }

      if (phase !== "done") {
        // Speech bubble above the head with the face to copy
        let rx = Math.min(u * 0.62, W * 0.36);
        let ry = rx * 0.95;
        // Shrink the bubble if the head is near the top of the frame, so it never lands on the face
        const room = top.y - u * 0.3 - 36;
        const k = room < ry * 2 ? clamp(room / (ry * 2), 0.6, 1) : 1;
        rx *= k;
        ry *= k;
        const gap = k < 1 ? u * 0.3 : u * 0.45;
        const bx = clamp(top.x, rx + 6, W - rx - 6);
        const by = Math.max(ry + 36, top.y - gap - ry);
        ctx.lineWidth = Math.max(2.5, u * 0.03);
        ctx.strokeStyle = MARK;
        ctx.fillStyle = PAPER;
        wobbleEllipse(ctx, bx, by, rx, ry, tick, 0.03);
        ctx.fill();
        ctx.stroke();

        // Highlighter fills behind the face while you hold the right expression
        if (phase === "play" && holdT > 0) {
          ctx.fillStyle = "rgba(255,107,91,0.35)";
          wobbleEllipse(ctx, bx, by - ry * 0.18, rx * 0.8 * (holdT / HOLD_TIME), rx * 0.8 * (holdT / HOLD_TIME), tick, 0.06);
          ctx.fill();
        }
        doodleFace(ctx, cur.kind, bx, by - ry * 0.2, rx * 0.46, tick);

        ctx.fillStyle = MARK;
        ctx.font = DOODLE_FONT.replace("%s", String(Math.round(rx * 0.24)));
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cur.label, bx, by + ry * 0.58, rx * 1.7);

        if (phase === "play") {
          // Time bar: a marker line that shrinks
          ctx.strokeStyle = CORAL;
          ctx.lineWidth = Math.max(3, u * 0.04);
          ctx.beginPath();
          ctx.moveTo(bx - rx * 0.6, by + ry * 0.78);
          ctx.lineTo(bx - rx * 0.6 + rx * 1.2 * (1 - roundT / ROUND_TIME), by + ry * 0.78 + wob(1, tick) * 1.5);
          ctx.stroke();
        } else {
          // Marker tick or cross stamped on the bubble
          ctx.strokeStyle = lastWon ? "#2fb36d" : CORAL;
          ctx.lineWidth = Math.max(4, u * 0.06);
          ctx.beginPath();
          const sx = bx + rx * 0.78;
          const sy = by - ry * 0.7;
          const q = rx * 0.2;
          if (lastWon) {
            ctx.moveTo(sx - q, sy);
            ctx.lineTo(sx - q * 0.2, sy + q * 0.8);
            ctx.lineTo(sx + q, sy - q * 0.8);
          } else {
            ctx.moveTo(sx - q, sy - q);
            ctx.lineTo(sx + q, sy + q);
            ctx.moveTo(sx + q, sy - q);
            ctx.lineTo(sx - q, sy + q);
          }
          ctx.stroke();
          if (lastWon && phaseT < 0.05) burst(bx, by, 22);
        }

        // Round tag with stars
        ctx.save();
        ctx.translate(W / 2, 22);
        ctx.rotate(-0.03);
        ctx.fillStyle = PAPER;
        ctx.strokeStyle = MARK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-62, -14, 124, 28, 8);
        ctx.fill();
        ctx.stroke();
        starRow(ctx, 0, 0, total, score, 7, tick);
        ctx.restore();
      } else {
        // Result card
        const msg = score >= total ? "Mind reader!" : score >= 3 ? "Nicely done!" : "Keep practising!";
        const cw = Math.min(W * 0.78, 220);
        ctx.save();
        ctx.translate(W / 2, 92);
        ctx.rotate(-0.04);
        ctx.fillStyle = PAPER;
        ctx.strokeStyle = MARK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -52, cw, 104, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = SUN;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-cw * 0.3, 6, cw * 0.6, 14);
        ctx.globalAlpha = 1;
        ctx.fillStyle = MARK;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = DOODLE_FONT.replace("%s", "36");
        ctx.fillText(`${score}/${total}`, 0, -18);
        ctx.font = DOODLE_FONT.replace("%s", "14");
        ctx.fillText(`faces read · ${msg}`, 0, 13);
        starRow(ctx, 0, 36, total, score, 8, tick);
        ctx.restore();
        if (phaseT < 0.05) burst(W / 2, 92, 30);
      }
      ctx.textBaseline = "alphabetic";

      step(bits, dt, 260);
      drawParticles(ctx, bits);
    },
  };
}

export function createFilter(id: TemplateId): ArFilter {
  if (id === "wish") return wishFilter();
  if (id === "match") return matchFilter();
  return bearFilter();
}
