/**
 * Terms & Conditions Section.
 *
 * HOW TO EDIT:
 *  - Edit the TERMS array below. Each entry is one numbered clause.
 *    - `title` (optional) renders as a bold heading.
 *    - `body` is the main paragraph. Use `\n\n` to start a new paragraph.
 *    - `bullets` (optional) renders an indented bulleted list under the body.
 *  - Edit the FOOTNOTES array for the unnumbered paragraphs at the bottom
 *    (Fair Play, Responsible Gaming, etc.).
 */

type Clause = {
  title?: string;
  body: string;
  bullets?: string[];
};

const TERMS: Clause[] = [
  {
    body:
      "This offer is promoted by SV Gaming Limited, trading as BetKing, and shall run for the Promo Period.",
  },
  {
    body:
      "BetKing reserves the right to restrict the rewards or disqualify customers who have registered duplicate accounts (a breach of our general terms and conditions).",
  },
  {
    title: "Eligibility",
    body:
      "The Promotion is open to all verified customers who are 18 years of age or older and physically located in Nigeria at the time of qualifying and at the time of reward distribution.",
  },
  {
    body:
      "Promotion is open to one customer per household. Any accounts found to belong to a related set of individuals will ALL be disabled and will not receive any further rewards, and their issued rewards/cash prizes may be reversed.",
  },
  {
    body:
      "Users found to be colluding or betting together, trying to cover a series of results in similar games, or using syndicate strategies to manipulate the leaderboard will not be awarded any further prizes and may have their issued rewards reversed.",
  },
  {
    title: "Promo Period",
    body: "From 8th June, 2026, 00:00 (WAT) to 19th July, 2026, 23:59 (WAT).",
  },
  {
    title: "Promo Mechanics",
    body: "To qualify, customers must meet the following requirements weekly:",
    bullets: [
      "Log in to their BetKing account on mobile, desktop, or our mobile apps.",
      "Visit the dedicated campaign landing page weekly to predict the outcomes of 5 selected World Cup matches.",
      "Predictions must be submitted directly via the landing page an hour before the First Match Start time on Thursdays.",
      "Place a minimum cumulative real money stake of ₦100,000 on any sports book market (including World Cup and other sports markets) during that specific campaign week.",
    ],
  },
  {
    title: "Prize Pool & Leaderboard Details",
    body: "",
    bullets: [
      "Weekly Prize Pool: A total pool of ₦10,000,000 cash will be shared equally among the Top 100 eligible winners each week.",
      "Winner Selection Logic: Eligible customers are ranked on the leaderboard based on the highest number of correct predictions for that week.",
      "Tie-Breaker Logic: If more than 100 customers have the same number of correct predictions, customers with the highest cumulative stake amount on the sportsbook during that campaign week will be ranked higher.",
      "Weekly Reset Structure: Predictions, leaderboards, and qualification staking tracks will reset automatically every Monday. Participation starts fresh for all customers each week.",
      "Streak Reward Mechanic: Customers who submit correct predictions for three (3) consecutive campaign weeks will be eligible to receive an additional ₦100,000 Streak Bonus. Streak Bonus is credited as cash and must be wagered once before any withdrawal.",
    ],
  },
];

const FOOTNOTES: { title: string; body: string }[] = [
  {
    title: "Entry Requirement",
    body:
      "This promotion is available for the Promo Period and is open to selected customers invited via email, SMS, calls, or other communication channels.",
  },
  {
    title: "Fair Play",
    body:
      "All participants are expected to adhere to the principles of fair play and integrity. Any form of cheating, scripting, automated entries, or collusion will result in immediate disqualification.",
  },
  {
    title: "Accuracy of Information",
    body:
      "Each eligible customer represents and warrants that any information they provide to BetKing during the registration process and the offer period is a true and honest representation of facts. BetKing may request additional identification or verification documents where necessary.",
  },
  {
    title: "Changes to the Promotion",
    body:
      "BetKing reserves the right to modify, suspend, or terminate the promo or alter the terms and conditions at any time, with or without notice, for any reason deemed necessary. It is your responsibility to review these terms and conditions regularly to take notice of any changes or updates we make, and you agree to do so.",
  },
  {
    title: "Disputes",
    body:
      "BetKing's decision on any dispute about this offer is final. No further correspondence will be entered into concerning the offer period after such decisions. Entries that do not comply, in full, with these entry terms and conditions will be disqualified.",
  },
  {
    title: "Access",
    body:
      "The Predict & Win landing page and rewards can be accessed and redeemed only on m.betking.com, desktop, and our official mobile apps (iOS and Android).",
  },
  {
    title: "General",
    body: "General terms and conditions apply.",
  },
  {
    title: "Responsible Gaming",
    body:
      "Participants must gamble responsibly. If you or someone you know needs help with gambling, you can contact Gamble Alert via WhatsApp +234 916 295 7989 or via email — info@gamblealert.org for free counselling. Support and tools are available at Responsible Gaming on BetKing.",
  },
];


export function TermsSection() {
  return (
    <section
      id="terms"
      className="scroll-mt-20 border-t border-border bg-navy-deep px-4 py-16 sm:py-20"
    >
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
              <div className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.title && (
                  <p className="mb-1 font-bold text-foreground">{t.title}:</p>
                )}
                {t.body && <p>{t.body}</p>}
                {t.bullets && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {t.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 space-y-4 border-t border-border pt-8">
          {FOOTNOTES.map((f, i) => (
            <div key={i} className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">{f.title}: </span>
              {f.body}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
