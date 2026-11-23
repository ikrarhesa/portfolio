import { useState, useEffect } from "react";
import ShellLayout from "./components/ShellLayout";
import IntroLoader from "./components/IntroLoader";
import SiteFooter from "./components/SiteFooter";
import SpaceInvaderModal from "./components/SpaceInvaderModal";
import { CONTACT } from "./constants/contact";
import { MISSIONS } from "./constants/missions";
import Label from "./components/Label";
import MissionCard from "./components/MissionCard";
import ProjectPage from "./components/ProjectPage";
import HeroStage from "./components/HeroStage";
import CountUp from "./components/CountUp";

const INTRO_SEEN_KEY = "hesa_intro_seen"; // when the intro last played
const INTRO_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // replay at most once a week

// The intro plays on a first visit, then at most once a week. It never makes someone wait who opened a link
// straight to a page or section (e.g. a shared case study). Add ?intro to the URL to force it.
function shouldPlayIntro() {
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  if (window.location.hash.length > 1) return false; // deep link
  try {
    const seen = parseInt(localStorage.getItem(INTRO_SEEN_KEY) ?? "", 10);
    return !Number.isFinite(seen) || Date.now() - seen > INTRO_COOLDOWN;
  } catch {
    return true; // storage blocked: play it, it only costs a few seconds
  }
}

const PROOF: { from?: number; to: number; prefix?: string; suffix: string; label: string }[] = [
  { from: 30, to: 500, prefix: "", suffix: "", label: "videos a week using AR effects in Indonesia after the library refresh, up from 30" },
  { to: 6, suffix: "+", label: "years across design, motion and digital marketing" },
];

// Staggered entrance delay for the hero (see .rise in index.css)
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const LINK =
  "text-fuchsia-300 underline decoration-fuchsia-300/40 underline-offset-4 transition-colors hover:text-fuchsia-200 hover:decoration-fuchsia-200 focus-visible:outline-2 focus-visible:outline-fuchsia-400 rounded-sm";

const PRINCIPLES = [
  ["Clarity over cleverness", "Keep the UX plain. Save the cleverness for interaction details."],
  ["Systems thinking", "Design how components, journeys and metrics connect."],
  ["Honest communication", "Show trade-offs, not just glossy outcomes."],
];

