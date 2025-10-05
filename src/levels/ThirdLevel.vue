<template>
  <LevelLayout :levelId="3">
    <img
      src="@/assets/images/s/fall.jpg"
      alt="third-level"
      class="level-image"
    />

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
const LEVEL_ID = 3;

const messageTexts = [
  { type: 'message', text: 'Level 3 — Satellite-Based Drought Monitoring for Crop Loss Forecasting 🌾🛰️' },
  { type: 'message', text: 'This quiz uses NASA Earth Observation data (MODIS) and indices for agricultural drought and crop yield forecasting. Choose the best answer for each question.' },
  {
    type: 'quiz',
    question: 'Q1. Which NASA sensor on Terra & Aqua provides Land Surface Reflectance and LST for many drought indices?',
    variants: [
      { type: 'text', content: 'A) Landsat Thematic Mapper (TM)' },
      { type: 'text', content: 'B) Gravity Recovery and Climate Experiment (GRACE)' },
      { type: 'text', content: 'C) Moderate Resolution Imaging Spectroradiometer (MODIS)' },
      { type: 'text', content: 'D) Global Precipitation Measurement (GPM)' }
    ],
    correctIndex: 2,
    points: 20,
    correctMessage: 'Correct! MODIS provides key reflectance and LST inputs.',
    wrongMessage: 'Not quite. Hint: It\'s the MODIS instrument on Terra/Aqua.'
  },
  {
    type: 'quiz',
    question: 'Q2. Which composite index is widely used for ag. drought monitoring and predicting crop yield loss (combining vegetation health and thermal stress)?',
    variants: [
      { type: 'text', content: 'A) Vegetation Health Index (VHI)' },
      { type: 'text', content: 'B) Standardized Precipitation Index (SPI)' },
      { type: 'text', content: 'C) Normalized Difference Vegetation Index (NDVI)' },
      { type: 'text', content: 'D) Normalized Difference Water Index (NDWI)' }
    ],
    correctIndex: 0,
    points: 20,
    correctMessage: 'Correct! VHI combines vegetation and temperature conditions.',
    wrongMessage: 'Try again. The composite index is VHI.'
  },
  {
    type: 'quiz',
    question: 'Q3. VHI combines two components. Which assesses the relative “greenness” by comparing current to historical min/max?',
    variants: [
      { type: 'text', content: 'A) Temperature Condition Index (TCI)' },
      { type: 'text', content: 'B) Vegetation Condition Index (VCI)' },
      { type: 'text', content: 'C) Land Surface Temperature (LST)' },
      { type: 'text', content: 'D) Normalized Difference Drought Index (NDDI)' }
    ],
    correctIndex: 1,
    points: 20,
    correctMessage: 'Correct! VCI measures relative greenness vs historical bounds.',
    wrongMessage: 'Close. The vigor component is VCI.'
  },
  {
    type: 'quiz',
    question: 'Q4. NDVI is computed from red and NIR reflectance. A value near +1.0 typically indicates…',
    variants: [
      { type: 'text', content: 'A) Bare soil or open water' },
      { type: 'text', content: 'B) Low water content in canopy (water stress)' },
      { type: 'text', content: 'C) Severe drought and poor vegetation health' },
      { type: 'text', content: 'D) Dense and healthy vegetation cover' }
    ],
    correctIndex: 3,
    points: 20,
    correctMessage: 'Correct! High NDVI corresponds to dense, healthy vegetation.',
    wrongMessage: 'Not this time. High NDVI means dense, healthy vegetation.'
  },
  {
    type: 'quiz',
    question: 'Q5. What is the primary goal of indices like VHI, NDWI, and VCI in ag. monitoring (e.g., FEWS NET, GEO GLAM)?',
    variants: [
      { type: 'text', content: 'A) Track glaciers and polar ice caps' },
      { type: 'text', content: 'B) Measure atmospheric CO2 concentration' },
      { type: 'text', content: 'C) Monitor crop health, detect early drought, forecast yield loss' },
      { type: 'text', content: 'D) Predict hurricane track and intensity' }
    ],
    correctIndex: 2,
    points: 20,
    correctMessage: 'Correct! These indices help monitor crops and forecast impacts.',
    wrongMessage: 'Hint: It\'s about monitoring crops and forecasting yield loss.'
  },
  { type: 'message', text: 'Great job! You\'ve completed the drought monitoring quiz.' }
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
