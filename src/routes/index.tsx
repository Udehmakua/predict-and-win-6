import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import betkingLogo from "@/assets/betking-logo.svg";
import heroImage from "@/assets/hero-worldcup.jpg";
import pay1 from "@/assets/pay-1.svg";
import pay2 from "@/assets/pay-2.svg";
import pay3 from "@/assets/pay-3.svg";
import pay4 from "@/assets/pay-4.svg";
import propertyBrand from "@/assets/property-brand.svg";
import { PREDICTIONS_ENABLED, WEEKLY_DEADLINE } from "@/lib/campaign-config";
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
          "Predict 5 World Cup matches every week on BetKing and share from a ₦10,000,000 weekly prize pool. Stake ₦100,000 to qualify.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" theme="dark" />
      <SiteHeader />
      <Hero />
      <Marquee />
      <LockInBanner />
      <HowItWorks />
      <BetNowCta />
      {PREDICTIONS_ENABLED ? <PredictionSection /> : <PredictionsClosed />}
      <TieBreaker />
      <BetNowCta />
      <StreakRewards />
      <LeaderboardSection />
      <SiteFooter />
    </main>
  );
}

/* ---------- Header ---------- */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-navy-deep/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center">
          <img src={betkingLogo} alt="BetKing" width={110} height={36} className="h-8 w-auto" />
        </a>
        <nav className="hidden gap-6 text-sm font-semibold uppercase tracking-wider md:flex">
          <a href="#how" className="text-muted-foreground hover:text-yellow">How it works</a>
          <a href="#predict" className="text-muted-foreground hover:text-yellow">Predict</a>
          <a href="#leaderboard" className="text-muted-foreground hover:text-yellow">Leaderboard</a>
          <a href="#streak" className="text-muted-foreground hover:text-yellow">Rewards</a>
        </nav>
        <a
          href="https://m.betking.com/en-ng"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-yellow px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105"
        >
          Bet Now
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-navy">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-navy/70" />
      <div className="absolute inset-0 -z-10 bg-navy/70" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] sm:text-7xl md:text-8xl">
          Predict &amp; Win
          <br />
          <span className="text-yellow">The World Cup</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
          Predict 5 major World Cup matches every week and stand a chance to
          share from <span className="font-bold text-foreground">₦10,000,000</span> every week.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#predict"
            className="rounded-md bg-yellow px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105"
          >
            Predict Now
          </a>
          <a
            href="#leaderboard"
            className="rounded-md border-2 border-yellow px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-foreground transition-colors hover:bg-yellow hover:text-primary-foreground"
          >
            View Leaderboard
          </a>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard k="₦10M" v="Weekly Pool" />
          <StatCard k="100" v="Top Winners" />
          <StatCard k="5" v="Matches / Wk" />
          <StatCard k="3x" v="Streak Bonus" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-yellow/30 bg-navy-deep/80 px-4 py-3">
      <div className="font-display text-2xl font-extrabold text-yellow">{k}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {v}
      </div>
    </div>
  );
}

