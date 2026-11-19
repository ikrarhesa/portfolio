/**
 * Space Invaders audio, synthesized live with the Web Audio API (no audio files, nothing to license).
 *  - Music: a looping synthwave pattern (kick, snare, hats, bass, arpeggio, lead) that speeds up as the
 *    alien wave thins out.
 *  - SFX: shoot, alien hit, UFO (looping warble + bonus), player hit, level up, game over.
 * Music and SFX are toggled separately, and the choice is remembered. Browsers only allow audio after a
 * user gesture, so `begin()` must be called from a click (the START / RETRY buttons).
 */

const KEY_MUSIC = "hesa_invaders_music";
const KEY_SFX = "hesa_invaders_sfx";

const readPref = (key: string) => {
  try {
    return localStorage.getItem(key) !== "0"; // on by default
  } catch {
    return true;
  }
};
const writePref = (key: string, on: boolean) => {
  try {
    localStorage.setItem(key, on ? "1" : "0");
  } catch {
    /* storage can be blocked */
  }
};

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

const MUSIC_VOLUME = 0.5;
const SFX_VOLUME = 0.9;
const LOOKAHEAD = 0.25; // seconds of music scheduled ahead of the clock (headroom for a busy main thread)

let ctx: AudioContext | null = null;
let musicGain: GainNode;
let sfxGain: GainNode;
let noiseBuffer: AudioBuffer;

let musicOn = readPref(KEY_MUSIC);
let sfxOn = readPref(KEY_SFX);
let sessionActive = false; // a game is open
let schedulerTimer: ReturnType<typeof setInterval> | undefined;
let step = 0;
let nextTime = 0;
let intensity = 0; // 0 (calm) .. 1 (few aliens left)

// ---------------------------------------------------------------- setup

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  const compressor = ctx.createDynamicsCompressor();
  const master = ctx.createGain();
  master.gain.value = 0.8;
  musicGain = ctx.createGain();
  musicGain.gain.value = 0;
  sfxGain = ctx.createGain();
  sfxGain.gain.value = sfxOn ? SFX_VOLUME : 0;
  musicGain.connect(master);
  sfxGain.connect(master);
  master.connect(compressor);
  compressor.connect(ctx.destination);

  // One second of white noise, reused by every hit / hat / explosion
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  document.addEventListener("visibilitychange", onVisibility);
  return ctx;
}

// Don't make noise from a hidden tab
function onVisibility() {
  if (!ctx) return;
  if (document.hidden) void ctx.suspend();
  else if (sessionActive) void ctx.resume();
}

// ---------------------------------------------------------------- synth helpers

type VoiceOptions = {
  type: OscillatorType;
  freq: number;
  to?: number; // glide to this frequency over the note
  t: number;
  dur: number;
  vol: number;
  attack?: number;
  lowpass?: number;
};

function voice(dest: AudioNode, o: VoiceOptions) {
  const c = ctx!;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = o.type;
  osc.frequency.setValueAtTime(o.freq, o.t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.to), o.t + o.dur);
  const attack = o.attack ?? 0.004;
  gain.gain.setValueAtTime(0.0001, o.t);
  gain.gain.exponentialRampToValueAtTime(o.vol, o.t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, o.t + o.dur);
  let out: AudioNode = osc;
  if (o.lowpass) {
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = o.lowpass;
    osc.connect(f);
    out = f;
  }
  out.connect(gain);
  gain.connect(dest);
  osc.start(o.t);
  osc.stop(o.t + o.dur + 0.03);
}

type NoiseOptions = {
  t: number;
  dur: number;
  vol: number;
  filter: BiquadFilterType;
  from: number;
  to?: number;
};

function noise(dest: AudioNode, o: NoiseOptions) {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  const f = c.createBiquadFilter();
  f.type = o.filter;
  f.frequency.setValueAtTime(o.from, o.t);
  if (o.to) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), o.t + o.dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(o.vol, o.t);
  gain.gain.exponentialRampToValueAtTime(0.0001, o.t + o.dur);
  src.connect(f);
  f.connect(gain);
  gain.connect(dest);
  src.start(o.t);
  src.stop(o.t + o.dur + 0.03);
}

