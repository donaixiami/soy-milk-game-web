import { ConfigProvider } from 'ant-design-vue';

export default defineNuxtPlugin((nuxtApp) => {
  // 只注册承担全局主题与语言上下文的 Provider，业务组件保持按需导入。
  nuxtApp.vueApp.component('AConfigProvider', ConfigProvider);
});
