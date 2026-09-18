"use client";

import { useState } from "react";
import gscData from "@/data/stickout-search-console.json";
import { TrendingUp, MousePointerClick, Eye, Award, Search, Activity } from "lucide-react";

export function SearchConsoleTelemetry() {
  const { summary, topQueries, timeline, dateRange, lastUpdated } = gscData;
  const [hoveredPoint, setHoveredPoint] = useState<typeof timeline[0] | null>(null);

  // Calculate SVG chart coordinates for impressions
  const maxImpressions = Math.max(...timeline.map((d) => d.impressions), 10);
  const chartHeight = 80;
  const chartWidth = 500;

  const points = timeline.map((pt, idx) => {
    const x = (idx / (timeline.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (pt.impressions / maxImpressions) * (chartHeight - 12);
    return { x, y, pt };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    : "";

  const formattedUpdate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <section className="mb-10">
      {/* Dossier Section Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-periwinkle/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-iris-bright" />
            </span>
            <p className="t-micro text-iris-bright font-mono tracking-widest uppercase">
              LIVE TELEMETRY // GOOGLE SEARCH CONSOLE
            </p>
          </div>
          <h2 className="t-h3 mt-1 text-paper">ORGANIC SEARCH TRACTION</h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="t-micro rounded-sm border border-periwinkle/20 bg-world-2 px-2.5 py-1 text-periwinkle/70 font-mono">
            {dateRange.days || 90} DAYS AUDIT
          </span>
          <span className="t-micro text-periwinkle/40 font-mono">
            SYNCED {formattedUpdate.toUpperCase()}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {/* Metric 1: Clicks */}
        <div className="border border-periwinkle/15 bg-world-2 p-4 transition-colors hover:border-iris/40">
          <div className="flex items-center justify-between text-periwinkle/50 mb-2">
            <span className="t-micro font-mono">ORGANIC CLICKS</span>
            <MousePointerClick className="h-4 w-4 text-iris-bright" />
          </div>
          <div className="text-2xl font-bold font-mono text-paper">
            {summary.clicks}
          </div>
          <p className="mt-1 text-[10px] text-iris-bright font-mono">
            High-intent EDA engineers
          </p>
        </div>

        {/* Metric 2: Impressions */}
        <div className="border border-periwinkle/15 bg-world-2 p-4 transition-colors hover:border-iris/40">
          <div className="flex items-center justify-between text-periwinkle/50 mb-2">
            <span className="t-micro font-mono">IMPRESSIONS</span>
            <Eye className="h-4 w-4 text-periwinkle/70" />
          </div>
          <div className="text-2xl font-bold font-mono text-paper">
            {summary.impressions}
          </div>
          <p className="mt-1 text-[10px] text-periwinkle/60 font-mono">
            Google search appearances
          </p>
        </div>

        {/* Metric 3: CTR */}
        <div className="border border-periwinkle/15 bg-world-2 p-4 transition-colors hover:border-iris/40">
          <div className="flex items-center justify-between text-periwinkle/50 mb-2">
            <span className="t-micro font-mono">AVG CTR</span>
            <TrendingUp className="h-4 w-4 text-signal" />
          </div>
          <div className="text-2xl font-bold font-mono text-signal">
            {(summary.ctr * 100).toFixed(1)}%
          </div>
          <p className="mt-1 text-[10px] text-signal/80 font-mono">
            ★ Top 5% SaaS benchmark
          </p>
        </div>

        {/* Metric 4: Position */}
        <div className="border border-periwinkle/15 bg-world-2 p-4 transition-colors hover:border-iris/40">
          <div className="flex items-center justify-between text-periwinkle/50 mb-2">
            <span className="t-micro font-mono">AVG RANK</span>
            <Award className="h-4 w-4 text-iris-bright" />
          </div>
          <div className="text-2xl font-bold font-mono text-paper">
            #{summary.position}
          </div>
          <p className="mt-1 text-[10px] text-iris-bright font-mono">
            Page 1 Google rank
          </p>
        </div>
      </div>

      {/* Timeline Sparkline Section */}
      <div className="mb-6 border border-periwinkle/15 bg-world-2 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-iris-bright" />
            <span className="t-micro font-mono text-periwinkle/80">
              SEARCH IMPRESSIONS TRAJECTORY ({dateRange.startDate} → {dateRange.endDate})
            </span>
          </div>
          {hoveredPoint && (
            <span className="t-micro font-mono text-iris-bright">
              {hoveredPoint.date}: {hoveredPoint.impressions} impr / {hoveredPoint.clicks} clicks
            </span>
          )}
        </div>

        {/* SVG Sparkline Area */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-24 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8d90c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#e8d90c" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Stroke line */}
            <path
              d={pathD}
              fill="none"
              stroke="#e8d90c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive hover points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.date === p.pt.date ? 4 : 2}
                className="cursor-pointer transition-all fill-iris-bright"
                onMouseEnter={() => setHoveredPoint(p.pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        <div className="mt-2 flex justify-between text-[9px] font-mono text-periwinkle/40">
          <span>{dateRange.startDate}</span>
          <span>DAILY TRAFFIC SAMPLES</span>
          <span>{dateRange.endDate}</span>
        </div>
      </div>

      {/* Top Search Queries Breakdown */}
      <div className="border border-periwinkle/15 bg-world-2 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-iris-bright" />
            <h3 className="t-label text-paper font-mono uppercase">
              TOP ORGANIC DISCOVERY QUERIES
            </h3>
          </div>
          <span className="t-micro text-periwinkle/50 font-mono">
            {topQueries.length} VERIFIED INTENTS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-periwinkle/10 text-[10px] text-periwinkle/50 uppercase">
                <th className="pb-2 font-normal">Search Keyword</th>
                <th className="pb-2 text-right font-normal">Clicks</th>
                <th className="pb-2 text-right font-normal">Impressions</th>
                <th className="pb-2 text-right font-normal">CTR</th>
                <th className="pb-2 text-right font-normal">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-periwinkle/5">
              {topQueries.map((q, idx) => (
                <tr
                  key={idx}
                  className="group transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-2.5 font-medium text-periwinkle group-hover:text-iris-bright">
                    <span className="mr-2 text-periwinkle/30">{idx + 1}.</span>
                    &ldquo;{q.query}&rdquo;
                  </td>
                  <td className="py-2.5 text-right font-bold text-paper">
                    {q.clicks > 0 ? (
                      <span className="text-iris-bright">{q.clicks}</span>
                    ) : (
                      <span className="text-periwinkle/40">0</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right text-periwinkle/70">
                    {q.impressions}
                  </td>
                  <td className="py-2.5 text-right text-periwinkle/70">
                    {q.ctr > 0 ? (
                      <span className="text-signal font-semibold">
                        {(q.ctr * 100).toFixed(1)}%
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        q.position <= 10
                          ? "bg-iris/15 text-iris-bright border border-iris/30"
                          : "bg-world text-periwinkle/50 border border-periwinkle/10"
                      }`}
                    >
                      #{q.position}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 border-t border-periwinkle/10 pt-3 text-[10px] font-mono text-periwinkle/40">
          ◆ DATA SOURCE // GOOGLE SEARCH CONSOLE API (SEARCHANALYTICS.QUERY) // AUTOMATICALLY INGESTED AT BUILD
        </p>
      </div>
    </section>
  );
}
