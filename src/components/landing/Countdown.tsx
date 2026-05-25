import { useEffect, useState } from "react";

interface Props {
  target: string; // ISO
  label?: string;
  compact?: boolean;
}

export function Countdown({ target, label, compact }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  const cells = [
    { v: d, l: "Days" },
    { v: h, l: "Hrs" },
    { v: m, l: "Min" },
    { v: s, l: "Sec" },
  ];

  if (compact) {
    return (
      <span className="font-mono text-xs text-yellow tabular-nums">
        {d > 0 ? `${d}d ` : ""}
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
        {String(s).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-3">
      {label && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow/90">
          {label}
        </span>
      )}
      <div className="flex gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.l}
            className="flex min-w-[64px] flex-col items-center rounded-xl border border-yellow/30 bg-navy-deep/80 px-3 py-2 backdrop-blur-sm sm:min-w-[80px] sm:px-4 sm:py-3"
          >
            <span className="font-display text-2xl font-extrabold tabular-nums text-yellow sm:text-4xl">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
              {c.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
