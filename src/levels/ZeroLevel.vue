<template>
  <div class="zero-level">
    <!-- Slideshow Section -->
    <div v-if="showSlideshow" class="slideshow" @click="nextSlide">
      <transition name="fade">
        <img
          :key="currentSlide"
          :src="historyImages[currentSlide]"
          alt="Patient History"
          class="slideshow__image"
        />
      </transition>
      <div class="slideshow__hint">
        <span v-if="currentSlide < historyImages.length - 1">
          Click or Press Enter to continue
        </span>
        <span v-else>
          Click or Press Enter to meet Sem
        </span>
      </div>
      <div class="slideshow__counter">
        {{ currentSlide + 1 }} / {{ historyImages.length }}
      </div>
    </div>

    <!-- Message Section -->
    <div v-else class="zero-level__message">
      <Message
        :text="messages[currentMessage].text"
        @typing-complete="showHint"
      />

      <div
        class="hint"
        :class="{ show: showHintText }"
        role="button"
        tabindex="0"
        @click="onHintClick"
      >
        <span v-if="currentMessage < messages.length - 1">Press Enter</span>
        <span v-else>Press Enter to start your first level</span>
      </div>

      <img
        :src="messages[currentMessage].moskotSrc"
        alt="moskot"
        class="moskot"
      >
    </div>
  </div>
</template>

<script setup>
import Message from '@/components/Message.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Set page title
document.title = "Welcome - Meet Sem";

// Import images
import moskot from '@/assets/images/moskot/moskot.png'
import moskot1 from '@/assets/images/moskot/moskot1.png'
import moskot2 from '@/assets/images/moskot/moskot2.png'
import moskot4 from '@/assets/images/moskot/moskot4.png'

// Import history images for slideshow
import history0 from '@/assets/images/history/history-0.png'
import history1 from '@/assets/images/history/history-1.png'
import history2 from '@/assets/images/history/history-2.png'
import history3 from '@/assets/images/history/history-3.png'
import history4 from '@/assets/images/history/history-4.png'
import history5 from '@/assets/images/history/history-5.png'
import history6 from '@/assets/images/history/history-6.png'
import history7 from '@/assets/images/history/history-7.png'
import history8 from '@/assets/images/history/history-8.png'

const historyImages = [
  history0, history1, history2, history3, history4,
  history5, history6, history7, history8
]

const messages = ref([
  { text: 'Hello, I am Sem.', moskotSrc: moskot4 },
  { text: 'I am an astronaut who knows how to use cosmos information to benefit farming.', moskotSrc: moskot2 },
  { text: 'In this game, I will show you real-life examples of how to use NASA data to develop your farm.', moskotSrc: moskot1 },
  { text: '4 seasons, many challenges, and valuable experience. I am here to help you. Let`s start?', moskotSrc: moskot },
])

const router = useRouter()
const showSlideshow = ref(true)
const currentSlide = ref(0)
const currentMessage = ref(0)
const showHintText = ref(false)
const canAdvance = ref(false)

const nextSlide = () => {
  if (currentSlide.value < historyImages.length - 1) {
    currentSlide.value++
  } else {
    // End slideshow and start messages
    showSlideshow.value = false
  }
}

const showHint = () => {
  canAdvance.value = true
  showHintText.value = true
}

const nextMessage = () => {
  if (!canAdvance.value) return
  // consume permission immediately to prevent multiple advances
  canAdvance.value = false
  if (currentMessage.value < messages.value.length - 1) {
    // Hide hint first, then advance message after transition
    showHintText.value = false
    setTimeout(() => {
      currentMessage.value++
    }, 800) // Wait for fade-out transition (0.8s)
  } else {
    // Hide hint first, then navigate after transition
    showHintText.value = false
    setTimeout(() => {
      router.push('/level1')
    }, 800) // Wait for fade-out transition (0.8s)
  }
}

const onKeyDown = (e) => {
  if (e.defaultPrevented) return
  if (e.repeat) return

  const target = e.target
  const isEditable = target && (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
  if (isEditable) return

  const key = e.key
  if (key === 'Enter') {
    e.preventDefault()
    if (showSlideshow.value) {
      nextSlide()
    } else {
      nextMessage()
    }
  }
}

const onHintClick = () => {
  nextMessage()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped lang="scss">
.moskot {
  position: fixed;
  bottom: -50px;
  right: -80px;
  width: 150px;
  height: 150px;
}

// Main Styles
.zero-level {
  &__message {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.hint {
  position: fixed;
  bottom: -5%;
  left: 50%;
  transform: translateX(-50%) translateY(20px) scale(0.9);
  color: #00ffff;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.9));
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 24px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.2),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
  animation: cosmic-hint 3s ease-in-out infinite;
  
  /* Smooth transitions for appearance/disappearance */
  opacity: 0;
  visibility: hidden;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  cursor: default;
}

.hint.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
  pointer-events: auto;
  cursor: pointer;
}

.hint::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(0, 255, 255, 0.1),
    transparent,
    rgba(0, 255, 255, 0.1),
    transparent
  );
  background-size: 200% 200%;
  border-radius: 8px;
  animation: border-flow 4s ease-in-out infinite;
  z-index: -1;
}

.hint::after {
  content: '✦';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #00ffff;
  font-size: 0.8rem;
  animation: star-twinkle 2s ease-in-out infinite;
}

.hint span:last-child::after {
  content: '✦';
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: #00ffff;
  font-size: 0.8rem;
  animation: star-twinkle 2s ease-in-out infinite 1s;
}

@keyframes cosmic-hint {
  0%, 100% {
    opacity: 0.7;
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.2),
      inset 0 0 20px rgba(0, 255, 255, 0.1);
  }
  50% {
    opacity: 1;
    box-shadow: 
      0 0 30px rgba(0, 255, 255, 0.4),
      inset 0 0 30px rgba(0, 255, 255, 0.2);
  }
}

.hint.show:hover {
  transform: translateX(-50%) translateY(-2px) scale(1.02);
  box-shadow:
    0 0 30px rgba(0, 255, 255, 0.35),
    inset 0 0 24px rgba(0, 255, 255, 0.15);
}

.hint.show:active {
  transform: translateX(-50%) translateY(1px) scale(0.98);
  filter: brightness(1.1);
}

@keyframes border-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(-50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
  }
}

/* Slideshow Styles */
.slideshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  cursor: pointer;
  z-index: 1000;
}

.slideshow__image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
  border-radius: 8px;
}

.slideshow__hint {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffff;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.9));
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 24px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.2),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
  animation: cosmic-hint 3s ease-in-out infinite;
}

.slideshow__counter {
  position: fixed;
  top: 5%;
  right: 5%;
  color: #00ffff;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}
</style>
