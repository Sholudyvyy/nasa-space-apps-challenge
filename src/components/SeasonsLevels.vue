<template>
  <div class="seasons-page">
    <header class="page-header">
      <h1>Levels</h1>
      <LevelSelector />
    </header>

    <section class="seasons">
      <div v-for="season in seasons" :key="season.id" class="season-card" :class="{ locked: !season.unlocked }">
        <div class="season-header">
          <h2>{{ season.title }}</h2>
          <span class="season-status">{{ season.unlocked ? season.completedCount + '/' + season.challenges.length + ' completed' : 'Locked' }}</span>
        </div>

        <div class="challenges">
          <div v-for="challenge in season.challenges" :key="challenge.level" class="challenge" :class="{ done: completedSet.has(challenge.level) }">
            <div class="thumb" :style="{ backgroundImage: `url(${challenge.image})` }"></div>
            <div class="meta">
              <div class="row">
                <span class="badge">#{{ challenge.level }}</span>
                <h3 class="title">{{ challenge.title }}</h3>
              </div>
              <p class="desc">{{ challenge.description }}</p>
              <div class="score">Score: <strong>{{ getBestScore(challenge.level) }}</strong></div>
              <div class="actions">
                <button
                  v-if="season.unlocked"
                  class="play"
                  @click="startLevel(challenge.route)"
                >Start</button>
                <button v-else class="locked-btn" disabled>Locked</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import LevelSelector from './LevelSelector.vue'

// Level thumbnails
import L1 from '@/assets/lvls/1lvl.png'
import L2 from '@/assets/lvls/2lvl.png'
import L3 from '@/assets/lvls/3lvl.png'
import L4 from '@/assets/lvls/4lvl.png'
import L5 from '@/assets/lvls/5lvl.png'
import L6 from '@/assets/lvls/6lvl.png'
import L7 from '@/assets/lvls/7lvl.png'
import L8 from '@/assets/lvls/8lvl.png'

const seasonsRaw = [
  {
    id: 1,
    title: 'Season 1 — Spring',
    challenges: [
      { level: 1, title: 'Orbital Sowing', description: 'Plant seeds on a low-orbit farm ring.', image: L1, route: '/level1' },
      { level: 2, title: 'Ion Harvest', description: 'Collect ionized dew as irrigation.', image: L2, route: '/level2' },
    ]
  },
  {
    id: 2,
    title: 'Season 2 — Summer',
    challenges: [
      { level: 3, title: 'Solar Reaping', description: 'Time your harvest with solar flares.', image: L3, route: '/level3' },
      { level: 4, title: 'Comet Fertilizer', description: 'Guide comet dust to enrich fields.', image: L4, route: '/level4' },
    ]
  },
  {
    id: 3,
    title: 'Season 3 — Autumn',
    challenges: [
      { level: 5, title: 'Nebula Sorting', description: 'Sort grains in microgravity.', image: L5, route: '/level5' },
      { level: 6, title: 'Asteroid Thresher', description: 'Use asteroid belts to thresh crops.', image: L6, route: '/level6' },
    ]
  },
  {
    id: 4,
    title: 'Season 4 — Winter',
    challenges: [
      { level: 7, title: 'Cryo Storage', description: 'Store surplus in cryo bins.', image: L7, route: '/level7' },
      { level: 8, title: 'Polar Lights Yield', description: 'Boost growth with aurora energy.', image: L8, route: '/level8' },
    ]
  }
]

function getCompletedSet() {
  try {
    const raw = localStorage.getItem('levelsCompleted')
    const arr = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch (_) {
    return new Set()
  }
}

const storageVersion = ref(0)
function bumpStorageVersion() { storageVersion.value++ }

const completedSet = computed(() => {
  // depend on version so this recomputes when localStorage may have changed
  void storageVersion.value
  return getCompletedSet()
})

const seasons = computed(() => {
  const set = completedSet.value
  const output = seasonsRaw.map(s => {
    const completedCount = s.challenges.filter(c => set.has(c.level)).length
    return { ...s, completedCount }
  })

  // Unlock logic: season 1 always unlocked; next season unlocked only when all previous challenges done
  return output.map((s, idx, arr) => {
    if (idx === 0) return { ...s, unlocked: true }
    const prev = arr[idx - 1]
    const prevComplete = prev.completedCount === prev.challenges.length
    return { ...s, unlocked: prevComplete }
  })
})

const router = useRouter()

function startLevel(route) {
  try {
    // mark as allowed for a short window; router guard will consume it
    sessionStorage.setItem('allowLevelNav', String(Date.now()))
  } catch (_) {}
  router.push(route)
}

function getBestScore(levelNum) {
  // If рівень ще не пройдено, показуємо 0 незалежно від наявних локальних значень
  if (!completedSet.value.has(levelNum)) return 0
  try {
    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress') || '{}')
    const key = `level${levelNum}`
    return levelsProgress[key]?.currentPoint || 0
  } catch (_) {
    return 0
  }
}

onMounted(() => {
  const onStorage = (e) => {
    if (e.key === 'levelsCompleted' || e.key === 'levelsProgress') bumpStorageVersion()
  }
  window.addEventListener('storage', onStorage)
  const onVis = () => { if (!document.hidden) bumpStorageVersion() }
  document.addEventListener('visibilitychange', onVis)
  // initial sync
  bumpStorageVersion()
  // teardown
  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
    document.removeEventListener('visibilitychange', onVis)
  })
})
</script>

<style scoped>
.seasons-page {
  position: fixed;
  inset: 0; /* full viewport */
  overflow: auto; /* enable scrolling inside page */
  padding: 24px 24px 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

h1 { color: #e0ecff; font-weight: 800; letter-spacing: 0.5px; }

.seasons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.season-card {
  background: rgba(12, 16, 28, 0.6);
  border: 1px solid rgba(120, 160, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
}

.season-card.locked {
  opacity: 0.6;
}

.season-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.season-status { color: #9fb3d9; font-size: 14px; }

.challenges {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.challenge {
  display: grid;
  grid-template-columns: 85px 1fr;
  gap: 12px;
  background: rgba(16, 20, 36, 0.6);
  border: 1px solid rgba(80, 120, 220, 0.2);
  border-radius: 12px;
  padding: 10px;
}

.challenge.done { outline: 2px solid rgba(60, 200, 120, 0.6); }

.thumb {
  width: 100%;
  height: 90px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.meta { display: flex; flex-direction: column; gap: 8px; }
.row { display: flex; align-items: center; gap: 8px; }
.badge { background: #0e1220; color: #a7c4ff; border: 1px solid #2a3b6f; border-radius: 9999px; padding: 2px 8px; font-weight: 700; }
.title { color: #e6ebff; font-weight: 800; }
.desc { color: #9db0d8; font-size: 14px; }
.score { color: #a7c4ff; font-size: 14px; }

.actions { margin-top: 4px; }
.play {
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 9999px;
  color: #e8f3ff;
  background: #1a2a55;
  border: 1px solid rgba(120, 180, 255, 0.35);
}
.locked-btn {
  padding: 8px 14px;
  border-radius: 9999px;
  color: #9fb3d9;
  background: #121621;
  border: 1px dashed rgba(120, 160, 255, 0.25);
}

@media (max-width: 900px) {
  .seasons { grid-template-columns: 1fr; }
  .challenge { grid-template-columns: 100px 1fr; }
  .thumb { height: 72px; }
}

@media (max-width: 520px) {
  .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .challenge { grid-template-columns: 88px 1fr; }
  .thumb { height: 64px; }
}
</style>


