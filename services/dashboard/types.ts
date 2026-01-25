// Stub dashboard types for ConnectPay
export interface ICreditChartData {
  year?: any[];
  month?: any[];
  week?: any[];
}

export interface IExpenseChartData {
  year?: any[];
  month?: any[];
  week?: any[];
}

export interface DomainData {
  id: string;
  name: string;
}

export interface IDomainByData {
  assessments_by_domain: Record<string, number>;
  candidates_by_domain: Record<string, number>;
  expenses_by_domain: Record<string, number>;
}

export interface DashboardStatsApiData {
  totalAssessments?: number;
  totalCredits?: number;
  totalDomains?: number;
  total_candidates_proctored?: number;
  total_assessments?: number;
  total_expenses?: number;
  total_credit?: number;
  average_expense_per_domain?: number;
  credit_balance?: number;
}