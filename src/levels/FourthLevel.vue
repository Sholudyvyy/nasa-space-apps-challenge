<template>
  <LevelLayout :levelId="4">
    <div class="image-container">
      <img
        src="@/assets/images/s/winter.jpg"
        alt="fourth-level"
        class="level-image"
      />
      <div class="image-link-container">
        <a
          href="https://landsat.gsfc.nasa.gov/"
          target="_blank"
          class="image-link"
        >
          Landsat Science website
        </a>
      </div>
    </div>

    <template #chat>
      <div class="chat-content">
        <div class="chat-list" ref="chatListRef">
          <template v-for="msg in shownMessages" :key="msg.id">
            <div v-if="msg.type === 'message'" class="message-wrapper">
              <Message
                :text="msg.text"
                type="info"
                :enableTyping="true"
                @typingComplete="scrollToBottom"
              />
              <div class="enter-hint" v-if="!hasActiveQuiz">Press Enter ⏎</div>
            </div>
            <div v-else-if="msg.type === 'img'" class="message-image-container">
              <img :src="msg.src" :alt="msg.alt || 'Image'" class="message-image" />
              <div class="enter-hint" v-if="!hasActiveQuiz">Press Enter ⏎</div>
            </div>
            <Quiz
              v-else-if="msg.type === 'quiz'"
              :question="msg.question"
              :variants="msg.variants"
              :correctIndex="msg.correctIndex"
              :points="msg.points"
              @correct="handleCorrectAnswer(msg.id, msg.correctMessage, $event)"
              @wrong="handleWrongAnswer(msg.id, msg.wrongMessage)"
            />
          </template>
        </div>
      </div>
    </template>
  </LevelLayout>
</template>

<script setup>
import LevelLayout from '@/layouts/LevelLayout.vue';
import Message from '@/components/Message.vue';
import Quiz from '@/components/Quiz.vue';
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Set page title
document.title = "Comet Fertilizer - Level 4";

const LEVEL_ID = 4;

const messageTexts = [
  { type: 'message', text: 'Spectral Analysis of Vegetation and Remote Sensing' },
  {
    type: 'quiz',
    question: 'Which spectral range on satellite images is the most sensitive to a decrease in chlorophyll concentration in plants (indicator of disease or stress)?',
    variants: [
      { type: 'text', content: 'Near-Infrared (NIR) range' },
      { type: 'text', content: 'Thermal Infrared (TIR) range' },
      { type: 'text', content: 'Mid-Infrared (MIR) range' },
      { type: 'text', content: 'Visible Green range' }
    ],
    correctIndex: 0,
    points: 25,
    correctMessage: 'Correct! NIR is most sensitive to chlorophyll decrease.',
    wrongMessage: 'Not quite. The correct answer is Near-Infrared (NIR).'
  },
  {
    type: 'quiz',
    question: 'Healthy leaves have high reflectance in NIR. Which part of the plant is primarily responsible for this high reflectance?',
    variants: [
      { type: 'text', content: 'Epidermis and waxy cuticle' },
      { type: 'text', content: 'Stem and root system' },
      { type: 'text', content: 'Chloroplasts in the cells' },
      { type: 'text', content: 'Internal leaf cell structure (mesophyll)' }
    ],
    correctIndex: 3,
    points: 25,
    correctMessage: 'Correct! The internal leaf mesophyll drives high NIR reflectance.',
    wrongMessage: 'Not quite. It is mainly the mesophyll (internal cell structure).'
  },
  {
    type: 'quiz',
    question: 'Which two satellite missions are primary sources for high-detail spectral analysis of vegetation via NASA Earthdata?',
    variants: [
      { type: 'text', content: 'Landsat and Sentinel-2' },
      { type: 'text', content: 'NOAA and GOES' },
      { type: 'text', content: 'MODIS and ASTER' },
      { type: 'text', content: 'GeoEye and WorldView' }
    ],
    correctIndex: 0,
    points: 30,
    correctMessage: 'Correct! Landsat and Sentinel-2 are widely used for vegetation spectra.',
    wrongMessage: 'Not quite. The correct pair is Landsat and Sentinel-2.'
  },
  {
    type: 'quiz',
    question: 'Which visible spectral range has the greatest absorption by healthy plants due to chlorophyll?',
    variants: [
      { type: 'text', content: 'Ultraviolet (UV)' },
      { type: 'text', content: 'Visible Blue' },
      { type: 'text', content: 'Visible Red' },
      { type: 'text', content: 'Visible Green' }
    ],
    correctIndex: 2,
    points: 20,
    correctMessage: 'Correct! Chlorophyll strongly absorbs in the red range.',
    wrongMessage: 'Not quite. Healthy plants absorb most strongly in the visible red.'
  },
  { type: 'message', text: 'You\'re getting good at this!' }
];

let messageIdCounter = 0;
const shownMessages = ref([{ id: messageIdCounter++, ...messageTexts[0] }]);
const currentIndex = ref(1);
const chatListRef = ref(null);
const hasActiveQuiz = ref(false);

