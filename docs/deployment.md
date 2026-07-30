# 生产部署

## 运行基线

- Node.js 22.19+
- npm 10+
- Linux x64（若更换平台，必须在目标平台重新执行构建）
- Nginx 1.24+
- HTTPS 域名

## 构建

```bash
npm ci
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

不要把开发机生成的 `.output` 跨操作系统复制到服务器。`@nuxt/image` 会打包平台相关的 Sharp 二进制，应在部署目标平台构建。

## 环境变量

以 `.env.example` 为起点创建仅服务器可读的环境文件：

```dotenv
NUXT_BACKEND_BASE_URL=http://127.0.0.1:3000
NUXT_COOKIE_SECRET=<至少 32 位随机字符串>
NUXT_PUBLIC_SITE_URL=https://example.com
NUXT_PUBLIC_SITE_NAME=<站点名称>
NUXT_AUTH_REGISTER_PATH=/api/game-api/auth/register
NUXT_AUTH_LOGIN_PATH=/api/game-api/auth/login
NUXT_AUTH_LOGOUT_PATH=/api/game-api/auth/logout
NUXT_AUTH_REFRESH_PATH=/api/game-api/auth/refresh
NUXT_AUTH_SESSION_PATH=/api/game-api/auth/session
```

`NUXT_PUBLIC_SITE_URL` 必须与浏览器实际访问的 HTTPS Origin 完全一致，否则认证写请求会被同源校验拒绝。密钥和真实 `.env` 不得提交到 Git。

## 启动

```bash
node .output/server/index.mjs
```

默认监听 `3000`。生产环境建议通过 `NITRO_PORT` 和 `NITRO_HOST=127.0.0.1` 明确限制监听地址，并使用 `deploy/soy-milk-game-web.service.example` 托管进程。

## Nginx

使用 `deploy/nginx.conf.example` 作为站点配置基础：

- TLS 在 Nginx 终止；
- `/health` 用于进程健康检查；
- `/_nuxt/` 构建资源长期缓存；
- HTML、认证接口和其他动态响应不由 Nginx 公共缓存；
- 转发 Host、客户端 IP 和协议，保证 Nuxt 能正确识别公开来源。

上线后至少验证：

```bash
curl --fail https://example.com/health
curl -I https://example.com/
```

认证 Cookie 使用 `Secure`，纯 HTTP 环境不会保存，这是必要的生产安全约束。本地开发认证联调应使用本地 HTTPS 代理或专用的开发 Cookie 配置，不能降低生产默认值。
