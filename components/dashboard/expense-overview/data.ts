import { IExpenseChartData } from "@/services/dashboard/types";

export const EMPTY_EXPENSE_DATA: IExpenseChartData = {
  year: [
    { month: "January", expense: 0 },
    { month: "February", expense: 0 },
    { month: "March", expense: 0 },
    { month: "April", expense: 0 },
    { month: "May", expense: 0 },
    { month: "June", expense: 0 },
    { month: "July", expense: 0 },
    { month: "August", expense: 0 },
    { month: "September", expense: 0 },
    { month: "October", expense: 0 },
    { month: "November", expense: 0 },
    { month: "December", expense: 0 },
  ],
  month: [
    { week: 1, expense: 0 },
    { week: 2, expense: 0 },
    { week: 3, expense: 0 },
    { week: 4, expense: 0 },
  ],
  week: [
    { day: "Sunday", expense: 0 },
    { day: "Monday", expense: 0 },
    { day: "Tuesday", expense: 0 },
    { day: "Wednesday", expense: 0 },
    { day: "Thursday", expense: 0 },
    { day: "Friday", expense: 0 },
    { day: "Saturday", expense: 0 },
  ],
};
