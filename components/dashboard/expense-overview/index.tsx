"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common-elements/card";
import { useMemo, useState } from "react";
import { Button } from "@/components/common-elements/button";
import { tailwindCn } from "@/helpers";
import { ExpensesChart } from "./expense-chart";
import type { IExpenseChartData } from "@/services/dashboard/types";

interface Props {
  data: IExpenseChartData;
}

const filterOptions = [
  { key: "Year", label: "Year" },
  { key: "Month", label: "Month" },
  { key: "Week", label: "Week" },
];

// Helper to convert month name to month number (0-11 for JS Date)
const monthNameToNumber = (month: string): number => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(month);
};

// Helper to get current week's Sunday date
const getWeekStartDate = (dayName: string): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const targetDay = daysOfWeek.indexOf(dayName);
  
  const diff = targetDay - currentDay;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return date;
};

export function ExpenseOverview({ data }: Props) {
  const [filter, setFilter] = useState("Year");

  // Transform API data to chart format
  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    if (filter === "Year") {
      return (data.year || []).map((item) => ({
        date: new Date(currentYear, monthNameToNumber(item.month), 1).toISOString(),
        amount: item.expense,
      }));
    }
    
    if (filter === "Month") {
      const currentMonth = new Date().getMonth();
      return (data.month || []).map((item) => {
        const dayOfMonth = (item.week - 1) * 7 + 1;
        return {
          date: new Date(currentYear, currentMonth, dayOfMonth).toISOString(),
          amount: item.expense,
        };
      });
    }
    
    return (data.week || []).map((item) => ({
      date: getWeekStartDate(item.day).toISOString(),
      amount: item.expense,
    }));
  }, [filter, data]);

  return (
    <Card className="rounded-2xl border py-4 border-gray-200 shadow-[0px_0px_6px_rgba(0,0,0,0.06)]">
      <CardHeader className="flex flex-row items-center justify-between px-5 space-y-0 pb-0">
        <CardTitle className="text-gray-800 dark:text-white">
          Expenses
        </CardTitle>

        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-background-50 p-1 rounded-lg">
          {filterOptions.map((opt) => (
            <Button
              key={opt.key}
              variant="ghost"
              size="sm"
              className={tailwindCn(
                "text-sm rounded-md px-3 py-1",
                filter === opt.key
                  ? "bg-white dark:bg-dark-background-100 hover:bg-white hover:opacity-80 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-800 dark:text-[#DFE2F0] "
              )}
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-5 [&_svg.recharts-surface]:focus:outline-none">
        <div className="h-[320px] w-full">
          <ExpensesChart
            data={chartData}
            filter={filter as "Year" | "Month" | "Week"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
