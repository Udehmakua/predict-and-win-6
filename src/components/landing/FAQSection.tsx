/**
 * FAQ Section.
 *
 * HOW TO EDIT:
 *  - Add / remove / reword items in the FAQS array below.
 *  - Each item: { q: "question?", a: "answer text." }
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I qualify for the weekly prize pool?",
    a: "Submit your 5 predictions for the week and place a minimum cumulative sports stake of ₦100,000 on BetKing within that same week.",
  },
  {
    q: "When do predictions lock?",
    a: "The whole prediction section locks the moment the first match of the week kicks off. After that you can no longer change or submit picks.",
  },
  {
    q: "Can I edit my predictions after submitting?",
    a: "No. Once you submit, your picks are locked in for that week. Make sure you're happy before hitting Submit.",
  },
  {
    q: "Where do I find my BetKing User ID?",
    a: "Log into your BetKing account on web or mobile — your User ID is shown in your profile / account settings. It's the numeric ID, not your username.",
  },
  {
    q: "How is the ₦10,000,000 prize pool shared?",
    a: "The top 100 players on the weekly leaderboard share the pool. Players are ranked by number of correct predictions; ties are broken by total qualifying stake (see the Tie-Breaker section above).",
  },
  {
    q: "What is the streak bonus?",
    a: "Predict correctly 3 weeks in a row and you unlock an extra ₦100,000 bonus on top of any weekly winnings.",
  },
  {
    q: "Do I need to predict every week?",
    a: "No, but you must predict and qualify each week you want to be eligible for that week's pool and to keep a streak alive.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">
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
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
