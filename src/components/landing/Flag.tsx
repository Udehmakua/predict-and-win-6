type Stripe = { c: string; w?: number };
type FlagDef = { dir: "h" | "v"; stripes: Stripe[]; label?: string };

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
};

export function Flag({ country, className = "" }: { country: string; className?: string }) {
  const def = FLAGS[country];
  if (!def) {
    return (
      <div
        className={`rounded-sm border border-white/20 bg-muted ${className}`}
        aria-label={country}
      />
    );
  }
  const total = def.stripes.reduce((s, x) => s + (x.w ?? 1), 0);
  const isH = def.dir === "h";
  return (
    <div
      role="img"
      aria-label={`${country} flag`}
      className={`overflow-hidden rounded-sm border border-white/20 ${className}`}
      style={{
        display: "flex",
        flexDirection: isH ? "column" : "row",
      }}
    >
      {def.stripes.map((s, i) => (
        <div
          key={i}
          style={{
            flex: `${s.w ?? 1} ${s.w ?? 1} 0`,
            background: s.c,
          }}
        />
      ))}
    </div>
  );
}
