/**
 * Country flag renderer.
 *
 * HOW TO ADD A NEW COUNTRY:
 *  - Most flags are simple stripes — add an entry to FLAGS with:
 *      dir: "h" (horizontal stripes) or "v" (vertical stripes)
 *      stripes: array of { c: "#hexcolor", w?: relativeWidth }
 *  - For complex flags (circle, cross, canton, etc.) add an entry
 *    to CUSTOM_FLAGS returning inline SVG.
 *  - The `country` string used here must match exactly the `home` /
 *    `away` value in `src/lib/campaign-config.ts`.
 */

import type React from "react";

type Stripe = { c: string; w?: number };
type FlagDef = { dir: "h" | "v"; stripes: Stripe[] };

const FLAGS: Record<string, FlagDef> = {
  Brazil: { dir: "h", stripes: [{ c: "#009C3B" }, { c: "#FFDF00" }, { c: "#002776" }] },
  Argentina: { dir: "h", stripes: [{ c: "#74ACDF" }, { c: "#FFFFFF" }, { c: "#74ACDF" }] },
  France: { dir: "v", stripes: [{ c: "#0055A4" }, { c: "#FFFFFF" }, { c: "#EF4135" }] },
  Germany: { dir: "h", stripes: [{ c: "#000000" }, { c: "#DD0000" }, { c: "#FFCE00" }] },
  England: { dir: "h", stripes: [{ c: "#FFFFFF" }, { c: "#CE1124" }, { c: "#FFFFFF" }] },
  Spain: { dir: "h", stripes: [{ c: "#AA151B", w: 1 }, { c: "#F1BF00", w: 2 }, { c: "#AA151B", w: 1 }] },
  Nigeria: { dir: "v", stripes: [{ c: "#008751" }, { c: "#FFFFFF" }, { c: "#008751" }] },
  Portugal: { dir: "v", stripes: [{ c: "#006600", w: 2 }, { c: "#FF0000", w: 3 }] },
  Netherlands: { dir: "h", stripes: [{ c: "#AE1C28" }, { c: "#FFFFFF" }, { c: "#21468B" }] },
  Italy: { dir: "v", stripes: [{ c: "#009246" }, { c: "#FFFFFF" }, { c: "#CE2B37" }] },
  Morocco: { dir: "h", stripes: [{ c: "#C1272D" }] },
  "Czech Republic": { dir: "h", stripes: [{ c: "#FFFFFF" }, { c: "#D7141A" }] },
  Paraguay: { dir: "h", stripes: [{ c: "#D52B1E" }, { c: "#FFFFFF" }, { c: "#0038A8" }] },
  "Ivory Coast": { dir: "v", stripes: [{ c: "#FF8200" }, { c: "#FFFFFF" }, { c: "#009E60" }] },
  Ecuador: { dir: "h", stripes: [{ c: "#FFDD00", w: 2 }, { c: "#034EA2", w: 1 }, { c: "#ED1C24", w: 1 }] },
  Tunisia: { dir: "h", stripes: [{ c: "#E70013" }] },
};

const CUSTOM_FLAGS: Record<string, () => React.ReactElement> = {
  Japan: () => (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none" className="h-full w-full">
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  ),
  "South Korea": () => (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none" className="h-full w-full">
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="5" fill="#003478" />
      <path d="M15 5 a5 5 0 0 1 0 10 a2.5 2.5 0 0 1 0 -5 a2.5 2.5 0 0 0 0 -5z" fill="#C60C30" />
    </svg>
  ),
  USA: () => (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none" className="h-full w-full">
      {Array.from({ length: 13 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={(i * 20) / 13}
          width="30"
          height={20 / 13}
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3C3B6E" />
    </svg>
  ),
  Sweden: () => (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none" className="h-full w-full">
      <rect width="30" height="20" fill="#006AA7" />
      <rect x="9" width="3" height="20" fill="#FECC00" />
      <rect y="8.5" width="30" height="3" fill="#FECC00" />
    </svg>
  ),
};

export function Flag({ country, className = "" }: { country: string; className?: string }) {
  const custom = CUSTOM_FLAGS[country];
  if (custom) {
    return (
      <div
        role="img"
        aria-label={`${country} flag`}
        className={`overflow-hidden rounded-sm border border-white/20 ${className}`}
      >
        {custom()}
      </div>
    );
  }

  const def = FLAGS[country];
  if (!def) {
    return (
      <div
        className={`rounded-sm border border-white/20 bg-muted ${className}`}
        aria-label={country}
      />
    );
  }
  const isH = def.dir === "h";
  return (
    <div
      role="img"
      aria-label={`${country} flag`}
      className={`overflow-hidden rounded-sm border border-white/20 ${className}`}
      style={{ display: "flex", flexDirection: isH ? "column" : "row" }}
    >
      {def.stripes.map((s, i) => (
        <div
          key={i}
          style={{ flex: `${s.w ?? 1} ${s.w ?? 1} 0`, background: s.c }}
        />
      ))}
    </div>
  );
}
