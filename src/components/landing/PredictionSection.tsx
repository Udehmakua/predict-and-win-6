import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  WEEKLY_MATCHES,
  CURRENT_WEEK,
  CURRENT_YEAR,
  type Outcome,
} from "@/lib/campaign-config";
import { submitPredictions, checkSubmission } from "@/lib/predictions.functions";
import { validateBetkingUserId } from "@/lib/user-id-validation";
import { Flag } from "./Flag";



const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDayHeader = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

// Group matches by calendar day (BetKing-style date headers)
function groupByDay<T extends { kickoff: string }>(matches: T[]) {
  const groups: { label: string; items: T[] }[] = [];
  for (const m of matches) {
    const label = fmtDayHeader(m.kickoff);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(m);
    else groups.push({ label, items: [m] });
  }
  return groups;
}

export function PredictionSection() {
  const submit = useServerFn(submitPredictions);
  const check = useServerFn(checkSubmission);

  const [userId, setUserId] = useState("");
  const [picks, setPicks] = useState<Record<string, Outcome>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Tick every second so the section auto-locks at the first kickoff.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // First match kickoff — when this passes, the whole section locks.
  const firstKickoff = Math.min(
    ...WEEKLY_MATCHES.map((m) => new Date(m.kickoff).getTime()),
  );
  const kickedOff = now >= firstKickoff;
  const sectionLocked = submitted || kickedOff;

  const validId = /^[0-9]{4,20}$/.test(userId);
  const allPicked = WEEKLY_MATCHES.every((m) => picks[m.id]);
  const madeCount = Object.keys(picks).length;

  const handlePick = (matchId: string, pick: Outcome, locked: boolean) => {
    if (locked) return;
    if (!validId) {
      toast.error("Enter your BetKing User ID to predict");
      return;
    }
    setPicks((p) => ({ ...p, [matchId]: pick }));
  };

  useEffect(() => {
    if (!validId) {
      setSubmitted(false);
      return;
    }
    let cancelled = false;
    check({ data: { userId, weekNumber: CURRENT_WEEK, year: CURRENT_YEAR } })
      .then((r) => !cancelled && setSubmitted(r.alreadySubmitted))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, validId, check]);

  const handleSubmit = async () => {
    if (!validId) return toast.error("Enter a valid BetKing User ID (digits only)");
    if (!allPicked) return toast.error("Make a pick for every match");
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
        toast.success("Predictions locked in. Good luck!");
        setSubmitted(true);
      } else {
        toast.error(res.error);
        if (res.error.includes("already")) setSubmitted(true);
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="predict" className="scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-bold uppercase tracking-[0.2em] text-yellow text-3xl">
          This Week's Fixtures
        </p>
        <h2 className="mt-2 font-display font-black uppercase leading-[0.95] sm:text-6xl text-xl">
          Make Your 5 Picks
        </h2>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {madeCount}/5 predictions made
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* User ID */}
        <div className="mt-6 rounded-xl border border-yellow/30 bg-card p-4">
          <label htmlFor="bkid" className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow">
            BetKing User ID (required)
          </label>
          <input
            id="bkid"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={20}
            placeholder="e.g. 78xxxxxx"
            value={userId}
            onChange={(e) => setUserId(e.target.value.replace(/\D/g, ""))}
            className="mt-2 w-full rounded-md border border-input bg-navy-deep px-3 py-2.5 font-mono tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-yellow focus:outline-none"
          />
          {submitted && validId && (
            <p className="mt-2 text-xs text-yellow">
              You've already submitted for this week.
            </p>
          )}
        </div>

        {/* Matches — BetKing-style feed grouped by day */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {groupByDay(WEEKLY_MATCHES).map((group) => (
            <div key={group.label}>
              {/* Day header */}
              <div className="flex items-center justify-between bg-secondary px-4 py-2.5">
                <span className="font-[family-name:var(--font-subtle)] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </span>
                <div className="flex w-[150px] justify-around text-xs font-bold text-muted-foreground sm:w-[180px]">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </div>
              </div>

              {group.items.map((m) => {
                const locked = sectionLocked;
                const pick = picks[m.id];
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 border-t border-border px-3 py-3 sm:px-4 ${
                      locked ? "opacity-60" : ""
                    }`}
                  >
                    {/* Stats icon + time */}
                    <div className="flex flex-col items-center gap-1 pr-1">
                      <svg
                        viewBox="0 0 16 16"
                        className="size-4 text-yellow"
                        fill="currentColor"
                      >
                        <rect x="1" y="9" width="3" height="6" />
                        <rect x="6.5" y="5" width="3" height="10" />
                        <rect x="12" y="1" width="3" height="14" />
                      </svg>
                      <span className="font-[family-name:var(--font-subtle)] text-[10px] font-semibold text-muted-foreground">
                        {fmtTime(m.kickoff)}
                      </span>
                    </div>

                    {/* Teams (stacked, BetKing style) */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Flag country={m.home} className="h-3.5 w-5 shrink-0" />
                        <span className="truncate text-sm font-semibold text-foreground">
                          {m.home}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Flag country={m.away} className="h-3.5 w-5 shrink-0" />
                        <span className="truncate text-sm font-semibold text-foreground">
                          {m.away}
                        </span>
                      </div>
                    </div>

                    {/* 1 / X / 2 buttons */}
                    <div className="flex w-[150px] shrink-0 gap-1.5 sm:w-[180px]">
                      {(["HOME", "DRAW", "AWAY"] as Outcome[]).map((v) => {
                        const active = pick === v;
                        const label = v === "HOME" ? "1" : v === "DRAW" ? "X" : "2";
                        return (
                          <button
                            key={v}
                            type="button"
                            disabled={locked}
                            onClick={() => handlePick(m.id, v, locked)}
                            className={`flex-1 rounded-md py-2.5 text-center text-sm font-bold transition-colors ${
                              active
                                ? "bg-yellow text-primary-foreground"
                                : "bg-secondary text-foreground hover:bg-yellow/20"
                            } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>


        {/* Submit */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || sectionLocked || !validId || !allPicked}
            className="w-full max-w-md rounded-md bg-yellow px-8 py-4 font-display text-base font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting
              ? "Submitting…"
              : submitted
                ? "Predictions Locked"
                : kickedOff
                  ? "Predictions Closed — Matches Started"
                  : "Submit Predictions"}
          </button>
          {!validId && userId.length > 0 && (
            <p className="text-xs text-destructive">User ID must be digits (4–20).</p>
          )}
          <p className="max-w-md text-center text-xs text-muted-foreground">
            By submitting, you agree to the campaign T&amp;Cs. Stake at least
            ₦100,000 this week to qualify.
          </p>
        </div>
      </div>
    </section>
  );
}
