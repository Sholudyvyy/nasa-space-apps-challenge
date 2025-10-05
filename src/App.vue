<template>
  <div id="app">
    <div class="stars" :class="{ hyperspace: isHyperspace }"></div>

    <LevelSelector />

    <!-- Settings button -->
    <button
      v-if="!showSettings"
      class="settings-button"
      @click="showSettings = true"
    >
      <img
        src="@/assets/images/settings.png"
        alt="Settings"
        class="settings-icon"
      />
    </button>

    <!-- Settings popup -->
    <div v-if="showSettings" class="settings-popup">
      <div class="settings-content">
        <h3>Settings</h3>

        <div class="setting-item">
          <label>Music Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model="volume"
            @input="updateVolume"
            class="volume-slider"
          />
          <span class="volume-value">{{ volume }}%</span>
        </div>

        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="isMuted" @change="toggleMute" />
            Mute Music
          </label>
        </div>

        <button class="close-button" @click="showSettings = false">
          Close
        </button>
      </div>
    </div>

    <div class="view" :class="{ 'fade-out': isHyperspace }">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <audio ref="bgMusic" loop autoplay>
      <source src="@/assets/images/music/main-music.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import LevelSelector from './components/LevelSelector.vue'
import { ref, onMounted, onBeforeUnmount } from "vue";

const isHyperspace = ref(false);
const bgMusic = ref(null);
const showSettings = ref(false);

// Load volume from localStorage or use default
const savedVolume = localStorage.getItem("musicVolume");
const savedMuted = localStorage.getItem("musicMuted");
const volume = ref(savedVolume !== null ? parseInt(savedVolume) : 90);
const isMuted = ref(savedMuted === "true");
let previousVolume = savedVolume !== null ? parseInt(savedVolume) : 90;

const handleHyperspaceStart = (e) => {
  isHyperspace.value = true;
};

const handleHyperspaceEnd = () => {
  isHyperspace.value = false;
};

const updateVolume = () => {
  if (bgMusic.value) {
    if (parseInt(volume.value) === 0) {
      isMuted.value = true;
      bgMusic.value.volume = 0;
    } else {
      isMuted.value = false;
      bgMusic.value.volume = volume.value / 100;
      previousVolume = volume.value;
    }
    // Save to localStorage
    localStorage.setItem("musicVolume", volume.value.toString());
    localStorage.setItem("musicMuted", isMuted.value.toString());
  }
};

const toggleMute = () => {
  if (bgMusic.value) {
    if (isMuted.value) {
      // When muting, just mute the audio but keep volume slider value
      bgMusic.value.volume = 0;
      if (volume.value > 0) {
        previousVolume = volume.value;
      }
    } else {
      // When unmuting, restore audio volume from slider
      if (volume.value > 0) {
        bgMusic.value.volume = volume.value / 100;
      } else {
        // If slider is at 0, restore to previous or default
        const volumeToRestore = previousVolume > 0 ? previousVolume : 90;
        volume.value = volumeToRestore;
        bgMusic.value.volume = volumeToRestore / 100;
      }
    }
    // Save to localStorage
    localStorage.setItem("musicVolume", volume.value.toString());
    localStorage.setItem("musicMuted", isMuted.value.toString());
  }
};