/* ---------- Marquee strip ---------- */
function Marquee() {
  const items = [
    "3-Week Streak Unlocks VIP Rewards",
    "Predict · Stake · Win",
    "New Matches Every Week",
    "₦10,000,000 Weekly Prize Pool",
    "Top 100 Winners Share The Pot",
  ];
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-yellow/30 bg-navy-deep py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {list.map((t, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8 text-xs font-bold uppercase tracking-[0.25em] text-yellow">
            {t}
            <span className="text-yellow">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Lock-in banner (countdown) ---------- */
function LockInBanner() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-yellow/30 bg-card p-6 sm:p-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
              Prediction Deadline
            </p>
            <h3 className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
              Lock In Before Kickoff
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Predictions close when the first match begins. Don't miss this week's pool.
            </p>
          </div>
          <Countdown target={WEEKLY_DEADLINE} />
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    { t: "Predict", d: "Pick outcomes for 5 selected World Cup matches each week." },
    { t: "Stake ₦100K+", d: "Place a minimum cumulative sports stake of ₦100,000 within the week." },
    { t: "Qualify", d: "Correct predictions move you up the weekly leaderboard." },
    { t: "Win Big", d: "Top 100 share the ₦10,000,000 weekly prize pool." },
  ];
  return (
    <section id="how" className="scroll-mt-20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">How it works</p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
          Four Steps To ₦10M
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="rounded-xl border border-yellow/20 bg-card p-5">
              <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-yellow">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 font-display text-lg font-extrabold uppercase">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tie-breaker (yellow band) ---------- */
function TieBreaker() {
  const tiers = [
    { r: 1, stake: "₦210K", wins: "₦2M" },
    { r: 2, stake: "₦184K", wins: "₦1M" },
    { r: 3, stake: "₦142K", wins: "₦500K" },
    { r: 4, stake: "₦98K", wins: "₦250K" },
    { r: 5, stake: "₦76K", wins: "₦150K" },
    { r: 6, stake: "₦64K", wins: "₦100K" },
  ];
  return (
    <section className="bg-yellow px-4 py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Tie-Breaker Rule</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
            Stake Higher.
            <br />
            Rank Higher.
          </h2>
          <p className="mt-4 max-w-md text-sm font-medium">
            When multiple players tie on correct predictions, those with the
            higher total qualifying stake claim the top spots in the Top 100.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tiers.map((t) => (
            <div key={t.r} className="rounded-md bg-navy p-3 text-foreground">
              <div className="font-display text-lg font-extrabold">#{t.r}</div>
              <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Stake
              </div>
              <div className="text-sm font-extrabold text-yellow">{t.stake}</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Wins
              </div>
              <div className="text-sm font-extrabold text-yellow">{t.wins}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Predictions closed fallback ---------- */
function PredictionsClosed() {
  return (
    <section id="predict" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Predictions are closed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back next week for fresh World Cup matches.
        </p>
      </div>
    </section>
  );
}

/* ---------- Streak rewards ---------- */
function StreakRewards() {
  return (
    <section id="streak" className="scroll-mt-20 bg-navy px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
          Streak Bonus · Extra ₦100,000
        </p>
        <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
          Correct Predictions
          <br />
          <span className="text-yellow">3 Weeks In A Row?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
          Predict correctly 3 weeks in a row and pocket an extra ₦100,000 on
          top of your weekly winnings.
        </p>

        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
          {[
            { n: "W1", active: true },
            { n: "W2", active: true },
            { n: "W3", active: false },
          ].map((w, i, arr) => (
            <div key={w.n} className="flex items-center gap-3">
              <div
                className={`flex size-14 items-center justify-center rounded-full font-display text-base font-extrabold ${
                  w.active
                    ? "bg-yellow text-primary-foreground"
                    : "border-2 border-yellow text-yellow"
                }`}
              >
                {w.n}
              </div>
              {i < arr.length - 1 && <span className="h-px w-6 bg-yellow" />}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 inline-block rounded-full border border-yellow bg-yellow/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-yellow">
          + ₦100,000 Bonus Unlocked At W3
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "Weekly Cash Pool",
            "+₦100,000 at 3-Week Streak",
            "Top 100 Share The Pot Every Week",
          ].map((t) => (
            <div
              key={t}
              className="rounded-md border border-yellow/30 bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function SiteFooter() {
  const pays = [pay1, pay2, pay3, pay4];
  return (
    <footer className="border-t border-border bg-navy-deep px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <img src={betkingLogo} alt="BetKing" width={120} height={40} className="h-9 w-auto" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          {pays.map((src, i) => (
            <div
              key={i}
              className="flex size-10 items-center justify-center rounded-md bg-white p-1"
            >
              <img src={src} alt="" width={20} height={20} className="size-5" />
            </div>
          ))}
        </div>

        <img
          src={propertyBrand}
          alt="Brand"
          width={220}
          height={32}
          className="h-8 w-auto"
        />

        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          ©2026 SV Gaming Limited T/A BetKing RC 1419108. Sports/Games Betting
          license numbers: 00000006/00000008. All Rights Reserved by SV Gaming
          Limited T/A BetKing.
        </p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Bet responsibly • 18+
        </p>
      </div>
    </footer>
  );
}
