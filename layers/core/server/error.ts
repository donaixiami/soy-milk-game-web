import type { H3Error } from 'h3';

export default defineNitroErrorHandler((error: H3Error & { code?: number }, event) => {
  const candidateStatus = Number(error.statusCode);
  const isPublicClientError = candidateStatus >= 400 && candidateStatus < 500;
  const statusCode = isPublicClientError ? candidateStatus : 500;

  setResponseStatus(event, statusCode);
  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8');

  return send(event, JSON.stringify({
    code: typeof error.code === 'number' ? error.code : -1,
    data: null,
    // 未知异常可能包含内部实现与路径，客户端只接收稳定的通用错误文案。
    message: isPublicClientError ? error.message : '服务器内部错误',
  }));
});
