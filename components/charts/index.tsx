"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RAreaChart,
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RLineChart,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** Chart palette is derived from semantic tokens only. */
export const chartColors = {
  accent: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  muted: "var(--text-muted)",
};

export const seriesPalette = [
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
  "var(--text-muted)",
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-2.5 py-1.5">
      {label !== undefined && (
        <p className="mb-1 text-[11px] font-medium text-text-primary">{label}</p>
      )}
      {payload.map((p, i) => (
        <p
          key={i}
          className="flex items-center gap-1.5 text-[11px] text-text-secondary"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-text-primary">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

const axisProps = {
  stroke: "transparent",
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 10, fill: "var(--text-muted)" },
} as const;

export function AreaChart({
  data,
  xKey,
  series,
  height = 200,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: { key: string; color?: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }} data-testid="chart-area">
      <ResponsiveContainer width="100%" height="100%">
        <RAreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={s.color ?? seriesPalette[i % seriesPalette.length]}
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor={s.color ?? seriesPalette[i % seriesPalette.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color ?? seriesPalette[i % seriesPalette.length]}
              strokeWidth={1.5}
              fill={`url(#fill-${s.key})`}
              dot={false}
              activeDot={{ r: 2.5 }}
            />
          ))}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  xKey,
  yKey,
  height = 180,
  color = "var(--accent)",
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
}) {
  return (
    <div style={{ height }} data-testid="chart-bar">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
          <Bar dataKey={yKey} fill={color} radius={[3, 3, 0, 0]} maxBarSize={26} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({
  data,
  xKey,
  series,
  height = 180,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: { key: string; color?: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }} data-testid="chart-line">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} width={40} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color ?? seriesPalette[i % seriesPalette.length]}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 2.5 }}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  height = 168,
  colors = seriesPalette,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
  colors?: string[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex items-center gap-4" data-testid="chart-donut">
      <div style={{ height, width: height }} className="relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="66%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </RPieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] font-semibold text-text-primary">{total}</span>
          <span className="text-[10px] text-text-muted">total</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="truncate text-text-secondary">{d.name}</span>
            <span className="ml-auto font-medium text-text-primary">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** GitHub-style contribution grid built from tokens (no shadows/glow). */
export function ContributionGrid({
  data,
  weeks = 52,
}: {
  data: number[];
  weeks?: number;
}) {
  const levels = [
    "bg-surface-active",
    "bg-accent/25",
    "bg-accent/45",
    "bg-accent/70",
    "bg-accent",
  ];
  const cells = data.slice(0, weeks * 7);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div data-testid="contribution-grid" className="w-full">
      <div className="overflow-x-auto scrollbar-none">
        <div className="min-w-[680px]">
          <div className="mb-1 flex text-[10px] text-text-muted">
            {months.map((m) => (
              <span key={m} className="flex-1">
                {m}
              </span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {cells.map((lvl, i) => (
              <span
                key={i}
                title={`${lvl * 3} contributions`}
                className={`h-[9px] w-[9px] rounded-[2px] ${levels[lvl] ?? levels[0]}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-text-muted">
        <span>Less</span>
        {levels.map((l, i) => (
          <span key={i} className={`h-[9px] w-[9px] rounded-[2px] ${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
