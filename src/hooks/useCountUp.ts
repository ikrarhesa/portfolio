import { useEffect, useLayoutEffect, useState } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Eases a number from `from` to `to` once on mount. Jumps straight to `to` for reduced-motion users. */
export function useCountUp(to: number, { from = 0, duration = 1800, delay = 0 } = {}) {
  // Starts at the final number so the pre-rendered HTML (and anything that reads it without running the
  // animation) shows the real value. The layout effect drops it to `from` before the first paint.
  const [value, setValue] = useState(to);

  useLayoutEffect(() => {
    // Intentional: a layout effect runs before paint, so there is no flash and no extra visible render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!prefersReducedMotion()) setValue(from);
  }, [from]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let start = 0;
    const timer = setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        setValue(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, from, duration, delay]);

  return value;
}
