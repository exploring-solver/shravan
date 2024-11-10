<script setup>
import VoiceAssistant from './components/VoiceAssistant.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Shravan the voice assistant</h1>
    </header>
    <main>
      <VoiceAssistant />
    </main>
    <footer>
      <p>Made by AMAN, MAIT Delhi</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

header {
  margin-bottom: 20px;
}

footer {
  margin-top: 20px;
  font-size: 0.8em;
  color: #666;
}
</style>