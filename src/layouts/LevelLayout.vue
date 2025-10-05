<template>
  <div class="level">
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
  </div>
</template>

<script setup>
import Message from '@/components/Message.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  levelId: {
    type: [String, Number],
    required: true
  }
});

const currentPoints = ref(0);
const bestScore = ref(0);

// Load points from storage for this specific level
const loadPoints = () => {
  const currentKey = `currentPoints_level${props.levelId}`;
  currentPoints.value = parseInt(sessionStorage.getItem(currentKey) || '0');
  
  // Load best score from levelsProgress
  try {
    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress') || '{}');
    const levelKey = `level${props.levelId}`;
    bestScore.value = levelsProgress[levelKey]?.currentPoint || 0;
  } catch (error) {
    console.error('Error loading levelsProgress:', error);
    bestScore.value = 0;
  }
};

// Listen for storage changes (when points are updated)
const handleStorageChange = (e) => {
  if (e.key === 'levelsProgress') {
    loadPoints();
  }
};

// Custom event listener for same-window updates
const handlePointsUpdate = (e) => {
  // Only update if the event is for this level
  if (e.detail && e.detail.levelId === props.levelId) {
    loadPoints();
  }
};

onMounted(() => {
  // Initialize current points to 0 for new session for this level
  const currentKey = `currentPoints_level${props.levelId}`;
  sessionStorage.setItem(currentKey, '0');
  loadPoints();
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('points-updated', handlePointsUpdate);
  
  // Poll for changes every 100ms to catch same-window updates
  const interval = setInterval(loadPoints, 100);
  
  onBeforeUnmount(() => {
    clearInterval(interval);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange);
  window.removeEventListener('points-updated', handlePointsUpdate);
});
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

.game-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
