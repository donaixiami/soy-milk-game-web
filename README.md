# soy-milk-game-web

SEO 优先的通用 Nuxt 4 SSR 框架。当前阶段不包含游戏目录、房间、模拟器、ROM 或联机业务。

## 环境

- Node.js 22.19+
- npm 10+
- Nuxt 4.5+

## 安装与开发

```bash
npm install --legacy-peer-deps
copy .env.example .env
npm run dev
```

## 质量检查

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

## 架构边界

- `layers/core`：请求、认证安全、SEO、主题、i18n、图片、上传、GSAP、ECharts、UnoCSS 和安全策略。
- `app`：站点配置与业务页面。
- 浏览器令牌只允许进入 HttpOnly Cookie，不进入 localStorage。
- 公开页面使用 SSR；登录后页面默认 noindex 且禁止公共缓存。
- 游戏业务需要后续独立授权与实施计划。
