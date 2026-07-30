export type PlayerCount = 1 | 2 | 3 | 4;

interface GameCapabilities {
  supportedPlayerCounts: PlayerCount[];
  localPlayerCounts: PlayerCount[];
  onlinePlayerCounts: PlayerCount[];
}

interface CatalogGame {
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
}

export function derivePlayerLabels(counts: number[]) {
  const labels: string[] = [];
  if (counts.includes(1)) labels.push('单人');
  if (counts.includes(2)) labels.push('双人');
  if (counts.some(count => count >= 3)) labels.push('多人');
  return labels;
}

export function deriveGameActions(capabilities: GameCapabilities) {
  return {
    solo: capabilities.supportedPlayerCounts.includes(1),
    local: capabilities.localPlayerCounts.length > 0,
    online: capabilities.onlinePlayerCounts.length > 0,
  };
}

export function filterPublishedGames<T extends CatalogGame>(games: T[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  return games.filter((game) => {
    if (game.status !== 'published') return false;
    if (!normalizedKeyword) return true;
    return `${game.title} ${game.description}`.toLocaleLowerCase().includes(normalizedKeyword);
  });
}
