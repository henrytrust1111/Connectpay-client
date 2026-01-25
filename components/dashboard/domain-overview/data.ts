import type { IDomainByData } from "@/services/dashboard/types";

// Define the correct type for chart data
interface ChartDomainData {
  name: string;
  value: number;
  color: string;
}

// Predefined color palette for domains
const DOMAIN_COLORS = [
  "bg-indigo-600",
  "bg-blue-400",
  "bg-orange-400",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-gray-400",
];

/**
 * Transform domain data from API format to component format
 * Sorts by value (descending) and assigns colors
 */
export function transformDomainData(
  domainRecord: Record<string, number>,
  limit: number = 10
): ChartDomainData[] {
  // Convert object to array and sort by value (descending)
  const sortedData = Object.entries(domainRecord)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit); // Take top N items

  // Assign colors
  return sortedData.map((item, index) => ({
    ...item,
    color: DOMAIN_COLORS[index % DOMAIN_COLORS.length],
  }));
}

/**
 * Get domain overview data for all three categories
 */
export function getDomainOverviewData(data: {
  assessments_by_domain: Record<string, number>;
  candidates_by_domain: Record<string, number>;
  expenses_by_domain: Record<string, number>;
}) {
  return [
    {
      title: "Assessments by Domain",
      data: transformDomainData(data.assessments_by_domain),
    },
    {
      title: "Candidates by Domain",
      data: transformDomainData(data.candidates_by_domain),
    },
    {
      title: "Expenses by Domain",
      data: transformDomainData(data.expenses_by_domain),
    },
  ];
}

export const domainStats = [
  {
    title: "Assessments by Domain",
    data: [
      { name: "Main Exam Portal", value: 120, color: "bg-indigo-600" },
      { name: "TechPro", value: 85, color: "bg-blue-400" },
      { name: "MedLearn Hub", value: 60, color: "bg-orange-400" },
      { name: "ScholarNet", value: 45, color: "bg-gray-300" },
      { name: "ScholarNet", value: 45, color: "bg-gray-300" },
    ],
  },
  {
    title: "Candidates by Domain",
    data: [
      { name: "Main Exam Portal", value: 1520, color: "bg-indigo-600" },
      { name: "TechPro", value: 1130, color: "bg-blue-400" },
      { name: "MedLearn Hub", value: 1050, color: "bg-orange-400" },
      { name: "ScholarNet", value: 860, color: "bg-gray-300" },
      { name: "ScholarNet", value: 860, color: "bg-gray-300" },
    ],
  },
  {
    title: "Expenses by Domain",
    data: [
      { name: "Main Exam Portal", value: 1520, color: "bg-indigo-600" },
      { name: "TechPro", value: 1130, color: "bg-blue-400" },
      { name: "MedLearn Hub", value: 1050, color: "bg-orange-400" },
      { name: "ScholarNet", value: 860, color: "bg-gray-300" },
      { name: "ScholarNet", value: 860, color: "bg-gray-300" },
    ],
  },
];

export const EMPTY_DOMAIN_DATA: IDomainByData = {
  assessments_by_domain: {},
  candidates_by_domain: {},
  expenses_by_domain: {},
};
