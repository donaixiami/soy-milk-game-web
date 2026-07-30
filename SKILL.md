---
name: soy-milk-game-web
description: soy-milk-game-web 的项目边界、实现顺序与验证入口。
---

# 项目规则

- 当前只实现 SEO 优先的通用 Nuxt 4 框架。
- 用户未再次明确授权前，不得实现任何游戏模块。
- 通用能力进入 `layers/core`，业务与站点配置进入根应用。
- 页面先保证视觉还原，确认后再迁移 UnoCSS；相同组合实际复用不足四次时不新增全局 shortcut。
- 新行为先写 Given-When-Then 空测试骨架并等待用户确认，再执行 TDD。
- SSR 代码不得无条件访问浏览器 API；敏感令牌不得进入客户端存储。
- 提交前运行相关测试及 `npm run typecheck`。
