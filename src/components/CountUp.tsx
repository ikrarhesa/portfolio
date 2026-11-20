import { useCountUp } from "../hooks/useCountUp";

export default function CountUp({
  to,
  from = 0,
  suffix = "",
  prefix = "",
  delay = 0,
  duration = 1800,
}: {
  to: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  duration?: number;
}) {
  const value = useCountUp(to, { from, delay, duration });
  return (
    <span className="tabular-nums">
      {prefix}
      {Math.round(value).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