function scrollToBottom() {
  const el = chatListRef.value;
  if (el) {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }
}

function handleCorrectAnswer(quizId, correctMessage, points) {
  hasActiveQuiz.value = false;
  
  try {
    const currentKey = `currentPoints_level${LEVEL_ID}`;
    const currentPoints = parseInt(sessionStorage.getItem(currentKey) || '0');
    const newPoints = currentPoints + points;
    sessionStorage.setItem(currentKey, newPoints.toString());
    
    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress') || '{}');
    const levelKey = `level${LEVEL_ID}`;
    
    if (!levelsProgress[levelKey]) {
      levelsProgress[levelKey] = { maxPoint: 100, currentPoint: null };
    }
    
    const bestScore = levelsProgress[levelKey].currentPoint || 0;
    if (newPoints > bestScore) {
      levelsProgress[levelKey].currentPoint = newPoints;
      localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
    }
    
    window.dispatchEvent(new CustomEvent('points-updated', { detail: { levelId: LEVEL_ID } }));
  } catch (error) {
  }
  
  replaceQuizWithMessage(quizId, correctMessage);
}

function handleWrongAnswer(quizId, wrongMessage) {
  hasActiveQuiz.value = false;
  replaceQuizWithMessage(quizId, wrongMessage);
}

function replaceQuizWithMessage(quizId, messageText) {
  setTimeout(() => {
    const index = shownMessages.value.findIndex(msg => msg.id === quizId);
    if (index !== -1) {
      shownMessages.value[index] = { id: quizId, type: 'message', text: messageText };
    }
  }, 1500);
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    if (hasActiveQuiz.value) {
      return;
    }
    
    if (currentIndex.value < messageTexts.length) {
      if (shownMessages.value.length >= 4) {
        shownMessages.value.shift();
      }
      
      const nextMessage = { id: messageIdCounter++, ...messageTexts[currentIndex.value] };
      shownMessages.value.push(nextMessage);
      currentIndex.value += 1;
      
      if (nextMessage.type === 'quiz') {
        hasActiveQuiz.value = true;
      }
      
      if (currentIndex.value === messageTexts.length) {
        markLevelCompleted();
      }
      
      nextTick().then(scrollToBottom);
    }
  }
}

function markLevelCompleted() {
  try {
    const levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted') || '[]');
    if (!levelsCompleted.includes(LEVEL_ID)) {
      levelsCompleted.push(LEVEL_ID);
      localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
    }
    sessionStorage.setItem('allowLevelNav', Date.now().toString());
    setTimeout(() => {
      router.push(`/level${LEVEL_ID + 1}`);
    }, 1000);
  } catch (error) {
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  nextTick().then(scrollToBottom);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

watch(shownMessages, async () => {
  await nextTick();
  scrollToBottom();
});
</script>

<style scoped>
.level-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-content {
  width: 100%;
  height: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  scroll-behavior: smooth;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 158, 255, 0.7) rgba(10, 15, 30, 0.3);
}

.chat-list::-webkit-scrollbar {
  width: 8px;
}

.chat-list::-webkit-scrollbar-track {
  background: rgba(10, 15, 30, 0.3);
  border-radius: 10px;
  margin: 4px 0;
}

.chat-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(74, 158, 255, 0.6), rgba(106, 179, 255, 0.8));
  border-radius: 10px;
  border: 1px solid rgba(74, 158, 255, 0.3);
  box-shadow: 0 0 10px rgba(74, 158, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(74, 158, 255, 0.8), rgba(106, 179, 255, 1));
  box-shadow: 0 0 15px rgba(74, 158, 255, 0.7), 0 0 25px rgba(74, 158, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.chat-list::-webkit-scrollbar-thumb:active {
  background: linear-gradient(180deg, rgba(106, 179, 255, 1), rgba(74, 158, 255, 0.9));
}

.chat-list :deep(.message-container) {
  padding: 0.5rem;
  min-height: auto;
  flex-shrink: 0;
}

.chat-list :deep(.message-card) {
  padding: 1rem;
  max-width: 100%;
  box-sizing: border-box;
}

.chat-list :deep(.quiz-container) {
  flex-shrink: 0;
}

.message-wrapper {
  position: relative;
  flex-shrink: 0;
}

.message-image-container {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  flex-shrink: 0;
  max-height: 350px;
}

.message-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
}

.enter-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.7rem;
  color: rgba(106, 179, 255, 0.8);
  background: rgba(10, 15, 30, 0.8);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(74, 158, 255, 0.4);
  backdrop-filter: blur(5px);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 10px rgba(74, 158, 255, 0.2);
  animation: hint-pulse 2s ease-in-out infinite;
  pointer-events: none;
  z-index: 10;
}

/* Image container with link (same as Level 1) */
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-link-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.image-link {
  display: inline-block;
  color: #ffd700;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  padding: 10px 20px;
  background: rgba(10, 15, 30, 0.85);
  border: 2px solid #ffd700;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.image-link:hover {
  color: #fff;
  background: rgba(255, 215, 0, 0.2);
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.image-link:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@keyframes hint-pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}
</style>
