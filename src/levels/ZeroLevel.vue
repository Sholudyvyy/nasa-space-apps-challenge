<template>
  <div class="zero-level__background">
    <div class="zero-level__main"/>

    <div class="zero-level__message">
      <Message
        text="Hello, I am Sem. I am a friendly alien. I am here to help you."
      />

      <img src="@/assets/images/moskot.png" alt="moskot" class="moskot"/>
    </div>
  </div>
</template>

<script setup>
import Message from '@/components/Message.vue'
</script>

<style scoped lang="scss">
.moskot {
  position: fixed;
  bottom: -50px;
  right: -80px;
  width: 150px;
  height: 150px;
}

// Main Styles
.zero-level {
  &__message {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
