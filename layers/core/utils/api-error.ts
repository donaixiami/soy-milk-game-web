import type { ApiResponse, AppErrorKind } from '../types/api';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly kind: AppErrorKind,
    public readonly statusCode = 500,
    public readonly code?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function fromApiResponse<T>(response: ApiResponse<T>): T {
  if (response.code !== 0) {
    throw new AppError(response.message, 'business', 400, response.code);
  }

  return response.data;
}