onMounted(() => {
  window.addEventListener("hyperspace-start", handleHyperspaceStart);
  window.addEventListener("hyperspace-end", handleHyperspaceEnd);

  if (bgMusic.value) {
    // Apply saved volume and mute state
    if (isMuted.value || volume.value === 0) {
      bgMusic.value.volume = 0;
    } else {
      bgMusic.value.volume = volume.value / 100;
    }

    bgMusic.value.play().catch(() => {
      const playOnInteraction = () => {
        bgMusic.value?.play();
        document.removeEventListener("click", playOnInteraction);
        document.removeEventListener("keydown", playOnInteraction);
      };
      document.addEventListener("click", playOnInteraction);
      document.addEventListener("keydown", playOnInteraction);
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("hyperspace-start", handleHyperspaceStart);
  window.removeEventListener("hyperspace-end", handleHyperspaceEnd);
});
</script>

<style lang="scss">
// Variables
$bg-color: #000;
$star-color: #fff;
$animation-duration: 16s;

// Mixins
@mixin star-layer($shadows) {
  box-shadow: $shadows;
}

body {
  all: unset;
}

html {
  background-color: $bg-color;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.stars {
  position: fixed;
  top: 50%;
  left: 50%;
  height: 1px;
  width: 1px;
  background-color: $star-color;
  border-radius: 50%;
  transform-origin: center center;
  will-change: transform, filter, opacity;

  // Layer 1: Primary stars
  box-shadow: -42vw -4vh 0px 0px $star-color, 25vw -41vh 0px 0px $star-color,
    -20vw 49vh 0px 1px $star-color, 5vw 40vh 1px 1px $star-color,
    29vw 19vh 1px 0px $star-color, -44vw -13vh 0px 0px $star-color,
    46vw 41vh 0px 1px $star-color, -3vw -45vh 0px 1px $star-color,
    47vw 35vh 1px 0px $star-color, 12vw -8vh 1px 0px $star-color,
    -34vw 48vh 1px 1px $star-color, 32vw 26vh 1px 1px $star-color,
    32vw -41vh 1px 1px $star-color, 0vw 37vh 1px 1px $star-color,
    34vw -26vh 1px 0px $star-color, -14vw -49vh 1px 0px $star-color,
    -12vw 45vh 0px 1px $star-color, -44vw -33vh 0px 1px $star-color,
    -13vw 41vh 0px 0px $star-color, -36vw -11vh 0px 1px $star-color,
    -23vw -24vh 1px 0px $star-color, -38vw -27vh 0px 1px $star-color,
    16vw -19vh 0px 0px $star-color, 28vw 33vh 1px 0px $star-color,
    -49vw -4vh 0px 0px $star-color, 16vw 32vh 0px 1px $star-color,
    36vw -18vh 1px 0px $star-color, -25vw -30vh 1px 0px $star-color,
    -23vw 24vh 0px 1px $star-color, -2vw -35vh 1px 1px $star-color,
    -25vw 9vh 0px 0px $star-color, -15vw -34vh 0px 0px $star-color,
    -8vw -19vh 1px 0px $star-color, -20vw -20vh 1px 1px $star-color,
    42vw 50vh 0px 1px $star-color, -32vw 10vh 1px 0px $star-color,
    -23vw -17vh 0px 0px $star-color, 44vw 15vh 1px 0px $star-color,
    -40vw 33vh 1px 1px $star-color, -43vw 8vh 0px 0px $star-color,
    -48vw -15vh 1px 1px $star-color, -24vw 17vh 0px 0px $star-color,
    -31vw 50vh 1px 0px $star-color, 36vw -38vh 0px 1px $star-color,
    -7vw 48vh 0px 0px $star-color, 15vw -32vh 0px 0px $star-color,
    29vw -41vh 0px 0px $star-color, 2vw 37vh 1px 0px $star-color,
    7vw -40vh 1px 1px $star-color, 15vw 18vh 0px 0px $star-color,
    25vw -13vh 1px 1px $star-color, -46vw -12vh 1px 1px $star-color,
    -18vw 22vh 0px 0px $star-color, 23vw -9vh 1px 0px $star-color,
    50vw 12vh 0px 1px $star-color, 45vw 2vh 0px 0px $star-color,
    14vw -48vh 1px 0px $star-color, 23vw 43vh 0px 1px $star-color,
    -40vw 16vh 1px 1px $star-color, 20vw -31vh 0px 1px $star-color,
    -17vw 44vh 1px 1px $star-color, 18vw -45vh 0px 0px $star-color,
    33vw -6vh 0px 0px $star-color, 0vw 7vh 0px 1px $star-color,
    -10vw -18vh 0px 1px $star-color, -19vw 5vh 1px 0px $star-color,
    1vw 42vh 0px 0px $star-color, 22vw 48vh 0px 1px $star-color,
    39vw -8vh 1px 1px $star-color, -6vw -42vh 1px 0px $star-color,
    -47vw 34vh 0px 0px $star-color, -46vw 19vh 0px 1px $star-color,
    -12vw -32vh 0px 0px $star-color, -45vw -38vh 0px 1px $star-color,
    -28vw 18vh 1px 0px $star-color, -38vw -46vh 1px 1px $star-color,
    49vw -6vh 1px 1px $star-color, -28vw 18vh 1px 1px $star-color,
    10vw -24vh 0px 1px $star-color, -5vw -11vh 1px 1px $star-color,
    33vw -8vh 1px 0px $star-color, -16vw 17vh 0px 0px $star-color,
    18vw 27vh 0px 1px $star-color, -8vw -10vh 1px 1px $star-color;

  animation: zoom $animation-duration alternate infinite;
}

// Hyperspace state: brighten, stretch outward, then fade
.stars.hyperspace {
  animation: hyperspace 0.9s ease-in forwards;
  filter: brightness(2);
}

// View fade wrapper (pre-route fade out on hyperspace)
.view {
  position: relative;
  transition: opacity 0.4s ease;
}

.view.fade-out {
  opacity: 0;
}

// Route transition (new page fade-in)
.page-enter-active {
  transition: opacity 0.5s ease 0.1s;
}

.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

// Animations
@keyframes zoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.5);
  }
}

@keyframes hyperspace {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1);
  }
  60% {
    transform: scale(3);
    opacity: 1;
    filter: brightness(3) blur(0.4px);
  }
  100% {
    transform: scale(6);
    opacity: 0;
    filter: brightness(1) blur(0.6px);
  }
}

