"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import numeral from "numeral";
import { useTheme } from "next-themes";

interface Props {
  filter: "Year" | "Month" | "Week";
  data: { date: string; amount: number }[];
}
export function ExpensesChart({ data, filter }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // ✅ Dynamic date formatter based on selected filter
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    if (filter === "Year") {
      return date.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb, Mar
    }
    if (filter === "Month") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }); // Oct 1, Oct 8...
    }
    return date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, Wed
  };

  const colors = {
    stroke: isDark ? "#374151" : "#f3f4f6",
    fill: isDark ? "#848ff5" : "#5149e2",
    grid: isDark ? "#374151" : "#f3f4f6",
    axis: isDark ? "#374151" : "#E4E7EC",
    tooltipBg: isDark ? "#1f2a37" : "#ffffff",
    tooltipBorder: isDark ? "#374151" : "#f3f4f6",
    tooltipText: isDark ? "#f3f4f6" : "#000000",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.fill} stopOpacity={0.25} />
            <stop offset="95%" stopColor={colors.fill} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={colors.stroke}
        />

        <XAxis
          dataKey="date"
          axisLine={{ stroke: colors.axis }}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={formatXAxis}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${numeral(value).format("0,0")}`}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: colors.tooltipBg,
            borderRadius: "8px",
            border: `1px solid ${colors.tooltipBorder}`,
          }}
          formatter={(value: number) => [
            `$${numeral(value).format("0,0.00")}`,
            "Amount",
          ]}
          labelFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />

        <Area
          type="monotone"
          dataKey="amount"
          stroke={colors.fill}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorAmount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
