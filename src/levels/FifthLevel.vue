<template>
  <LevelLayout :levelId="5">
    <div class="image-container">
      <img
        src="@/assets/images/s/Spring.jpg"
        alt="fifth-level"
        class="level-image"
      />
      <div class="image-link-container">
        <a
          href="https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/modis/"
          target="_blank"
          class="image-link"
        >
          MODIS website
        </a>
        <a
          href="https://www.earthdata.nasa.gov/data/instruments/viirs"
          target="_blank"
          class="image-link"
        >
          VIIRS website
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
document.title = "Nebula Sorting - Level 5";

const LEVEL_ID = 5;

const messageTexts = [
  { type: 'message', text: 'Level 5 — Weekly Vegetation Monitoring & Yield Forecasting 📈🌿' },
  { type: 'message', text: 'Answer the following questions about MODIS/VIIRS weekly monitoring, NDWI/NDVI, and VHI components.' },
  {
    type: 'quiz',
    question: 'What\'s the main advantage of weekly (vs monthly) MODIS/VIIRS monitoring for yield forecasting?',
    variants: [
      { type: 'text', content: 'It allows for better soil type classification across large regions.' },
      { type: 'text', content: 'It is primarily used for tracking the global movement of dust storms.' },
      { type: 'text', content: 'It enables early detection of short-term stress events (flash droughts/heat waves).' },
      { type: 'text', content: 'It provides a direct measure of average annual rainfall for the whole season.' }
    ],
    correctIndex: 2,
    points: 15,
    correctMessage: 'Correct! Weekly cadence captures short-term stress that impacts crops fast.',
    wrongMessage: 'Not quite. Weekly data helps detect rapid stress events early.'
  },
  {
    type: 'quiz',
    question: 'Unlike NDVI (greenness), what does NDWI primarily assess for early drought detection?',
    variants: [
      { type: 'text', content: 'The total surface area covered by clouds.' },
      { type: 'text', content: 'The concentration of nitrogen in leaf tissue.' },
      { type: 'text', content: 'The amount of solar radiation absorbed by the canopy.' },
      { type: 'text', content: 'The water content within plant tissues (leaves).' }
    ],
    correctIndex: 3,
    points: 20,
    correctMessage: 'Correct! NDWI is sensitive to leaf/canopy water content.',
    wrongMessage: 'Hint: NDWI targets plant water content rather than greenness.'
  },
  {
    type: 'quiz',
    question: 'In VHI, a high Temperature Condition Index (TCI) indicates…',
    variants: [
      { type: 'text', content: 'Favorable thermal conditions and low heat stress.' },
      { type: 'text', content: 'Severe water stress causing transpiration shutdown.' },
      { type: 'text', content: 'The highest LST recorded for the region.' },
      { type: 'text', content: 'The crop has reached peak maturity and harvest readiness.' }
    ],
    correctIndex: 0,
    points: 20,
    correctMessage: 'Correct! High TCI = lower thermal stress, favorable conditions.',
    wrongMessage: 'Close. High TCI means low heat stress.'
  },
  {
    type: 'quiz',
    question: 'Comparing seasonal NDVI to a 20-year average mainly provides what insight?',
    variants: [
      { type: 'text', content: 'The exact number of days the crop was visible above ground.' },
      { type: 'text', content: 'The final market price of the commodity.' },
      { type: 'text', content: 'It quantifies current-season vegetation stress (anomaly) linked to potential yield loss.' },
      { type: 'text', content: 'Helps identify the need for chemical fertilizer application.' }
    ],
    correctIndex: 2,
    points: 25,
    correctMessage: 'Correct! NDVI anomaly vs history correlates with yield impacts.',
    wrongMessage: 'Think anomaly vs historical baseline to assess yield risk.'
  },
  { type: 'message', text: 'Great work! You\'ve completed Level 5.' }
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
<style scoped>
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
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>
