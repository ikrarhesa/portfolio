import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PerspectiveGrid from "./PerspectiveGrid";

const NAV = [
  { id: "work", label: "Work", href: "#work" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
];

type ShellLayoutProps = {
  children: React.ReactNode;
  /** "project" keeps Work highlighted while a case study is open */
  route?: "home" | "project";
};

function ShellLayout({ children, route = "home" }: ShellLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Compact header and scroll-spy, throttled to one update per frame
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 16);

      if (route === "project") {
        setActive("work");
        return;
      }
      let current: string | null = null;
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 140) current = n.id;
      }
      if (max > 0 && y >= max - 4) current = NAV[NAV.length - 1].id; // bottom of page = last section
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [route]);

  // Slide the highlight pill under the active link (moved imperatively, no re-render)
  useLayoutEffect(() => {
    const place = () => {
      const pill = pillRef.current;
      const link = active ? linkRefs.current[active] : null;
      if (!pill) return;
      if (!link) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <div className="min-h-screen text-zinc-200 relative">
      {/* Quiet backdrop: the grid stays as atmosphere, not competition for the text */}
      <div className="fixed inset-0 z-0 opacity-[0.12] pointer-events-none" aria-hidden>
        <PerspectiveGrid />
      </div>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(217,70,239,0.10), transparent 60%)" }}
      />

      <header
        className={[
          "sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-white/10 bg-[#07060b]/85 backdrop-blur" : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto max-w-5xl px-5 flex items-center justify-between gap-4 transition-[height] duration-300",
            scrolled ? "h-12" : "h-16",
          ].join(" ")}
        >
          <a
            href="#top"
            className="group font-semibold text-zinc-100 tracking-tight focus-visible:outline-2 focus-visible:outline-fuchsia-400 rounded"
          >
            Hesa
            <span className="text-fuchsia-400 inline-block transition-transform duration-300 group-hover:scale-150 motion-safe:animate-pulse">
              .
            </span>
          </a>

          <nav ref={navRef} className="relative flex items-center text-sm" aria-label="Primary">
            <span
              ref={pillRef}
              aria-hidden
              className="absolute left-0 top-0 h-full rounded-md bg-white/10 ring-1 ring-fuchsia-400/30 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
            />
            {NAV.map((n) => (
              <a
                key={n.id}
                ref={(el) => {
                  linkRefs.current[n.id] = el;
                }}
                href={n.href}
                aria-current={active === n.id ? "true" : undefined}
                className={[
                  "relative px-3 py-1.5 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400",
                  active === n.id ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100",
                ].join(" ")}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 text-xs text-emerald-300 border border-emerald-400/30 rounded-full px-3 py-1.5 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-emerald-300"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-5xl px-5">
        {children}
      </main>
    </div>
  );
}

export default ShellLayout;
