import { useEffect, useState } from "react";

interface Entry {
  rank: number;
  user_id_display: string;
  correct_predictions: number;
  stake: number;
}

const TIERS = [
  { label: "Top 1 – 19", from: 1, to: 19 },
  { label: "Rank 20 – 39", from: 20, to: 39 },
  { label: "Rank 40 – 75", from: 40, to: 75 },
  { label: "Rank 76 – 100", from: 76, to: 100 },
];

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
  const isEmpty = !loading && entries.length === 0;

  return (
    <section id="leaderboard" className="scroll-mt-20 bg-navy-deep px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display font-black uppercase leading-[0.95] text-4xl sm:text-6xl">
          Top 100 Predictors
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Updated weekly. Climb the ranks and share the ₦10,000,000 prize pool.
        </p>

        {!isEmpty && (
          <div className="mt-6 flex flex-wrap gap-2">
            {TIERS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setTierIdx(i)}
                className={`rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  tierIdx === i
                    ? "border-yellow bg-yellow text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-yellow/60 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {loading && (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}

          {isEmpty && (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl font-extrabold uppercase text-yellow">
                No Winners Yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check next week.
              </p>
            </div>
          )}

          {!loading && !isEmpty && (
            <>
              <div className="grid grid-cols-[60px_1fr_100px_120px] gap-2 border-b border-border bg-navy-deep px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:grid-cols-[80px_1fr_140px_160px] sm:px-6">
                <div>Rank</div>
                <div>User ID</div>
                <div className="text-right">Correct</div>
                <div className="text-right">Stake (₦)</div>
              </div>

              {visible.map((e) => {
                const isTop3 = e.rank <= 3;
                return (
                  <div
                    key={e.rank}
                    className={`grid grid-cols-[60px_1fr_100px_120px] items-center gap-2 border-b border-border/40 px-4 py-3 sm:grid-cols-[80px_1fr_140px_160px] sm:px-6 ${
                      isTop3 ? "bg-yellow/5" : ""
                    }`}
                  >
                    <div className={`font-display text-base font-extrabold sm:text-lg ${isTop3 ? "text-yellow" : "text-foreground"}`}>
                      #{e.rank}
                    </div>
                    <div className="font-mono text-sm tracking-wider sm:text-base">
                      {e.user_id_display}
                    </div>
                    <div className="text-right font-bold text-yellow sm:text-lg">
                      {e.correct_predictions}
                    </div>
                    <div className="text-right font-mono text-xs text-muted-foreground sm:text-sm">
                      {e.stake.toLocaleString("en-NG")}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {!isEmpty && !loading && (
          <p className="mt-4 text-xs text-muted-foreground">
            Showing {visible.length} of {entries.length || 100} players.
          </p>
        )}
      </div>
    </section>
  );
}