// ---------------------------------------------------------------- music

// A minor → F → C → G, one bar each
const CHORDS = [
  { root: 55, notes: [220, 261.63, 329.63] },
  { root: 43.65, notes: [174.61, 220, 261.63] },
  { root: 65.41, notes: [261.63, 329.63, 392] },
  { root: 49, notes: [196, 246.94, 293.66] },
];
const ARP = [0, 1, 2, 1, 0, 1, 2, 1];
// Sparse lead melody per bar (0 = rest), A minor pentatonic-ish
const LEAD = [
  [659.25, 0, 0, 523.25, 0, 0, 440, 0, 0, 0, 523.25, 0, 587.33, 0, 0, 0],
  [440, 0, 0, 523.25, 0, 0, 698.46, 0, 0, 0, 659.25, 0, 523.25, 0, 0, 0],
  [523.25, 0, 0, 659.25, 0, 0, 783.99, 0, 0, 0, 659.25, 0, 523.25, 0, 0, 0],
  [587.33, 0, 0, 493.88, 0, 0, 587.33, 0, 0, 0, 783.99, 0, 659.25, 0, 587.33, 0],
];

const bpm = () => 98 + intensity * 38;

function playStep(s: number, t: number) {
  const bar = Math.floor(s / 16) % 4;
  const i = s % 16;
  const chord = CHORDS[bar];
  const stepDur = 60 / bpm() / 4;

  if (i % 4 === 0) voice(musicGain, { type: "sine", freq: 150, to: 45, t, dur: 0.16, vol: 0.85 }); // kick
  if (i === 4 || i === 12) {
    noise(musicGain, { t, dur: 0.12, vol: 0.28, filter: "bandpass", from: 1800 }); // snare
    voice(musicGain, { type: "triangle", freq: 230, to: 120, t, dur: 0.1, vol: 0.18 });
  }
  if (i % 2 === 0) noise(musicGain, { t, dur: 0.04, vol: i % 4 === 2 ? 0.12 : 0.07, filter: "highpass", from: 7000 }); // hats
  if (intensity > 0.55 && i % 2 === 1) noise(musicGain, { t, dur: 0.03, vol: 0.05, filter: "highpass", from: 8000 }); // busier late
  if (i % 2 === 0) voice(musicGain, { type: "sawtooth", freq: chord.root, t, dur: stepDur * 1.7, vol: i === 0 ? 0.4 : 0.3, lowpass: 420 }); // bass
  voice(musicGain, { type: "square", freq: chord.notes[ARP[i % 8]] * 2, t, dur: stepDur * 0.8, vol: 0.045, lowpass: 3200 }); // arp
  const lead = LEAD[bar][i];
  if (lead) voice(musicGain, { type: "square", freq: lead, t, dur: stepDur * 2.2, vol: 0.06, attack: 0.01, lowpass: 2600 });
}

function schedule() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    playStep(step, nextTime);
    nextTime += 60 / bpm() / 4;
    step = (step + 1) % 64;
  }
}

function startScheduler() {
  if (!ctx || schedulerTimer) return;
  step = 0;
  nextTime = ctx.currentTime + 0.08;
  musicGain.gain.setTargetAtTime(MUSIC_VOLUME, ctx.currentTime, 0.05);
  schedulerTimer = setInterval(schedule, 30);
}

function haltScheduler() {
  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = undefined;
  if (ctx) musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
}

// ---------------------------------------------------------------- sfx

const sfxReady = () => !!ctx && ctx.state === "running" && sfxOn;
const now = () => ctx!.currentTime;

