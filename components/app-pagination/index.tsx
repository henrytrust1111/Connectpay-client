"use client";

import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../common-elements/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { tailwindCn } from "@/helpers";

interface PaginationProps {
  pageCount: number;
  currentPage?: number;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  onPageChange?: (page: number) => void;
}

export const AppPagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage = 1,
  pageRangeDisplayed,
  marginPagesDisplayed,
  onPageChange,
}) => {
  const [selected, setSelected] = useState<number>((currentPage || 1) - 1);
  const [adjustedPageRange, setAdjustedPageRange] =
    useState(pageRangeDisplayed);

  const handlePageClick = (page: number) => {
    setSelected(page - 1);
    onPageChange?.(page);
  };
  useEffect(() => {
    setSelected((currentPage || 1) - 1);
  }, [currentPage]);

  // Adjust the page range for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setAdjustedPageRange(1); // Smaller range for mobile
      } else {
        setAdjustedPageRange(pageRangeDisplayed); // Default for larger screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageRangeDisplayed]);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams!);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const generatePages = () => {
    const pages: React.JSX.Element[] = [];
    const rangeDisplayed = adjustedPageRange;

    if (pageCount <= rangeDisplayed + 2 * marginPagesDisplayed) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={selected === i}
              href={createPageURL(i + 1)}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return pages;
    }

    const leftSide = Math.max(
      selected - Math.floor(rangeDisplayed / 2),
      marginPagesDisplayed
    );
    const rightSide = Math.min(
      selected + Math.floor(rangeDisplayed / 2),
      pageCount - marginPagesDisplayed - 1
    );

    for (let i = 0; i < marginPagesDisplayed; i++) {
      if (i < pageCount) {
        pages.push(
          <PaginationItem key={`start-${i}`}>
            <PaginationLink
              isActive={selected === i}
              href={createPageURL(i + 1)}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    if (leftSide > marginPagesDisplayed) {
      pages.push(
        <PaginationItem key="ellipsis-left">
          <PaginationEllipsis className="w-auto" />
        </PaginationItem>
      );
    }

    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={selected === i}
            href={createPageURL(i + 1)}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (rightSide < pageCount - marginPagesDisplayed - 1) {
      pages.push(
        <PaginationItem key="ellipsis-right">
          <PaginationEllipsis className="w-auto" />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(pageCount - marginPagesDisplayed, rightSide + 1);
      i < pageCount;
      i++
    ) {
      pages.push(
        <PaginationItem key={`end-${i}`}>
          <PaginationLink
            isActive={selected === i}
            href={createPageURL(i + 1)}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (!pageCount || pageCount <= 0) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={selected === 0}
            href={selected > 0 ? createPageURL(selected) : "#"}
            onClick={() => {
              if (selected > 0) handlePageClick(selected);
            }}
            className={tailwindCn({
              "pointer-events-none opacity-40": selected === 0,
            })}
          />
        </PaginationItem>
        {generatePages()}
        <PaginationItem>
          <PaginationNext
            aria-disabled={selected === pageCount - 1}
            href={createPageURL(selected + 2)}
            onClick={() => handlePageClick(selected + 2)}
            className={tailwindCn({
              "pointer-events-none opacity-40": selected === pageCount - 1,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
