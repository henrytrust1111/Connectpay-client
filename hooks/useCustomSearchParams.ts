"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";

interface IQueryParamsItem {
  key?: string;
  value?: string;
}

/**
 * Custom hook for managing URL query parameters in Next.js applications.
 * Provides utilities to add, remove, and alter query parameters without page reload.
 *
 * @returns {{
 *   addQueryParam: (params: IQueryParamsItem) => void;
 *   addQueryParams: (params: IQueryParamsItem[]) => void;
 *   removeQueryParam: (key: string) => void;
 *   removeQueryParams: (keys: string[]) => void;
 *   alterQueryParams: (
 *     addParams: IQueryParamsItem[],
 *     removeKeys: string[]
 *   ) => void;
 *   removeAllQueryParams: () => void;
 * }} An object containing query parameter manipulation functions.
 *
 * @example
 * // Add a single query parameter
 * const { addQueryParam } = useCustomSearchParams();
 * addQueryParam({ key: 'search', value: 'laptop' });
 * // URL changes from /products to /products?search=laptop
 *
 * @example
 * // Add multiple query parameters at once
 * const { addQueryParams } = useCustomSearchParams();
 * addQueryParams([
 *   { key: 'category', value: 'electronics' },
 *   { key: 'sort', value: 'price' },
 *   { key: 'order', value: 'asc' }
 * ]);
 * // URL: /products?category=electronics&sort=price&order=asc
 *
 * @example
 * // Remove a single query parameter
 * const { removeQueryParam } = useCustomSearchParams();
 * removeQueryParam('search');
 * // URL changes from /products?search=laptop&category=electronics
 * // to /products?category=electronics
 *
 * @example
 * // Remove multiple query parameters
 * const { removeQueryParams } = useCustomSearchParams();
 * removeQueryParams(['sort', 'order']);
 * // Removes both 'sort' and 'order' from the URL
 *
 * @example
 * // Alter query parameters (add new ones and remove existing ones simultaneously)
 * const { alterQueryParams } = useCustomSearchParams();
 * alterQueryParams(
 *   [{ key: 'page', value: '2' }, { key: 'limit', value: '20' }],
 *   ['search', 'filter']
 * );
 * // Adds 'page' and 'limit' while removing 'search' and 'filter'
 *
 * @example
 * // Remove all query parameters
 * const { removeAllQueryParams } = useCustomSearchParams();
 * removeAllQueryParams();
 * // URL changes from /products?search=laptop&category=electronics to /products
 *
 * @example
 * // Usage in a search component
 * function SearchBar() {
 *   const { addQueryParam } = useCustomSearchParams();
 *
 *   const handleSearch = (searchTerm) => {
 *     addQueryParam({ key: 'q', value: searchTerm });
 *   };
 *
 *   return <input onChange={(e) => handleSearch(e.target.value)} />;
 * }
 *
 * @example
 * // Usage in a filter component with multiple filters
 * function ProductFilters() {
 *   const { addQueryParams, removeQueryParams } = useCustomSearchParams();
 *
 *   const applyFilters = (filters) => {
 *     const params = Object.entries(filters).map(([key, value]) => ({
 *       key,
 *       value: String(value)
 *     }));
 *     addQueryParams(params);
 *   };
 *
 *   const clearFilters = () => {
 *     removeQueryParams(['category', 'price', 'brand']);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => applyFilters({ category: 'shoes', price: '50' })}>
 *         Apply Filters
 *       </button>
 *       <button onClick={clearFilters}>Clear Filters</button>
 *     </div>
 *   );
 * }
 */
export const useCustomSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Removes all query parameters from the URL
   */
  const removeAllQueryParams = useCallback(() => {
    if (pathname) {
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, router]);

  /**
   * Adds or updates a single query parameter
   * @param {IQueryParamsItem} params - Object containing the key and value to add
   * @param {string} params.key - The query parameter key
   * @param {string} params.value - The query parameter value
   */
  const addQueryParam = useCallback(
    ({ key, value }: IQueryParamsItem) => {
      const newParams = searchParams ? qs.parse(searchParams.toString()) : null;
      if (newParams && key && value) {
        newParams[key] = value;
        router.push(`${pathname}?${qs.stringify(newParams)}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Adds or updates multiple query parameters at once
   * @param {IQueryParamsItem[]} params - Array of objects containing keys and values to add
   */
  const addQueryParams = useCallback(
    (params: IQueryParamsItem[]) => {
      const newParams = searchParams ? qs.parse(searchParams.toString()) : null;
      if (newParams && params.length) {
        params.forEach(({ key, value }) => {
          if (key && value) {
            newParams[key] = value;
          }
        });
        router.push(`${pathname}?${qs.stringify(newParams)}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Removes a single query parameter from the URL
   * @param {string} param - The query parameter key to remove
   */
  const removeQueryParam = useCallback(
    (param: string) => {
      const newParams = searchParams ? qs.parse(searchParams.toString()) : null;
      if (newParams) {
        delete newParams[param];
        router.push(`${pathname}?${qs.stringify(newParams)}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Removes multiple query parameters from the URL
   * @param {string[]} params - Array of query parameter keys to remove
   */
  const removeQueryParams = useCallback(
    (params: string[]) => {
      const newParams = searchParams ? qs.parse(searchParams.toString()) : null;
      if (newParams) {
        params.forEach((el) => {
          delete newParams[el];
        });
        router.push(`${pathname}?${qs.stringify(newParams)}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Alters query parameters by adding new ones and removing existing ones in a single operation
   * @param {IQueryParamsItem[]} newQueryItems - Array of query parameters to add or update
   * @param {string[]} deletedParams - Array of query parameter keys to remove
   */
  const alterQueryParams = useCallback(
    (newQueryItems: IQueryParamsItem[], deletedParams: string[] = []) => {
      const newParams = searchParams ? qs.parse(searchParams.toString()) : null;
      if (newParams) {
        deletedParams?.forEach((el) => {
          delete newParams[el];
        });
        newQueryItems.forEach(({ key, value }) => {
          if (key && value) {
            newParams[key] = value;
          }
        });
        router.push(`${pathname}?${qs.stringify(newParams)}`, {
          scroll: false,
        });
      }
    },
    [pathname, router, searchParams]
  );

  return {
    removeAllQueryParams,
    removeQueryParam,
    removeQueryParams,
    addQueryParam,
    addQueryParams,
    alterQueryParams,
  };
};
