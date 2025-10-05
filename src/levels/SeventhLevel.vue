<template>
  <LevelLayout :levelId="7">
    <div>
      <h1>Level 7: Interstellar Probe Mission</h1>
      <div class="level-info">
        <h2>Mission Overview</h2>
        <p>
          Almost at the finish line! Launch humanity's first interstellar probe beyond our solar system.
        </p>

        <h3>Objectives:</h3>
        <ul>
          <li>Design interstellar propulsion</li>
          <li>Navigate beyond heliopause</li>
          <li>Deploy deep space instruments</li>
          <li>Establish communication relay</li>
        </ul>

        <h3>Difficulty: Expert</h3>
        <p>Estimated completion time: 35–40 minutes</p>
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
