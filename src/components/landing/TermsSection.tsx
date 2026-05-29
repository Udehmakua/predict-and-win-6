/**
 * Terms & Conditions Section.
 *
 * HOW TO EDIT:
 *  - Add / remove / reword clauses in the TERMS array below.
 *  - Each item is a single bullet point. Keep it short and plain.
 */

const TERMS: string[] = [
  "Campaign open to registered BetKing customers aged 18 and over, resident in Nigeria.",
  "To qualify for a given week, the player must submit all 5 predictions before the first match kicks off, and place a minimum cumulative sports stake of ₦100,000 in that same week.",
  "Each player may submit only one set of predictions per week, identified by their BetKing User ID. Duplicate or fraudulent submissions will be disqualified.",
  "Predictions lock automatically at the kickoff of the first match. Late or modified entries will not be accepted.",
  "The weekly ₦10,000,000 prize pool is shared among the top 100 players on that week's leaderboard, ranked by correct predictions.",
  "Ties are broken by total qualifying stake for the week. If still tied, BetKing's decision is final.",
  "The streak bonus of ₦100,000 is awarded once a player records correct predictions for 3 consecutive qualifying weeks.",
  "Prizes are credited to the player's BetKing wallet within 7 working days of the weekly result confirmation.",
  "BetKing reserves the right to amend, suspend, or terminate the campaign at any time without prior notice.",
  "By participating you agree to BetKing's general Terms of Service and Responsible Gaming policy. Bet responsibly. 18+.",
];

export function TermsSection() {
  return (
    <section id="terms" className="scroll-mt-20 border-t border-border bg-navy-deep px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
          Legal
        </p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
          Terms &amp; Conditions
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Please read carefully. By submitting predictions you agree to these terms.
        </p>

        <ol className="mt-8 space-y-4">
          {TERMS.map((t, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <span className="font-display text-sm font-extrabold text-yellow">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