const getProjectId = (hash: string) => hash.match(/^#\/work\/([\w-]+)/)?.[1] ?? null;

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function App() {
  // "leaving" means the intro is fading out while the site is already mounted underneath it
  // (so the hero animates in with no black gap).
  const [intro, setIntro] = useState<"playing" | "leaving" | "done">(() => (shouldPlayIntro() ? "playing" : "done"));
  const showLoader = intro === "playing";
  const [isSpaceInvaderModalOpen, setIsSpaceInvaderModalOpen] = useState(false);
  const [hash, setHash] = useState(() => window.location.hash);
  const project = MISSIONS.find((m) => m.id === getProjectId(hash)) ?? null;

  // Hash routing: "#/work/<id>" is a project page, anything else is home
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Konami code opens the game
  useEffect(() => {
    if (showLoader) return;
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress++;
        if (progress === KONAMI.length) {
          progress = 0;
          setIsSpaceInvaderModalOpen(true);
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLoader]);

  // After a route change: project pages start at the top; home scrolls to its "#section"
  useEffect(() => {
    if (showLoader) return;
    const root = document.documentElement;
    if (project) {
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = "";
      document.title = `${project.title} · Ikrar Hesa Prasetya`;
      return;
    }
    document.title = "Ikrar Hesa Prasetya · Product & Creative Systems Designer";
    const id = window.location.hash.slice(1);
    if (id && !id.startsWith("/")) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
  }, [project, showLoader]);

  const handleReveal = () => {
    setIntro("leaving");
    try {
      localStorage.setItem(INTRO_SEEN_KEY, Date.now().toString());
    } catch {
      /* storage can be blocked */
    }
  };

  return (
    <>
      {!showLoader && (
      <ShellLayout route={project ? "project" : "home"}>
        {project ? (
          <ProjectPage mission={project} />
        ) : (
          <>
        {/* Hero */}
        <section className="pb-14 md:pb-20">
          {/* One screen tall (minus the 4rem header and a 6.5rem peek), so the stats row below is cut off
              at the bottom edge on purpose and invites a scroll. */}
          <div className="grid min-h-[calc(100svh-4rem-6.5rem)] items-center gap-10 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <div className="rise" style={delay(0)}>
                <Label>Ikrar Hesa Prasetya · Jakarta</Label>
              </div>
              <h1
                className="rise mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-zinc-50 md:text-6xl"
                style={delay(120)}
              >
                Designer of digital products and <span className="shimmer-text">creative systems</span>.
              </h1>
              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-zinc-300" style={delay(260)}>
                I design experiences and tools that help people communicate, create and sell. Currently designing at
                Shopee, working on creative tools used by millions across Southeast Asia.
              </p>
              <div className="rise mt-8 flex flex-wrap gap-3" style={delay(400)}>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-7 py-4 text-base font-semibold text-white shadow-[0_8px_30px_rgba(217,70,239,0.35)] transition-colors hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                >
                  See selected work
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-xl px-4 py-4 max-sm:px-0 text-sm font-medium text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                >
                  Get in touch
                </a>
              </div>
            </div>

            <div className="rise" style={delay(300)}>
              <HeroStage onPlayInvaders={() => setIsSpaceInvaderModalOpen(true)} />
            </div>
          </div>

          <dl className="rise grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-2" style={delay(560)}>
            {PROOF.map((p) => (
              <div key={p.label}>
                <dt className="text-4xl font-bold tracking-tight text-zinc-50">
                  <CountUp from={p.from} to={p.to} prefix={p.prefix} suffix={p.suffix} delay={700} />
                </dt>
                <dd className="mt-2 text-sm leading-snug text-zinc-400">{p.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Work */}
        <section id="work" className="scroll-mt-20 py-14 md:py-20">
          <Label>Selected work</Label>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">Selected case studies</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {MISSIONS.map((m, i) => (
              <MissionCard key={m.id} mission={m} featured={i === 0} />
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-20 border-t border-white/10 py-14 md:py-20">
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14 lg:grid-cols-[minmax(0,380px)_1fr]">
            <figure className="mx-auto w-full max-w-sm md:sticky md:top-24 md:mx-0">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)] shadow-[0_0_60px_rgba(217,70,239,0.12)]">
                <img
                  src="/about.jpg"
                  alt="Ikrar Hesa Prasetya standing beside an Apollo 11 poster outside the Smithsonian National Air and Space Museum"
                  width={840}
                  height={1118}
                  loading="lazy"
                  className="block aspect-[3/4] w-full object-cover grayscale contrast-[1.05]"
                />
                {/* Fades the bottom of the photo into the page */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/45 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </figure>

            <div>
              <Label>About</Label>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">A little about me</h2>

              <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-300">
                <p className="text-lg text-zinc-200">
                  I'm a multi-disciplinary designer with over 6 years of experience across product, brand and motion,
                  based in Jakarta. Currently at{" "}
                  <a href="https://shopee.co.id/" target="_blank" rel="noreferrer" className={LINK}>
                    Shopee
                  </a>
                  , designing creative tools and experiences, including AR, at one of Southeast Asia's leading
                  e-commerce platforms, used by millions of people.
                </p>
                <p>
                  I am driven by curiosity and my mission to design empathetic products that balance user experience and
                  business impact.
                </p>
                <p>
                  Before Shopee, I worked as a Creative Marketing Associate at{" "}
                  <a href="https://danacita.co.id/" target="_blank" rel="noreferrer" className={LINK}>
                    Danacita
                  </a>
                  , where I helped schools, universities, bootcamps and students access a more affordable education
                  through Danacita's products and services. I also helped bring those products to market and grow
                  Danacita's design team.
                </p>
                <p>In my downtime, I enjoy exploring new destinations with my trusty camera.</p>
              </div>

              <div className="mt-12 border-t border-white/10 pt-8">
                <Label>How I work</Label>
                <ul className="mt-5 grid gap-6 sm:grid-cols-3">
                  {PRINCIPLES.map(([t, d]) => (
                    <li key={t}>
                      <p className="font-semibold text-zinc-100">{t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 border-t border-white/10 py-14 md:py-20">
          <Label>Contact</Label>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">Let's work together</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
            Open to product design roles and collaborations. Typical reply within a couple of days. If it's urgent,
            say so in the subject line.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {CONTACT.email && (
              <a
                href={`mailto:${CONTACT.email}`}
                className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
              >
                {CONTACT.email}
              </a>
            )}
            {CONTACT.linkedin && (
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
              >
                LinkedIn
              </a>
            )}
            {CONTACT.cv && (
              <a
                href={CONTACT.cv}
                download
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
              >
                Download CV
              </a>
            )}
          </div>
        </section>

          </>
        )}

        <SiteFooter />
      </ShellLayout>
      )}
      {intro !== "done" && <IntroLoader onReveal={handleReveal} onDone={() => setIntro("done")} />}
      <SpaceInvaderModal isOpen={isSpaceInvaderModalOpen} onClose={() => setIsSpaceInvaderModalOpen(false)} />
    </>
  );
}

export default App;
