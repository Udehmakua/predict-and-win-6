import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  WEEKLY_MATCHES,
  CURRENT_WEEK,
  CURRENT_YEAR,
  type Outcome,
} from "@/lib/campaign-config";
import { submitPredictions, checkSubmission } from "@/lib/predictions.functions";
import { Countdown } from "./Countdown";

export function PredictionSection() {
  const submit = useServerFn(submitPredictions);
  const check = useServerFn(checkSubmission);

  const [userId, setUserId] = useState("");
  const [picks, setPicks] = useState<Record<string, Outcome>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);

  const validId = /^[0-9]{4,20}$/.test(userId);
  const allPicked = WEEKLY_MATCHES.every((m) => picks[m.id]);
  const now = Date.now();

  const handlePick = (matchId: string, pick: Outcome, locked: boolean) => {
    if (locked) return;
    if (!validId) {
      toast.error("Enter your BetKing User ID to predict");
      return;
    }
    setPicks((p) => ({ ...p, [matchId]: pick }));
  };

  // Check duplicate when user types a complete ID
  useEffect(() => {
    if (!validId) {
      setSubmitted(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    check({ data: { userId, weekNumber: CURRENT_WEEK, year: CURRENT_YEAR } })
      .then((r) => {
        if (!cancelled) setSubmitted(r.alreadySubmitted);
      })
      .catch(() => {})
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, [userId, validId, check]);

  const handleSubmit = async () => {
    if (!validId) {
      toast.error("Enter a valid BetKing User ID (digits only)");
      return;
    }
    if (!allPicked) {
      toast.error("Make a pick for every match");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          userId,
          weekNumber: CURRENT_WEEK,
          year: CURRENT_YEAR,
          predictions: WEEKLY_MATCHES.map((m) => ({
            matchId: m.id,
            pick: picks[m.id],
          })),
        },
      });
      if (res.success) {
        toast.success("Predictions locked in. Good luck!", {
          description: `Week ${CURRENT_WEEK} • ${WEEKLY_MATCHES.length} picks submitted`,
        });
        setSubmitted(true);
      } else {
        toast.error(res.error);
        if (res.error.includes("already")) setSubmitted(true);
      }
    } catch (e) {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="predict" className="relative scroll-mt-20 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-yellow/40 bg-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">
            Week {CURRENT_WEEK} • {WEEKLY_MATCHES.length} Matches
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
            Make Your <span className="text-yellow">Predictions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Pick the winner of every match below. One entry per User ID per week.
          </p>
        </div>

        {/* User ID input */}
        <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-yellow/30 bg-card/60 p-5 backdrop-blur">
          <label htmlFor="bkid" className="text-xs font-semibold uppercase tracking-widest text-yellow">
            BetKing User ID
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="bkid"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={20}
              placeholder="e.g. 78xxxxxx"
              value={userId}
              onChange={(e) => setUserId(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-lg border border-input bg-navy-deep px-4 py-3 font-mono text-lg tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-yellow focus:outline-none focus:ring-2 focus:ring-yellow/40"
            />
            {checking && <Loader2 className="size-5 animate-spin text-yellow" />}
            {!checking && validId && submitted && (
              <CheckCircle2 className="size-6 shrink-0 text-cyan" />
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {submitted && validId
              ? "You've already submitted for this week. Come back next week!"
              : "Required. You must input your User ID before predicting."}
          </p>
        </div>

        {/* Match cards */}
        <div className="grid gap-4">
          {WEEKLY_MATCHES.map((m) => {
            const kickoffMs = new Date(m.kickoff).getTime();
            const locked = kickoffMs <= now || submitted;
            const pick = picks[m.id];

            return (
              <article
                key={m.id}
                className={`rounded-2xl border bg-card/70 p-4 backdrop-blur transition-all sm:p-6 ${
                  pick ? "border-yellow/60 glow-yellow" : "border-border"
                } ${locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-muted-foreground">
                    {m.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    {locked ? (
                      <span className="inline-flex items-center gap-1 text-destructive">
                        <Lock className="size-3" /> Locked
                      </span>
                    ) : (
                      <>
                        <span className="text-muted-foreground">Locks in</span>
                        <Countdown target={m.kickoff} compact />
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 items-center gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl" aria-hidden>{m.homeFlag}</div>
                    <div className="mt-1 text-xs font-bold uppercase sm:text-sm">{m.home}</div>
                  </div>
                  <div className="text-center font-display text-xl font-extrabold text-muted-foreground sm:text-2xl">
                    VS
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl" aria-hidden>{m.awayFlag}</div>
                    <div className="mt-1 text-xs font-bold uppercase sm:text-sm">{m.away}</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {(
                    [
                      { v: "HOME", label: m.home, sub: "Home Win" },
                      { v: "DRAW", label: "Draw", sub: "X" },
                      { v: "AWAY", label: m.away, sub: "Away Win" },
                    ] as { v: Outcome; label: string; sub: string }[]
                  ).map((opt) => {
                    const active = pick === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        disabled={locked}
                        onClick={() => handlePick(m.id, opt.v, locked)}
                        className={`rounded-xl border px-2 py-3 text-xs font-bold uppercase tracking-wide transition-all sm:py-4 sm:text-sm ${
                          active
                            ? "border-yellow bg-yellow text-primary-foreground scale-[1.02]"
                            : "border-border bg-navy-deep/70 text-foreground hover:border-yellow/60 hover:bg-secondary"
                        } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="truncate">{opt.sub}</div>
                        <div className={`mt-1 text-[10px] font-medium ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        {/* Submit */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submitted || !validId || !allPicked}
            className="group relative inline-flex w-full max-w-md items-center justify-center gap-2 overflow-hidden rounded-xl bg-yellow-gradient px-8 py-4 font-display text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-[0_8px_30px_-8px_var(--brand-yellow)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:text-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Submitting…
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="size-5" /> Predictions Locked
              </>
            ) : (
              <>Submit Predictions</>
            )}
          </button>

          {!validId && userId.length > 0 && (
            <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5" /> User ID must be digits (4–20).
            </p>
          )}

          <p className="mx-auto max-w-md text-center text-xs text-muted-foreground">
            By submitting, you agree to the campaign T&amp;Cs. Stake at least
            ₦100,000 this week to qualify for rewards.
          </p>
        </div>
      </div>
    </section>
  );
}
