import type { ApiResponse } from '../../types/api';
import { AppError, fromApiResponse } from '../../utils/api-error';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Fetcher = <T>(path: string, options: { method: RequestMethod }) => Promise<ApiResponse<T>>;

const REDACTED_FIELDS = new Set(['authorization', 'cookie', 'password']);

export function sanitizeRequestMeta(meta: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      REDACTED_FIELDS.has(key.toLowerCase()) ? '[REDACTED]' : value,
    ]),
  );
}

export function createBackendRequester(fetcher: Fetcher) {
  return async function request<T>(
    path: string,
    options: { method: RequestMethod },
  ): Promise<T> {
    const attempts = options.method === 'GET' ? 2 : 1;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        return fromApiResponse(await fetcher<T>(path, options));
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (attempt + 1 === attempts) {
          throw new AppError('网络请求失败', 'network', 503);
        }
      }
    }

    throw new AppError('网络请求失败', 'network', 503);
  };
}
