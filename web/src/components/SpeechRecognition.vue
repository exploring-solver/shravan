<template>
    <div class="speech-recognition">
      <button @click="toggleListening">
        {{ isListening ? 'Stop Listening' : 'Start Listening' }}
      </button>
      <p v-if="isListening">Listening...</p>
      <p>{{ transcript }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SpeechRecognition',
    data() {
      return {
        recognition: null,
        isListening: false,
        transcript: '',
      };
    },
    mounted() {
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event) => {
          const last = event.results.length - 1;
          this.transcript = event.results[last][0].transcript;
          this.$emit('speechRecognized', this.transcript.split(' '));
        };
        
        this.recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
        };
      } else {
        console.error('Speech recognition not supported');
      }
    },
    methods: {
      toggleListening() {
        if (this.isListening) {
          this.recognition.stop();
        } else {
          this.recognition.start();
        }
        this.isListening = !this.isListening;
      },
    },
  };
  </script>