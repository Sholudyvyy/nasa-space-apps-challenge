<template>
  <div class="menu">
    <div class="stars"></div>

    <div class="menu-buttons">
      <h1 class="menu-title">{{ titleText }}</h1>
      <button class="play-button" @click="startGame">Play</button>
      <button class="seasons-button" @click="openLevelSelector">Seasons</button>
      <button class="more-info-button" @click="showMoreInfo = true">
        More info
      </button>
    </div>

    <div class="astronaut-container" :style="{ left: x + 'px', top: y + 'px' }">
      <img :src="currentSrc" alt="Astronaut" class="astronaut" />
    </div>

    <!-- More Info Popup -->
    <transition name="fade-up">
      <div
        v-if="showMoreInfo"
        class="overlay"
        @click.self="showMoreInfo = false"
      >
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label="More information"
        >
          <div class="panel-bar">About the Game</div>
          <div class="panel-body">
            <div class="info-content">
              <h2>🌌 Space Farming Adventure</h2>
              <p>
                Welcome to an extraordinary farming experience beyond Earth! In
                this game, you'll explore different planets, cultivate cosmic
                crops, and manage resources across various seasons.
              </p>

              <h3>🎮 How to Play</h3>
              <ul>
                <li>Navigate through different seasons and levels</li>
                <li>Plant and harvest unique space crops</li>
                <li>Manage your resources wisely</li>
                <li>Complete challenges to unlock new seasons</li>
              </ul>

              <h3>🌱 Features</h3>
              <ul>
                <li>4 unique seasons with different environments</li>
                <li>Multiple challenging levels</li>
                <li>Beautiful cosmic visuals</li>
                <li>Relaxing space-themed music</li>
              </ul>

              <h3>🚀 Tips</h3>
              <p>
                Start with Spring season to learn the basics, then progress
                through Summer, Autumn, and Winter. Each season brings new
                challenges and rewards!
              </p>
            </div>
          </div>
          <button
            class="close-btn"
            @click="showMoreInfo = false"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import moskot5 from "@/assets/images/moskot/moskot5.png";
import moskot4 from "@/assets/images/moskot/moskot4.png";
import moskot3 from "@/assets/images/moskot/moskot3.png";
import moskot2 from "@/assets/images/moskot/moskot2.png";
import moskot1 from "@/assets/images/moskot/moskot1.png";
import moskot from "@/assets/images/moskot/moskot.png";

// Random rotating title per page load
const titleOptions = [
  "Harvest Among Stars ✨",
  "Cultivate Cosmic Fields 🌌",
  "Farm Beyond Earth 🚜",
  "Grow Galactic Crops 🌻",
  "Navigate, Plant, Prosper 🪐",
  "Seeds in Space 🌱",
  "Cosmos Meets Cultivation 🌾",
  "Explore, Farm, Flourish 🚀",
  "Galactic Harvest Time 🌠",
  "Your Cosmic Farm 🌍",
];
const titleText = ref(
  titleOptions[Math.floor(Math.random() * titleOptions.length)]
);

const ASTRONAUT_SIZE = 150;
const x = ref(0);
const y = ref(0);
const frames = [moskot1, moskot2, moskot3, moskot4, moskot5, moskot];
const currentIdx = ref(0);
const currentSrc = computed(() => frames[currentIdx.value]);
let dx = Math.random() > 0.5 ? 2 : -2;
let dy = Math.random() > 0.5 ? 2 : -2;
let frameId;

const router = useRouter();
const showMoreInfo = ref(false);

onMounted(() => {
  // start at a random in-bounds position
  x.value = Math.max(
    0,
    Math.min(
      window.innerWidth - ASTRONAUT_SIZE,
      Math.random() * (window.innerWidth - ASTRONAUT_SIZE)
    )
  );
  y.value = Math.max(
    0,
    Math.min(
      window.innerHeight - ASTRONAUT_SIZE,
      Math.random() * (window.innerHeight - ASTRONAUT_SIZE)
    )
  );

  const step = () => {
    x.value += dx;
    y.value += dy;

    if (x.value <= 0 || x.value >= window.innerWidth - ASTRONAUT_SIZE) {
      dx = -dx;
      x.value = Math.max(
        0,
        Math.min(window.innerWidth - ASTRONAUT_SIZE, x.value)
      );
      currentIdx.value = (currentIdx.value + 1) % frames.length;
    }
    if (y.value <= 0 || y.value >= window.innerHeight - ASTRONAUT_SIZE) {
      dy = -dy;
      y.value = Math.max(
        0,
        Math.min(window.innerHeight - ASTRONAUT_SIZE, y.value)
      );
      currentIdx.value = (currentIdx.value + 1) % frames.length;
    }

    frameId = requestAnimationFrame(step);
  };

  frameId = requestAnimationFrame(step);
});

