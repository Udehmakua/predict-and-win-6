/**
 * Campaign configuration — edit weekly.
 *
 * HOW TO UPDATE EACH WEEK:
 * 1. Change `WEEKLY_MATCHES` below — replace the 5 fixtures.
 *    - `kickoff` MUST be an ISO timestamp in UTC (Z suffix).
 *    - Nigeria (WAT) is UTC+1, so subtract 1 hour from local time.
 *      e.g. Fri 12 Jun 2026 03:00 WAT  →  "2026-06-12T02:00:00Z"
 * 2. Bump `CURRENT_WEEK` (and `CURRENT_YEAR` in January) so the
 *    database treats this as a new week and lets users submit again.
 * 3. `WEEKLY_DEADLINE` is the countdown shown in the hero banner AND
 *    the moment the whole prediction section locks. Set it to the
 *    kickoff of MATCH 1 (the earliest match).
 * 4. For any new country, add a flag entry in `src/components/landing/Flag.tsx`.
 *
 * `PREDICTIONS_ENABLED`: master switch — set to `false` to hide the
 * prediction section entirely (e.g. between campaigns).
 */

export const PREDICTIONS_ENABLED = true;

export const CURRENT_WEEK = 1;
export const CURRENT_YEAR = 2026;

export type Outcome = "HOME" | "DRAW" | "AWAY";

export interface Match {
  id: string;
  home: string;
  away: string;
  kickoff: string; // ISO UTC
  stage: string;
}

export const WEEKLY_MATCHES: Match[] = [
  {
    id: "m1",
    home: "South Korea",
    away: "Czech Republic",
    kickoff: "2026-06-12T02:00:00Z", // Fri 12 Jun 2026, 03:00 WAT
    stage: "Group Stage",
  },
  {
    id: "m2",
    home: "USA",
    away: "Paraguay",
    kickoff: "2026-06-13T01:00:00Z", // Sat 13 Jun 2026, 02:00 WAT
    stage: "Group Stage",
  },
  {
    id: "m3",
    home: "Netherlands",
    away: "Japan",
    kickoff: "2026-06-14T20:00:00Z", // Sun 14 Jun 2026, 21:00 WAT
    stage: "Group Stage",
  },
  {
    id: "m4",
    home: "Ivory Coast",
    away: "Ecuador",
    kickoff: "2026-06-14T23:00:00Z", // Mon 15 Jun 2026, 00:00 WAT
    stage: "Group Stage",
  },
  {
    id: "m5",
    home: "Sweden",
    away: "Tunisia",
    kickoff: "2026-06-15T02:00:00Z", // Mon 15 Jun 2026, 03:00 WAT
    stage: "Group Stage",
  },
];

// Countdown deadline = kickoff of the FIRST match.
// When this passes, the whole prediction section locks.
export const WEEKLY_DEADLINE = WEEKLY_MATCHES[0].kickoff;
