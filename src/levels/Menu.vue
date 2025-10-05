<template>
  <div class="menu">
    <div class="stars"></div>

    <button class="settings-button">
      <img
        src="@/assets/images/settings.png"
        alt="Settings"
        class="settings-icon"
      />
    </button>

    <div class="menu-buttons">
      <h1 class="menu-title">{{ titleText }}</h1>
      <router-link to="/level0" class="play-button">Play</router-link>
      <button class="more-info-button">More info</button>
    </div>

    <div class="astronaut-container" :style="{ left: x + 'px', top: y + 'px' }">
      <img :src="currentSrc" alt="Astronaut" class="astronaut" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
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

.settings-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  z-index: 2;
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
</style>
