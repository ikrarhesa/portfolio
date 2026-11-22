import type { CSSProperties } from "react";

// Front slice is near-white fuchsia, back slice is deep violet: a neon depth gradient through the hologram
const FRONT = [250, 232, 255];
const BACK = [147, 51, 234];
const mix = (t: number) => `rgb(${FRONT.map((f, i) => Math.round(f + (BACK[i] - f) * t)).join(",")})`;

/**
 * A pixel-art sprite as a rotating 3D wireframe hologram: each lit pixel is an outlined cell, and a few thin
 * copies are stacked at different depths and spun with CSS 3D transforms, like a Jarvis projection. No images
 * or WebGL. Size comes from the CSS variable `--u` (the size of one sprite pixel), set by the parent.
 */
export default function HoloSprite({ sprite, slices = 7 }: { sprite: number[][]; slices?: number }) {
  const rows = sprite.length;
  const cols = sprite[0].length;
  const cells = sprite.flatMap((row, y) =>
    row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" /> : null))
  );

  return (
    <div className="hx3d-scene" style={{ width: `calc(var(--u) * ${cols})`, height: `calc(var(--u) * ${rows})` } as CSSProperties}>
      <div className="hx3d-spin">
        {Array.from({ length: slices }, (_, i) => {
          const t = i / (slices - 1);
          const z = (i - (slices - 1) / 2) * 0.9; // in sprite pixels
          const outer = i === 0 || i === slices - 1; // brighter shell, fainter core
          return (
            <svg
              key={i}
              viewBox={`0 0 ${cols} ${rows}`}
              className="hx3d-slice"
              fill={mix(t)}
              fillOpacity={outer ? 0.22 : 0.07}
              stroke={mix(t)}
              strokeWidth="0.09"
              strokeOpacity={outer ? 1 : 0.6}
              style={{ transform: `translateZ(calc(var(--u) * ${z.toFixed(2)}))` } as CSSProperties}
              aria-hidden
            >
              {cells}
            </svg>
          );
        })}
      </div>
    </div>
  );
}
