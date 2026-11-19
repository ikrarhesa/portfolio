# The intro (a neon wireframe hologram, Jarvis style)

Components: `src/components/IntroLoader.tsx` (the sequence) and `src/components/HoloSprite.tsx` (the 3D hologram).
Styles: the "Intro (a neon wireframe hologram projected from a platform)" section of `src/index.css`.
Wiring: `src/App.tsx` (`intro` state: `playing` → `leaving` → `done`).

## What it does
A glowing projector platform lights up and ONE character from the game builds up on it as a rotating 3D
wireframe hologram, in cyan and electric blue only. Counter-rotating HUD circles with tick marks surround it,
dashed rings orbit the platform, and a telemetry readout counts up (UNIT / VALUE / SCAN %) while
"Hi, I'm Hesa." forms underneath. At the end the projection switches off like an old TV and the hero comes in.
About 4 seconds: the greeting is fully in by ~2s, and the rest is time to read it.

**A different hologram every time the intro plays**: your ship (PLAYER-1, the same one that opens the game
from the hero), crab, squid, octopus, UFO, then around again. The last one shown is remembered in
`localStorage` (`hesa_intro_hologram`), so the same one never plays twice in a row.

The idea: curiosity needs a gap and a quick payoff. "What is this, is there a game in here?" is the gap; the
hologram ship beside the hero demo (which opens the game) is the payoff.

## Why it's light
Nothing is downloaded. The hologram is drawn from the sprite data already in the app
(`constants/spaceInvaders.ts`): 7 thin SVG copies of the sprite (each pixel an outlined cell) stacked at
different depths and spun with CSS 3D transforms. No images, video or WebGL, so it starts instantly. The only
thing the intro waits for is fonts.

- **Skippable.** Click anywhere, press Enter / Space / Esc, or use the "Skip ↵" button.
- **No black gap.** When it starts to fade, the site is already mounted underneath, so the hero animates in.
- **Reduced motion.** People who ask for less motion get a still frame (the hologram turned slightly) for under a second.
- **Accessible.** The overlay is `role="status"` with an `aria-label`.

## When it shows
- **On a first visit**, then **at most once a week** (it remembers when it last played in
  `localStorage` as `hesa_intro_seen`; the cooldown is `INTRO_COOLDOWN` in `App.tsx`).
- **Never on a deep link.** If someone opens a link straight to a page or section (a shared case study,
  `#contact`, ...) they go straight there with no wait.
- **`?intro` forces it**, even on a deep link, which is handy for testing or showing it off:
  `http://localhost:5173/?intro`

Switching tabs or coming back to an open page never replays it. It only runs when the page loads.

## Force it to show (development)
Either add `?intro` to the URL, or clear the memory in the browser console and reload:
```js
localStorage.removeItem('hesa_intro_seen');
location.reload();
```
Add `localStorage.removeItem('hesa_intro_hologram');` to start the hologram rotation from the ship again.

## Tuning
In `IntroLoader.tsx`:
- `HOLOGRAMS`: which sprites can appear, their order, and the readout text (`unit`, `value`). Index 0 is the
  first visit's hologram.
- `MIN_MS`: how long the show plays before it can finish (3700 ms; the greeting animates in at ~1.5s to 2.0s, so the rest is reading time).
- `MAX_MS`: the cap if fonts are slow. `LEAVE_MS`: fade-out duration (keep in sync with `intro-out` / `hx-off`).
- `HudRings`: the HUD circles. `--u` (on the `hx-stage` element): the size of one sprite pixel, which scales
  the whole projection.

In `HoloSprite.tsx`: `slices` (more = denser volume), the front/back neon colors, the cell outline weight.
In `index.css`: `hx3d-spin` (rotation speed is the `6s`), `hx-spin-a` / `hx-spin-b` (HUD ring speeds).

Note: the Browser preview pane in the desktop app throttles timers and animation frames while it is
hidden, so the sequence can look stuck or out of order there. It plays normally in a regular browser window.
