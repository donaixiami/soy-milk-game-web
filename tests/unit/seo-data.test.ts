import { describe, expect, it } from 'vitest';

import { buildAsyncDataKey } from '../../layers/core/utils/async-data-key';
import { createSeoDefinition } from '../../layers/core/utils/seo';

describe('SEO 定义', () => {
  it('canonical 只使用配置的站点域名', () => {
    const seo = createSeoDefinition({
      siteUrl: 'https://site.test',
      title: '文章标题',
      description: '文章摘要',
      path: '/articles/1?utm_source=test',
    });

    expect(seo.canonical).toBe('https://site.test/articles/1');
  });

  it('私有页面默认禁止收录', () => {
    expect(createSeoDefinition({
      siteUrl: 'https://site.test',
      title: '个人中心',
      description: '用户资料',
      path: '/account',
      private: true,
    }).robots).toBe('noindex,nofollow');
  });
});

describe('SSR 数据缓存键', () => {
  it('包含语言和排序后的查询参数', () => {
    expect(buildAsyncDataKey('article-list', 'zh-CN', { page: 2, category: 'tech' }))
      .toBe('article-list:zh-CN:category=tech&page=2');
  });
});
