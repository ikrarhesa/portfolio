import { useState } from "react";
import ShellLayout, { type SectionId } from "./components/ShellLayout";

type MissionId = "video-ar" | "vital-reserve" | "ecosera";

const MISSIONS: {
  id: MissionId;
  label: string;
  title: string;
  summary: string;
  role: string;
  focus: string;
}[] = [
  {
    id: "video-ar",
    label: "Mission 01",
    title: "Large-scale Video & AR Surface",
    summary:
      "Designing video & AR experiences deployed across multiple markets, balancing engagement, performance, and content tooling.",
    role: "Product design",
    focus: "Interaction, systems, experimentation",
  },
  {
    id: "vital-reserve",
    label: "Mission 02",
    title: "Vital reserve / wellbeing app",
    summary:
      "Personal project exploring how to visualize energy, recovery, and health signals in a way people actually understand and act on.",
    role: "Product & visual design",
    focus: "Data visualization, UX flows",
  },
  {
    id: "ecosera",
    label: "Mission 03",
    title: "Ecosera / circular economy",
    summary:
      "Marketplace concept for local SMEs and waste-to-value flows, with dashboards for impact, not just sales.",
    role: "Product design",
    focus: "Flows, incentives, dashboards",
  },
];

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [activeMission, setActiveMission] = useState<MissionId>("video-ar");

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
  {/* Base glow */}
  <div className="pointer-events-none absolute inset-x-[-35%] top-1/3 h-56 bg-[radial-gradient(circle,_rgba(244,114,182,0.5)_0,transparent_60%)] opacity-50" />
  <div className="holo-disc" />

  <div className="relative z-10 space-y-3">
    <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">
      Mission console
    </p>
    <h1 className="text-xl md:text-2xl font-semibold">
      Hesa · Product Designer
    </h1>
    <p className="text-sm text-slate-300">
      Interactive portfolio framed as a starship control deck. Instead of static pages, you navigate missions,
      experiments, and long term campaigns.
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
      const selected = MISSIONS.find((m) => m.id === activeMission)!;

      return (
        <div className="space-y-4 h-full flex flex-col">
          <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
              Work console
            </p>
            <h2 className="text-xl font-semibold mb-2">
              Featured missions
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Click a mission to focus the console. Later, each mission can open a full case study view or a separate panel.
            </p>

            {/* Mission cards */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MISSIONS.map((mission) => {
                const isActive = mission.id === activeMission;
                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => setActiveMission(mission.id)}
                    className={[
                      "text-left border rounded-xl bg-slate-950/80 p-4 flex flex-col justify-between transition-all",
                      isActive
                        ? "border-fuchsia-500/70 shadow-[0_0_40px_rgba(217,70,239,0.45)]"
                        : "border-slate-800 hover:border-fuchsia-500/40 hover:bg-slate-900/80",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                        {mission.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-100 mb-1">
                        {mission.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {mission.summary}
                      </p>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-500">
                      Role: {mission.role} · Focus: {mission.focus}.
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="border border-fuchsia-500/30 bg-slate-950/80 rounded-2xl p-5 flex-1">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-2">
              Mission detail
            </p>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">
              {selected.title}
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              {selected.summary}
            </p>
            <p className="text-xs text-slate-400">
              Role: {selected.role} · Focus: {selected.focus}. This area is where we will later plug a proper case study:
              problem framing, constraints, your approach, key decisions, and outcomes.
            </p>
          </div>
        </div>
      );
    
      case "labs":
        return (
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] h-full">
            {/* Active experiments */}
            <div className="border border-fuchsia-500/40 bg-slate-950/85 rounded-2xl p-5 flex flex-col">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-2">
                Labs
              </p>
              <h2 className="text-xl font-semibold mb-2">
                Active experiments
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                Prototypes, visual explorations, and interaction tests that may or may not grow into full missions.
                This is the part of the deck where things are allowed to be rough.
              </p>

              <div className="space-y-3 text-sm text-slate-200">
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                    LAB 01 · Interface
                  </p>
                  <p className="font-medium mb-1">
                    Holographic control surfaces
                  </p>
                  <p className="text-slate-400 text-xs mb-2">
                    Exploring how far sci-fi UI patterns (holograms, floating panels, space-deck metaphors) can be pushed
                    while still staying readable and fast to use.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Focus: motion language, depth cues, and how to keep this portfolio maintainable instead of a one-off art piece.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300 mb-1">
                    LAB 02 · Data
                  </p>
                  <p className="font-medium mb-1">
                    Signals & state visualisation
                  </p>
                  <p className="text-slate-400 text-xs mb-2">
                    Experiments on how to show status, health, and timelines (for projects or people) in a way that feels like a ship dashboard but remains honest and legible.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Focus: compact visual encodings, "at a glance" vs deep dive views.
                  </p>
                </div>
              </div>
            </div>

            {/* Queue / ideas */}
            <div className="space-y-4">
              <div className="border border-slate-800 bg-slate-950/85 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
                  In queue
                </p>
                <ul className="text-sm text-slate-300 space-y-1.5">
                  <li>• Small interactive map or "sector view" tying missions together visually.</li>
                  <li>• Ambient animation layer that reacts to scroll / pointer without becoming distracting.</li>
                  <li>• A way to "dock" external work (talks, writing, side missions) into this OS.</li>
                </ul>
              </div>

              <div className="border border-slate-800 bg-slate-950/85 rounded-2xl p-5 text-sm text-slate-400">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
                  Wild ideas
                </p>
                <p className="mb-1">
                  Some experiments may never ship, but they still influence how I design:
                </p>
                <ul className="space-y-1.5">
                  <li>• AR layer for this deck (viewing missions as anchors in physical space).</li>
                  <li>• "Crew log" view that maps collaborators, teams, and time.</li>
                  <li>• A stripped-down, low-power mode of this UI that still keeps the control-room metaphor.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="max-w-3xl space-y-4">
            <div className="border border-slate-800 bg-slate-950/80 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
                Contact
              </p>
              <h2 className="text-xl font-semibold mb-2">
                Open to missions
              </h2>
              <p className="text-sm text-slate-300 mb-2">
                I&apos;m interested in missions around product design, systems-heavy interfaces, and sci-fi inspired experiences that still respect real-world constraints.
              </p>
              <p className="text-sm text-slate-400">
                If you&apos;d like to discuss a project, collaboration, or just compare notes on building complex interfaces, these are the best ways to reach me.
              </p>
            </div>

            <div className="border border-fuchsia-500/30 bg-slate-950/80 rounded-2xl p-5 grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-1">
                  Primary channel
                </p>
                <div className="space-y-1 text-slate-300">
                  <p className="text-xs text-slate-500">Email</p>
                  {/* TODO: replace with real email */}
                  <p className="font-medium">
                    your.email@domain.com
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300 mb-1">
                  Signal relays
                </p>
                <ul className="space-y-1 text-slate-300 text-sm">
                  {/* TODO: replace hrefs with real links */}
                  <li>
                    <span className="text-xs text-slate-500 block">LinkedIn</span>
                    <a
                      href="#"
                      className="underline underline-offset-2 text-fuchsia-300 hover:text-fuchsia-200"
                    >
                      linkedin.com/in/your-handle
                    </a>
                  </li>
                  <li>
                    <span className="text-xs text-slate-500 block">Portfolio / CV</span>
                    <a
                      href="#"
                      className="underline underline-offset-2 text-fuchsia-300 hover:text-fuchsia-200"
                    >
                      Download CV (PDF)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-2 text-xs text-slate-500">
                <p>
                  Typical response window: within a couple of days. If it&apos;s time-sensitive, say so in the subject line so it doesn&apos;t get buried like a forgotten side quest.
                </p>
              </div>
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
