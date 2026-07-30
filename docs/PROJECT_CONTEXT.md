# PROJECT_CONTEXT — soy-milk-game-web

## 定位

SEO 优先的通用 Nuxt 4 SSR 框架。第一阶段只建设可复用底层能力，不实现游戏平台、FC、模拟器、房间或联机业务。

## 技术基线

- Node.js 22.19+、npm 10+
- Nuxt 4、Vue 3、严格 TypeScript
- UnoCSS；页面视觉确认后再迁移稳定样式，少于四次复用不创建 shortcut
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

## 2026-07-30 游戏业务阶段

- 通用框架基线已复制到 `donaixiami/nuxt4_demo`；本仓开始承载游戏平台业务，通用能力继续放在 `layers/core`，游戏目录、房间和运行时留在根应用业务层。
- 已完成游戏目录与详情页，以及人数、单人游玩、同屏和在线能力规则；草稿不对外展示，不存在或未发布游戏返回 404，并输出 canonical、description 和 `VideoGame` JSON-LD。
- 游戏平台认证 BFF 默认对接后端 `/api/game-api/auth/register|login|logout|refresh|session`，浏览器仍只通过本站 BFF 管理 HttpOnly 会话 Cookie。
- 房间行为骨架位于 `tests/behaviors/game-room.behavior.ts`，已确认公开、邀请码、仅好友、固定 release、同屏不建在线房间和未登录安全返回等规则。房间持久化必须由后端负责，不得使用 Nuxt 进程内存充当权威房间状态。
- 当前认证 BFF 验证基线：`tests/unit/auth-bff.test.ts` 7 项测试、Nuxt typecheck 与 ESLint 通过。
