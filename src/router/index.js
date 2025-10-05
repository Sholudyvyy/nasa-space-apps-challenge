import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../levels/Menu.vue'
import Level0 from '../levels/ZeroLevel.vue'
import FirstLevel from '../levels/FirstLevel.vue'
import SeconLevel from '../levels/SeconLevel.vue'
import ThirdLevel from '../levels/ThirdLevel.vue'
import FourthLevel from '../levels/FourthLevel.vue'
import FifthLevel from '../levels/FifthLevel.vue'
import SixthLevel from '../levels/SixthLevel.vue'
import SeventhLevel from '../levels/SeventhLevel.vue'
import EighthLevel from '../levels/EighthLevel.vue'
import NotFound from '../components/NotFound.vue'
import SeasonsLevels from '../components/SeasonsLevels.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/level0',
      name: 'Level0',
      component: Level0
    },
    {
      path: '/level1',
      name: 'FirstLevel',
      component: FirstLevel
    },
    {
      path: '/level2',
      name: 'SeconLevel',
      component: SeconLevel
    },
    {
      path: '/level3',
      name: 'ThirdLevel',
      component: ThirdLevel
    },
    {
      path: '/level4',
      name: 'FourthLevel',
      component: FourthLevel
    },
    {
      path: '/level5',
      name: 'FifthLevel',
      component: FifthLevel
    },
    {
      path: '/level6',
      name: 'SixthLevel',
      component: SixthLevel
    },
    {
      path: '/level7',
      name: 'SeventhLevel',
      component: SeventhLevel
    },
    {
      path: '/level8',
      name: 'EighthLevel',
      component: EighthLevel
    },
    {
      path: '/levels',
      name: 'Levels',
      component: SeasonsLevels
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

// Helper: check if path is a level route like /level1, /level2, ...
function isLevelRoute(path) {
  return /^\/level\d+$/.test(path)
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

// Pair-based unlocking: [1,2] open by default; next pair opens only when previous pair fully completed
function getHighestUnlockedPairEnd() {
  // Base unlocked pair is [1,2]
  let highestEnd = 2
  const completed = getCompletedSet()
  const pairStarts = [1, 3, 5, 7]
  for (let i = 0; i < pairStarts.length; i++) {
    const a = pairStarts[i]
    const b = a + 1
    if (i === 0) {
      // first pair is unlocked by default; if both completed, we can advance
      if (completed.has(a) && completed.has(b)) {
        highestEnd = b
        continue
      } else {
        highestEnd = 2
        break
      }
    } else {
      // subsequent pair is considered unlocked only if previous pair fully completed
      const prevA = pairStarts[i - 1]
      const prevB = prevA + 1
      const prevDone = completed.has(prevA) && completed.has(prevB)
      if (!prevDone) break
      highestEnd = b
      // if current pair not completed, we still stop here; it's the highest unlocked end
      const currDone = completed.has(a) && completed.has(b)
      if (!currDone) break
    }
  }
  return highestEnd
}

function isLevelAllowedByProgress(levelNumber) {
  if (levelNumber === 0) return true
  const highestEnd = getHighestUnlockedPairEnd()
  return levelNumber <= highestEnd
}

// Trigger hyperspace effect before navigating to the next level
router.beforeEach(async (to, from) => {
  // Block direct URL entry to level routes unless explicitly allowed by a prior click
  if (isLevelRoute(to.path)) {
    const fromIsLevel = !!from?.path && isLevelRoute(from.path)
    try {
      const tokenRaw = sessionStorage.getItem('allowLevelNav')
      const token = tokenRaw ? parseInt(tokenRaw, 10) : 0
      const now = Date.now()
      const isFresh = token && now - token < 3000 // 3s validity
      // Consume token regardless to avoid reuse
      sessionStorage.removeItem('allowLevelNav')
      // If coming from another level, allow without token; otherwise require fresh token
      if (!fromIsLevel && !isFresh) {
        return { name: 'Menu' }
      }
      // Also enforce pair-based unlock based on progress
      const match = to.path.match(/\/level(\d+)/)
      const levelNumber = match ? parseInt(match[1], 10) : NaN
      if (!Number.isNaN(levelNumber) && !isLevelAllowedByProgress(levelNumber)) {
        return { name: 'Levels' }
      }
    } catch (_) {
      return { name: 'Menu' }
    }
  }

  // Skip on initial load or when navigating to the same route
  if (!from.name || to.fullPath === from.fullPath) {
    return true
  }

  const durationMs = 900
  try {
    window.dispatchEvent(new CustomEvent('hyperspace-start', { detail: { durationMs } }))
  } catch (e) {
    // no-op if window not available (SSR), just proceed
  }

  await new Promise((resolve) => setTimeout(resolve, durationMs))
  return true
})

router.afterEach(() => {
  try {
    window.dispatchEvent(new CustomEvent('hyperspace-end'))
  } catch (e) {
    // no-op
  }
})

export default router
