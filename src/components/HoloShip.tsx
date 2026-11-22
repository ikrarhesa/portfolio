import { SPRITES } from "../constants/spaceInvaders";

/**
 * A holographic projection of the player's ship, hovering over a projector pad.
 * It's the hero's entry point to the Space Invaders game.
 */
export default function HoloShip({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  const ship = SPRITES.PLAYER;
  const px = 4; // sprite pixel size in SVG units

  const pixels = ship.flatMap((row, y) =>
    row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px - 0.5} height={px - 0.5} /> : null))
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Shoot the alien! Play Space Invaders"
      className={`holo-ship group flex w-[72px] flex-col items-center opacity-50 transition-[transform,opacity] hover:scale-110 hover:opacity-100 focus-visible:opacity-100 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-cyan-300 ${className}`}
    >
      <svg viewBox="0 0 104 112" className="holo-flicker block w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="hl-ship" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a5f3fc" />
            <stop offset="1" stopColor="#e879f9" />
          </linearGradient>
          <linearGradient id="hl-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <filter id="hl-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Scanlines: only every other row of the hologram shows */}
          <pattern id="hl-lines" width="4" height="3" patternUnits="userSpaceOnUse">
            <rect width="4" height="1.4" fill="#fff" />
          </pattern>
          <mask id="hl-mask">
            <rect x="0" y="0" width="104" height="112" fill="url(#hl-lines)" />
          </mask>
        </defs>

        {/* Projector pad */}
        <ellipse className="holo-pad" cx="52" cy="92" rx="38" ry="8" fill="none" stroke="#22d3ee" strokeOpacity="0.7" strokeWidth="1.5" />
        <ellipse className="holo-pad-in" cx="52" cy="92" rx="24" ry="5" fill="#22d3ee" fillOpacity="0.15" stroke="#22d3ee" strokeOpacity="0.9" strokeWidth="1" />

        {/* Light cone rising from the pad */}
        <polygon className="holo-beam" points="30,92 74,92 68,38 36,38" fill="url(#hl-beam)" />

        {/* The ship: a cyan ghost, plus the gradient body, both scanlined */}
        <g className="holo-bob">
          <g transform="translate(26 34)" mask="url(#hl-mask)">
            <g className="holo-ghost" fill="#22d3ee" opacity="0.55">
              {pixels}
            </g>
            <g className="holo-body" fill="url(#hl-ship)" filter="url(#hl-glow)">
              {pixels}
            </g>
          </g>
          {/* A scan sweep passing over the ship */}
          <rect className="holo-scan" x="22" y="28" width="60" height="2" fill="#ecfeff" opacity="0.5" />
          {/* Test laser, fires while hovered */}
          <rect className="holo-laser" x="51" y="30" width="2" height="8" fill="#67e8f9" filter="url(#hl-glow)" />
        </g>
      </svg>

      <span
        className="mt-1 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-200 opacity-0 transition-[color,opacity] group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:text-cyan-100 group-hover:[text-shadow:0_0_8px_rgba(34,211,238,0.8)] group-focus-visible:text-cyan-100 group-focus-visible:[text-shadow:0_0_8px_rgba(34,211,238,0.8)]"
      >
        Shoot the alien!
      </span>
    </button>
  );
}
