import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { INVADER } from "../constants/invader";

export type TemplateId = "neon" | "pixel" | "glitch";
type Connection = { start: number; end: number };

// Face tracking runs entirely in the visitor's browser. Only the library's WASM and the
// ~4MB model file are fetched (from public CDNs); no video frames ever leave the device.
const VERSION = "1.2.3";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export const openCamera = () =>
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 720 } },
    audio: false,
  });

export async function createLandmarker() {
  const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  const make = (delegate: "GPU" | "CPU") =>
    FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO",
      numFaces: 1,
    });
  let landmarker: FaceLandmarker;
  try {
    landmarker = await make("GPU");
  } catch {
    landmarker = await make("CPU");
  }
  return { landmarker, oval: FaceLandmarker.FACE_LANDMARKS_FACE_OVAL as Connection[] };
}

// Deterministic pseudo-random in [0, 1) so glitch bands hold still between ticks
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

type RunOptions = {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  landmarker: FaceLandmarker;
  oval: Connection[];
  getTemplate: () => TemplateId;
};

/** Starts the draw + detect loop. Returns a stop function. */
export function runFaceAR({ video, canvas, landmarker, oval, getTemplate }: RunOptions) {
  const ctx = canvas.getContext("2d")!;
  let raf = 0;
  let lastVideoTime = -1;
  let landmarks: NormalizedLandmark[] | null = null;
  const box = { x: 0, y: 0, w: 0, h: 0, ready: false };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (!W || !H || video.readyState < 2 || !video.videoWidth) return;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      landmarks = landmarker.detectForVideo(video, now).faceLandmarks[0] ?? null;
    }

    // Camera frame, cover-fit and mirrored like a selfie
    const s = Math.max(W / video.videoWidth, H / video.videoHeight);
    const dw = video.videoWidth * s;
    const dh = video.videoHeight * s;
    const ox = (W - dw) / 2;
    const oy = (H - dh) / 2;
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, ox, oy, dw, dh);
    ctx.restore();

    const template = getTemplate();
    if (landmarks) {
      const pt = (i: number) => ({ x: W - (ox + landmarks![i].x * dw), y: oy + landmarks![i].y * dh });
      drawEffects(ctx, canvas, pt, oval, template, box, now, W, H, dpr);
    }
    drawHud(ctx, W, H, template, !!landmarks, now);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    landmarker.close();
  };
}

type Pt = (i: number) => { x: number; y: number };

