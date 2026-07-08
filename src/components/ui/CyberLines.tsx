/**
 * Minimal flat line-work for solid-background containers — thin rules,
 * registration marks and one accent tick (spec §0: printed-poster feel,
 * depth from composition, never glow/scanlines).
 * tone="light" for dark sections (bone-white lines), "ink" for paper cards.
 */
export function CyberLines({
  flip = false,
  tone = "light",
}: {
  flip?: boolean;
  tone?: "light" | "ink";
}) {
  const base = tone === "ink" ? "var(--ink)" : "var(--periwinkle)";
  const peri = (pct: number) =>
    `color-mix(in srgb, ${base} ${pct}%, transparent)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* full-height rule in the left gutter */}
      <div
        className="absolute inset-y-0 left-[5.5%] w-px"
        style={{ background: peri(10) }}
      />
      {/* dashed horizon rule */}
      <div
        className="absolute left-0 right-0 top-[17%] h-px"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${peri(14)} 0 7px, transparent 7px 16px)`,
        }}
      />
      {/* short drop-line hanging from the horizon rule */}
      <div
        className="absolute right-[9%] top-[17%] h-[19%] w-px"
        style={{ background: peri(10) }}
      />
      {/* baseline rule, bottom-left quadrant */}
      <div
        className="absolute bottom-[11%] left-[5.5%] h-px w-[34%]"
        style={{ background: peri(8) }}
      />
      {/* registration marks at rule intersections */}
      <span
        className="absolute left-[5.5%] top-[17%] font-mono text-[10px] leading-none"
        style={{ color: peri(30), transform: "translate(-50%, -50%)" }}
      >
        +
      </span>
      <span
        className="absolute bottom-[11%] left-[39.5%] font-mono text-[10px] leading-none"
        style={{ color: peri(30), transform: "translate(-50%, 50%)" }}
      >
        +
      </span>
      {/* single accent end-cap tick */}
      <span
        className="absolute right-[9%] top-[36%] h-[5px] w-[5px] border"
        style={{
          borderColor: "color-mix(in srgb, var(--iris-bright) 45%, transparent)",
          transform: "translateX(50%)",
        }}
      />
    </div>
  );
}
