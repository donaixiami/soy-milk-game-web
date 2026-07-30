import { AppError } from '../../utils/api-error';

interface CsrfRequestInput {
  expectedOrigin: string;
  origin: string | null | undefined;
  cookieToken: string | null | undefined;
  headerToken: string | null | undefined;
}

export function assertTrustedOrigin(expectedOrigin: string, origin: string | null | undefined): void {
  if (origin !== expectedOrigin) {
    throw new AppError('请求来源不受信任', 'auth', 403);
  }
}

export function assertCsrfRequest(input: CsrfRequestInput): void {
  assertTrustedOrigin(input.expectedOrigin, input.origin);

  if (!input.cookieToken || input.cookieToken !== input.headerToken) {
    throw new AppError('CSRF 校验失败', 'auth', 403);
  }
}
