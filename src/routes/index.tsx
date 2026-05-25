import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  Trophy,
  Target,
  Wallet,
  Crown,
  Flame,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import betkingLogo from "@/assets/betking-logo.svg";
import heroImage from "@/assets/hero-worldcup.jpg";
import {
  PREDICTIONS_ENABLED,
  WEEKLY_DEADLINE,
  CURRENT_WEEK,
} from "@/lib/campaign-config";
import { Countdown } from "@/components/landing/Countdown";
import { PredictionSection } from "@/components/landing/PredictionSection";
import { LeaderboardSection } from "@/components/landing/LeaderboardSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Predict & Win ₦10M Weekly — BetKing World Cup Campaign" },
      {
        name: "description",
        content:
          "Predict 5 World Cup matches every week on BetKing and stand a chance to share from a ₦10,000,000 weekly prize pool. Stake ₦100,000 to qualify.",
      },
      { property: "og:title", content: "Predict & Win ₦10M Weekly — BetKing World Cup" },
      {
        property: "og:description",
        content:
          "Predict 5 World Cup matches weekly. Share from ₦10M every week. BetKing campaign.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--navy-deep)",
            color: "var(--foreground)",
            border: "1px solid var(--brand-yellow)",
          },
        }}
      />

      <SiteHeader />
      <Hero />
      <CampaignIntro />
      <HowItWorks />
      <TieBreaker />
      <PrizePool />
      {PREDICTIONS_ENABLED ? <PredictionSection /> : <PredictionsClosed />}
      <LeaderboardSection />
      <StreakRewards />
      <SiteFooter />
    </main>
  );
}

