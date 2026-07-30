import { describe, expect, it } from 'vitest';

import {
  deriveGameActions,
  derivePlayerLabels,
  filterPublishedGames,
} from '../../app/features/game-catalog/domain/game-capabilities';
import { findPublishedGame, listPublishedGames } from '../../server/features/game-catalog/game-catalog.repository';

describe('游戏人数标签', () => {
  it.each([
    { counts: [1], labels: ['单人'] },
    { counts: [2], labels: ['双人'] },
    { counts: [1, 2], labels: ['单人', '双人'] },
    { counts: [2, 3, 4], labels: ['双人', '多人'] },
    { counts: [1, 2, 3, 4], labels: ['单人', '双人', '多人'] },
  ])('从 $counts 派生 $labels', ({ counts, labels }) => {
    expect(derivePlayerLabels(counts)).toEqual(labels);
  });
});

describe('游戏详情入口', () => {
  it('纯单人游戏只展示单人入口', () => {
    expect(deriveGameActions({
      supportedPlayerCounts: [1],
      localPlayerCounts: [],
      onlinePlayerCounts: [],
    })).toEqual({ solo: true, local: false, online: false });
  });

  it('分别按同屏和在线人数声明展示入口', () => {
    expect(deriveGameActions({
      supportedPlayerCounts: [1, 2, 3, 4],
      localPlayerCounts: [2, 3, 4],
      onlinePlayerCounts: [2, 3, 4],
    })).toEqual({ solo: true, local: true, online: true });

    expect(deriveGameActions({
      supportedPlayerCounts: [1, 2, 3, 4],
      localPlayerCounts: [],
      onlinePlayerCounts: [2, 3, 4],
    })).toEqual({ solo: true, local: false, online: true });
  });
});

describe('公开游戏目录', () => {
  const games = [
    { title: '星际竞速', description: '多人竞速挑战', status: 'published' as const },
    { title: '暮光邮差', description: '单人城市冒险', status: 'published' as const },
    { title: '像素竞技场', description: '等待审核', status: 'draft' as const },
  ];

  it('只返回匹配关键词的已发布游戏', () => {
    expect(filterPublishedGames(games, '竞速')).toEqual([games[0]]);
    expect(filterPublishedGames(games, '')).toEqual(games.slice(0, 2));
  });

  it('服务端数据源不返回草稿且 slug 不存在时返回空值', () => {
    expect(listPublishedGames().every(game => game.status === 'published')).toBe(true);
    expect(findPublishedGame('pixel-arena')).toBeNull();
    expect(findPublishedGame('twilight-courier')?.title).toBe('暮光邮差');
  });
});
