import { describe, it } from 'vitest';

// Feature: HttpOnly Cookie 认证 BFF
//
// Scenario: 登录成功后仅通过安全 Cookie 保存令牌
//   Given 用户提交有效登录凭据
//   When BFF 调用后端登录接口成功
//   Then BFF 设置 access、refresh 与 csrf Cookie
//   And 浏览器响应正文不包含访问令牌或刷新令牌
//
// Scenario: 查询当前会话
//   Given 请求携带有效 access Cookie
//   When 浏览器查询当前会话
//   Then BFF 返回后端会话信息且不暴露令牌
//
// Scenario: 刷新当前会话
//   Given 请求携带有效 refresh Cookie 与匹配的 CSRF 信息
//   When 浏览器请求刷新会话
//   Then BFF 仅向后端刷新接口发送刷新令牌
//   And BFF 更新令牌 Cookie 且不在正文返回令牌
//
// Scenario: 刷新失败后清理会话
//   Given refresh Cookie 已失效
//   When 后端拒绝刷新请求
//   Then BFF 清除 access、refresh 与 csrf Cookie
//
// Scenario: 登出当前会话
//   Given 请求携带有效会话 Cookie 与匹配的 CSRF 信息
//   When 浏览器请求登出
//   Then BFF 通知后端注销并清除全部认证 Cookie
//
// Scenario: 写请求拒绝不可信来源
//   Given 登录、刷新或登出请求来源不匹配站点来源
//   When BFF 校验请求来源与双提交 CSRF 令牌
//   Then BFF 返回 403 且不调用后端认证接口

describe('HttpOnly Cookie 认证 BFF 行为', () => {
  it('登录成功后仅通过安全 Cookie 保存令牌');
  it('查询当前会话');
  it('刷新当前会话');
  it('刷新失败后清理会话');
  it('登出当前会话');
  it('写请求拒绝不可信来源');
});
