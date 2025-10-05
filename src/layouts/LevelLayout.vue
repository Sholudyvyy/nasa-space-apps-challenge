<template>
  <div class="level">
    <div class="content">
      <section class="panel game-panel">
        <img class="border" src="/src/assets/images/game-border.png" />
        <div class="inner">
          <slot>
            <div class="placeholder">Game goes here</div>
          </slot>
        </div>
      </section>

      <aside class="panel chat-panel">
        <img class="border" src="/src/assets/images/chat-border.png" />
        <div class="inner">
          <slot name="chat">
            <div class="placeholder">Chat goes here</div>
          </slot>
        </div>
      </aside>
    </div>

    <div class="bottom-nav">
      <button class="nav-btn" :disabled="!canGoPrev" @click="goPrev">Prev</button>
      <div class="nav-status">Level {{ currentLevelDisplay }}</div>
      <button class="nav-btn" :disabled="!canGoNext" @click="goNext">Next</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
</script>

<style scoped>
.level {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  color: azure;
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
  --border-padding: 4rem;
  /* Distance from border to content */
  --panel-width: 650px;
  /* Total panel width */
  --panel-height: 600px;
  /* Total panel height */

  width: var(--panel-width);
  height: var(--panel-height);
}

.chat-panel {
  --border-padding: 2.5rem;
  /* Distance from border to content */
  --panel-width: 300px;
  /* Total panel width */
  --panel-height: 600px;
  /* Total panel height */

  width: var(--panel-width);
  height: var(--panel-height);
}

/* Inner content with padding */
.inner {
  width: 100%;
  height: 100%;
  padding: var(--border-padding);
  box-sizing: border-box;
}

.placeholder {
  padding: 40px;
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
</style>
