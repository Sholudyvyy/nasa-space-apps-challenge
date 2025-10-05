<template>
  <LevelLayout :levelId="7">
    <div class="image-container">
      <img
        src="@/assets/images/s/fall.jpg"
        alt="seventh-level"
        class="level-image"
      />
      <div class="image-link-container">
        <a href="https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/sar" target="_blank" class="image-link">
          SAR website
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
              <img
                :src="msg.src"
                :alt="msg.alt || 'Image'"
                class="message-image"
              />
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
import LevelLayout from "@/layouts/LevelLayout.vue";
import Message from "@/components/Message.vue";
import Quiz from "@/components/Quiz.vue";
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Set page title
document.title = "Cryo Storage - Level 7";

const LEVEL_ID = 7;

const messageTexts = [
  { type: "message", text: "In winter, conventional optical satellites (such as Landsat) are often blocked by clouds or snow." },
  { type: "message", text: "One more challenge!" },
  {
    type: "quiz",
    question: "What technology used on satellites (such as Sentinel-1 or the upcoming NISAR) allows them to “see” through clouds, smoke, and at night, and is particularly useful for monitoring winter crops in winter?",
    variants: [
      { type: "text", content: "Hyperspectral imaging" },
      { type: "text", content: "Synthetic aperture radar (SAR)" },
      { type: "text", content: "Thermal infrared imaging" },
      { type: "text", content: "High-speed GPS receivers" },
    ],
    correctIndex: 1,
    points: 25,
    correctMessage: "You are right!",
    wrongMessage: "You almost succeeded!",
  },
  {
    type: "quiz",
    question: "Go to the interactive platform NASA EOSDIS Worldview. Find and activate the data layer that shows the level of snow cover, and set the date to a winter month. Which satellite is most often used to create this layer due to its ability to see large areas every day?",
    variants: [
      { type: "text", content: "SMAP" },
      { type: "text", content: "MODIS" },
      { type: "text", content: "SRTM" },
      { type: "text", content: "Landsat" },
    ],
    correctIndex: 1,
    points: 25,
    correctMessage: "Yes, yes, well done!",
    wrongMessage: "Almost, almost, you are close!",
  },
  {
    type: "quiz",
    question: "How can satellites that measure Earth's mass and gravity (e.g., GRACE missions) help agronomists estimate snow water equivalent (SWE) in large agricultural basins?",
    variants: [
      { type: "text", content: "They measure the color of water in the soil." },
      { type: "text", content: "They provide direct photographs of snow." },
      { type: "text", content: "They measure changes in the gravitational field caused by large masses of water/snow." },
      { type: "text", content: "They measure the air temperature above the snow." },
    ],
    correctIndex: 2,
    points: 25,
    correctMessage: "Well done, that's right!",
    wrongMessage: "Very close! Well done!",
  },
  {
    type: "quiz",
    question: " Radar data (SAR) is sensitive to the dielectric properties of the surface. What happens to the SAR signal when the soil around the roots of winter crops freezes, compared to when it is thawed?",
    variants: [
      { type: "text", content: "The SAR signal remains unchanged; it is not sensitive to temperature." },
      { type: "text", content: "The SAR signal becomes weaker because frozen water is a better absorber." },
      { type: "text", content: "The SAR signal usually becomes stronger (brighter) because ice is a better scatterer, which helps to monitor these phases." },
      { type: "text", content: "The SAR image simply disappears." },
    ],
    correctIndex: 2,
    points: 25,
    correctMessage: "Keep it up!",
    wrongMessage: "Almost, just a little more",
  },
  { type: "message", text: "Fantastic! You're nearing the finish line!" },
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
  console.log("✅ Correct answer!");
  hasActiveQuiz.value = false;

  try {
    const currentKey = `currentPoints_level${LEVEL_ID}`;
    const currentPoints = parseInt(sessionStorage.getItem(currentKey) || "0");
    const newPoints = currentPoints + points;
    sessionStorage.setItem(currentKey, newPoints.toString());
    console.log(
      `🎯 Level ${LEVEL_ID}: Added ${points} points! Current: ${newPoints}`
    );

    const levelsProgress = JSON.parse(
      localStorage.getItem("levelsProgress") || "{}"
    );
    const levelKey = `level${LEVEL_ID}`;

    if (!levelsProgress[levelKey]) {
      levelsProgress[levelKey] = { maxPoint: 100, currentPoint: null };
    }

    const bestScore = levelsProgress[levelKey].currentPoint || 0;
    if (newPoints > bestScore) {
      levelsProgress[levelKey].currentPoint = newPoints;
      localStorage.setItem("levelsProgress", JSON.stringify(levelsProgress));
      console.log(`🏆 Level ${LEVEL_ID}: New best score: ${newPoints}!`);
    }

    window.dispatchEvent(
      new CustomEvent("points-updated", { detail: { levelId: LEVEL_ID } })
    );
  } catch (error) {
    console.error("Error saving points:", error);
  }

  replaceQuizWithMessage(quizId, correctMessage);
}

function handleWrongAnswer(quizId, wrongMessage) {
  console.log("❌ Wrong answer!");
  hasActiveQuiz.value = false;
  replaceQuizWithMessage(quizId, wrongMessage);
}

function replaceQuizWithMessage(quizId, messageText) {
  setTimeout(() => {
    const index = shownMessages.value.findIndex((msg) => msg.id === quizId);
    if (index !== -1) {
      shownMessages.value[index] = {
        id: quizId,
        type: "message",
        text: messageText,
      };
    }
  }, 1500);
}

function handleKeydown(e) {
  if (e.key === "Enter") {
    if (hasActiveQuiz.value) {
      console.log("⚠️ Please answer the quiz before continuing");
      return;
    }

    if (currentIndex.value < messageTexts.length) {
      if (shownMessages.value.length >= 4) {
        shownMessages.value.shift();
      }

      const nextMessage = {
        id: messageIdCounter++,
        ...messageTexts[currentIndex.value],
      };
      shownMessages.value.push(nextMessage);
      currentIndex.value += 1;

      if (nextMessage.type === "quiz") {
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
    const levelsCompleted = JSON.parse(
      localStorage.getItem("levelsCompleted") || "[]"
    );
    if (!levelsCompleted.includes(LEVEL_ID)) {
      levelsCompleted.push(LEVEL_ID);
      localStorage.setItem("levelsCompleted", JSON.stringify(levelsCompleted));
      console.log(`✅ Level ${LEVEL_ID} completed and saved!`);
    }
    sessionStorage.setItem("allowLevelNav", Date.now().toString());
    setTimeout(() => {
      router.push(`/level${LEVEL_ID + 1}`);
    }, 1000);
  } catch (error) {
    console.error("Error saving level completion:", error);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  nextTick().then(scrollToBottom);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
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
  background: linear-gradient(
    180deg,
    rgba(74, 158, 255, 0.6),
    rgba(106, 179, 255, 0.8)
  );
  border-radius: 10px;
  border: 1px solid rgba(74, 158, 255, 0.3);
  box-shadow: 0 0 10px rgba(74, 158, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(74, 158, 255, 0.8),
    rgba(106, 179, 255, 1)
  );
  box-shadow: 0 0 15px rgba(74, 158, 255, 0.7), 0 0 25px rgba(74, 158, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.chat-list::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    rgba(106, 179, 255, 1),
    rgba(74, 158, 255, 0.9)
  );
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
  0%,
  100% {
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
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.image-link:hover {
  color: #fff;
  background: rgba(255, 215, 0, 0.2);
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.image-link:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
