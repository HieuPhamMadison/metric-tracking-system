export interface Response<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  success?: boolean;
  meta?: unknown;
}
