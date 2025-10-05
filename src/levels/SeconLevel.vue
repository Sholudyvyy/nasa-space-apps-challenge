<template>
  <LevelLayout :levelId="2">
    <div>
      <h1>Level 2: Space Station Operations</h1>
      <div class="level-info">
        <h2>Mission Overview</h2>
        <p>
          Now that you've completed basic training, it's time to learn about space station operations.
        </p>

        <h3>Objectives:</h3>
        <ul>
          <li>Master life support systems</li>
          <li>Learn emergency procedures</li>
          <li>Practice spacewalk protocols</li>
        </ul>

        <h3>Difficulty: Easy</h3>
        <p>Estimated completion time: 10–15 minutes</p>
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
