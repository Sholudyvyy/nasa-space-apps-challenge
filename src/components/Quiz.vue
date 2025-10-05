<template>
  <div class="quiz-container">
    <div class="quiz-card">
      <div class="quiz-content">
        <p class="quiz-question">{{ question }}</p>
        <div class="quiz-variants">
          <button
            v-for="(variant, index) in variants"
            :key="index"
            class="quiz-variant"
            :class="{ 
              'selected': selectedIndex === index,
              'correct': answered && index === correctIndex,
              'wrong': answered && selectedIndex === index && index !== correctIndex
            }"
            @click="selectVariant(index)"
            :disabled="answered"
          >
            <span v-if="variant.type === 'text'" class="variant-text">
              {{ variant.content }}
            </span>
            <img 
              v-else-if="variant.type === 'img'" 
              :src="variant.content" 
              :alt="variant.alt || 'Variant image'"
              class="variant-image"
            />
          </button>
        </div>
      </div>
      <div class="cosmic-border"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const emit = defineEmits(['correct', 'wrong'])

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  variants: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.length >= 2 && value.length <= 4 &&
        value.every(v => v.type && v.content && ['text', 'img'].includes(v.type))
    }
  },
  correctIndex: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  },
  points: {
    type: Number,
    default: 10
  }
})

const selectedIndex = ref(null)
const answered = ref(false)

const selectVariant = (index) => {
  if (answered.value) return
  
  selectedIndex.value = index
  answered.value = true
  
  if (index === props.correctIndex) {
    emit('correct', props.points)
  } else {
    emit('wrong')
  }
}
</script>

<style scoped lang="scss">
// Variables
$bg-color: #000;
$text-color: #fff;
$border-color: #333;
$glow-color: #4a9eff;
$success-color: #00ff88;
$error-color: #ff4444;

// Animations
@keyframes cosmic-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(74, 158, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(74, 158, 255, 0.6), 0 0 30px rgba(74, 158, 255, 0.3);
  }
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

// Main Styles
.quiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow: visible;
}

.quiz-card {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.8));
  border: 1px solid $border-color;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
  overflow: visible;
  backdrop-filter: blur(10px);
  animation: cosmic-glow 3s ease-in-out infinite;
  box-sizing: border-box;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.1), transparent);
    background-repeat: repeat;
    background-size: 150px 100px;
    pointer-events: none;
  }
}

.quiz-content {
  position: relative;
  z-index: 2;
}

.quiz-question {
  color: $text-color;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.quiz-variants {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: visible;
}

.quiz-variant {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(40, 40, 40, 0.6));
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(40, 40, 40, 0.9), rgba(50, 50, 50, 0.7));
    border-color: rgba(74, 158, 255, 0.6);
    box-shadow: 0 0 15px rgba(74, 158, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  &.correct {
    background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1));
    border-color: $success-color;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
    animation: pulse 0.5s ease-in-out;
  }
  
  &.wrong {
    background: linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(255, 68, 68, 0.1));
    border-color: $error-color;
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.4);
    animation: pulse 0.5s ease-in-out;
  }
}

.variant-text {
  color: $text-color;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: 0.3px;
  display: block;
  text-align: center;
}

.variant-image {
  max-width: 100%;
  max-height: 150px;
  border-radius: 6px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.cosmic-border {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 12px;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(74, 158, 255, 0.1),
    transparent,
    rgba(74, 158, 255, 0.1),
    transparent
  );
  background-size: 200% 200%;
  animation: border-flow 6s ease-in-out infinite;
  z-index: 1;
}

// Responsive design
@media (max-width: 768px) {
  .quiz-card {
    padding: 1rem;
  }
  
  .quiz-question {
    font-size: 1rem;
  }
  
  .variant-text {
    font-size: 0.9rem;
  }
}
</style>

