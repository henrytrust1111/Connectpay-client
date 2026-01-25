import { DashboardStatsApiData } from "@/services/dashboard/types";
import {
  Users,
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  Wallet,
} from "lucide-react";

export const mapDashboardStats = (data: DashboardStatsApiData) => [
  {
    title: "Total Candidates Proctored",
    value: (data.total_candidates_proctored || 0).toLocaleString(),
    icon: Users,
  },
  {
    title: "Total Assessments Proctored",
    value: (data.total_assessments || 0).toLocaleString(),
    icon: BookOpen,
  },
  {
    title: "Total Expenses",
    value: `$${(data.total_expenses || 0).toLocaleString()}`,
    icon: ArrowDownRight,
  },
  {
    title: "Total Credit",
    value: `$${(data.total_credit || 0).toLocaleString()}`,
    icon: ArrowUpRight,
  },
  {
    title: "Average Expense per Domain",
    value: `$${(data.average_expense_per_domain || 0).toLocaleString()}`,
    icon: Layers,
  },
  {
    title: "Wallet Balance",
    value: `$${(data.credit_balance || 0).toLocaleString()}`,
    icon: Wallet,
    active: true,
  },
];

export const EMPTY_STATS: DashboardStatsApiData = {
  total_candidates_proctored: 0,
  total_assessments: 0,
  total_expenses: 0,
  total_credit: 0,
  average_expense_per_domain: 0,
  credit_balance: 0,
};
