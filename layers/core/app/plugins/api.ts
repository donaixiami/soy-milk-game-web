import { createAuthenticatedRequester } from '../utils/authenticated-request';
import { useSessionStore } from '../stores/session';

interface ApiRequestOptions extends Record<string, unknown> {
  body?: Record<string, unknown> | string | FormData;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, unknown>;
}

export default defineNuxtPlugin(() => {
  const sessionStore = useSessionStore();
  const csrfCookie = useCookie<string | null>('sm_csrf');
  const requestFetch = import.meta.server ? useRequestFetch() : $fetch;

  const api = createAuthenticatedRequester<unknown, ApiRequestOptions>({
    clearSession: () => sessionStore.clearSession(),
    fetcher: (path, options) => requestFetch(path, {
      ...options,
      credentials: 'include',
    }),
    refresh: async () => {
      const result = await requestFetch<{ session: Record<string, unknown> }>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-csrf-token': csrfCookie.value ?? '' },
      });
      sessionStore.setSession(result.session);
    },
  });

  return { provide: { api } };
});
