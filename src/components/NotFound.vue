<template>
  <div class="not-found-container">
    <h1>🚀 Page Not Found</h1>
    <div class="not-found-info">
      <h2>Mission Control Error</h2>
      <p>Houston, we have a problem! The page you're looking for doesn't exist in our mission database.</p>
      
      <h3>Possible Solutions:</h3>
      <ul>
        <li>Check the URL for typos</li>
        <li>Return to mission headquarters</li>
        <li>Start a new space exploration journey</li>
      </ul>
      
      <div class="navigation">
        <router-link to="/level1" class="home-btn">🏠 Back to Mission Control</router-link>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.not-found-container {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.not-found-info {
  margin-top: 2rem;
}

.navigation {
  margin-top: 2rem;
}

.home-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.home-btn:hover {
  background-color: #0056b3;
}
</style>
