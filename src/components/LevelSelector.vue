<template>
  <div class="level-selector">
    <label for="level-select">Select level:</label>
    <select id="level-select" v-model="selectedPath" @change="goToLevel">
      <option v-for="level in levels" :key="level.path" :value="level.path">
        {{ level.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Map available level files to route paths and labels
// Keep in sync with routes in `src/router/index.js`
const levels = computed(() => [
  { path: '/level0', label: 'Level 0' },
  { path: '/level1', label: 'Level 1' },
  { path: '/level2', label: 'Level 2' },
  { path: '/level3', label: 'Level 3' },
  { path: '/level4', label: 'Level 4' },
  { path: '/level5', label: 'Level 5' },
  { path: '/level6', label: 'Level 6' },
  { path: '/level7', label: 'Level 7' },
  { path: '/level8', label: 'Level 8' }
])

const selectedPath = ref('/level0')

onMounted(() => {
  // Initialize selection based on current route if it matches a level
  const current = levels.value.find(l => l.path === route.path)
  if (current) {
    selectedPath.value = current.path
  } else {
    // If on root '/', prefer '/level0'
    if (route.path === '/') selectedPath.value = '/level0'
  }
})

watch(() => route.path, (newPath) => {
  const current = levels.value.find(l => l.path === newPath)
  if (current) selectedPath.value = current.path
})

function goToLevel() {
  if (route.path !== selectedPath.value) {
    router.push(selectedPath.value)
  }
}
</script>

<style scoped>
.level-selector {
  position: fixed;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 1000;
}

label {
  color: #ffffff;
  font-weight: 600;
}

select {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  padding: 6px 10px;
  backdrop-filter: blur(6px);
}

select option {
  color: #000;
}
</style>


