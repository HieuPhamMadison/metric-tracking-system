import { Response } from './interface/response.interface';

export function httpResponse<T>(response: Response<T>): Response<T> {
  return response;
}
