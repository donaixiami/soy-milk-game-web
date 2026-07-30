interface AuthenticatedRequestOptions {
  skipAuthRefresh?: boolean;
}

interface RequestError {
  statusCode?: number;
  status?: number;
}

function isUnauthorized(error: unknown): error is RequestError {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as RequestError;
  return candidate.statusCode === 401 || candidate.status === 401;
}

export function createAuthenticatedRequester<T, TOptions extends Record<string, unknown> = Record<string, never>>(dependencies: {
  fetcher: (path: string, options?: TOptions) => Promise<T>;
  refresh: () => Promise<void>;
  clearSession: () => void;
}) {
  let refreshPromise: Promise<void> | undefined;

  const refreshOnce = () => {
    if (!refreshPromise) {
      refreshPromise = dependencies.refresh().finally(() => {
        refreshPromise = undefined;
      });
    }
    return refreshPromise;
  };

  return async function request(
    path: string,
    options: TOptions & AuthenticatedRequestOptions = {} as TOptions & AuthenticatedRequestOptions,
  ) {
    const { skipAuthRefresh, ...fetchOptions } = options;

    try {
      return await dependencies.fetcher(path, fetchOptions as TOptions);
    } catch (error) {
      if (skipAuthRefresh || !isUnauthorized(error)) throw error;

      try {
        await refreshOnce();
      } catch (refreshError) {
        dependencies.clearSession();
        throw refreshError;
      }

      // 刷新只允许重放一次，避免后端持续返回 401 时形成请求环。
      return dependencies.fetcher(path, fetchOptions as TOptions);
    }
  };
}