onUnmounted(() => {
  if (frameId) cancelAnimationFrame(frameId);
});

const openLevelSelector = () => {
  window.dispatchEvent(new CustomEvent("open-level-selector"));
};

const startGame = () => {
  try {
    sessionStorage.setItem("allowLevelNav", String(Date.now()));
  } catch (_) {}
  router.push("/level0");
};
</script>

<style scoped lang="scss">
$bg-color: #000;

.menu {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $bg-color;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-title {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: absolute;
  right: -260px;
  top: -90px;
  color: #6a6a6a;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3);
  margin: 0 80px 12px 0;
  font-family: sans-serif;
  transform: rotate(12deg);
  z-index: 2;
  animation: pulse-title 2s ease-in-out infinite;
}

@keyframes pulse-title {
  0%,
  100% {
    transform: rotate(12deg) scale(1);
  }
  50% {
    transform: rotate(12deg) scale(1.1);
  }
}

.menu-buttons {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.play-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 80px;
  background: linear-gradient(145deg, #e0e0e0, #c0c0c0);
  border: none;
  border-radius: 15px;
  color: #000;
  font-size: 24px;
  font-weight: bold;
  font-family: sans-serif;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.seasons-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 190px;
  height: 70px;
  background: linear-gradient(145deg, #e0e0e0, #c0c0c0);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 20px;
  font-weight: bold;
  font-family: sans-serif;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.more-info-button {
  width: 180px;
  height: 60px;
  background: linear-gradient(145deg, #e0e0e0, #c0c0c0);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 18px;
  font-weight: bold;
  font-family: sans-serif;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.astronaut-container {
  position: fixed;
  width: 150px;
  height: 150px;
  pointer-events: none;
  z-index: 0;
}

.astronaut {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.1s ease;
}

@media (max-width: 768px) {
  .menu-title {
    font-size: 18px;
    top: 15px;
    right: 15px;
  }

  .play-button {
    width: 160px;
    height: 60px;
    font-size: 20px;
  }

  .more-info-button {
    width: 140px;
    height: 50px;
    font-size: 16px;
  }

  .astronaut-container {
    width: 120px;
    height: 120px;
  }
}

/* More Info Popup - similar to LevelSelector */
.overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    120% 120% at 50% 0%,
    rgba(10, 12, 24, 0.45) 0%,
    rgba(6, 8, 20, 0.45) 60%,
    rgba(4, 6, 14, 0.45) 100%
  );
  backdrop-filter: none;
  display: grid;
  place-items: center;
  z-index: 9999;
}

.panel {
  width: min(92vw, 800px);
  max-height: 85vh;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(180deg, #080a14 0%, #0d1330 60%, #0a0f16 100%);
}

.panel-bar {
  width: 100%;
  text-align: center;
  padding: 16px 20px;
  color: #e0ecff;
  font-weight: 800;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #121622, #101820, #121622);
  font-size: 20px;
}

.panel-body {
  flex: 1;
  display: flex;
  padding: 30px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(20, 30, 50, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(74, 143, 212, 0.5);
    border-radius: 4px;

    &:hover {
      background: rgba(74, 143, 212, 0.7);
    }
  }
}

.info-content {
  color: #e0ecff;
  line-height: 1.8;

  h2 {
    color: #6ab3ff;
    font-size: 28px;
    margin-bottom: 15px;
    text-shadow: 0 2px 10px rgba(106, 179, 255, 0.5);
  }

  h3 {
    color: #5a9fd4;
    font-size: 20px;
    margin-top: 25px;
    margin-bottom: 12px;
    text-shadow: 0 1px 5px rgba(90, 159, 212, 0.5);
  }

  p {
    margin-bottom: 15px;
    color: #c5d5f0;
    font-size: 16px;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 15px;

    li {
      padding: 8px 0 8px 30px;
      position: relative;
      color: #c5d5f0;
      font-size: 15px;

      &:before {
        content: "→";
        position: absolute;
        left: 10px;
        color: #6ab3ff;
        font-weight: bold;
      }
    }
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 32px;
  width: 32px;
  border: none;
  border-radius: 9999px;
  background: #121622;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #1a1f2e;
    transform: scale(1.1);
  }
}

/* Appear animation */
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.fade-up-enter-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-up-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
</style>
