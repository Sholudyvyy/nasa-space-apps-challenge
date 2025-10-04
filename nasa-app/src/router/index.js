import { createRouter, createWebHistory } from 'vue-router'
import FirstLevel from '../levels/FirstLevel.vue'
import SeconLevel from '../levels/SeconLevel.vue'
import ThirdLevel from '../levels/ThirdLevel.vue'
import FourthLevel from '../levels/FourthLevel.vue'
import FifthLevel from '../levels/FifthLevel.vue'
import SixthLevel from '../levels/SixthLevel.vue'
import SeventhLevel from '../levels/SeventhLevel.vue'
import EighthLevel from '../levels/EighthLevel.vue'
import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: App
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
    }
  ],
})

export default router
