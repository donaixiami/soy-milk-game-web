<script setup lang="ts">
import type { PublicGame } from '../../features/game-catalog/domain/game';
import { derivePlayerLabels } from '../../features/game-catalog/domain/game-capabilities';

const keyword = ref('');
const { data } = await useApiData<{ games: PublicGame[] }>('game-catalog', '/api/games');
const games = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLocaleLowerCase();
  if (!normalizedKeyword) return data.value?.games ?? [];
  return (data.value?.games ?? []).filter(game =>
    `${game.title} ${game.description}`.toLocaleLowerCase().includes(normalizedKeyword),
  );
});

useSeoPage({
  title: '发现好游戏',
  description: '浏览支持单人、同屏和在线联机的浏览器游戏。',
  path: '/games',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '发现好游戏',
  },
});
</script>

<template>
  <main class="catalog-page">
    <header class="catalog-header">
      <div>
        <p class="eyebrow">游戏中心</p>
        <h1>发现好游戏</h1>
        <p class="subtitle">单人探索、连接设备同屏畅玩，或与远方好友在线联机。</p>
      </div>
      <label class="search-field">
        <span>搜索</span>
        <input v-model="keyword" type="search" placeholder="搜索游戏、类型或玩法">
      </label>
    </header>

    <section v-if="games.length" class="game-grid" aria-label="游戏列表">
      <NuxtLink
        v-for="game in games"
        :key="game.slug"
        class="game-card"
        :to="`/games/${game.slug}`"
      >
        <div class="game-cover" :data-accent="game.accent">
          <span>{{ game.runtimeLabel }}</span>
        </div>
        <div class="game-card-body">
          <h2>{{ game.title }}</h2>
          <p>{{ game.description }}</p>
          <div class="tag-row">
            <span v-for="label in derivePlayerLabels(game.supportedPlayerCounts)" :key="label">{{ label }}</span>
            <span v-if="game.localPlayerCounts.length">同屏</span>
            <span v-if="game.onlinePlayerCounts.length">在线</span>
          </div>
        </div>
      </NuxtLink>
    </section>

    <section v-else class="empty-state">
      <h2>没有找到相关游戏</h2>
      <p>换一个关键词试试。</p>
    </section>
  </main>
</template>

<style scoped>
.catalog-page { min-height: 100vh; padding: 64px clamp(24px, 6vw, 96px); color: #f4f7fb; background: #070b14; }
.catalog-header { display: flex; align-items: end; justify-content: space-between; gap: 32px; max-width: 1240px; margin: 0 auto 36px; }
.eyebrow { margin: 0 0 10px; color: #5eead4; font-size: 13px; font-weight: 700; letter-spacing: .12em; }
h1 { margin: 0; font-size: clamp(36px, 5vw, 64px); line-height: 1.05; }
.subtitle { max-width: 640px; margin: 16px 0 0; color: #9aa8bd; font-size: 17px; line-height: 1.7; }
.search-field { width: min(360px, 100%); color: #9aa8bd; font-size: 13px; }
.search-field span { display: block; margin-bottom: 8px; }
.search-field input { width: 100%; padding: 14px 16px; border: 1px solid #2a3952; border-radius: 12px; outline: none; color: #f4f7fb; background: #111b2c; }
.search-field input:focus { border-color: #5eead4; box-shadow: 0 0 0 3px rgba(94, 234, 212, .12); }
.game-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 22px; max-width: 1240px; margin: 0 auto; }
.game-card { overflow: hidden; border: 1px solid #202d43; border-radius: 18px; color: inherit; text-decoration: none; background: #111b2c; transition: transform .2s ease, border-color .2s ease; }
.game-card:hover { transform: translateY(-4px); border-color: #3f536f; }
.game-cover { display: flex; align-items: end; min-height: 180px; padding: 18px; background: linear-gradient(145deg, #123b3c, #0d1727 60%, #1c6470); }
.game-cover[data-accent='violet'] { background: linear-gradient(145deg, #33235b, #151326 60%, #6f4fa0); }
.game-cover[data-accent='amber'] { background: linear-gradient(145deg, #51311c, #18131a 60%, #9b5428); }
.game-cover[data-accent='blue'] { background: linear-gradient(145deg, #193957, #0c1728 60%, #245e8d); }
.game-cover span { padding: 6px 9px; border: 1px solid rgba(255, 255, 255, .18); border-radius: 999px; font-size: 12px; background: rgba(4, 10, 19, .55); }
.game-card-body { padding: 20px; }
.game-card h2 { margin: 0; font-size: 21px; }
.game-card p { min-height: 52px; margin: 10px 0 18px; color: #9aa8bd; line-height: 1.6; }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-row span { padding: 5px 9px; border-radius: 999px; color: #b8c4d5; font-size: 12px; background: #1b2940; }
.empty-state { max-width: 1240px; margin: 80px auto; text-align: center; }
.empty-state h2 { margin-bottom: 8px; }
.empty-state p { color: #9aa8bd; }
@media (max-width: 720px) { .catalog-page { padding-top: 40px; } .catalog-header { align-items: stretch; flex-direction: column; } .search-field { width: 100%; } }
</style>
