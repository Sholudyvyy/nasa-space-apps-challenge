<template>
  <LevelLayout>
    <div>
      <h1>Level 4: Mars Exploration</h1>
      <div class="level-info">
        <h2>Mission Overview</h2>
        <p>
          Journey to the Red Planet! This mission requires advanced navigation and resource management.
        </p>

        <h3>Objectives:</h3>
        <ul>
          <li>Navigate interplanetary space</li>
          <li>Manage fuel and life support</li>
          <li>Land on Mars safely</li>
          <li>Conduct surface exploration</li>
        </ul>

        <h3>Difficulty: Intermediate</h3>
        <p>Estimated completion time: 20–25 minutes</p>
      </div>
    </div>
    <template #chat>
      <div>Chat is here</div>
    </template>
  </LevelLayout>
</template>

<script setup>
import LevelLayout from '@/layouts/LevelLayout.vue';
</script>

<style scoped></style>
