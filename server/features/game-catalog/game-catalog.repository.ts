import type { PublicGame } from '../../../app/features/game-catalog/domain/game';

const games: PublicGame[] = [
  {
    slug: 'star-racing',
    title: '星际竞速',
    description: '在不断变化的赛道上挑战极限，支持单人、同屏与在线竞速。',
    introduction: '独自刷新纪录、连接多个设备同屏竞速，或创建在线房间与远方好友一决高下。',
    status: 'published',
    supportedPlayerCounts: [1, 2, 3, 4],
    localPlayerCounts: [2, 3, 4],
    onlinePlayerCounts: [2, 3, 4],
    runtimeLabel: 'HTML5 游戏',
    inputLabel: '键盘 / 多个标准手柄',
    updatedAt: '2026-07-28',
    accent: 'mint',
  },
  {
    slug: 'metal-assault',
    title: '合金突击',
    description: '经典横版动作游戏，支持单人闯关和双人协作。',
    introduction: '选择单人完成关卡，或与另一位玩家通过同屏或在线方式共同推进。',
    status: 'published',
    supportedPlayerCounts: [1, 2],
    localPlayerCounts: [2],
    onlinePlayerCounts: [2],
    runtimeLabel: 'NES 模拟器',
    inputLabel: '键盘 / 最多 2 个手柄',
    updatedAt: '2026-07-24',
    accent: 'amber',
  },
  {
    slug: 'twilight-courier',
    title: '暮光邮差',
    description: '一段关于城市、记忆与错过的短篇单人冒险。',
    introduction: '本游戏仅支持单人游玩，不会创建在线房间或邀请其他玩家。',
    status: 'published',
    supportedPlayerCounts: [1],
    localPlayerCounts: [],
    onlinePlayerCounts: [],
    runtimeLabel: 'WASM 游戏',
    inputLabel: '键盘 / 标准手柄',
    updatedAt: '2026-07-20',
    accent: 'violet',
  },
  {
    slug: 'forest-expedition',
    title: '森林远征',
    description: '独自探索不断变化的森林，或与远方伙伴在线协作。',
    introduction: '支持单人和在线多人，但没有声明同屏能力。',
    status: 'published',
    supportedPlayerCounts: [1, 2, 3, 4],
    localPlayerCounts: [],
    onlinePlayerCounts: [2, 3, 4],
    runtimeLabel: 'WebGL 游戏',
    inputLabel: '键盘 / 标准手柄',
    updatedAt: '2026-07-18',
    accent: 'blue',
  },
  {
    slug: 'pixel-arena',
    title: '像素竞技场',
    description: '兼容性检查尚未完成。',
    introduction: '该版本仍在隔离检查中。',
    status: 'draft',
    supportedPlayerCounts: [2],
    localPlayerCounts: [],
    onlinePlayerCounts: [],
    runtimeLabel: 'HTML5 游戏',
    inputLabel: '待确认',
    updatedAt: '2026-07-29',
    accent: 'amber',
  },
];

export function listPublishedGames() {
  return games.filter(game => game.status === 'published');
}

export function findPublishedGame(slug: string) {
  return games.find(game => game.slug === slug && game.status === 'published') ?? null;
}
