<template>
  <div id="app">
    <div class="stars" :class="{ hyperspace: isHyperspace }"></div>
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
import { ref, onMounted, onBeforeUnmount } from "vue";

const isHyperspace = ref(false);
const bgMusic = ref(null);

const handleHyperspaceStart = (e) => {
  isHyperspace.value = true;
};

const handleHyperspaceEnd = () => {
  isHyperspace.value = false;
};

onMounted(() => {
  window.addEventListener("hyperspace-start", handleHyperspaceStart);
  window.addEventListener("hyperspace-end", handleHyperspaceEnd);

  if (bgMusic.value) {
    bgMusic.value.volume = 0.9;
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
</style>
