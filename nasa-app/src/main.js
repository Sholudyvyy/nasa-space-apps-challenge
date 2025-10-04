import { createApp } from 'vue'
import App from './levels/FirstLevel.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
