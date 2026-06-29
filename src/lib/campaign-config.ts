/**
 * Campaign configuration — edit weekly.
 *
 * HOW TO UPDATE EACH WEEK:
 * 1. Change `WEEKLY_QUESTIONS` below — replace the 5 questions.
 *    - `kickoff` MUST be an ISO timestamp in UTC (Z suffix).
 *      Nigeria (WAT) is UTC+1, so subtract 1 hour from local time.
 *    - `type` is either "YES_NO" (renders Yes / No buttons) or
 *      "SHORT_TEXT" (renders a single-line text input).
 * 2. Bump `CURRENT_WEEK` (and `CURRENT_YEAR` in January) so the
 *    database treats this as a new week and lets users submit again.
 * 3. `WEEKLY_DEADLINE` is the countdown shown in the hero banner AND
 *    the moment the whole prediction section locks. Set it to the
 *    earliest kickoff.
 *
 * `PREDICTIONS_ENABLED`: master switch — set to `false` to hide the
 * prediction section entirely (e.g. between campaigns).
 */

export const PREDICTIONS_ENABLED = true;

export const CURRENT_WEEK = 1;
export const CURRENT_YEAR = 2026;

// Legacy outcome type — kept for any old imports. New flow uses string answers.
export type Outcome = "HOME" | "DRAW" | "AWAY";

export type QuestionType = "YES_NO" | "SHORT_TEXT";

export interface Question {
  id: string;
  fixture: string; // e.g. "Spain vs Austria"
  text: string;    // the question itself
  type: QuestionType;
  kickoff: string; // ISO UTC — used to group + lock the section
  stage?: string;
}

export const WEEKLY_QUESTIONS: Question[] = [
  {
    id: "q1",
    fixture: "Spain vs Austria",
    text: "Will there be a goal scored in the first 30 minutes (00:00–29:59)?",
    type: "YES_NO",
    kickoff: "2026-06-12T02:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "q2",
    fixture: "Switzerland vs Algeria",
    text: "Will both teams score a goal (90 mins only)?",
    type: "YES_NO",
    kickoff: "2026-06-12T19:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "q3",
    fixture: "Spain vs Austria",
    text: "Will Spain win to nil (90 mins only)?",
    type: "YES_NO",
    kickoff: "2026-06-12T02:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "q4",
    fixture: "Portugal vs Croatia",
    text: "Will both teams score a goal (90 mins only)?",
    type: "YES_NO",
    kickoff: "2026-06-13T19:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "q5",
    fixture: "Portugal vs Croatia",
    text: "Who will get a red card first?",
    type: "SHORT_TEXT",
    kickoff: "2026-06-13T19:00:00Z",
    stage: "Group Stage",
  },
];

// Backwards-compat alias — some older code may still import WEEKLY_MATCHES.
export const WEEKLY_MATCHES = WEEKLY_QUESTIONS;

// Countdown deadline = earliest kickoff. When this passes, the whole
// prediction section locks.
export const WEEKLY_DEADLINE = WEEKLY_QUESTIONS.reduce(
  (earliest, q) => (q.kickoff < earliest ? q.kickoff : earliest),
  WEEKLY_QUESTIONS[0].kickoff,
);
