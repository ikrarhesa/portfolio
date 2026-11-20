import { createLandmarker, openCamera } from "./faceAR";
import type { ControlKey } from "../hooks/useSpaceInvaders";

export type HeadStatus = "loading" | "calibrating" | "tracking" | "lost" | "error";

/**
 * Camera steering is for desktop and tablet only. Phones are excluded (touch device with a small
 * screen), and so is anything without a camera API.
 */
export function canUseHeadControl() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return false;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const smallestSide = Math.min(window.screen.width, window.screen.height);
  return !(touch && smallestSide < 600);
}

const DETECT_INTERVAL_MS = 66; // ~15 fps is plenty for steering
const CALIBRATION_SAMPLES = 12;
const DEAD_ZONE = 0.03; // fraction of the frame width around the calibrated centre where the ship holds still
const FULL_TILT = 0.16; // head offset (fraction of frame width) that gives full speed
const SMOOTHING = 0.35; // 0..1, lower is smoother

type Options = {
  video: HTMLVideoElement;
  setControl: (key: ControlKey, pressed: boolean) => void;
  setSteer: (value: number) => void;
  onStatus: (status: HeadStatus) => void;
};

/**
 * Steers the ship with the nose position and auto-fires while a face is visible.
 * Everything runs in the browser. Returns a stop function that also turns the camera off.
 */
export function startHeadControl({ video, setControl, setSteer, onStatus }: Options) {
  let stopped = false;
  let timer = 0;
  let stream: MediaStream | null = null;
  let closeLandmarker: (() => void) | null = null;
  let status: HeadStatus | null = null;

  const report = (s: HeadStatus) => {
    if (s !== status) {
      status = s;
      onStatus(s);
    }
  };
  let steer = 0;
  const release = () => {
    steer = 0;
    setSteer(0);
    setControl("Space", false);
  };

  (async () => {
    report("loading");
    try {
      const [{ landmarker }, media] = await Promise.all([
        createLandmarker(),
        openCamera({ width: 320, height: 240 }),
      ]);
      if (stopped) {
        landmarker.close();
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream = media;
      closeLandmarker = () => landmarker.close();
      video.srcObject = media;
      await video.play();
      if (stopped) return;

      report("calibrating");
      const samples: number[] = [];
      let centre = 0.5;
      let lastTime = -1;

      timer = window.setInterval(() => {
        if (video.readyState < 2 || video.currentTime === lastTime) return;
        lastTime = video.currentTime;
        const face = landmarker.detectForVideo(video, performance.now()).faceLandmarks[0];
        if (!face) {
          release();
          if (samples.length >= CALIBRATION_SAMPLES) report("lost");
          return;
        }
        const x = face[1].x; // nose tip, 0..1 across the (unmirrored) camera frame

        if (samples.length < CALIBRATION_SAMPLES) {
          samples.push(x);
          if (samples.length === CALIBRATION_SAMPLES) {
            centre = samples.reduce((a, b) => a + b, 0) / samples.length;
            report("tracking");
          }
          return;
        }

        report("tracking");
        // The camera frame is not mirrored: moving your head to your right lowers x
        // The further you lean, the faster the ship goes, so small moves give small nudges
        const offset = centre - x;
        const beyond = Math.max(0, Math.abs(offset) - DEAD_ZONE) / (FULL_TILT - DEAD_ZONE);
        const target = Math.sign(offset) * Math.min(1, beyond) ** 1.5;
        steer += (target - steer) * SMOOTHING;
        setSteer(steer);
        setControl("Space", true);
      }, DETECT_INTERVAL_MS);
    } catch {
      if (!stopped) report("error");
    }
  })();

  return () => {
    stopped = true;
    clearInterval(timer);
    release();
    stream?.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
    closeLandmarker?.();
  };
}
