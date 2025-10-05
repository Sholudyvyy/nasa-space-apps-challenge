<template>
  <div class="message-container">
    <div class="message-card" :data-type="type">
      <div class="message-content">
        <slot>
          <p class="message-text" ref="messageText">{{ displayText }}</p>
          <span class="cursor" v-if="isTyping">|</span>
        </slot>
      </div>
      <div class="cosmic-border"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'

const emit = defineEmits(['typingComplete'])

const props = defineProps({
  text: {
    type: String,
    default: 'Your message here'
  },
  type: {
    type: String,
    default: 'info', // info, success, warning, error
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  typingSpeed: {
    type: Number,
    default: 50 // milliseconds per character
  },
  enableTyping: {
    type: Boolean,
    default: true
  }
})

const displayText = ref('')
const isTyping = ref(false)
const messageText = ref(null)

const typeText = async (text) => {
  if (!props.enableTyping) {
    displayText.value = text
    return
  }
  
  displayText.value = ''
  isTyping.value = true
  
  for (let i = 0; i <= text.length; i++) {
    displayText.value = text.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, props.typingSpeed))
  }
  
  // Keep cursor visible for a moment after typing is complete
  setTimeout(() => {
    isTyping.value = false
    emit('typingComplete')
  }, 1000)
}

onMounted(() => {
  typeText(props.text)
})

watch(() => props.text, (newText) => {
  typeText(newText)
})
</script>

<style scoped lang="scss">
// Variables
$bg-color: #000;
$text-color: #fff;
$border-color: #333;
$glow-color: #4a9eff;
$success-color: #00ff88;
$warning-color: #ffaa00;
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

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
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

@keyframes cursor-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

// Main Styles
.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 2rem;
}

.message-card {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.8));
  border: 1px solid $border-color;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  animation: cosmic-glow 3s ease-in-out infinite;
  
  // Subtle starfield effect
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
    animation: star-twinkle 4s ease-in-out infinite;
    pointer-events: none;
  }
}

.message-content {
  position: relative;
  z-index: 2;
}

.message-text {
  color: $text-color;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  font-weight: 300;
  letter-spacing: 0.5px;
  display: inline;
}

.cursor {
  color: $glow-color;
  font-weight: bold;
  animation: cursor-blink 1s infinite;
  margin-left: 2px;
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

// Type-specific styles
.message-card {
  &[data-type="success"] {
    .cosmic-border {
      background: linear-gradient(
        45deg,
        transparent,
        rgba(0, 255, 136, 0.2),
        transparent,
        rgba(0, 255, 136, 0.2),
        transparent
      );
    }
    
    animation: cosmic-glow 3s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
  
  &[data-type="warning"] {
    .cosmic-border {
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 170, 0, 0.2),
        transparent,
        rgba(255, 170, 0, 0.2),
        transparent
      );
    }
    
    animation: cosmic-glow 3s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
  }
  
  &[data-type="error"] {
    .cosmic-border {
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 68, 68, 0.2),
        transparent,
        rgba(255, 68, 68, 0.2),
        transparent
      );
    }
    
    animation: cosmic-glow 3s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
  }
}

// Responsive design
@media (max-width: 768px) {
  .message-container {
    padding: 1rem;
  }
  
  .message-card {
    padding: 1.5rem;
  }
  
  .message-text {
    font-size: 1rem;
  }
}

// Dark mode enhancements
@media (prefers-color-scheme: dark) {
  .message-card {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(10, 10, 10, 0.9));
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
