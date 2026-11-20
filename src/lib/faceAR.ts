import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { createFilter, type ArEvent, type ArFilter, type TemplateId } from "./arFilters";

export type { ArEvent, TemplateId } from "./arFilters";

// Face tracking runs entirely in the visitor's browser. Only the library's WASM and the
// ~4MB model file are fetched (from public CDNs); no video frames ever leave the device.
const VERSION = "1.2.3";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export const openCamera = (size = { width: 960, height: 720 }) =>
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: size.width }, height: { ideal: size.height } },
    audio: false,
  });

/** Warms the HTTP cache with the model file so the first camera start is quicker. */
let prefetched = false;
export function prefetchFaceModel() {
  if (prefetched) return;
  prefetched = true;
  fetch(MODEL_URL, { priority: "low" } as RequestInit).catch(() => {
    prefetched = false;
  });
}

export async function createLandmarker({ blendshapes = false } = {}) {
  const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  const make = (delegate: "GPU" | "CPU") =>
    FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: blendshapes,
    });
  let landmarker: FaceLandmarker;
  try {
    landmarker = await make("GPU");
  } catch {
    landmarker = await make("CPU");
  }
  return { landmarker };
}

// Landmark loops used by the beauty/skin-smoothing pass (MediaPipe face mesh indices)
const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const EYE_L = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
const EYE_R = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382];
const MOUTH_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
const LIPS = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];

type RunOptions = {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  landmarker: FaceLandmarker;
  getTemplate: () => TemplateId;
  onEvent?: (e: ArEvent) => void;
};

/** Starts the draw + detect loop. Returns a stop function. */
export function runFaceAR({ video, canvas, landmarker, getTemplate, onEvent }: RunOptions) {
  const ctx = canvas.getContext("2d")!;
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d")!;
  let raf = 0;
  let lastVideoTime = -1;
  let lastNow = 0;
  let landmarks: NormalizedLandmark[] | null = null;
  let scores: Record<string, number> = {};
  let templateId: TemplateId | null = null;
  let filter: ArFilter | null = null;

  const emit = (e: ArEvent) => onEvent?.(e);

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
    const dt = Math.min(0.1, lastNow ? (now - lastNow) / 1000 : 0.016);
    lastNow = now;

    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const result = landmarker.detectForVideo(video, now);
      landmarks = result.faceLandmarks[0] ?? null;
      scores = {};
      for (const c of result.faceBlendshapes?.[0]?.categories ?? []) scores[c.categoryName] = c.score;
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

    const wanted = getTemplate();
    if (wanted !== templateId) {
      templateId = wanted;
      filter = createFilter(wanted);
      emit({ kind: "reset" });
    }

    if (landmarks && filter) {
      const lm = landmarks;
      const pt = (i: number) => ({ x: W - (ox + lm[i].x * dw), y: oy + lm[i].y * dh });
      let a = pt(234);
      let b = pt(454);
      if (a.x > b.x) [a, b] = [b, a];
      const upper = pt(13);
      const lower = pt(14);
      const lips = () => {
        const path = new Path2D();
        for (const loop of [LIPS, MOUTH_INNER]) {
          loop.forEach((i, k) => {
            const p = pt(i);
            if (k === 0) path.moveTo(p.x, p.y);
            else path.lineTo(p.x, p.y);
          });
          path.closePath();
        }
        return path;
      };
      const smooth = (amount: number, brightness = 1.07) => {
        if (!("filter" in ctx)) return;
        // Build the softened face on an offscreen canvas, then fade its edges so no seam shows
        // at the hairline or jaw.
        const w = Math.round(W * dpr);
        const h = Math.round(H * dpr);
        if (off.width !== w || off.height !== h) {
          off.width = w;
          off.height = h;
        }
        const o = offCtx;
        o.setTransform(1, 0, 0, 1, 0, 0);
        o.globalCompositeOperation = "source-over";
        o.globalAlpha = 1;
        o.filter = "none";
        o.clearRect(0, 0, w, h);
        o.setTransform(dpr, 0, 0, dpr, 0, 0);
        o.save();
        o.filter = `blur(${(1.5 * dpr).toFixed(1)}px) brightness(${brightness}) saturate(1.03)`;
        o.translate(W, 0);
        o.scale(-1, 1);
        o.drawImage(video, ox, oy, dw, dh);
        o.restore();

        // Soft mask: the face inset a little, minus eyes and lips
        let mx = 0;
        let my = 0;
        for (const i of FACE_OVAL) {
          const p = pt(i);
          mx += p.x;
          my += p.y;
        }
        mx /= FACE_OVAL.length;
        my /= FACE_OVAL.length;
        const mask = new Path2D();
        FACE_OVAL.forEach((i, k) => {
          const p = pt(i);
          const x = mx + (p.x - mx) * 0.9;
          const y = my + (p.y - my) * 0.9;
          if (k === 0) mask.moveTo(x, y);
          else mask.lineTo(x, y);
        });
        mask.closePath();
        for (const loop of [EYE_L, EYE_R, LIPS]) {
          loop.forEach((i, k) => {
            const p = pt(i);
            if (k === 0) mask.moveTo(p.x, p.y);
            else mask.lineTo(p.x, p.y);
          });
          mask.closePath();
        }
        o.globalCompositeOperation = "destination-in";
        o.filter = `blur(${(9 * dpr).toFixed(1)}px)`;
        o.fillStyle = "#fff";
        o.fill(mask, "evenodd");
        o.filter = "none";
        o.globalCompositeOperation = "source-over";

        ctx.save();
        ctx.globalAlpha = amount;
        ctx.drawImage(off, 0, 0, W, H);
        ctx.restore();
      };
      filter.draw({
        ctx,
        W,
        H,
        now,
        dt,
        pt,
        faceW: Math.hypot(b.x - a.x, b.y - a.y),
        roll: Math.atan2(b.y - a.y, b.x - a.x),
        top: pt(10),
        chin: pt(152),
        mouth: { x: (upper.x + lower.x) / 2, y: (upper.y + lower.y) / 2 },
        bs: (name) => scores[name] ?? 0,
        hasIris: lm.length > 473,
        smooth,
        lips,
        emit,
      });
    }
    drawHud(ctx, W, H, filter?.hint() ?? "", !!landmarks);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    landmarker.close();
  };
}

function drawHud(ctx: CanvasRenderingContext2D, W: number, H: number, hint: string, tracking: boolean) {
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = "600 11px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(tracking ? hint : "LOOKING FOR A FACE…", W / 2, H - 28);
  ctx.font = "500 9px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("LIVE · ON YOUR DEVICE", W / 2, H - 14);
  ctx.shadowBlur = 0;
}
