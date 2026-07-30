import type { PlayerCount } from './game-capabilities';

export interface PublicGame {
  slug: string;
  title: string;
  description: string;
  introduction: string;
  status: 'draft' | 'published' | 'archived';
  supportedPlayerCounts: PlayerCount[];
  localPlayerCounts: PlayerCount[];
  onlinePlayerCounts: PlayerCount[];
  runtimeLabel: string;
  inputLabel: string;
  updatedAt: string;
  accent: 'mint' | 'violet' | 'amber' | 'blue';
}
