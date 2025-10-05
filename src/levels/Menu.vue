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

    <h1 class="menu-title">Cummning...</h1>

    <div class="menu-buttons">
      <button class="play-button">Play</button>
      <button class="more-info-button">More info</button>
    </div>

    <div class="astronaut-container">
      <img src="@/assets/images/moskot5.png" alt="Astronaut" class="astronaut" />
    </div>
  </div>
</template>

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
  position: absolute;
  top: 320px;
  right: 700px;
  color: #6a6a6a;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3);
  transform: rotate(15deg);
  margin: 0;
  font-family: sans-serif;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.play-button {
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
  position: absolute;
  width: 150px;
  height: 150px;
  pointer-events: none;
}

.astronaut {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.1s ease;
  transform-origin: -100px center;
  animation: arcMove 100s linear infinite alternate;
}

@keyframes arcMove {
  from {
    transform: rotate(0deg) translateX(800px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(800px) rotate(-360deg);
  }
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
