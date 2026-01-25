"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import numeral from "numeral";
import { useTheme } from "next-themes";

interface Props {
  filter: "Year" | "Month" | "Week";
  data: { date: string; amount: number }[];
}
export function CreditChart({ data, filter }: Props) {
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
      <BarChart data={data} barSize={28}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={colors.grid}
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
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          itemStyle={{ color: colors.fill }}
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
        <Bar
          dataKey="amount"
          radius={[4, 4, 0, 0]}
          width={28}
          fill="#4f39f64d"
          activeBar={<Rectangle fill={colors.fill} />}
          // opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
