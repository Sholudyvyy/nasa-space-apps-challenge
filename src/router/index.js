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
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

// Trigger hyperspace effect before navigating to the next level
router.beforeEach(async (to, from) => {
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