/* ---------- Header ---------- */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-navy-deep/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={betkingLogo} alt="BetKing" width={100} height={36} className="h-8 w-auto" />
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-yellow sm:inline">
            World Cup
          </span>
        </a>
        <nav className="hidden gap-6 text-sm font-semibold uppercase tracking-wider md:flex">
          <a href="#how" className="text-muted-foreground hover:text-yellow">How it works</a>
          <a href="#predict" className="text-muted-foreground hover:text-yellow">Predict</a>
          <a href="#leaderboard" className="text-muted-foreground hover:text-yellow">Leaderboard</a>
          <a href="#streak" className="text-muted-foreground hover:text-yellow">Rewards</a>
        </nav>
        <a
          href="#predict"
          className="rounded-lg bg-yellow px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105"
        >
          Predict
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-hero">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-deep/40 via-transparent to-navy" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan sm:text-xs">
            <Sparkles className="size-3" />
            World Cup Campaign • Week {CURRENT_WEEK}
          </span>

          <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl md:text-7xl">
            Predict &amp; Win<br />
            <span className="text-yellow">The World Cup</span>
          </h1>

          <p className="mt-4 font-display text-2xl font-extrabold uppercase text-cyan sm:text-3xl">
            ₦10M Weekly Up For Grabs
          </p>

          <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
            Predict 5 major World Cup matches every week and stand a chance to share
            from ₦10,000,000. The more you stake, the higher you climb.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#predict"
              className="group inline-flex items-center gap-2 rounded-xl bg-yellow-gradient px-6 py-4 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_8px_30px_-8px_var(--brand-yellow)] transition-transform hover:scale-105 sm:text-base"
            >
              Predict Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#leaderboard"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-cyan bg-cyan/5 px-6 py-4 font-display text-sm font-extrabold uppercase tracking-wider text-cyan transition-all hover:bg-cyan hover:text-accent-foreground sm:text-base"
            >
              View Leaderboard
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Countdown target={WEEKLY_DEADLINE} label="Predictions close in" />
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <StatCard k="₦10M" v="Weekly Pool" />
            <StatCard k="Top 100" v="Winners / Week" />
            <StatCard k="5" v="Matches / Week" />
            <StatCard k="3x" v="Streak Bonus" highlight />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border bg-card/60 px-4 py-3 backdrop-blur ${
        highlight ? "border-yellow glow-yellow" : "border-border"
      }`}
    >
      <div className={`font-display text-xl font-extrabold sm:text-2xl ${highlight ? "text-yellow" : "text-foreground"}`}>
        {k}
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {v}
      </div>
    </div>
  );
}

/* ---------- Campaign intro band ---------- */
function CampaignIntro() {
  return (
    <section className="relative overflow-hidden bg-yellow text-primary-foreground">
      <div className="absolute inset-0 animate-shine opacity-50" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
        <p className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-4xl">
          This World Cup, your football knowledge could win you millions weekly.
        </p>
        <p className="mt-3 text-sm font-semibold sm:text-base">
          Predict correctly, climb the leaderboard, and compete for your share of ₦10M every week.
        </p>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    { n: "01", icon: Target, t: "Predict 5 Matches", d: "Pick outcomes for the 5 featured World Cup matches each week." },
    { n: "02", icon: Wallet, t: "Stake ₦100,000+", d: "Place a minimum cumulative stake of ₦100,000 during the campaign week." },
    { n: "03", icon: TrendingUp, t: "Climb the Leaderboard", d: "Correct predictions qualify you for the weekly leaderboard rankings." },
    { n: "04", icon: Crown, t: "Share ₦10M", d: "Top 100 eligible winners share the ₦10,000,000 weekly prize pool." },
  ];
  return (
    <section id="how" className="scroll-mt-20 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-yellow/40 bg-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">
            How it works
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase sm:text-5xl">
            Four steps to <span className="text-yellow">millions</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-yellow/60 hover:glow-yellow"
            >
              <div className="absolute -right-2 -top-4 font-display text-7xl font-black text-yellow/10">
                {s.n}
              </div>
              <s.icon className="size-8 text-yellow" />
              <h3 className="mt-4 font-display text-lg font-extrabold uppercase">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tie-breaker highlight ---------- */
function TieBreaker() {
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-yellow bg-yellow/10 p-6 backdrop-blur sm:p-10">
          <div className="absolute -right-12 -top-12 size-60 rounded-full bg-yellow/20 blur-3xl" />
          <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-yellow text-primary-foreground sm:size-20">
              <Trophy className="size-8 sm:size-10" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
                <span className="text-yellow">Tie-breaker:</span> Higher stakes rank higher
              </h3>
              <p className="mt-2 text-sm text-foreground sm:text-base">
                More correct predictions increase your chances of winning. In the
                event of a tie, players with higher total stakes rank higher.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-yellow">
                The more you stake, the higher your winning chances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Prize Pool ---------- */
function PrizePool() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy via-navy-deep to-navy" />
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-block rounded-full border border-yellow/40 bg-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">
          Weekly Prize Pool
        </span>
        <div className="mt-6 font-display text-6xl font-black uppercase leading-none text-yellow sm:text-8xl md:text-9xl">
          ₦10,000,000
        </div>
        <p className="mt-4 font-display text-xl font-extrabold uppercase text-foreground sm:text-2xl">
          Shared between the Top 100 each week
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Cash prizes • Smartphones • TVs • Premium gadgets. Resets every week.
        </p>
        <div className="mt-8 inline-flex">
          <Countdown target={WEEKLY_DEADLINE} label="Week resets in" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Predictions closed fallback ---------- */
function PredictionsClosed() {
  return (
    <section id="predict" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/60 p-8 text-center">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Predictions are closed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back next week for a fresh set of World Cup matches.
        </p>
      </div>
    </section>
  );
}

/* ---------- Streak rewards ---------- */
function StreakRewards() {
  return (
    <section id="streak" className="relative scroll-mt-20 overflow-hidden px-4 py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-deep via-navy to-navy-deep" />
      <div className="mx-auto max-w-4xl rounded-3xl border border-yellow/40 bg-card/60 p-8 text-center backdrop-blur sm:p-12">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-yellow-gradient animate-pulse-glow sm:size-20">
          <Flame className="size-8 text-primary-foreground sm:size-10" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
          Correct Predictions<br />
          <span className="text-yellow">3 Weeks In A Row?</span>
        </h2>
        <p className="mt-4 text-base text-foreground sm:text-lg">
          Unlock an <span className="font-bold text-yellow">extra ₦100,000 cash reward</span>.
        </p>

        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-yellow/40 bg-navy-deep/60 px-4 py-5"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow/20 font-display text-lg font-extrabold text-yellow">
                {n}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Week {n}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Keep your streak alive by predicting correctly every week.
        </p>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy-deep/80 px-4 py-8 text-center">
      <img src={betkingLogo} alt="BetKing" width={100} height={36} className="mx-auto h-8 w-auto" />
      <p className="mt-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} BetKing • Predict &amp; Win World Cup Campaign
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        Bet responsibly • 18+
      </p>
    </footer>
  );
}
