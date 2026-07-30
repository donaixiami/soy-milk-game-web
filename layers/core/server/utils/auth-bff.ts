interface AuthTokens<TSession> {
  accessToken: string;
  refreshToken: string;
  session: TSession;
}

interface AuthBackend<TCredentials, TSession> {
  login(credentials: TCredentials): Promise<AuthTokens<TSession>>;
  logout(refreshToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<AuthTokens<TSession>>;
  session(accessToken: string): Promise<TSession>;
}

interface AuthCookies {
  clear(): void;
  setTokens(accessToken: string, refreshToken: string): void;
}

export function createAuthBffService<TCredentials, TSession>(dependencies: {
  backend: AuthBackend<TCredentials, TSession>;
  cookies: AuthCookies;
}) {
  const { backend, cookies } = dependencies;

  return {
    async login(credentials: TCredentials) {
      const result = await backend.login(credentials);
      cookies.setTokens(result.accessToken, result.refreshToken);
      return { session: result.session };
    },

    async getSession(accessToken: string) {
      return { session: await backend.session(accessToken) };
    },

    async refresh(refreshToken: string) {
      try {
        const result = await backend.refresh(refreshToken);
        cookies.setTokens(result.accessToken, result.refreshToken);
        return { session: result.session };
      } catch (error) {
        cookies.clear();
        throw error;
      }
    },

    async logout(refreshToken: string) {
      try {
        await backend.logout(refreshToken);
      } finally {
        // 后端不可用时也必须终止本地会话，避免浏览器继续携带失效凭据。
        cookies.clear();
      }
    },
  };
}
