<template>
    <div class="voice-assistant">
        <h1>Voice Assistant</h1>
        <div class="assistant-face" :class="{ speaking: isSpeaking }">
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="mouth"></div>
        </div>

        <!-- Project Selection Dropdown -->
        <div class="project-selection">
            <label for="project">Select Project:</label>
            <select v-model="selectedProjectId" @change="fetchProjectDetails">
                <option disabled value="">Please select a project</option>
                <option v-for="project in projects" :key="project._id" :value="project._id">
                    {{ project.name }}
                </option>
            </select>
        </div>

        <!-- Voice Assistant Controls -->
        <button style="border: 2px blue solid;" @click="toggleListening" :disabled="isProcessing">
            {{ isListening ? 'Stop Listening' : 'Start Listening(Enable Shravan)' }}
        </button>
        <p v-if="isListening">Listening...</p>
        <p v-if="isProcessing">Processing...</p>
        <p v-if="error">{{ error }}</p>
        <!-- Display Current Command -->
        <div class="current-command">
            <h3>Current Command:</h3>
            <p>{{ currentCommand }}</p>
        </div>
        <!-- Display parameters if they exist -->
        <div v-if="currentParameters.length > 0">
            <h4>Parameters:</h4>
            <ul>
                <li v-for="(param, index) in currentParameters" :key="index">{{ param }}</li>
            </ul>
        </div>
        <div v-else>
            <p>No parameters available.</p>
        </div>
        <!-- Display Current Command and Command List -->
        <div style="text-align: left;" v-if="selectedProject">
            <h2>Project: {{ selectedProject.name }}</h2>
            <p>{{ selectedProject.description }}</p>

            <h3>Available Commands:</h3>
            <ul>
                <li v-for="command in commands" :key="command._id">
                    <strong>{{ command.name }}</strong>: {{ command.description }}

                    <!-- Check if the command has parameters -->
                    <div v-if="command.parameters && command.parameters.length">
                        <p><strong>Parameters:</strong></p>
                        <ul>
                            <li v-for="(param, index) in command.parameters" :key="index">{{ param }}</li>
                        </ul>
                    </div>
                    <div v-else>
                        <p><strong>No parameters</strong></p>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendSpeechToServer, fetchProjects, fetchProjectCommands } from '../services/ApiService';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const isListening = ref(false);
const isProcessing = ref(false);
const isSpeaking = ref(false);
const error = ref(null);
const projects = ref([]);
const selectedProjectId = ref('');
const selectedProject = ref(null);
const commands = ref([]);
const currentCommand = ref('');
const currentParameters = ref([]);

let recognition = null;
let speechSynthesis = window.speechSynthesis;

onMounted(async () => {
    // Fetch projects on component mount
    await fetchAllProjects();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = async (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            await processSpeech(transcript);
        };

        recognition.onerror = (event) => {
            error.value = 'Speech recognition error: ' + event.error;
            isListening.value = false;
        };
    } else {
        error.value = 'Speech recognition not supported in this browser.';
    }
});

// Fetch all projects
const fetchAllProjects = async () => {
    try {
        projects.value = await fetchProjects();
    } catch (err) {
        error.value = 'Error fetching projects.';
        console.error('Error:', err);
    }
};

// Fetch selected project details and commands
const fetchProjectDetails = async () => {
    try {
        isProcessing.value = true;
        const project = projects.value.find((p) => p._id === selectedProjectId.value);
        selectedProject.value = project;

        commands.value = await fetchProjectCommands(selectedProjectId.value);

        // Optionally, fetch the current command for the project
        await fetchCurrentCommand();
    } catch (err) {
        error.value = 'Error fetching project details.';
        console.error('Error:', err);
    } finally {
        isProcessing.value = false;
    }
};

// Fetch current command for the selected project
const fetchCurrentCommand = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/projects/${selectedProjectId.value}/current-command`);
        currentCommand.value = response.data.command;
        currentParameters.value = response.data.parameters; // Store parameters in state
    } catch (err) {
        error.value = 'Error fetching current command.';
        console.error('Error:', err);
    }
};

const toggleListening = () => {
    if (isListening.value) {
        recognition.stop();
    } else {
        error.value = null;
        recognition.start();
    }
    isListening.value = !isListening.value;
};

const processSpeech = async (transcript) => {
    isProcessing.value = true;
    try {
        const responseText = await sendSpeechToServer(transcript, selectedProjectId.value);
        speakResponse(responseText);
        // Optionally, update current command
        await fetchCurrentCommand();
    } catch (err) {
        error.value = 'Error processing your request. Please try again.';
        console.error('Error:', err);
    } finally {
        isProcessing.value = false;
    }
};

const speakResponse = (text) => {
    isSpeaking.value = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        isSpeaking.value = false;
    };
    speechSynthesis.speak(utterance);
};
</script>

<style scoped>
/* (Your existing styles) */
.voice-assistant {
    text-align: center;
    font-family: Arial, sans-serif;
    color: #fff;
    background-color: #1a1a1a;
    min-height: 100vh;
    padding: 20px;
}

.project-selection {
    margin: 20px 0;
}

.project-selection select {
    padding: 5px;
    font-size: 1em;
}

.current-command {
    margin-top: 20px;
    background-color: #333;
    padding: 10px;
    border-radius: 5px;
}
</style>