function drawEffects(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  pt: Pt,
  oval: Connection[],
  template: TemplateId,
  box: { x: number; y: number; w: number; h: number; ready: boolean },
  now: number,
  W: number,
  H: number,
  dpr: number
) {
  // Smoothed bounding box of the face oval
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of oval) {
    const p = pt(c.start);
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  const k = box.ready ? 0.35 : 1;
  box.x += (minX - box.x) * k;
  box.y += (minY - box.y) * k;
  box.w += (maxX - minX - box.w) * k;
  box.h += (maxY - minY - box.h) * k;
  box.ready = true;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;

  const ovalStroke = (scale: number) => {
    ctx.beginPath();
    for (const c of oval) {
      const a = pt(c.start);
      const b = pt(c.end);
      ctx.moveTo(cx + (a.x - cx) * scale, cy + (a.y - cy) * scale);
      ctx.lineTo(cx + (b.x - cx) * scale, cy + (b.y - cy) * scale);
    }
  };

  if (template === "neon") {
    for (let i = 0; i < 3; i++) {
      const t = (now / 2400 + i / 3) % 1;
      ctx.globalAlpha = (1 - t) * 0.8;
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ovalStroke(1 + 0.5 * t);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowColor = "#e879f9";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "#f0abfc";
    ctx.lineWidth = 3;
    ovalStroke(1);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  if (template === "pixel") {
    // Head roll from the cheek landmarks, so the hat tilts with the head
    let a = pt(234);
    let b = pt(454);
    if (a.x > b.x) [a, b] = [b, a];
    const faceW = Math.hypot(b.x - a.x, b.y - a.y);
    const roll = Math.atan2(b.y - a.y, b.x - a.x);
    const top = pt(10);
    const u = (faceW * 0.9) / 11;
    const lift = 8 * u * 0.75 + Math.sin(now / 260) * u * 0.6;
    ctx.save();
    ctx.translate(top.x + Math.sin(roll) * lift, top.y - Math.cos(roll) * lift);
    ctx.rotate(roll);
    ctx.fillStyle = "#f0abfc";
    ctx.shadowColor = "#e879f9";
    ctx.shadowBlur = 10;
    INVADER.forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) ctx.fillRect((x - 5.5) * u, (y - 4) * u, u * 0.88, u * 0.88);
      })
    );
    ctx.restore();

    for (let i = 0; i < 10; i++) {
      const t = (now / 3000 + i * 0.37) % 1;
      ctx.globalAlpha = Math.sin(Math.PI * t);
      ctx.fillStyle = i % 2 ? "#22d3ee" : "#e879f9";
      ctx.fillRect(cx + Math.cos(i * 2.1) * box.w * 0.6, cy + box.h * 0.4 - t * box.h * 0.9, u * 0.8, u * 0.8);
    }
    ctx.globalAlpha = 1;
  }

  if (template === "glitch") {
    const tick = Math.floor(now / 110);
    // Horizontal slices of the camera frame shifted sideways
    for (let n = 0; n < 4; n++) {
      const y = Math.max(0, Math.min(H - 20, box.y + rnd(tick * 3 + n) * box.h));
      const bh = 6 + rnd(tick * 7 + n) * 14;
      const shift = (rnd(tick * 5 + n) - 0.5) * 28;
      ctx.drawImage(canvas, 0, y * dpr, canvas.width, bh * dpr, shift, y, W, bh);
    }
    // Cyan / magenta ghost copies of the face
    const jitter = (rnd(tick) - 0.5) * 8;
    ctx.globalCompositeOperation = "screen";
    [
      ["rgba(34,211,238,0.4)", -4 + jitter],
      ["rgba(232,121,249,0.4)", 4 - jitter],
    ].forEach(([color, dx]) => {
      ctx.fillStyle = color as string;
      ctx.beginPath();
      oval.forEach((c, i) => {
        const p = pt(c.start);
        if (i === 0) ctx.moveTo(p.x + (dx as number), p.y);
        else ctx.lineTo(p.x + (dx as number), p.y);
      });
      ctx.closePath();
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
  }

  // Landmark dots (every 5th of the 468 mesh points)
  ctx.fillStyle = "rgba(240,171,252,0.85)";
  for (let i = 0; i < 468; i += 5) {
    const p = pt(i);
    ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
  }

  // Tracking brackets around the face
  const pad = 14;
  const bx = box.x - pad, by = box.y - pad, bw = box.w + pad * 2, bh = box.h + pad * 2;
  const len = Math.min(bw, bh) * 0.2;
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(bx, by + len); ctx.lineTo(bx, by); ctx.lineTo(bx + len, by);
  ctx.moveTo(bx + bw - len, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + len);
  ctx.moveTo(bx, by + bh - len); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + len, by + bh);
  ctx.moveTo(bx + bw - len, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - len);
  ctx.stroke();
}

function drawHud(ctx: CanvasRenderingContext2D, W: number, H: number, template: TemplateId, tracking: boolean, now: number) {
  ctx.font = "600 11px ui-monospace, SFMono-Regular, monospace";
  ctx.textBaseline = "alphabetic";
  if (Math.floor(now / 550) % 2 === 0) {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(18, 20, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.fillText("REC", 28, 24);
  ctx.fillStyle = "#f0abfc";
  ctx.textAlign = "right";
  ctx.fillText(template.toUpperCase(), W - 14, 24);

  ctx.font = "500 10px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.textAlign = "left";
  ctx.fillText(tracking ? "LIVE · ON YOUR DEVICE" : "LOOKING FOR A FACE…", 14, H - 14);
}
