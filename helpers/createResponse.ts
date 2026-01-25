import { IResponse } from "@/api/types";

/**
 * Utility function to create a standardized response object
 * @param success - Indicates whether the operation succeeded
 * @param data - The data payload of the response
 * @param message - Optional message describing the result
 * @param status - Optional HTTP status code
 */
export function createResponse<T>(
  success: boolean,
  data: T,
  message?: string,
  status?: number
): IResponse<T> {
  return {
    success,
    data,
    message,
    status,
  };
}
