/**
 * Campaign configuration — edit weekly.
 *
 * - `PREDICTIONS_ENABLED`: master switch to show/hide the prediction section.
 *   Set to `false` to disable customer submissions across the site.
 * - `CURRENT_WEEK` / `CURRENT_YEAR`: identifies which campaign week submissions
 *   are recorded against (used by the unique constraint to block duplicates).
 * - `WEEKLY_MATCHES`: the 5 featured matches for the current week. Replace each
 *   week. `kickoff` is an ISO timestamp — the UI uses it for the lock countdown.
 * - `WEEKLY_DEADLINE`: ISO timestamp shown in the hero countdown.
 */

export const PREDICTIONS_ENABLED = true;

export const CURRENT_WEEK = 1;
export const CURRENT_YEAR = 2026;

export type Outcome = "HOME" | "DRAW" | "AWAY";

export interface Match {
  id: string;
  home: string;
  homeFlag: string; // emoji
  away: string;
  awayFlag: string;
  kickoff: string; // ISO
  stage: string;
}

export const WEEKLY_MATCHES: Match[] = [
  {
    id: "m1",
    home: "Brazil",
    homeFlag: "🇧🇷",
    away: "Argentina",
    awayFlag: "🇦🇷",
    kickoff: "2026-06-15T20:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "m2",
    home: "France",
    homeFlag: "🇫🇷",
    away: "Germany",
    awayFlag: "🇩🇪",
    kickoff: "2026-06-16T18:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "m3",
    home: "England",
    homeFlag: "🇬🇧",
    away: "Spain",
    awayFlag: "🇪🇸",
    kickoff: "2026-06-17T20:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "m4",
    home: "Nigeria",
    homeFlag: "🇳🇬",
    away: "Portugal",
    awayFlag: "🇵🇹",
    kickoff: "2026-06-18T19:00:00Z",
    stage: "Group Stage",
  },
  {
    id: "m5",
    home: "Netherlands",
    homeFlag: "🇳🇱",
    away: "Italy",
    awayFlag: "🇮🇹",
    kickoff: "2026-06-19T20:00:00Z",
    stage: "Group Stage",
  },
];

// Sunday 23:59 of the current campaign week
export const WEEKLY_DEADLINE = "2026-06-21T23:59:00Z";