// Settings button
.settings-button {
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.settings-icon {
  width: 30px;
  height: 30px;
  filter: invert(1);
  transition: transform 0.3s ease;
}

.settings-button:hover .settings-icon {
  transform: rotate(30deg);
}

// Settings popup
.settings-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 15, 30, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(15px);
}

.settings-content {
  background: rgba(20, 30, 50, 0.6);
  border: 2px solid #4a8fd4;
  padding: 40px;
  border-radius: 20px;
  min-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(74, 143, 212, 0.5),
    0 0 40px rgba(74, 143, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);

  h3 {
    color: #fff;
    margin: 0 0 30px 0;
    font-size: 32px;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 2px 10px rgba(100, 150, 255, 0.8),
      0 0 20px rgba(100, 150, 255, 0.6);
    letter-spacing: 1px;
  }
}

.setting-item {
  background: rgba(30, 40, 60, 0.4);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(106, 179, 255, 0.4);
  box-shadow: 0 0 10px rgba(106, 179, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(40, 50, 70, 0.5);
    border-color: rgba(106, 179, 255, 0.8);
    box-shadow: 0 0 15px rgba(106, 179, 255, 0.4),
      0 0 30px rgba(106, 179, 255, 0.2);
  }

  label {
    color: #d0e0ff;
    display: block;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  input[type="checkbox"] {
    margin-right: 12px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    accent-color: #5a9fd4;
  }
}

.volume-slider {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(
    to right,
    rgba(50, 60, 80, 0.8) 0%,
    rgba(70, 90, 120, 0.8) 100%
  );
  outline: none;
  -webkit-appearance: none;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(145deg, #6ab3ff, #4a8fd4);
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(106, 179, 255, 0.3);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6),
        0 0 0 4px rgba(106, 179, 255, 0.5);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(145deg, #6ab3ff, #4a8fd4);
    cursor: pointer;
    border: none;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(106, 179, 255, 0.3);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.volume-value {
  color: #6ab3ff;
  margin-left: 15px;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.close-button {
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background: linear-gradient(145deg, #4a8fd4, #3a6fa4);
  border: 2px solid rgba(100, 150, 200, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 15px rgba(74, 143, 212, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(74, 143, 212, 0.5);
    background: linear-gradient(145deg, #5a9fe4, #4a7fb4);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(74, 143, 212, 0.4);
  }
}
</style>
