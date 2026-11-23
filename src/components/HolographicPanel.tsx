const HolographicPanel = () => {

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8 md:py-12">
      {/* Main panel container */}
      <div className="relative w-full max-w-full lg:max-w-4xl min-h-[500px] md:min-h-[450px] lg:min-h-[500px] group">
        {/* Outer glow with holographic shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 via-fuchsia-400/20 to-fuchsia-500/20 rounded-lg blur-2xl" />
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(217,70,239,0.3) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "-200% 0",
            animation: "holographic-shimmer 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* SVG Frame */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]"
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Main Background Shape with Chamfered Corners */}
          <path
            d="M40 0H760L800 40V180L780 190V310L800 320V460L760 500H40L0 460V40L40 0Z"
            className="fill-black/60 stroke-fuchsia-500/40"
            strokeWidth="1"
          />

          {/* Inner Border (Glowing Fuchsia) */}
          <path
            d="M45 10H755L790 45V175L770 185V315L790 325V455L755 490H45L10 455V45L45 10Z"
            className="stroke-fuchsia-500"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 5px #d946ef)" }}
          />

          {/* Right Side Tab */}
          <path
            d="M800 190V310L785 310V190H800Z"
            className="fill-fuchsia-500/20 stroke-fuchsia-400"
            strokeWidth="2"
          />

          {/* Bottom Tab */}
          <path
            d="M300 500H500L490 490H310L300 500Z"
            className="fill-fuchsia-500/20 stroke-fuchsia-400"
            strokeWidth="2"
          />

          {/* Decorative Corner Details */}
          {/* Top Left */}
          <path d="M10 45L45 10" className="stroke-fuchsia-300" strokeWidth="1" />
          {/* Top Right */}
          <path d="M755 10L790 45" className="stroke-fuchsia-300" strokeWidth="1" />
          {/* Bottom Left */}
          <path d="M10 455L45 490" className="stroke-fuchsia-300" strokeWidth="1" />
          {/* Bottom Right */}
          <path d="M755 490L790 455" className="stroke-fuchsia-300" strokeWidth="1" />
        </svg>

        {/* Content Container */}
        <div className="relative flex items-start justify-center p-6 md:p-10 lg:p-12 min-h-[500px] md:min-h-[450px] lg:min-h-[500px]">
          {/* Scanlines overlay */}
          <div className="absolute inset-4 overflow-hidden opacity-20 pointer-events-none rounded-lg">
            <div
              className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(217,70,239,0.1)_50%)] bg-[length:100%_3px]"
              style={{
                animation: "scanlines 8s linear infinite",
              }}
            />
          </div>

          {/* Central content area */}
          <div className="relative z-10 w-full space-y-4 md:space-y-6">
            {/* Top Strip: Identity + Mode */}
            <div className="border-b border-fuchsia-500/30 pb-3 md:pb-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="text-fuchsia-300 text-[11px] md:text-xs tracking-[0.2em] uppercase font-mono">
                    PILOT
                  </div>
                  <div className="text-fuchsia-300 text-base md:text-lg font-mono font-semibold">
                    Ikrar Hesa Prasetya
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="text-emerald-300 text-[11px] md:text-xs font-mono uppercase tracking-wider">
                    Available
                  </div>
                </div>
              </div>
              <div className="text-fuchsia-200/90 text-xs md:text-sm font-mono">
                Product Designer · AR, Video & Live · Product Strategy
              </div>
              <div className="text-fuchsia-300/80 text-[11px] md:text-xs font-mono">
                SECTOR: Consumer apps · Marketplace · Edtech
              </div>
            </div>

            {/* Core Mission */}
            <div className="space-y-2 md:space-y-3">
              <div className="text-fuchsia-300 text-base md:text-xl lg:text-2xl font-mono font-semibold leading-tight drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">
                Designing high-impact digital systems for video, live, marketplaces, and learning.
              </div>
              <div className="text-fuchsia-100/90 text-xs md:text-sm font-mono leading-relaxed">
                I turn messy product problems into shippable, measurable experiences: AR camera tools for video and live, short-video funnels, and tools for small businesses and students.
              </div>
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 pt-1 md:pt-2">
              <div className="group border border-fuchsia-500/30 bg-fuchsia-950/20 rounded px-2.5 md:px-3 py-2 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/40 transition-all cursor-pointer">
                <div className="text-fuchsia-300 text-base md:text-lg font-mono font-bold">24%</div>
                <div className="text-fuchsia-200/80 text-[11px] md:text-xs font-mono leading-snug">Shopee Video usage uplift Q1–Q2 2024</div>
              </div>
              <div className="group border border-fuchsia-500/30 bg-fuchsia-950/20 rounded px-2.5 md:px-3 py-2 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/40 transition-all cursor-pointer">
                <div className="text-fuchsia-300 text-base md:text-lg font-mono font-bold">34K</div>
                <div className="text-fuchsia-200/80 text-[11px] md:text-xs font-mono leading-snug">weekly uses of Malaysia video templates</div>
              </div>
              <div className="group border border-fuchsia-500/30 bg-fuchsia-950/20 rounded px-2.5 md:px-3 py-2 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/40 transition-all cursor-pointer">
                <div className="text-fuchsia-300 text-base md:text-lg font-mono font-bold">5+</div>
                <div className="text-fuchsia-200/80 text-[11px] md:text-xs font-mono leading-snug">years designing multi-market products</div>
              </div>
              <div className="group border border-fuchsia-500/30 bg-fuchsia-950/20 rounded px-2.5 md:px-3 py-2 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/40 transition-all cursor-pointer">
                <div className="text-fuchsia-300 text-base md:text-lg font-mono font-bold">3</div>
                <div className="text-fuchsia-200/80 text-[11px] md:text-xs font-mono leading-snug">active side systems (Aello, Ecosera, SSAAC)</div>
              </div>
            </div>

            {/* Grid Background Effect */}
            <div className="absolute inset-0 -z-10 opacity-10">
              <div className="w-full h-full"
                style={{
                  backgroundImage: "radial-gradient(circle, #d946ef 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicPanel;

