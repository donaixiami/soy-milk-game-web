import { AppError } from '../../utils/api-error';

interface CsrfRequestInput {
  expectedOrigin: string;
  origin: string | null | undefined;
  cookieToken: string | null | undefined;
  headerToken: string | null | undefined;
}

export function assertCsrfRequest(input: CsrfRequestInput): void {
  if (input.origin !== input.expectedOrigin) {
    throw new AppError('请求来源不受信任', 'auth', 403);
  }

  if (!input.cookieToken || input.cookieToken !== input.headerToken) {
    throw new AppError('CSRF 校验失败', 'auth', 403);
  }
}
