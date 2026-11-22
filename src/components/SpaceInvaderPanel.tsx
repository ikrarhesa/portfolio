interface SpaceInvaderPanelProps {
  onClick?: () => void;
}

interface SpaceInvaderPanelProps {
  onClick?: () => void;
}

const SpaceInvaderPanel = ({ onClick }: SpaceInvaderPanelProps) => {
  // Classic Space Invader pattern (11x8 grid) for the decorative state
  const spaceInvaderPattern = [
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
  ];

  return (
    <div
      className={`relative w-[240px] h-[240px] cursor-pointer group transition-transform duration-300 hover:scale-105`}
      onClick={onClick}
    >
      {/* SVG Frame */}
      <svg
        className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(217,70,239,0.3)] pointer-events-none"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Background Shape */}
        <path
          d="M24 0H236C238.2 0 240 1.8 240 4V236C240 238.2 238.2 240 236 240H24L0 216V24L24 0Z"
          className="fill-black/80 stroke-fuchsia-400/40"
          strokeWidth="1"
        />

        {/* Thicker Decorative Bars */}
        <path d="M28 0H160" className="stroke-fuchsia-400" strokeWidth="3" />
        <path d="M0 60V110" className="stroke-fuchsia-400" strokeWidth="3" />
        <path d="M0 130V180" className="stroke-fuchsia-400" strokeWidth="3" />
        <path d="M240 80V160" className="stroke-fuchsia-400" strokeWidth="3" />

        {/* Corner Detail */}
        <circle cx="24" cy="0" r="3" className="fill-black stroke-fuchsia-400" strokeWidth="1.5" />
        <circle cx="24" cy="0" r="1.5" className="fill-fuchsia-400" />
      </svg>

      {/* Inner Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-lg">
        {/* Decorative State */}
        <div className="flex flex-col items-center justify-center p-6 w-full h-full">
          {/* Scanlines overlay */}
          <div className="absolute inset-2 overflow-hidden opacity-20 pointer-events-none">
            <div
              className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(217,70,239,0.1)_50%)] bg-[length:100%_3px]"
              style={{ animation: "scanlines 8s linear infinite" }}
            />
          </div>

          {/* Space Invader with up/down animation */}
          <div
            className="relative grid grid-cols-11 gap-0.5 z-10 mb-4"
            style={{ animation: "space-invader-float 3s ease-in-out infinite" }}
          >
            {spaceInvaderPattern.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`w-3.5 h-3.5 transition-all duration-300 ${cell
                    ? "bg-fuchsia-400 border border-fuchsia-300/40 shadow-[0_0_6px_rgba(217,70,239,0.9),inset_0_0_2px_rgba(192,38,211,0.5)]"
                    : "bg-transparent"
                    }`}
                  style={{
                    animation: cell ? "pulse-glow 2s ease-in-out infinite" : "none",
                    animationDelay: `${(rowIdx + colIdx) * 0.03}s`,
                    boxShadow: cell
                      ? "0 0 6px rgba(217,70,239,0.9), inset 0 0 2px rgba(192,38,211,0.5), 0 1px 0 rgba(217,70,239,0.3)"
                      : "none",
                  }}
                />
              ))
            )}
          </div>

          {/* Space Invader Text */}
          <div className="relative z-10 mt-2">
            <div className="text-fuchsia-400/90 text-sm font-mono font-semibold tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] animate-flicker">
              CLICK TO PLAY
            </div>
          </div>
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-fuchsia-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ clipPath: 'polygon(24px 0, 100% 0, 100% 100%, 24px 100%, 0 216px, 0 24px)' }} />
        </div>
      </div>
    </div>
  );
};

export default SpaceInvaderPanel;
