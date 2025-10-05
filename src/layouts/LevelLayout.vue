<template>
  <div class="level">
    <div class="content">
      <section class="panel game-panel">
        <img class="border" src="/src/assets/images/game-border.png" />
        <div class="inner">
          <slot>
            <div class="placeholder">Game goes here</div>
          </slot>
        </div>
      </section>

      <aside class="panel chat-panel">
        <img class="border" src="/src/assets/images/chat-border.png" />
        <div class="inner">
          <slot name="chat">
            <div class="placeholder">Chat goes here</div>
          </slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.level {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  color: azure;
}

.content {
  display: flex;
  gap: 4rem;
  align-items: flex-start;
}

.panel {
  position: relative;
  display: flex;
}

.border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  object-fit: fill;
}

/* Adjust these values */
.game-panel {
  --border-padding: 4rem;
  /* Distance from border to content */
  --panel-width: 650px;
  /* Total panel width */
  --panel-height: 600px;
  /* Total panel height */

  width: var(--panel-width);
  height: var(--panel-height);
}

.chat-panel {
  --border-padding: 2.5rem;
  /* Distance from border to content */
  --panel-width: 300px;
  /* Total panel width */
  --panel-height: 600px;
  /* Total panel height */

  width: var(--panel-width);
  height: var(--panel-height);
}

/* Inner content with padding */
.inner {
  width: 100%;
  height: 100%;
  padding: var(--border-padding);
  box-sizing: border-box;
}

.placeholder {
  padding: 40px;
  color: #aaa;
  font-size: 1rem;
}
</style>
