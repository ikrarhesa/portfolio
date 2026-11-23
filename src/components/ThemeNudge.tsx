import { useEffect, useState } from "react";
import { useContent } from "../i18n";

/**
 * A comic-book speech bubble that points at the theme toggle and invites people into dark mode.
 *
 * It's deliberately shy: it only appears in light mode, only for someone who has never touched the
 * toggle, after they've been on the page a while, and it leaves on its own. Once seen, it stays
 * away for a week — a nudge that nags is just an ad.
 */

const SEEN_KEY = "hesa_nudge_seen";
const COOLDOWN = 7 * 24 * 60 * 60 * 1000; // a week between appearances
const THEME_KEY = "hesa_theme";
const APPEAR_AFTER = 14_000; // let people read the page first
const STAY_FOR = 11_000;

function shouldNudge() {
  try {
    // Someone who has already picked a theme doesn't need telling
    if (localStorage.getItem(THEME_KEY) !== null) return false;
    const seen = parseInt(localStorage.getItem(SEEN_KEY) ?? "", 10);
    return !Number.isFinite(seen) || Date.now() - seen > COOLDOWN;
  } catch {
    return false; // storage blocked: skip it rather than nag on every page view
  }
}

export default function ThemeNudge({ theme, onAccept }: { theme: "light" | "dark"; onAccept: () => void }) {
  const t = useContent();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (theme !== "light" || !shouldNudge()) return;

    const appear = setTimeout(() => {
      setShow(true);
      try {
        localStorage.setItem(SEEN_KEY, String(Date.now()));
      } catch {
        /* storage blocked: it just shows again next visit */
      }
    }, APPEAR_AFTER);

    return () => clearTimeout(appear);
  }, [theme]);

  // Let it go on its own, and on Escape
  useEffect(() => {
    if (!show) return;
    const leave = setTimeout(() => setShow(false), STAY_FOR);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(leave);
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  if (!show || theme !== "light") return null;

  return (
    <button
      type="button"
      className="theme-nudge"
      aria-label={t.shell.nudge.aria}
      onClick={() => {
        setShow(false);
        onAccept();
      }}
    >
      <span className="theme-nudge-big">{t.shell.nudge.big}</span>
      <span className="theme-nudge-small">{t.shell.nudge.small}</span>
    </button>
  );
}
