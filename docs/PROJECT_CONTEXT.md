# PROJECT_CONTEXT — soy-milk-game-web

## 定位

SEO 优先的通用 Nuxt 4 SSR 框架。第一阶段只建设可复用底层能力，不实现游戏平台、FC、模拟器、房间或联机业务。

## 技术基线

- Node.js 22.19+、npm 10+
- Nuxt 4、Vue 3、严格 TypeScript
- 根应用继承本地 `layers/core`
- Nitro Node SSR，后续由 Nginx 反向代理

## 边界

- `layers/core` 只保存认证、请求、SEO、图片、上传、主题、动画、图表和安全等通用能力。
- 站点品牌、域名、SEO 内容与业务页面留在根应用。
- 禁止在通用 Layer 中写入 ROM、模拟器、游戏房间或具体运行时逻辑。
- 行为代码严格执行 BDD 骨架确认与 TDD 红绿重构流程。

## 常用命令

`npm run dev`、`npm run typecheck`、`npm run lint`、`npm run test:unit`、`npm run test:e2e`、`npm run build`。

## 当前阶段

工程骨架已初始化。下一步先确认 BDD 行为骨架，再实现通用框架能力。
