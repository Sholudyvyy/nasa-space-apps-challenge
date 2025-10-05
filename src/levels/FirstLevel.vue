<template>
  <LevelLayout :levelId="1">
    <img
      src="@/assets/images/s/Spring.jpg"
      alt="first-level"
      class="first-level__image"
    />

    <template #chat>
      <div class="chat-content">
        <div class="chat-list" ref="chatListRef">
          <template v-for="(msg, index) in shownMessages" :key="msg.id">
            <div v-if="msg.type === 'message'" class="message-wrapper">
              <Message
                :text="msg.text"
                type="info"
                :enableTyping="true"
                @typingComplete="scrollToBottom"
              />
              <div class="enter-hint" v-if="!hasActiveQuiz && index === shownMessages.length - 1">Press Enter ⏎</div>
            </div>
            <div v-else-if="msg.type === 'img'" class="message-image-container">
              <img :src="msg.src" :alt="msg.alt || 'Image'" class="message-image" />
              <div class="enter-hint" v-if="!hasActiveQuiz && index === shownMessages.length - 1">Press Enter ⏎</div>
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

// Level ID for this level
const LEVEL_ID = 1;

// Message data (edit as needed)
// Supported types:
// - 'message': { type: 'message', text: 'text here' }
// - 'img': { type: 'img', src: '/path/to/image', alt: 'description' }
// - 'quiz': { type: 'quiz', question: 'question text', variants: [{type: 'text'|'img', content: '...'}], correctIndex: 0, correctMessage: 'text', wrongMessage: 'text' }
const messageTexts = [
  { type: 'message', text: 'Привет! Это первое сообщение.' },
  { type: 'message', text: 'Нажми Enter, чтобы увидеть следующее сообщение.' },
  { type: 'message', text: 'Сообщения появляются сверху стека.' },
  { type: 'img', src: '/src/assets/images/moskot/moskot.png', alt: 'Maskot' },
  { 
    type: 'quiz',
    question: 'Какое время года изображено на картинке?',
    variants: [
      { type: 'text', content: 'Весна' },
      { type: 'text', content: 'Лето' },
      { type: 'text', content: 'Осень' },
      { type: 'text', content: 'Зима' }
    ],
    correctIndex: 0,
    points: 15,
    correctMessage: 'Правильно! Это весна! 🌸',
    wrongMessage: 'Неправильно! На картинке изображена весна. Попробуй еще раз!'
  },
  { type: 'message', text: 'Компонент Message печатает текст с эффектом.' },
  { 
    type: 'quiz',
    question: 'Выберите правильное изображение маскота:',
    variants: [
      { type: 'img', content: '/src/assets/images/moskot/moskot.png', alt: 'Maskot' },
      { type: 'img', content: '/src/assets/images/moskot/moskot1.png', alt: 'Maskot 1' }
    ],
    correctIndex: 0,
    points: 20,
    correctMessage: 'Отлично! Это правильный маскот! ✨',
    wrongMessage: 'Ой, не совсем! Попробуй другой вариант.'
  },
  { type: 'message', text: 'Компонент Message печатает текст с эффектом.' },
  { type: 'message', text: 'Удачи на уровне!' }
];

let messageIdCounter = 0;

const shownMessages = ref([{ id: messageIdCounter++, ...messageTexts[0] }]);
const currentIndex = ref(1);
const chatListRef = ref(null);
const hasActiveQuiz = ref(false); // Track if there's an unanswered quiz

// shownMessages will be maintained at max 4 items by dropping the oldest

function scrollToBottom() {
  const el = chatListRef.value;
  if (el) {
    // Use smooth scroll to show the latest message
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }
}

