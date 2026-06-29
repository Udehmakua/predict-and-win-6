import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  WEEKLY_QUESTIONS,
  CURRENT_WEEK,
  CURRENT_YEAR,
  type Question,
} from "@/lib/campaign-config";
import { submitPredictions, checkSubmission } from "@/lib/predictions.functions";
import { validateBetkingUserId } from "@/lib/user-id-validation";
import { WorldCupIcon } from "./WorldCupIcon";

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

// Group questions by calendar day
function groupByDay(questions: Question[]) {
  const groups: { label: string; items: Question[] }[] = [];
  for (const q of questions) {
    const label = fmtDayHeader(q.kickoff);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(q);
    else groups.push({ label, items: [q] });
  }
  return groups;
}

export function PredictionSection() {
  const submit = useServerFn(submitPredictions);
  const check = useServerFn(checkSubmission);

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const firstKickoff = Math.min(
    ...WEEKLY_QUESTIONS.map((q) => new Date(q.kickoff).getTime()),
  );
  const kickedOff = now >= firstKickoff;
  const sectionLocked = submitted || kickedOff;

  const validation = useMemo(() => validateBetkingUserId(userId), [userId]);
  const validId = validation.ok;
  const validityReason = validation.ok ? null : validation.reason;
  const nameRegex = /^[A-Za-z][A-Za-z'\-\s]*$/;
  const validFirstName = firstName.trim().length > 0 && nameRegex.test(firstName.trim());
  const validLastName = lastName.trim().length > 0 && nameRegex.test(lastName.trim());
  const validNames = validFirstName && validLastName;
  const allAnswered = WEEKLY_QUESTIONS.every((q) => (answers[q.id] ?? "").trim().length > 0);
  const madeCount = WEEKLY_QUESTIONS.filter((q) => (answers[q.id] ?? "").trim().length > 0).length;

  const guard = (locked: boolean) => {
    if (locked) return false;
    if (!validId) {
      toast.error("Enter your BetKing User ID to predict");
      return false;
    }
    if (!validNames) {
      toast.error("Enter your first and last name to predict");
      return false;
    }
    return true;
  };

  const setAnswer = (qid: string, value: string) =>
    setAnswers((a) => ({ ...a, [qid]: value }));

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
    if (!validId) return toast.error(validityReason ?? "Enter a valid BetKing User ID");
    if (!validNames) return toast.error("Enter your first and last name");
    if (!allAnswered) return toast.error("Answer every question");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          userId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          weekNumber: CURRENT_WEEK,
          year: CURRENT_YEAR,
          predictions: WEEKLY_QUESTIONS.map((q) => ({
            questionId: q.id,
            fixture: q.fixture,
            question: q.text,
            type: q.type,
            answer: answers[q.id].trim(),
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
        <h2 className="font-display font-extrabold uppercase leading-[0.95] text-3xl sm:text-4xl">
          Answer Your 5 Questions
        </h2>

        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {madeCount}/5 answered
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Name */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-yellow/30 bg-card p-4">
            <label htmlFor="fname" className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow">
              First Name (required)
            </label>
            <input
              id="fname"
              type="text"
              autoComplete="given-name"
              maxLength={50}
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-navy-deep px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:border-yellow focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-yellow/30 bg-card p-4">
            <label htmlFor="lname" className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow">
              Last Name (required)
            </label>
            <input
              id="lname"
              type="text"
              autoComplete="family-name"
              maxLength={50}
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-navy-deep px-3 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:border-yellow focus:outline-none"
            />
          </div>
        </div>

        {/* User ID */}
        <div className="mt-4 rounded-xl border border-yellow/30 bg-card p-4">
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

        {/* Questions */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {groupByDay(WEEKLY_QUESTIONS).map((group) => (
            <div key={group.label}>
              <div className="flex items-center justify-between bg-secondary px-4 py-2.5">
                <span className="font-[family-name:var(--font-subtle)] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </span>
              </div>

              {group.items.map((q) => {
                const locked = sectionLocked;
                const answer = answers[q.id] ?? "";
                return (
                  <div
                    key={q.id}
                    className={`border-t border-border px-3 py-4 sm:px-4 ${
                      locked ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pr-1 pt-1">
                        <WorldCupIcon className="h-3.5 w-5 shrink-0 text-yellow" />
                        <span className="font-[family-name:var(--font-subtle)] text-[10px] font-semibold text-muted-foreground">
                          {fmtTime(q.kickoff)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wide text-yellow">
                          {q.fixture}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {q.text}
                        </p>

                        {q.type === "YES_NO" ? (
                          <div className="mt-3 flex gap-2">
                            {(["Yes", "No"] as const).map((v) => {
                              const active = answer === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  disabled={locked}
                                  onClick={() => {
                                    if (!guard(locked)) return;
                                    setAnswer(q.id, v);
                                  }}
                                  className={`min-w-[80px] rounded-md py-2.5 px-4 text-sm font-bold transition-colors ${
                                    active
                                      ? "bg-yellow text-primary-foreground"
                                      : "bg-secondary text-foreground hover:bg-yellow/20"
                                  } ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            type="text"
                            disabled={locked}
                            maxLength={100}
                            placeholder="Type your answer"
                            value={answer}
                            onChange={(e) => {
                              if (!guard(locked)) return;
                              setAnswer(q.id, e.target.value);
                            }}
                            className="mt-3 w-full rounded-md border border-input bg-navy-deep px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-yellow focus:outline-none disabled:cursor-not-allowed"
                          />
                        )}
                      </div>
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
            disabled={submitting || sectionLocked || !validId || !validNames || !allAnswered}
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
          {!validId && userId.length > 0 && validityReason && (
            <p className="text-xs text-destructive">{validityReason}</p>
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
