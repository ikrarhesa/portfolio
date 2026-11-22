const MissionFeedPanel = () => {
    const deployments = [
        {
            id: "SV-ML-24",
            project: "Shopee Video Malaysia",
            description: "Template system that scaled from 200 to 34K uses/week",
            link: "#work"
        },
        {
            id: "EC-01",
            project: "Ecosera",
            description: "Micro-marketplace OS for local SMEs",
            link: "#work"
        },
        {
            id: "AE-01",
            project: "Aello",
            description: "Body battery iOS app for energy & recovery",
            link: "#work"
        }
    ];

    return (
        <div className="relative flex items-start justify-center min-h-[400px] py-8 md:py-12">
            {/* Panel container */}
            <div className="relative w-full max-w-full lg:max-w-md min-h-[500px] group">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20 rounded-lg blur-2xl" />
                <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        backgroundPosition: "-200% 0",
                        animation: "holographic-shimmer 4s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />

                {/* SVG Frame */}
                <svg
                    className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    viewBox="0 0 400 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    {/* Main Background Shape */}
                    <path
                        d="M30 0H370L400 30V140L385 145V355L400 360V470L370 500H30L0 470V30L30 0Z"
                        className="fill-black/60 stroke-cyan-500/40"
                        strokeWidth="1"
                    />

                    {/* Inner Border */}
                    <path
                        d="M35 8H365L392 35V138L377 143V357L392 362V465L365 492H35L8 465V35L35 8Z"
                        className="stroke-cyan-500"
                        strokeWidth="2"
                        style={{ filter: "drop-shadow(0 0 5px #22d3ee)" }}
                    />

                    {/* Right Side Tab */}
                    <path
                        d="M400 145V355L388 355V145H400Z"
                        className="fill-cyan-500/20 stroke-cyan-400"
                        strokeWidth="2"
                    />

                    {/* Decorative Corner Details */}
                    <path d="M8 35L35 8" className="stroke-cyan-300" strokeWidth="1" />
                    <path d="M365 8L392 35" className="stroke-cyan-300" strokeWidth="1" />
                    <path d="M8 465L35 492" className="stroke-cyan-300" strokeWidth="1" />
                    <path d="M365 492L392 465" className="stroke-cyan-300" strokeWidth="1" />
                </svg>

                {/* Content Container */}
                <div className="relative flex flex-col p-6 md:p-8 min-h-[500px]">
                    {/* Scanlines overlay */}
                    <div className="absolute inset-4 overflow-hidden opacity-20 pointer-events-none rounded-lg">
                        <div
                            className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.1)_50%)] bg-[length:100%_3px]"
                            style={{
                                animation: "scanlines 8s linear infinite",
                            }}
                        />
                    </div>

                    {/* Header */}
                    <div className="relative z-10 border-b border-cyan-500/30 pb-3 mb-4">
                        <div className="text-cyan-300 text-xs tracking-[0.2em] uppercase font-mono mb-1">
                            Mission Feed
                        </div>
                        <div className="text-cyan-300 text-lg font-mono font-semibold">
                            Recent Deployments
                        </div>
                    </div>

                    {/* Deployment List */}
                    <div className="relative z-10 space-y-3 flex-1">
                        {deployments.map((deployment) => (
                            <div
                                key={deployment.id}
                                className="group border border-cyan-500/30 bg-cyan-950/20 rounded px-3 py-3 hover:border-cyan-400/60 hover:bg-cyan-950/40 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div className="text-cyan-300 text-xs font-mono font-bold">
                                        {deployment.id}
                                    </div>
                                    <div className="text-cyan-300 text-[11px] font-mono uppercase tracking-wider">
                                        [Open Case]
                                    </div>
                                </div>
                                <div className="text-cyan-200 text-sm font-mono mb-1">
                                    {deployment.project}
                                </div>
                                <div className="text-cyan-200/75 text-xs font-mono leading-snug">
                                    "{deployment.description}"
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grid Background Effect */}
                    <div className="absolute inset-0 -z-10 opacity-10">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
                                backgroundSize: "20px 20px"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionFeedPanel;
