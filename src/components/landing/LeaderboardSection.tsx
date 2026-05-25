import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Flame } from "lucide-react";

interface Entry {
  rank: number;
  user_id_display: string;
  correct_predictions: number;
  stake: number;
}

const TIERS = [
  { label: "Top 1 – 19", from: 1, to: 19, icon: Trophy, tone: "yellow" as const },
  { label: "Rank 20 – 39", from: 20, to: 39, icon: TrendingUp, tone: "cyan" as const },
  { label: "Rank 40 – 75", from: 40, to: 75, icon: Flame, tone: "muted" as const },
  { label: "Rank 76 – 100", from: 76, to: 100, icon: Flame, tone: "muted" as const },
];

const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG");

export function LeaderboardSection() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tierIdx, setTierIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/leaderboard.json")
      .then((r) => r.json())
      .then((d) => setEntries(d))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const tier = TIERS[tierIdx];
  const visible = entries.filter((e) => e.rank >= tier.from && e.rank <= tier.to);

  return (
    <section id="leaderboard" className="relative scroll-mt-20 bg-navy-deep/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Weekly Leaderboard
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
            Top <span className="text-yellow">100</span> Predictors
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Updated weekly. Climb the ranks and share the ₦10M prize pool.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {TIERS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTierIdx(i)}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all sm:text-sm ${
                tierIdx === i
                  ? "border-yellow bg-yellow text-primary-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:border-yellow/60 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
          <div className="grid grid-cols-[60px_1fr_120px_140px] gap-2 border-b border-border bg-navy-deep/80 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:grid-cols-[80px_1fr_140px_160px] sm:px-6 sm:text-xs">
            <div>Rank</div>
            <div>User ID</div>
            <div className="text-right">Correct</div>
            <div className="text-right">Stake (₦)</div>
          </div>

          {loading && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Loading leaderboard…
            </div>
          )}

          {!loading &&
            visible.map((e) => {
              const isTop3 = e.rank <= 3;
              return (
                <div
                  key={e.rank}
                  className={`grid grid-cols-[60px_1fr_120px_140px] items-center gap-2 border-b border-border/40 px-4 py-3 transition-colors sm:grid-cols-[80px_1fr_140px_160px] sm:px-6 ${
                    isTop3 ? "bg-yellow/5" : "hover:bg-secondary/40"
                  }`}
                >
                  <div
                    className={`font-display text-base font-extrabold sm:text-lg ${
                      isTop3 ? "text-yellow" : "text-foreground"
                    }`}
                  >
                    #{e.rank}
                  </div>
                  <div className="font-mono text-sm tracking-wider sm:text-base">
                    {e.user_id_display}
                  </div>
                  <div className="text-right font-bold text-cyan sm:text-lg">
                    {e.correct_predictions}
                  </div>
                  <div className="text-right font-mono text-xs text-muted-foreground sm:text-sm">
                    {e.stake.toLocaleString("en-NG")}
                  </div>
                </div>
              );
            })}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Showing {visible.length} of {entries.length || 100} players.
        </p>
      </div>
    </section>
  );
}

export { formatNaira };
