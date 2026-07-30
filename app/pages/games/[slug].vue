<script setup lang="ts">
import type { PublicGame } from '../../features/game-catalog/domain/game';
import { deriveGameActions, derivePlayerLabels } from '../../features/game-catalog/domain/game-capabilities';

const route = useRoute();
const slug = String(route.params.slug);
const { data, error } = await useApiData<{ game: PublicGame }>(`game-detail-${slug}`, `/api/games/${slug}`);

if (error.value || !data.value?.game) {
  throw createError({ statusCode: 404, statusMessage: '游戏不存在或尚未发布' });
}

const game = computed(() => data.value!.game);
const actions = computed(() => deriveGameActions(game.value));
const labels = computed(() => derivePlayerLabels(game.value.supportedPlayerCounts));

useSeoPage({
  title: game.value.title,
  description: game.value.description,
  path: `/games/${game.value.slug}`,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.value.title,
    description: game.value.description,
    numberOfPlayers: game.value.supportedPlayerCounts.join(', '),
  },
});
</script>

<template>
  <main class="detail-page">
    <NuxtLink class="back-link" to="/games">返回游戏目录</NuxtLink>

    <section class="detail-hero">
      <div class="detail-cover" :data-accent="game.accent">
        <span>{{ game.runtimeLabel }}</span>
      </div>
      <div class="detail-content">
        <p class="eyebrow">精选游戏</p>
        <h1>{{ game.title }}</h1>
        <p class="lead">{{ game.description }}</p>
        <div class="tag-row">
          <span v-for="label in labels" :key="label">{{ label }}</span>
          <span v-if="actions.local">支持同屏</span>
          <span v-if="actions.online">在线联机</span>
        </div>
        <div class="detail-actions">
          <button v-if="actions.solo" type="button" disabled>单人游玩</button>
          <button v-if="actions.local" type="button" disabled>同屏游玩</button>
          <button v-if="actions.online" type="button" disabled>创建在线房间</button>
        </div>
      </div>
    </section>

    <section class="detail-grid">
      <article>
        <h2>游戏简介</h2>
        <p>{{ game.introduction }}</p>
        <h2>开始前准备</h2>
        <p>开始游戏前会检查运行版本、资源完整性和可用输入设备。</p>
      </article>
      <aside>
        <h2>支持能力</h2>
        <dl>
          <div><dt>支持人数</dt><dd>{{ game.supportedPlayerCounts.join('、') }} 人</dd></div>
          <div><dt>运行方式</dt><dd>{{ game.runtimeLabel }}</dd></div>
          <div><dt>输入方式</dt><dd>{{ game.inputLabel }}</dd></div>
          <div><dt>最近更新</dt><dd>{{ game.updatedAt }}</dd></div>
        </dl>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.detail-page { min-height: 100vh; padding: 48px clamp(24px, 6vw, 96px) 80px; color: #f4f7fb; background: #070b14; }
.back-link { display: inline-flex; margin: 0 auto 24px; color: #9aa8bd; text-decoration: none; }
.back-link:hover { color: #5eead4; }
.detail-hero { display: grid; grid-template-columns: minmax(280px, 44%) 1fr; overflow: hidden; max-width: 1240px; margin: 0 auto; border: 1px solid #202d43; border-radius: 22px; background: #111b2c; }
.detail-cover { display: flex; align-items: end; min-height: 430px; padding: 28px; background: linear-gradient(145deg, #123b3c, #0d1727 60%, #1c6470); }
.detail-cover[data-accent='violet'] { background: linear-gradient(145deg, #33235b, #151326 60%, #6f4fa0); }
.detail-cover[data-accent='amber'] { background: linear-gradient(145deg, #51311c, #18131a 60%, #9b5428); }
.detail-cover[data-accent='blue'] { background: linear-gradient(145deg, #193957, #0c1728 60%, #245e8d); }
.detail-cover span { padding: 7px 11px; border: 1px solid rgba(255, 255, 255, .2); border-radius: 999px; background: rgba(4, 10, 19, .55); }
.detail-content { display: flex; align-items: flex-start; justify-content: center; flex-direction: column; padding: clamp(32px, 6vw, 72px); }
.eyebrow { margin: 0 0 12px; color: #5eead4; font-size: 13px; font-weight: 700; letter-spacing: .12em; }
h1 { margin: 0; font-size: clamp(42px, 6vw, 72px); line-height: 1.02; }
.lead { max-width: 680px; margin: 22px 0; color: #a7b3c5; font-size: 18px; line-height: 1.8; }
.tag-row, .detail-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-row span { padding: 6px 10px; border-radius: 999px; color: #c7d3e4; font-size: 13px; background: #1b2940; }
.detail-actions { margin-top: 30px; }
.detail-actions button { padding: 12px 18px; border: 1px solid #30415d; border-radius: 10px; color: #dce5f2; background: #18243a; }
.detail-actions button:first-child { border-color: #5eead4; color: #05201d; background: #5eead4; }
.detail-actions button:disabled { cursor: not-allowed; opacity: .78; }
.detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 22px; max-width: 1240px; margin: 22px auto 0; }
.detail-grid article, .detail-grid aside { padding: 28px; border: 1px solid #202d43; border-radius: 18px; background: #111b2c; }
.detail-grid h2 { margin: 0 0 12px; font-size: 18px; }
.detail-grid p { margin: 0 0 28px; color: #9aa8bd; line-height: 1.8; }
dl { margin: 0; }
dl div { display: flex; justify-content: space-between; gap: 20px; padding: 13px 0; border-bottom: 1px solid #202d43; }
dt { color: #8998ad; } dd { margin: 0; text-align: right; }
@media (max-width: 800px) { .detail-hero, .detail-grid { grid-template-columns: 1fr; } .detail-cover { min-height: 280px; } }
</style>
