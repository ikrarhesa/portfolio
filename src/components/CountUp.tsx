import { useCountUp } from "../hooks/useCountUp";

export default function CountUp({
  to,
  from = 0,
  suffix = "",
  delay = 0,
  duration = 1800,
}: {
  to: number;
  from?: number;
  suffix?: string;
  delay?: number;
  duration?: number;
}) {
  const value = useCountUp(to, { from, delay, duration });
  return (
    <span className="tabular-nums">
      {Math.round(value).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
