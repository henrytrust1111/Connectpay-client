"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common-elements/table";
import { Input } from "@/components/common-elements/input";
import {
  // ArrowUpWideNarrow,
  // ChevronsUpDown,
  Database,
  Filter,
  SearchIcon,
} from "lucide-react";
import { Badge } from "@/components/common-elements/badge";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common-elements/select";
import { tailwindCn } from "@/helpers";
import {
  AssessmentsData,
  EAssessmentFeature,
} from "@/services/assessment/types";
import { EAppQueryParamsKey } from "@/enums";
import { DEFAULT_DOMAIN_VALUE } from "@/constants";
import { useCustomSearchParams } from "@/hooks";
import { SortDirection, SortDropdown } from "@/components/sort-dropdown";
import { useDebouncedCallback } from "use-debounce";
// import { dashboardSortOptions } from "@/components/flags/flags-overview/data";
const dashboardSortOptions = [
  { label: "Name", key: "name" },
  { label: "Date", key: "date" },
];
import { ClientDate } from "@/components/client-date";
import { Domain } from "@/services/user/types";
import { EmptyState } from "@/components/common-elements/empty-state";

interface Props {
  data?: AssessmentsData;
  searchParams?: Record<string, string>;
  domains?: Domain[];
}

export function AssessmentOverview({ data, searchParams, domains }: Props) {
  // Get initial query parameters
  const initialSearch = searchParams?.[EAppQueryParamsKey.SEARCH] ?? "";
  const sortBy = searchParams?.[EAppQueryParamsKey.SORT_BY] ?? "";
  const orderBy = searchParams?.[EAppQueryParamsKey.ORDER_BY] ?? "asc";
  const domain = searchParams?.[EAppQueryParamsKey.DOMAIN];
  // Check if data is empty
  const isEmpty = !data?.exams?.length && !initialSearch && !domain;
  console.log({ isEmpty }, data?.exams?.length);
  // State management
  const { addQueryParams, removeQueryParams } = useCustomSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [domainFilter, setDomainFilter] = useState<string>(
    domain || DEFAULT_DOMAIN_VALUE
  );
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: sortBy,
    direction: orderBy as SortDirection,
  });

  const debounceChange = useDebouncedCallback<(value: string) => void>(
    // function
    (value) => {
      if (value.trim()) {
        addQueryParams([
          { key: EAppQueryParamsKey.SEARCH, value },
          { key: EAppQueryParamsKey.PAGE, value: "1" },
        ]);
      } else {
        removeQueryParams([EAppQueryParamsKey.SEARCH, EAppQueryParamsKey.PAGE]);
      }
    },
    // delay in ms
    500
  );

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSort({ key, direction });
    addQueryParams([
      { key: EAppQueryParamsKey.SORT_BY, value: key },
      { key: EAppQueryParamsKey.ORDER_BY, value: direction },
      { key: EAppQueryParamsKey.PAGE, value: "1" },
    ]);
  };
  const domainList = [
    DEFAULT_DOMAIN_VALUE,
    ...(domains?.map((d) => d.title) ?? []),
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceChange(e.target.value);
  };

  const handleDomainChange = (value: string) => {
    setDomainFilter(value);
    if (value === DEFAULT_DOMAIN_VALUE) {
      removeQueryParams([EAppQueryParamsKey.DOMAIN, EAppQueryParamsKey.PAGE]);
    } else {
      addQueryParams([
        {
          key: EAppQueryParamsKey.DOMAIN,
          value,
        },
        { key: EAppQueryParamsKey.PAGE, value: "1" },
      ]);
    }
  };
  return (
    <div>
      {/* Top controls */}
      <div className="sm:flex items-center justify-between mb-4">
        {/* Search input */}
        <div className="relative flex items-center max-w-full sm:max-w-sm lg:w-xs">
          <div className="absolute top-1/2 -translate-y-1/2 left-3">
            <SearchIcon className="w-5 h-5 text-black dark:text-white" />
          </div>
          <Input
            placeholder="Search by Domain"
            value={search}
            onChange={handleSearchChange}
            className=" bg-white dark:bg-dark-background-50 dark:placeholder:text-[#DFE2F0] pl-10 dark:border-none"
          />
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-0 gap-2">
          <Select value={domainFilter} onValueChange={handleDomainChange}>
            <SelectTrigger className="max-w-[180px] bg-white dark:bg-dark-background-50">
              <span className=" inline-flex items-center gap-1">
                <Filter className="!size-4 mr-1" />
                <span className="line-clamp-1 truncate max-w-[100px]">
                  <SelectValue placeholder="Filter" />
                </span>
              </span>
            </SelectTrigger>
            <SelectContent align="end">
              {domainList.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SortDropdown
            options={dashboardSortOptions}
            value={sort.key}
            direction={sort.direction}
            onChange={handleSortChange}
            className="dark:bg-dark-background-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 dark:border-dark-background-50">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-100 dark:bg-dark-background-100 hover:bg-neutral-100 dark:hover:bg-dark-background-100">
              <TableHead className="text-gray-600 dark:text-white font-semibold">
                Assessment Title
              </TableHead>
              <TableHead className="text-gray-600 dark:text-white font-semibold text-center">
                Domain
              </TableHead>
              <TableHead className="text-gray-600 dark:text-white font-semibold text-center">
                Date
              </TableHead>
              <TableHead className="text-gray-600 dark:text-white font-semibold text-center">
                Candidates
              </TableHead>
              <TableHead className="text-gray-600 dark:text-white font-semibold text-center">
                Assessment Setting
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!data?.exams?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <div className="flex justify-center">
                    <EmptyState
                      icon={
                        <Database className="h-6 w-6 text-neutral-900 dark:text-dark-text" />
                      }
                      title={isEmpty ? "No Assessments" : "Empty Result"}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.exams.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors even:bg-white dark:even:bg-dark-background-100"
                >
                  <TableCell className="font-medium py-4 text-gray-800 dark:text-muted-foreground">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-muted-foreground py-4 text-center">
                    {item.domain}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-muted-foreground py-4 text-center">
                    <ClientDate date={item.updatedAt} />
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-muted-foreground py-4 text-center">
                    {item.candidates}
                  </TableCell>
                  <TableCell align="center" className="">
                    <Badge
                      className={tailwindCn(
                        "p-2 rounded-md text-xs font-medium",
                        item.features.includes(EAssessmentFeature.facial)
                          ? "bg-[#C0FBFF] text-[#003337] hover:bg-[#C0FBFF]"
                          : "bg-[#D2FFC0] text-[#003701] hover:bg-[#D2FFC0]"
                      )}
                    >
                      {item.features.includes(EAssessmentFeature.facial)
                        ? "AI + Facial Recognition"
                        : "AI Proctored"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
