import React from "react";

export type SectionId = "overview" | "about" | "work" | "labs" | "contact";

type ShellLayoutProps = {
  children: React.ReactNode;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
};

const sections: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "labs", label: "Labs" },
  { id: "contact", label: "Contact" },
];

function ShellLayout({ children, activeSection, onSectionChange }: ShellLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top status bar */}
      <header className="border-b border-fuchsia-500/30 bg-slate-950/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold tracking-[0.3em] text-fuchsia-300 uppercase">
            HESA
          </span>
          <span className="text-sm text-slate-400">
            Control Deck
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-2 py-1 rounded-full border border-emerald-500/40 text-emerald-300/90">
            SYS: STABLE
          </span>
          <span className="hidden sm:inline text-slate-500">
            v0.1 · local build
          </span>
        </div>
      </header>

      {/* Main body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 border-r border-slate-900/80 px-4 py-5 space-y-6 bg-slate-950/95">
          <div className="space-y-1">
            <p className="text-[10px] font-medium tracking-[0.24em] text-slate-500 uppercase">
              Navigation
            </p>
            <nav className="mt-2 space-y-1 text-sm">
              {sections.map((section) => {
                const isActive = section.id === activeSection;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onSectionChange(section.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-slate-900 text-slate-100 border border-fuchsia-500/60 shadow-[0_0_25px_rgba(217,70,239,0.35)]"
                        : "text-slate-400 hover:bg-slate-900/60 border border-transparent",
                    ].join(" ")}
                  >
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-medium tracking-[0.24em] text-slate-500 uppercase">
              Status
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-400">
              <p>Active mission:</p>
              <p className="text-fuchsia-300">
                Portfolio v0.1 · shell online
              </p>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
  <div className="h-full w-full rounded-3xl border border-slate-900/80 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),#020617_55%)] px-6 py-5 relative overflow-hidden">
    {/* vertical bulkhead lines */}
    <div className="pointer-events-none absolute inset-y-6 left-1/3 w-px bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
    <div className="pointer-events-none absolute inset-y-6 right-1/3 w-px bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
    {children}
  </div>
</main>

      </div>
    </div>
  );
}

export default ShellLayout;
