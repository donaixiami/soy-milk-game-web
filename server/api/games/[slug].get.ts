import { createError, getRouterParam } from 'h3';

import { findPublishedGame } from '../../features/game-catalog/game-catalog.repository';

export default defineEventHandler((event) => {
  const game = findPublishedGame(getRouterParam(event, 'slug') ?? '');
  if (!game) throw createError({ statusCode: 404, statusMessage: '游戏不存在或尚未发布' });
  return { game };
});