function handleCorrectAnswer(quizId, correctMessage, points) {
  console.log('✅ Correct answer!');
  hasActiveQuiz.value = false; // Allow Enter key again
  
  // Add points to session score for this level
  try {
    const currentKey = `currentPoints_level${LEVEL_ID}`;
    
    const currentPoints = parseInt(sessionStorage.getItem(currentKey) || '0');
    const newPoints = currentPoints + points;
    sessionStorage.setItem(currentKey, newPoints.toString());
    console.log(`🎯 Level ${LEVEL_ID}: Added ${points} points! Current: ${newPoints}`);
    
    // Check if current score beats best score for this level in levelsProgress
    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress') || '{}');
    const levelKey = `level${LEVEL_ID}`;
    
    if (!levelsProgress[levelKey]) {
      levelsProgress[levelKey] = { maxPoint: 100, currentPoint: null };
    }
    
    const bestScore = levelsProgress[levelKey].currentPoint || 0;
    if (newPoints > bestScore) {
      levelsProgress[levelKey].currentPoint = newPoints;
      localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
      console.log(`🏆 Level ${LEVEL_ID}: New best score: ${newPoints}!`);
    }
    
    // Dispatch custom event to notify points counter with level ID
    window.dispatchEvent(new CustomEvent('points-updated', { 
      detail: { levelId: LEVEL_ID } 
    }));
  } catch (error) {
    console.error('Error saving points:', error);
  }
  
  replaceQuizWithMessage(quizId, correctMessage);
}

function handleWrongAnswer(quizId, wrongMessage) {
  console.log('❌ Wrong answer!');
  hasActiveQuiz.value = false; // Allow Enter key again
  replaceQuizWithMessage(quizId, wrongMessage);
}

function replaceQuizWithMessage(quizId, messageText) {
  // Wait for animation to complete before replacing quiz with message
  setTimeout(() => {
    // Find the quiz in shownMessages and replace it with a message
    const index = shownMessages.value.findIndex(msg => msg.id === quizId);
    if (index !== -1) {
      shownMessages.value[index] = {
        id: quizId, // Keep the same ID to preserve the key
        type: 'message',
        text: messageText
      };
    }
  }, 1500); // 1.5 second delay to show the correct/wrong animation
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    // Prevent Enter if there's an active quiz
    if (hasActiveQuiz.value) {
      console.log('⚠️ Please answer the quiz before continuing');
      return;
    }
    
    if (currentIndex.value < messageTexts.length) {
      // Keep only last 3 before pushing so result is max 4
      if (shownMessages.value.length >= 4) {
        shownMessages.value.shift();
      }
      
      // Add next message to the bottom of the list with unique ID
      const nextMessage = {
        id: messageIdCounter++,
        ...messageTexts[currentIndex.value]
      };
      shownMessages.value.push(nextMessage);
      currentIndex.value += 1;
      
      // Check if the new message is a quiz
      if (nextMessage.type === 'quiz') {
        hasActiveQuiz.value = true;
      }
      
      // Check if this was the last message
      if (currentIndex.value === messageTexts.length) {
        markLevelCompleted();
      }
      
      // Ensure newest message is visible
      nextTick().then(scrollToBottom);
    }
  }
}

function markLevelCompleted() {
  try {
    // Get existing completed levels from localStorage
    const levelsCompleted = JSON.parse(localStorage.getItem('levelsCompleted') || '[]');
    
    // Add level 1 if not already completed
    if (!levelsCompleted.includes(1)) {
      levelsCompleted.push(1);
      localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
      console.log('✅ Level 1 completed and saved!');
    }
    
    // Set token to allow navigation to next level
    sessionStorage.setItem('allowLevelNav', Date.now().toString());
    
    // Navigate to next level (level 2) after a short delay
    setTimeout(() => {
      router.push('/level2');
    }, 1000);
  } catch (error) {
    console.error('Error saving level completion:', error);
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  // Start scrolled to bottom for initial message
  nextTick().then(scrollToBottom);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// Also scroll when messages array changes for any reason
watch(shownMessages, async () => {
  await nextTick();
  scrollToBottom();
});
</script>

<style scoped>
.first-level__image {
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
}

/* Custom Scrollbar Styling */
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
  box-shadow: 
    0 0 10px rgba(74, 158, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(74, 158, 255, 0.8), rgba(106, 179, 255, 1));
  box-shadow: 
    0 0 15px rgba(74, 158, 255, 0.7),
    0 0 25px rgba(74, 158, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.chat-list::-webkit-scrollbar-thumb:active {
  background: linear-gradient(180deg, rgba(106, 179, 255, 1), rgba(74, 158, 255, 0.9));
}

/* Firefox Scrollbar */
.chat-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 158, 255, 0.7) rgba(10, 15, 30, 0.3);
}

/* Minimize inner spacing of Message component for this level */
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
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(74, 158, 255, 0.2);
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
