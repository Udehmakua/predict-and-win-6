/**
 * FAQ Section.
 *
 * HOW TO EDIT:
 *  - Add / remove / reword items in the FAQS array below.
 *  - Each item: { q: "question?", a: "answer text." }
 *  - Use \n\n inside `a` to create paragraph breaks.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Who is eligible to participate in the Predict & Win campaign?",
    a: "The campaign is open to verified BetKing customers who are 18 years or older, physically located in Nigeria, and have received an exclusive invitation via email, SMS, phone call, or our internal communication channels.",
  },
  {
    q: "How do I qualify for a share of the weekly ₦10,000,000 prize pool?",
    a: "To stand a chance to win each week, you must complete two main steps:\n\nPredict: Log in and submit your predictions for the 5 selected World Cup matches on the campaign page at least one hour before the first match kicks off on Thursday.\n\nStake: Place a cumulative total of ₦100,000 or more in real money stakes on any sportsbook market (World Cup or other sports) during that specific campaign week.",
  },
  {
    q: "How is the ₦10,000,000 weekly prize pool split, and what happens if there is a tie?",
    a: "The ₦10,000,000 cash prize is shared equally among the Top 100 eligible players with the highest number of correct predictions.\n\nThe Tie-Breaker: If more than 100 players get the same number of correct picks, the leaderboard will automatically rank players based on their total staking volume for the week. The higher your total cumulative stake, the higher your position on the leaderboard.",
  },
  {
    q: "When does the leaderboard reset?",
    a: "The leaderboard, your match predictions, and your qualification staking track will reset automatically every Monday. Everyone's progress starts fresh at the beginning of each new campaign week.",
  },
  {
    q: "What is the Streak Reward, and how do I win it?",
    a: "If you successfully submit correct predictions for three (3) consecutive campaign weeks, you will unlock an extra ₦100,000 Streak Bonus. This bonus is credited as cash and only carries a simple 1x wagering requirement before it becomes eligible for withdrawal.",
  },
  {
    q: "What happens if I miss the prediction deadline?",
    a: "All predictions must be submitted directly through the dedicated landing page at least one hour before the first selected match starts on Thursday. Once that cutoff time passes, the portal locks for the week, and you will have to wait for the next round to open.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="mt-8 w-full">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="text-left font-display text-sm font-extrabold uppercase tracking-wide text-foreground hover:no-underline sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
