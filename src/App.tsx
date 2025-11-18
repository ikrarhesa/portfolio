import { useState } from "react";
import ShellLayout, { type SectionId } from "./components/ShellLayout";

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview": 
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Viewport strip at the top */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 px-6 py-4">
  {/* starfield */}
  <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.28),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16),transparent_55%),repeating-radial-gradient(circle_at_top,_rgba(248,250,252,0.12)_0,_rgba(248,250,252,0.12)_1px,transparent_1px,transparent_3px)]" />
  {/* horizon / planet edge */}
  <div className="pointer-events-none absolute -bottom-10 left-1/4 w-1/2 h-24 rounded-full bg-gradient-to-t from-fuchsia-500/20 via-fuchsia-400/10 to-transparent blur-2xl" />

        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.35),transparent_60%)]" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Viewport
            </p>
            <p className="text-sm text-slate-200">
              Orbiting: Portfolio · Sector v0.1
            </p>
          </div>
          <div className="text-xs text-slate-400 text-right space-y-0.5">
            <p>
              Signal: <span className="text-emerald-300">Strong</span>
            </p>
            <p>
              Mode: <span className="text-fuchsia-300">Designer</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main deck - holo table + side consoles */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)]">
        {/* Holo table / main console */}
        <div className="relative border border-fuchsia-500/50 bg-slate-950/90 rounded-3xl p-5 flex flex-col justify-between overflow-hidden shadow-[0_0_80px_rgba(217,70,239,0.25)]">
          {/* Fake hologram glow */}
          <div className="pointer-events-none absolute inset-x-[-35%] top-1/3 h-56 bg-[radial-gradient(circle,_rgba(244,114,182,0.65)_0,transparent_60%)] opacity-80 blur-[2px]" />
          <div className="relative z-10 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">
              Mission console
            </p>
            <h1 className="text-xl md:text-2xl font-semibold">
              Hesa · Product Designer
            </h1>
            <p className="text-sm text-slate-300">
              Interactive portfolio framed as a starship control deck. Instead of static pages, you navigate missions, experiments, and long term campaigns.
            </p>
          </div>

          <div className="relative z-10 mt-5 grid gap-3 grid-cols-3 text-xs text-slate-300">
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                Role
              </p>
              <p>Product & UX</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                Focus
              </p>
              <p>Sci fi UI, systems, AR/VR</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                Status
              </p>
              <p className="text-emerald-300">Building v0.1</p>
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
              Quick scan
            </p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Work will host 3–5 core missions as case studies.</li>
              <li>• Labs will be the playground for experiments and prototypes.</li>
              <li>• Each section behaves like a system panel, not a flat page.</li>
            </ul>
          </div>
          <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-4 text-xs text-slate-400">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
              Next upgrades
            </p>
            <p>
              Hologram animation on the table surface, parallax on the viewport background, and subtle ambient pulses for active missions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  case "about":
    return (
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Bio panel */}
        <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
            Identity
          </p>
          <h2 className="text-xl font-semibold mb-2">
            Hesa · Product Designer
          </h2>
          <p className="text-sm text-slate-300 mb-3">
            Product designer working across video, AR, and systems-heavy products. I like turning messy constraints
            into interfaces that feel as intentional as a starship bridge: dense, but readable.
          </p>
          <p className="text-sm text-slate-400">
            Previously worked on AR & video experiences at scale, educational projects, and tools that sit between
            storytelling and data. This deck is the control room for all of that.
          </p>
        </div>
  
        {/* Focus / background panel */}
        <div className="space-y-4">
          <div className="border border-fuchsia-500/30 bg-slate-950/80 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-2">
              Current focus
            </p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Designing products where motion and state are first-class citizens, not decoration.</li>
              <li>• Bridging “sci-fi UI energy” with real-world constraints, teams, and metrics.</li>
              <li>• Exploring AR/VR, control-room metaphors, and tools that feel like instruments, not templates.</li>
            </ul>
          </div>
  
          <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5 text-sm text-slate-400">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
              Operating principles
            </p>
            <ul className="space-y-1">
              <li>• Clarity over cleverness in UX, cleverness reserved for interaction details.</li>
              <li>• Systems thinking: how components, journeys, and metrics connect.</li>
              <li>• Honest communication: show trade-offs, not just glossy outcomes.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  
    case "work":
      return (
        <div className="space-y-4">
          <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
              Work console
            </p>
            <h2 className="text-xl font-semibold mb-2">
              Featured missions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Selected projects that show how I think about systems, interaction, and outcomes. Each “mission” will later
              expand into a full case study panel.
            </p>
    
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Mission 01 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                    Mission 01
                  </p>
                  <p className="text-sm font-semibold text-slate-100 mb-1">
                    Large-scale Video & AR Surface
                  </p>
                  <p className="text-xs text-slate-400">
                    Designing video & AR experiences deployed across multiple markets, balancing engagement, performance,
                    and content tooling.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  Role: Product design · Focus: interaction, systems, experimentation.
                </p>
              </div>
    
              {/* Mission 02 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                    Mission 02
                  </p>
                  <p className="text-sm font-semibold text-slate-100 mb-1">
                    Vital reserve / wellbeing app
                  </p>
                  <p className="text-xs text-slate-400">
                    Personal project exploring how to visualize energy, recovery, and health signals in a way people
                    actually understand and act on.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  Role: Product & visual design · Focus: data visualization, UX flows.
                </p>
              </div>
    
              {/* Mission 03 */}
              <div className="border border-slate-800 rounded-xl bg-slate-950/80 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                    Mission 03
                  </p>
                  <p className="text-sm font-semibold text-slate-100 mb-1">
                    Ecosera / circular economy
                  </p>
                  <p className="text-xs text-slate-400">
                    Marketplace concept for local SMEs and waste-to-value flows, with dashboards for impact, not just sales.
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  Role: Product design · Focus: flows, incentives, dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    
      case "labs":
        return (
          <div className="border border-fuchsia-500/40 bg-slate-950/80 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-2">
              Labs
            </p>
            <h2 className="text-xl font-semibold mb-2">
              Experimental Interfaces
            </h2>
            <p className="text-sm text-slate-400 mb-3">
              This section will hold prototypes, AR/VR ideas, weird UI concepts, and anything that is not “safe case study” material.
            </p>
            <p className="text-xs text-slate-500">
              Later: embed interactive demos, micro-interactions, perhaps a fake terminal or hologram panel that pulls live content.
            </p>
          </div>
        );
      case "contact":
        return (
          <div className="max-w-lg space-y-4">
            <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
                Contact
              </p>
              <h2 className="text-xl font-semibold mb-2">
                Open to missions
              </h2>
              <p className="text-sm text-slate-400 mb-3">
                This panel will later turn into a clean “contact” section with your preferred channels and time zones. For now, it is a structural placeholder.
              </p>
              <p className="text-xs text-slate-500">
                Later: buttons for email, LinkedIn, maybe a quick “signal strength” indicator for availability.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </ShellLayout>
  );
}

export default App;
