import { lazy, Suspense, useState, useEffect } from "react";
import ShellLayout from "./components/ShellLayout";
import IntroLoader from "./components/IntroLoader";
import SiteFooter from "./components/SiteFooter";
// The game is only fetched when someone opens it
const SpaceInvaderModal = lazy(() => import("./components/SpaceInvaderModal"));
import { CONTACT } from "./constants/contact";
import { fill, useContent, useLang, useMissions } from "./i18n";
import Label from "./components/Label";
import MissionCard from "./components/MissionCard";
import ProjectPage from "./components/ProjectPage";
import HeroStage from "./components/HeroStage";
import CountUp from "./components/CountUp";

const INTRO_SEEN_KEY = "hesa_intro_seen"; // when the intro last played
const INTRO_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // replay at most once a week

// The intro plays on a first visit to the home page, then at most once a week. It never makes someone wait who
// opened a link straight to a page or section (e.g. a shared case study). Add ?intro to the URL to force it.
// index.html has an inline copy of these conditions that hides the pre-rendered page until React mounts, so keep
// the two in step.
// Automated readers (crawlers, link previews, AI browsing tools, headless browsers) snapshot the page early, so
// they would only ever see the intro. Let them straight into the real content.
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|gpt|claude|perplexity|anthropic|openai/i;
const looksAutomated = () => navigator.webdriver === true || BOT_UA.test(navigator.userAgent);

function shouldPlayIntro() {
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  if (looksAutomated()) return false;
  if (window.location.pathname !== "/") return false; // case study page
  if (window.location.hash.length > 1) return false; // deep link to a section
  try {
    const seen = parseInt(localStorage.getItem(INTRO_SEEN_KEY) ?? "", 10);
    return !Number.isFinite(seen) || Date.now() - seen > INTRO_COOLDOWN;
  } catch {
    return true; // storage blocked: play it, it only costs a few seconds
  }
}

// The numbers are the same in every language; the eyebrow naming each metric and the caption
// below it come from the content files (home.proof, same order).
// 16,900% is (34,000 - 200) / 200: the growth in weekly template uses in Malaysia over three months.
const PROOF: { from?: number; to: number; prefix?: string; suffix: string }[] = [
  { to: 16900, suffix: "%" },
  { to: 6, suffix: "" },
];

// Staggered entrance delay for the hero (see .rise in index.css)
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const LINK =
  "text-fuchsia-300 underline decoration-fuchsia-300/40 underline-offset-4 transition-colors hover:text-fuchsia-200 hover:decoration-fuchsia-200 focus-visible:outline-2 focus-visible:outline-fuchsia-400 rounded-sm";

