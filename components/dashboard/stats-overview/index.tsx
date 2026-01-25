import React from "react";
import { mapDashboardStats } from "./data";
import { StatsCard } from "./stats-card";
import { DashboardStatsApiData } from "@/services/dashboard/types";

interface StatsOverviewProps {
  stats: DashboardStatsApiData;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const mappedStats = mapDashboardStats(stats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4">
      {mappedStats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          active={stat.active}
        />
      ))}
    </div>
  );
};
