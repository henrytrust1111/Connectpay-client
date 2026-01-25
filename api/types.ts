export interface IResponse<T = unknown> {
  status?: number;
  success: boolean;
  data: T; // Use a property to hold the generic type
  message?: string;
}
