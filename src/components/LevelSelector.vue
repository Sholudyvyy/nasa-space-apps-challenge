<template>
  <div>
    <transition name="fade-up">
      <div v-if="isOpen" class="overlay" @click.self="close">
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Levels selector"
        >
          <div class="panel-bar">Levels</div>
          <div class="panel-body">
            <div class="seasons-grid">
              <button
                v-for="s in seasons"
                :key="s.id"
                class="season-card"
                :class="{ locked: !s.unlocked }"
                :disabled="!s.unlocked"
                @click="openSeason(s.id)"
              >
                <div
                  class="season-media"
                  :style="{
                    backgroundImage: `url(${seasonImage[s.id] || ''})`,
                  }"
                ></div>
                <div class="season-title">{{ s.title }}</div>
                <div class="season-meta">Levels {{ s.range }}</div>
                <div class="season-progress">
                  {{ s.completedCount }} / {{ s.levels.length }} completed
                </div>
              </button>
            </div>
          </div>
          <button class="close-btn" @click="close" aria-label="Close">✕</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  externalOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const router = useRouter();
const isOpen = ref(false);

// Watch for external control
watch(
  () => props.externalOpen,
  (newVal) => {
    console.log("LevelSelector externalOpen changed to:", newVal);
    isOpen.value = newVal;
  },
  { immediate: true }
);

// Watch isOpen for debugging
watch(isOpen, (newVal, oldVal) => {
  console.log("LevelSelector isOpen changed:", oldVal, "->", newVal);
});

// Season preview images from src/assets/images/s
// Note: filenames are case-sensitive
import SpringImg from "@/assets/images/s/Spring.jpg";
import SummerImg from "@/assets/images/s/Summer.jpg";
import AutumnImg from "@/assets/images/s/fall.jpg";
import WinterImg from "@/assets/images/s/winter.jpg";

const seasonImage = {
  1: SpringImg,
  2: SummerImg,
  3: AutumnImg,
  4: WinterImg,
};

const baseSeasons = [
  { id: 1, title: "Spring", range: "1–2", levels: [1, 2] },
  { id: 2, title: "Summer", range: "3–4", levels: [3, 4] },
  { id: 3, title: "Autumn", range: "5–6", levels: [5, 6] },
  { id: 4, title: "Winter", range: "7–8", levels: [7, 8] },
];

function getCompletedSet() {
  try {
    const raw = localStorage.getItem("levelsCompleted");
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (_) {
    return new Set();
  }
}

const seasons = computed(() => {
  const completed = getCompletedSet();
  const withCounts = baseSeasons.map((s) => ({
    ...s,
    completedCount: s.levels.filter((l) => completed.has(l)).length,
  }));
  return withCounts.map((s, idx, arr) => {
    if (idx === 0) return { ...s, unlocked: true };
    const prev = arr[idx - 1];
    const prevComplete = prev.completedCount === prev.levels.length;
    return { ...s, unlocked: prevComplete };
  });
});

function openSeason(id) {
  const target = seasons.value.find((s) => s.id === id);
  if (!target?.unlocked) return;
  close();
  router.push({ path: "/levels", query: { season: String(id) } });
}

function close() {
  isOpen.value = false;
  emit("close");
}
</script>

<style scoped>
/* Trigger button */
.trigger {
  position: fixed;
  bottom: 16px;
  right: 16px;
  height: 48px;
  width: 48px;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #0e1220 0%, #151b33 60%, #0d2a30 100%);
  color: #fff;
  cursor: pointer;
}
.icon {
  font-size: 22px;
}

/* Overlay */
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

/* Animated panel */
.panel {
  width: min(92vw, 960px);
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  /* soft starry background */
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
}

.panel-body {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 20px;
}

.seasons-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.season-card {
  border: 2px solid rgba(0, 153, 255, 0.45);
  border-radius: 16px;
  padding: 18px;
  color: #e0ecff;
  text-align: left;
  cursor: pointer;
  background-color: #0b0f1e;
  background-image: radial-gradient(
      2px 2px at 8% 20%,
      rgba(170, 200, 255, 0.9) 40%,
      transparent 41%
    ),
    radial-gradient(
      1px 1px at 30% 70%,
      rgba(200, 220, 255, 0.85) 40%,
      transparent 41%
    ),
    radial-gradient(
      1.5px 1.5px at 65% 35%,
      rgba(150, 190, 255, 0.8) 40%,
      transparent 41%
    ),
    radial-gradient(
      1px 1px at 85% 55%,
      rgba(180, 210, 255, 0.75) 40%,
      transparent 41%
    ),
    radial-gradient(
      0.8px 0.8px at 45% 15%,
      rgba(255, 255, 255, 0.7) 40%,
      transparent 41%
    );
  background-repeat: repeat;
  background-size: 140px 90px, 160px 100px, 180px 120px, 200px 140px,
    220px 160px;
  background-blend-mode: screen;
  box-shadow: 0 0 10px rgba(0, 153, 255, 0.18),
    inset 0 0 6px rgba(0, 153, 255, 0.1);
  transition: transform 160ms ease, box-shadow 160ms ease,
    border-color 160ms ease, filter 160ms ease;
}
.season-media {
  width: 100%;
  height: 150px;
  min-height: 150px;
  display: block;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 153, 255, 0.25);
}
.season-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.2);
}
.season-card:hover {
  border-color: rgba(0, 180, 255, 0.75);
  box-shadow: 0 0 16px rgba(0, 180, 255, 0.3),
    0 0 2px rgba(0, 180, 255, 0.35) inset;
  transform: translateY(-1px);
}
.season-card:focus-visible {
  outline: none;
  border-color: rgba(0, 200, 255, 0.9);
  box-shadow: 0 0 18px rgba(0, 200, 255, 0.4),
    0 0 3px rgba(0, 200, 255, 0.45) inset;
}

.season-title {
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.season-meta {
  color: #9fb3d9;
  font-size: 14px;
}
.season-progress {
  color: #7fa3ff;
  font-size: 12px;
  margin-top: 6px;
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

@media (max-width: 640px) {
  .levels-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