// Real paths: "/" is home and "/work/<id>" is a case study. Each one is also pre-rendered to its own HTML file.
const ROUTE_RE = /^\/work\/([\w-]+)\/?$/;
const getProjectId = (path: string) => path.match(ROUTE_RE)?.[1] ?? null;

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** `initialPath` is only passed when pre-rendering at build time (see src/entry-server.tsx). */
function App({ initialPath }: { initialPath?: string }) {
  // "leaving" means the intro is fading out while the site is already mounted underneath it
  // (so the hero animates in with no black gap).
  const [intro, setIntro] = useState<"playing" | "leaving" | "done">(() =>
    initialPath === undefined && shouldPlayIntro() ? "playing" : "done"
  );
  const showLoader = intro === "playing";
  const [isSpaceInvaderModalOpen, setIsSpaceInvaderModalOpen] = useState(false);
  const [path, setPath] = useState(() => initialPath ?? window.location.pathname);
  const [navKey, setNavKey] = useState(0); // bumps on every in-app link click, so "/#about" re-scrolls
  const { lang } = useLang();
  const t = useContent();
  const missions = useMissions();
  const project = missions.find((m) => m.id === getProjectId(path)) ?? null;
  const projectId = project?.id ?? null;

  // The page is hidden until React mounts when the intro is about to play (see index.html)
  useEffect(() => {
    document.documentElement.classList.remove("intro-pending");
  }, []);

  // Client-side navigation for links to "/" and "/work/<id>", so moving around doesn't reload the page.
  // Back and forward buttons are handled by popstate.
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== "/" && !ROUTE_RE.test(url.pathname)) return; // e.g. the CV PDF
      e.preventDefault();
      const next = url.pathname + url.search + url.hash;
      if (next !== window.location.pathname + window.location.search + window.location.hash) {
        window.history.pushState(null, "", next);
      }
      setPath(url.pathname);
      setNavKey((k) => k + 1);
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
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

  // The title and description follow the page and the language. This is separate from the scroll effect below,
  // so switching language never moves the page.
  const pageTitle = project ? fill(t.shell.meta.projectTitle, { title: project.title }) : t.shell.meta.homeTitle;
  const pageDescription = project ? project.summary : t.shell.meta.homeDescription;
  useEffect(() => {
    if (showLoader) return;
    document.title = pageTitle;
    const set = (selector: string, value: string) =>
      document.head.querySelector(selector)?.setAttribute("content", value);
    set('meta[name="description"]', pageDescription);
    set('meta[property="og:title"]', pageTitle);
    set('meta[property="og:description"]', pageDescription);
    set('meta[name="twitter:title"]', pageTitle);
    set('meta[name="twitter:description"]', pageDescription);
    set('meta[property="og:locale"]', lang === "ja" ? "ja_JP" : "en_US");
  }, [showLoader, pageTitle, pageDescription, lang]);

  // After a route change: project pages start at the top; home scrolls to its "#section"
  useEffect(() => {
    if (showLoader) return;
    const root = document.documentElement;
    if (projectId) {
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = "";
      return;
    }
    const id = window.location.hash.slice(1);
    if (id) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    } else if (navKey > 0) {
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0); // arrived through a link to "/" (the logo)
      root.style.scrollBehavior = "";
    }
  }, [projectId, showLoader, navKey]);

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
        {/* Hero. No bottom padding: the work section below supplies the whole gap, so the stats row
            and the case studies stay on the first screen. */}
        <section>
          {/* Deliberately shorter than one screen: the work comes first, so the stats row and the
              case studies below it are reachable on the first scroll rather than a screen down.
              HeroStage sizes the phone against the same height — keep the two in step. */}
          <div className="grid min-h-[28rem] items-center gap-10 py-8 md:min-h-[calc(62svh-4rem)] lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <div className="rise" style={delay(0)}>
                <Label>{t.home.hero.label}</Label>
              </div>
              <h1
                className="rise mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-zinc-50 md:text-6xl"
                style={delay(120)}
              >
                {t.home.hero.headline.before}
                <span className="shimmer-text">{t.home.hero.headline.emphasis}</span>
                {t.home.hero.headline.after}
              </h1>
              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-zinc-300" style={delay(260)}>
                {t.home.hero.intro}
              </p>
              <div className="rise mt-8 flex flex-wrap gap-3" style={delay(400)}>
                <a
                  href="/#work"
                  className="group inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-7 py-4 text-base font-semibold text-white shadow-[0_8px_30px_rgba(217,70,239,0.35)] transition-colors hover:bg-fuchsia-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                >
                  {t.home.hero.ctaWork}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="/#contact"
                  className="inline-flex items-center rounded-xl px-4 py-4 max-sm:px-0 text-sm font-medium text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-fuchsia-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                >
                  {t.home.hero.ctaContact}
                </a>
              </div>
            </div>

            <div className="rise" style={delay(300)}>
              <HeroStage onPlayInvaders={() => setIsSpaceInvaderModalOpen(true)} />
            </div>
          </div>

          <dl className="rise grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-2" style={delay(560)}>
            {PROOF.map((p, i) => (
              <div key={i}>
                {/* The metric is named before the number, so the figure means something on sight */}
                <dt className="font-mono text-xs uppercase tracking-widest text-fuchsia-300">
                  {t.home.proof[i].eyebrow}
                </dt>
                <dd className="mt-3">
                  <span className="block text-4xl font-bold tracking-tight text-zinc-50">
                    <CountUp from={p.from} to={p.to} prefix={p.prefix} suffix={p.suffix} delay={700} />
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-zinc-400">{t.home.proof[i].label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Work */}
        <section id="work" className="scroll-mt-20 pt-12 pb-14 md:pt-14 md:pb-20">
          <Label>{t.home.work.label}</Label>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">{t.home.work.heading}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {missions.map((m, i) => (
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
                  alt={t.home.about.photoAlt}
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
              <Label>{t.home.about.label}</Label>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">{t.home.about.heading}</h2>

              <div className="mt-6 space-y-5 text-base leading-relaxed text-zinc-300">
                <p className="text-lg text-zinc-200">
                  {t.home.about.p1.before}
                  <a href="https://shopee.co.id/" target="_blank" rel="noreferrer" className={LINK}>
                    {t.home.about.p1.link}
                  </a>
                  {t.home.about.p1.after}
                </p>
                <p>{t.home.about.p2}</p>
                <p>
                  {t.home.about.p3.before}
                  <a href="https://danacita.co.id/" target="_blank" rel="noreferrer" className={LINK}>
                    {t.home.about.p3.link}
                  </a>
                  {t.home.about.p3.after}
                </p>
                <p>{t.home.about.p4}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 border-t border-white/10 py-14 md:py-20">
          <Label>{t.home.contact.label}</Label>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">{t.home.contact.heading}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">{t.home.contact.body}</p>
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
                {t.home.contact.linkedin}
              </a>
            )}
            {CONTACT.cv && (
              <a
                href={CONTACT.cv}
                download
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
              >
                {t.home.contact.cv}
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
      {isSpaceInvaderModalOpen && (
        <Suspense fallback={null}>
          <SpaceInvaderModal isOpen onClose={() => setIsSpaceInvaderModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default App;
