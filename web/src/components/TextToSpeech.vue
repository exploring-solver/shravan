<template>
    <div class="text-to-speech">
      <button @click="speak" :disabled="!text">Speak Response</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TextToSpeech',
    props: {
      text: {
        type: String,
        required: true,
      },
    },
    methods: {
      speak() {
        const utterance = new SpeechSynthesisUtterance(this.text);
        speechSynthesis.speak(utterance);
      },
    },
  };
  </script>