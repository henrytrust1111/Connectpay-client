import React from "react";
import { DomainStatsCard } from "./domain-stats-card";
import type { IDomainByData } from "@/services/dashboard/types";
import { getDomainOverviewData } from "./data";

interface DomainOverviewProps {
  dashboardByDomainData: IDomainByData;
}

export const DomainOverview = ({
  dashboardByDomainData,
}: DomainOverviewProps) => {
  const domainStats = getDomainOverviewData(dashboardByDomainData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {domainStats.map((stat) => (
        <DomainStatsCard key={stat.title} title={stat.title} data={stat.data} />
      ))}
    </div>
  );
};
