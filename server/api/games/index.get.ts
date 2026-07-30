import { getQuery } from 'h3';

import { filterPublishedGames } from '../../../app/features/game-catalog/domain/game-capabilities';
import { listPublishedGames } from '../../features/game-catalog/game-catalog.repository';

export default defineEventHandler((event) => {
  const keyword = String(getQuery(event).keyword ?? '');
  return { games: filterPublishedGames(listPublishedGames(), keyword) };
});
