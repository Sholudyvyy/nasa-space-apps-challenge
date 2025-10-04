<template>
  <div class="start-screen">
    <div class="hero-section">
      <h1>🚀 NASA Space Mission Simulator</h1>
      <p class="subtitle">Embark on an Epic Journey Through Space</p>
    </div>
    
    <div class="project-info">
      <h2>About This Project</h2>
      <p>
        Welcome to the NASA Space Mission Simulator! This interactive application takes you on an incredible 
        journey through eight challenging levels, each representing different aspects of space exploration 
        and NASA missions.
      </p>
      
      <div class="features">
        <h3>🌟 What You'll Experience:</h3>
        <ul>
          <li><strong>Progressive Difficulty:</strong> From beginner training to master-level galactic exploration</li>
          <li><strong>Real NASA Concepts:</strong> Learn about actual space missions and technologies</li>
          <li><strong>Interactive Learning:</strong> Each level teaches different space exploration skills</li>
          <li><strong>Mission-Based Structure:</strong> Complete objectives to advance through levels</li>
        </ul>
      </div>
      
      <div class="mission-overview">
        <h3>🎯 Mission Overview</h3>
        <p>
          Your journey begins with basic astronaut training and progresses through increasingly complex 
          missions including lunar landings, Mars exploration, asteroid mining, Jupiter's moons, 
          interstellar travel, and finally galactic exploration.
        </p>
      </div>
      
      <div class="tech-stack">
        <h3>🛠️ Built With:</h3>
        <ul>
          <li><strong>Vue.js 3:</strong> Modern reactive framework</li>
          <li><strong>Vue Router:</strong> Single-page application navigation</li>
          <li><strong>Vite:</strong> Fast build tool and development server</li>
          <li><strong>Modern CSS:</strong> Responsive and beautiful styling</li>
        </ul>
      </div>
    </div>
    
    <div class="navigation">
      <router-link to="/level1" class="start-btn">🚀 Begin Mission</router-link>
      <div class="level-links">
        <h4>Quick Level Access:</h4>
        <div class="level-grid">
          <router-link to="/level1" class="level-link">Level 1</router-link>
          <router-link to="/level2" class="level-link">Level 2</router-link>
          <router-link to="/level3" class="level-link">Level 3</router-link>
          <router-link to="/level4" class="level-link">Level 4</router-link>
          <router-link to="/level5" class="level-link">Level 5</router-link>
          <router-link to="/level6" class="level-link">Level 6</router-link>
          <router-link to="/level7" class="level-link">Level 7</router-link>
          <router-link to="/level8" class="level-link">Level 8</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.start-screen {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero-section {
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  color: #1a365d;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 300;
}

.project-info {
  text-align: left;
  margin-bottom: 3rem;
  background: #f7fafc;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.project-info h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
}

.project-info h3 {
  color: #4a5568;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.project-info p {
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1rem;
}

.features ul, .tech-stack ul {
  text-align: left;
  margin-left: 1rem;
}

.features li, .tech-stack li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.navigation {
  margin-top: 2rem;
}

.start-btn {
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

.level-links h4 {
  margin-bottom: 1rem;
  color: #4a5568;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.level-link {
  display: block;
  padding: 10px 15px;
  background: #e2e8f0;
  color: #4a5568;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.level-link:hover {
  background: #cbd5e0;
  color: #2d3748;
}
</style>
