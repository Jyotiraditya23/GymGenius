import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-amber-500/40 px-4 py-3 shadow-xl">
        <p className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-black">
          {payload[0].value.toLocaleString()}
          <span className="text-zinc-400 text-sm font-normal ml-1">kg·vol</span>
        </p>
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ data }) => {
  return (
    <div className="relative">
      {/* Decorative grid lines top-left */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/20 pointer-events-none" />

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="2 6"
            stroke="#3f3f46"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
            axisLine={{ stroke: "#3f3f46" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#f59e0b", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#volumeGrad)"
            dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
            activeDot={{ fill: "#fbbf24", r: 6, strokeWidth: 2, stroke: "#1c1917" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;