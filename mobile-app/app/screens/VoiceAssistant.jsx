import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Avatar, List } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { sendSpeechToServer, fetchProjects, fetchProjectCommands } from '../../services/Api';

const VoiceAssistant = () => {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [commands, setCommands] = useState([]);
  const [recording, setRecording] = useState(null); // To hold the audio recording instance

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      setIsProcessing(true);
      const project = projects.find((p) => p._id === projectId);
      setSelectedProject(project);
      const fetchedCommands = await fetchProjectCommands(projectId);
      setCommands(fetchedCommands);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      // Stop listening and send the audio to the server
      console.log('Stopping listening and sending the command to server.');
      await stopRecording();
    } else {
      // Start listening
      console.log('Starting to listen.');
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recordingInstance = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recordingInstance.recording);
      setIsListening(true);
      console.log('Recording started.');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      console.log('Stopping recording.');
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      // Process and send the recorded speech to the server
      const transcript = await processSpeech(uri);
      await sendSpeechCommandToServer(transcript);
    }
    setIsListening(false);
  };

  const processSpeech = async (uri) => {
    setIsProcessing(true);
    try {
      console.log('Processing the recorded audio from URI:', uri);
      // Here you would typically convert audio to text using a speech recognition service.
      // For now, we are simulating that with a placeholder transcript.
      const transcript = 'Simulated transcript from recorded audio';
      return transcript;
    } catch (error) {
      console.error('Error processing speech:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  };

  const sendSpeechCommandToServer = async (transcript) => {
    if (!transcript || !selectedProject) {
      console.error('No transcript or selected project available.');
      return;
    }
    try {
      console.log('Sending command to server:', transcript);
      const responseText = await sendSpeechToServer(transcript, selectedProject._id);
      setCurrentCommand(responseText);
      Speech.speak(responseText);
      console.log('Command response from server:', responseText);
    } catch (error) {
      console.error('Error sending speech to the server:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Voice Assistant</Text>
      <Avatar.Icon size={100} icon="microphone" style={styles.avatar} />
      <Button
        mode="contained"
        onPress={toggleListening}
        disabled={isProcessing}
        style={styles.button}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Button>
      {isListening && <Text>Listening...</Text>}
      {isProcessing && <Text>Processing...</Text>}
      <Text style={styles.commandText}>Current Command: {currentCommand}</Text>
      <List.Section>
        <List.Subheader>Select Project</List.Subheader>
        {projects.map((project) => (
          <List.Item
            key={project._id}
            title={project.name}
            description={project.description}
            onPress={() => fetchProjectDetails(project._id)}
          />
        ))}
      </List.Section>
      {selectedProject && (
        <View>
          <Text style={styles.projectTitle}>{selectedProject.name}</Text>
          <Text>Available Commands:</Text>
          {commands.map((command) => (
            <Text key={command._id}>
              {command.name}: {command.description}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
  commandText: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default VoiceAssistant;
