<template>
  <LevelLayout>
    <div>
      <h1>Level 1: Mission Introduction</h1>
      <div class="level-info">
        <h2>Mission Overview</h2>
        <p>
          Welcome to your first NASA mission! This is where your space exploration
          journey begins.
        </p>

        <h3>Objectives:</h3>
        <ul>
          <li>Learn basic space navigation</li>
          <li>Understand mission protocols</li>
          <li>Complete initial training modules</li>
        </ul>

        <h3>Difficulty: Beginner</h3>
        <p>Estimated completion time: 5–10 minutes</p>
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
