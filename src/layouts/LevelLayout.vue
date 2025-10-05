<template>
  <div class="level">
    <button class="menu-btn" @click="goMenu">Menu</button>
    <!-- Points Counter -->
    <div class="points-counter">
      <div class="points-content">
        <span class="points-label">Score</span>
        <span class="points-value">{{ currentPoints }}</span>
        <span class="best-score-label">Best: {{ bestScore }}</span>
      </div>
    </div>

    <div class="content">
      <section class="panel game-panel">
        <img class="border" src="/src/assets/images/game-border.png" />
        <div class="inner">
          <slot class="game-content">
            <div class="placeholder">Game goes here</div>
          </slot>
        </div>
      </section>
    </div>

    <div class="chat-panel">
      <slot name="chat">
      </slot>
    </div>

    <div class="bottom-nav">
      <button class="nav-btn" :disabled="!canGoPrev" @click="goPrev">Prev</button>
      <div class="nav-status">Level {{ currentLevelDisplay }}</div>
      <button class="nav-btn" :disabled="!canGoNext" @click="goNext">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Props
const props = defineProps({
  levelId: {
    type: [String, Number],
    required: true
  }
})

// Points state
const currentPoints = ref(0)
const bestScore = ref(0)

// Load points for this specific level
const loadPoints = () => {
  const currentKey = `currentPoints_level${props.levelId}`
  currentPoints.value = parseInt(sessionStorage.getItem(currentKey) || '0')

  try {
    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress') || '{}')
    const levelKey = `level${props.levelId}`
    bestScore.value = levelsProgress[levelKey]?.currentPoint || 0
  } catch (error) {
    console.error('Error loading levelsProgress:', error)
    bestScore.value = 0
  }
}

// Listeners for points updates
const handleStorageChange = (e) => {
  if (e.key === 'levelsProgress') {
    loadPoints()
  }
}

const handlePointsUpdate = (e) => {
  if (e.detail && e.detail.levelId === props.levelId) {
    loadPoints()
  }
}

let intervalId
onMounted(() => {
  const currentKey = `currentPoints_level${props.levelId}`
  sessionStorage.setItem(currentKey, '0')
  loadPoints()

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('points-updated', handlePointsUpdate)

  // Poll for same-window updates
  intervalId = setInterval(loadPoints, 100)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('points-updated', handlePointsUpdate)
  if (intervalId) clearInterval(intervalId)
})

// Navigation / level progression
const route = useRoute()
const router = useRouter()

function parseCurrentLevel() {
  const match = route.path.match(/\/level(\d+)/)
  return match ? parseInt(match[1], 10) : NaN
}

function getCompletedSet() {
  try {
    const raw = localStorage.getItem('levelsCompleted')
    const arr = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch (_) {
    return new Set()
  }
}

function getHighestUnlockedPairEnd() {
  let highestEnd = 2
  const completed = getCompletedSet()
  const pairStarts = [1, 3, 5, 7]
  for (let i = 0; i < pairStarts.length; i++) {
    const a = pairStarts[i]
    const b = a + 1
    if (i === 0) {
      if (completed.has(a) && completed.has(b)) {
        highestEnd = b
        continue
      } else {
        highestEnd = 2
        break
      }
    } else {
      const prevA = pairStarts[i - 1]
      const prevB = prevA + 1
      const prevDone = completed.has(prevA) && completed.has(prevB)
      if (!prevDone) break
      highestEnd = b
      const currDone = completed.has(a) && completed.has(b)
      if (!currDone) break
    }
  }
  return highestEnd
}

const currentLevel = computed(() => parseCurrentLevel())
const highestEnd = computed(() => getHighestUnlockedPairEnd())

const canGoPrev = computed(() => {
  const n = currentLevel.value
  if (!Number.isFinite(n)) return false
  return n > 1
})

const canGoNext = computed(() => {
  const n = currentLevel.value
  if (!Number.isFinite(n)) return false
  return n + 1 <= highestEnd.value
})

const currentLevelDisplay = computed(() => {
  const n = currentLevel.value
  return Number.isFinite(n) ? n : '-'
})

function navigateToLevel(n) {
  if (!Number.isFinite(n)) return
  try {
    sessionStorage.setItem('allowLevelNav', String(Date.now()))
  } catch (_) {}
  router.push(`/level${n}`)
}

function goPrev() {
  const n = currentLevel.value
  if (Number.isFinite(n) && n > 1) navigateToLevel(n - 1)
}

function goNext() {
  const n = currentLevel.value
  if (Number.isFinite(n) && n + 1 <= highestEnd.value) navigateToLevel(n + 1)
}

function goMenu() {
  router.push('/')
}
</script>

<style scoped>
.level {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  color: azure;

  margin: 20px;
  margin-left: 80px;
  position: relative;
}

.points-counter {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10000;
  pointer-events: none;
}

.points-content {
  pointer-events: auto;
  background: linear-gradient(135deg, rgba(20, 30, 50, 0.9), rgba(30, 40, 60, 0.9));
  border: 2px solid rgba(74, 158, 255, 0.5);
  border-radius: 12px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(74, 158, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: glow-pulse 3s ease-in-out infinite;
}

.points-label {
  color: rgba(106, 179, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.points-value {
  color: #fff;
  font-size: 1.75rem;
  font-weight: bold;
  text-shadow: 
    0 2px 8px rgba(74, 158, 255, 0.8),
    0 0 15px rgba(74, 158, 255, 0.5);
  transition: all 0.3s ease;
}

.best-score-label {
  color: rgba(255, 215, 0, 0.9);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 2px;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(74, 158, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 4px 25px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(74, 158, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

.content {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.panel {
  position: relative;
  display: flex;
}

.border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  object-fit: fill;
}

/* Adjust these values */
.game-panel {
  /* Total panel width */
  --panel-height: 600px;
  height: var(--panel-height);
}

.chat-panel {
  flex: 1;
}

/* Inner content with padding */
.inner {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.placeholder {
  color: #aaa;
  font-size: 1rem;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(10, 15, 30, 0.6);
  border: 1px solid rgba(120, 160, 255, 0.25);
  border-radius: 9999px;
  padding: 8px 14px;
  backdrop-filter: blur(6px);
}

.nav-btn {
  padding: 8px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(120, 180, 255, 0.35);
  background: #1a2a55;
  color: #e8f3ff;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-status {
  color: #cfe0ff;
  font-weight: 700;
}

.menu-btn {
  position: absolute;
  top: 5px;
  left: 650px;
  padding: 8px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(120, 180, 255, 0.35);
  background: #1a2a55;
  color: #e8f3ff;
  cursor: pointer;
  z-index: 10001;
}

.game-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
