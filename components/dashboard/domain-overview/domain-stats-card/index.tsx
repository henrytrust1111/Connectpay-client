import { Card, CardContent } from "@/components/common-elements/card";
import { tailwindCn } from "@/helpers";
import numeral from "numeral";

interface DomainData {
  name: string;
  value: number;
  color?: string;
}

interface DomainStatsCardProps {
  title: string;
  data: DomainData[];
  maxValue?: number; // optional if you want to control the bar scale manually
}

export function DomainStatsCard({
  title,
  data,
  maxValue,
}: DomainStatsCardProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const hasData = data?.length > 0;
  const isExpenses = title === "Expenses by Domain";
  return (
    <Card className="rounded-xl border border-gray-200 p-0 shadow-none">
      <CardContent className="p-5 pb-6.5">
        <h3 className="text-gray-800 dark:text-white font-medium mb-4">
          {isExpenses ? `${title} ($)` : title}
        </h3>

        {!hasData ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No data available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-[#DFE2F0] mb-1 ">
                    {item.name}
                  </p>
                  <p className="block text-sm text-gray-700 dark:text-[#DFE2F0] text-right font-medium">
                    {isExpenses
                      ? `${numeral(item.value).format("0,0.00")}`
                      : numeral(item.value).format("0,0")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={tailwindCn(
                          "h-full rounded-full transition-all duration-500 ease-in-out",
                          item.color || "bg-indigo-500"
                        )}
                        style={{ width: `${(item.value / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="ml-3 text-sm font-medium text-gray-700 dark:text-[#DFE2F0] w-14 text-right">
                    {/* {isExpenses
                    ? `${numeral(item.value).format("0,0.00")}`
                    : numeral(item.value).format("0,0")} */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}