let ufoLoop: { osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null = null;

export const gameAudio = {
  getPrefs: () => ({ music: musicOn, sfx: sfxOn }),

  /** Call from a click handler (START / RETRY). Unlocks audio and starts the music if it's on. */
  begin() {
    if (!ensure()) return;
    void ctx!.resume();
    sessionActive = true;
    intensity = 0;
    gameAudio.ufoStop();
    if (musicOn) startScheduler();
    gameAudio.start();
  },

  /** The game was closed: silence everything and let the device go. */
  shutdown() {
    sessionActive = false;
    haltScheduler();
    gameAudio.ufoStop();
    if (ctx) void ctx.suspend();
  },

  setMusicEnabled(on: boolean) {
    musicOn = on;
    writePref(KEY_MUSIC, on);
    if (!ctx) return;
    if (on && sessionActive) {
      void ctx.resume();
      startScheduler();
    } else {
      haltScheduler();
    }
  },

  setSfxEnabled(on: boolean) {
    sfxOn = on;
    writePref(KEY_SFX, on);
    if (!ctx) return;
    sfxGain.gain.setTargetAtTime(on ? SFX_VOLUME : 0, ctx.currentTime, 0.03);
    if (!on) gameAudio.ufoStop();
  },

  /** 0 = full wave, 1 = last alien. Speeds the music up. */
  setIntensity(value: number) {
    intensity = Math.min(1, Math.max(0, value));
  },

  start() {
    if (!sfxReady()) return;
    const t = now();
    [392, 523.25, 659.25].forEach((f, i) => voice(sfxGain, { type: "square", freq: f, t: t + i * 0.07, dur: 0.09, vol: 0.14, lowpass: 3000 }));
  },

  shoot() {
    if (!sfxReady()) return;
    voice(sfxGain, { type: "square", freq: 900, to: 200, t: now(), dur: 0.11, vol: 0.12, lowpass: 3500 });
  },

  alienShoot() {
    if (!sfxReady()) return;
    voice(sfxGain, { type: "sawtooth", freq: 260, to: 90, t: now(), dur: 0.12, vol: 0.05, lowpass: 900 });
  },

  alienKill() {
    if (!sfxReady()) return;
    const t = now();
    noise(sfxGain, { t, dur: 0.16, vol: 0.4, filter: "lowpass", from: 2400, to: 300 });
    voice(sfxGain, { type: "square", freq: 320, to: 70, t, dur: 0.17, vol: 0.14, lowpass: 2000 });
  },

  ufoStart() {
    if (!sfxReady() || ufoLoop) return;
    const c = ctx!;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 720;
    const lfo = c.createOscillator();
    lfo.frequency.value = 7;
    const lfoDepth = c.createGain();
    lfoDepth.gain.value = 150;
    lfo.connect(lfoDepth);
    lfoDepth.connect(osc.frequency);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, c.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start();
    lfo.start();
    ufoLoop = { osc, lfo, gain };
  },

  ufoStop() {
    if (!ufoLoop || !ctx) return;
    const { osc, lfo, gain } = ufoLoop;
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.stop(t + 0.1);
    lfo.stop(t + 0.1);
    ufoLoop = null;
  },

  ufoKill() {
    if (!sfxReady()) return;
    const t = now();
    [440, 660, 880, 1320].forEach((f, i) => voice(sfxGain, { type: "square", freq: f, t: t + i * 0.06, dur: 0.1, vol: 0.14, lowpass: 3500 }));
  },

  playerHit() {
    if (!sfxReady()) return;
    const t = now();
    noise(sfxGain, { t, dur: 0.55, vol: 0.55, filter: "lowpass", from: 2200, to: 120 });
    voice(sfxGain, { type: "sawtooth", freq: 190, to: 38, t, dur: 0.5, vol: 0.28, lowpass: 900 });
  },

  levelUp() {
    if (!sfxReady()) return;
    const t = now();
    [261.63, 329.63, 392, 523.25, 659.25].forEach((f, i) =>
      voice(sfxGain, { type: "square", freq: f, t: t + i * 0.085, dur: 0.12, vol: 0.14, lowpass: 3200 })
    );
  },

  /** Stops the music and plays a short descending sting. */
  gameOver() {
    sessionActive = true; // keep the context alive for the sting
    haltScheduler();
    gameAudio.ufoStop();
    if (!sfxReady()) return;
    const t = now() + 0.15;
    [440, 370, 311.13, 261.63].forEach((f, i) => voice(sfxGain, { type: "sawtooth", freq: f, t: t + i * 0.18, dur: 0.2, vol: 0.16, lowpass: 1600 }));
    voice(sfxGain, { type: "sawtooth", freq: 130.81, to: 55, t: t + 0.76, dur: 0.9, vol: 0.2, lowpass: 700 });
  },
};
