export const AUTH_COOKIE_NAMES = {
  access: 'sm_access',
  refresh: 'sm_refresh',
  csrf: 'sm_csrf',
} as const;

export const AUTH_COOKIE_OPTIONS = {
  token: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  },
  csrf: {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
  },
} as const;
