import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  WEEKLY_MATCHES,
  CURRENT_WEEK,
  CURRENT_YEAR,
  type Outcome,
} from "@/lib/campaign-config";
import { submitPredictions, checkSubmission } from "@/lib/predictions.functions";
import { Flag } from "./Flag";



const fmtKick = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} ${time}`;
};

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
          This Week's Fixtures
        </p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
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

        {/* Matches */}
        <div className="mt-6 grid gap-3">
          {WEEKLY_MATCHES.map((m, i) => {
            const locked = new Date(m.kickoff).getTime() <= now || submitted;
            const pick = picks[m.id];
            return (
              <article
                key={m.id}
                className={`rounded-xl border bg-card p-4 sm:p-5 ${
                  pick ? "border-yellow" : "border-border"
                } ${locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-muted-foreground">Match {i + 1}</span>
                  <span className="text-yellow">{fmtKick(m.kickoff)}</span>
                </div>

                <div className="mt-3 grid grid-cols-3 items-center">
                  <div className="flex items-center gap-3">
                    <Flag country={m.home} className="h-7 w-10 shrink-0 sm:h-8 sm:w-12" />
                    <div className="text-[11px] font-bold uppercase tracking-wider sm:text-sm">
                      {m.home}
                    </div>
                  </div>
                  <div className="text-center font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    vs
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right text-[11px] font-bold uppercase tracking-wider sm:text-sm">
                      {m.away}
                    </div>
                    <Flag country={m.away} className="h-7 w-10 shrink-0 sm:h-8 sm:w-12" />
                  </div>
                </div>


                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "HOME", label: m.home, sub: "Home" },
                      { v: "DRAW", label: "X", sub: "Draw" },
                      { v: "AWAY", label: m.away, sub: "Away" },
                    ] as { v: Outcome; label: string; sub: string }[]
                  ).map((opt) => {
                    const active = pick === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        disabled={locked}
                        onClick={() => handlePick(m.id, opt.v, locked)}
                        className={`rounded-md border px-2 py-3 text-center transition-colors ${
                          active
                            ? "border-yellow bg-yellow text-primary-foreground"
                            : "border-border bg-navy-deep text-foreground hover:border-yellow/60"
                        } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="text-[9px] font-semibold uppercase tracking-widest opacity-70">
                          {opt.sub}
                        </div>
                        <div className="mt-1 text-sm font-extrabold uppercase">
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
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submitted || !validId || !allPicked}
            className="w-full max-w-md rounded-md bg-yellow px-8 py-4 font-display text-base font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? "Submitting…" : submitted ? "Predictions Locked" : "Submit Predictions"}
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
