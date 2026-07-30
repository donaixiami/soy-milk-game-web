import { randomUUID } from 'node:crypto';

import type { H3Event } from 'h3';

import type { ApiResponse } from '../../types/api';
import { fromApiResponse } from '../../utils/api-error';
import { createAuthBffService } from './auth-bff';
import { AUTH_COOKIE_NAMES, AUTH_COOKIE_OPTIONS } from './cookies';

interface AuthTokenPayload<TSession> {
  accessToken: string;
  refreshToken: string;
  session: TSession;
}

interface AuthRuntimeConfig {
  backendBaseUrl: string;
  auth: {
    loginPath: string;
    logoutPath: string;
    refreshPath: string;
    sessionPath: string;
    registerPath: string;
  };
}

function backendUrl(config: AuthRuntimeConfig, path: string) {
  return new URL(path, config.backendBaseUrl).toString();
}

export function clearAuthCookies(event: H3Event) {
  for (const name of Object.values(AUTH_COOKIE_NAMES)) {
    deleteCookie(event, name, { path: '/' });
  }
}

export function setAuthCookies(event: H3Event, accessToken: string, refreshToken: string) {
  setCookie(event, AUTH_COOKIE_NAMES.access, accessToken, {
    ...AUTH_COOKIE_OPTIONS.token,
    maxAge: 15 * 60,
  });
  setCookie(event, AUTH_COOKIE_NAMES.refresh, refreshToken, {
    ...AUTH_COOKIE_OPTIONS.token,
    maxAge: 30 * 24 * 60 * 60,
  });
  setCookie(event, AUTH_COOKIE_NAMES.csrf, randomUUID(), AUTH_COOKIE_OPTIONS.csrf);
}

export function createEventAuthBff<TCredentials extends Record<string, unknown>, TSession>(event: H3Event) {
  const config = useRuntimeConfig(event) as unknown as AuthRuntimeConfig;
  const request = async <T>(path: string, options: Parameters<typeof $fetch>[1]) => {
    const response = await $fetch<ApiResponse<T>>(backendUrl(config, path), options);
    return fromApiResponse(response);
  };

  return createAuthBffService<TCredentials, TSession>({
    backend: {
      register: credentials => request<AuthTokenPayload<TSession>>(config.auth.registerPath, {
        method: 'POST',
        body: credentials,
      }),
      login: credentials => request<AuthTokenPayload<TSession>>(config.auth.loginPath, {
        method: 'POST',
        body: credentials,
      }),
      logout: async (refreshToken) => {
        await request<unknown>(config.auth.logoutPath, {
          method: 'POST',
          body: { refreshToken },
        });
      },
      refresh: refreshToken => request<AuthTokenPayload<TSession>>(config.auth.refreshPath, {
        method: 'POST',
        body: { refreshToken },
      }),
      session: accessToken => request<TSession>(config.auth.sessionPath, {
        method: 'GET',
        headers: { authorization: `Bearer ${accessToken}` },
      }),
    },
    cookies: {
      clear: () => clearAuthCookies(event),
      setTokens: (accessToken, refreshToken) => setAuthCookies(event, accessToken, refreshToken),
    },
  });
}
