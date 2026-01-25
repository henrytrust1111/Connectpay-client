import { ICreditChartData } from "@/services/dashboard/types";

export const EMPTY_CREDIT_DATA: ICreditChartData = {
    year: [
      { month: "January", credit: 0 },
      { month: "February", credit: 0 },
      { month: "March", credit: 0 },
      { month: "April", credit: 0 },
      { month: "May", credit: 0 },
      { month: "June", credit: 0 },
      { month: "July", credit: 0 },
      { month: "August", credit: 0 },
      { month: "September", credit: 0 },
      { month: "October", credit: 0 },
      { month: "November", credit: 0 },
      { month: "December", credit: 0 },
    ],
    month: [
      { week: 1, credit: 0 },
      { week: 2, credit: 0 },
      { week: 3, credit: 0 },
      { week: 4, credit: 0 },
    ],
    week: [
      { day: "Sunday", credit: 0 },
      { day: "Monday", credit: 0 },
      { day: "Tuesday", credit: 0 },
      { day: "Wednesday", credit: 0 },
      { day: "Thursday", credit: 0 },
      { day: "Friday", credit: 0 },
      { day: "Saturday", credit: 0 },
    ],
  };
  