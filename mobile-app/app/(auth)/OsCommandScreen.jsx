import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Config from '../../config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const OsCommandScreen = () => {
    const [isListening, setIsListening] = useState(false);
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState(null);
    const [recording, setRecording] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [recording]);

    const startListening = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording: recordingObject } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recordingObject);
            setIsListening(true);
            console.log('Listening...');
        } catch (err) {
            console.error('Failed to start recording', err);
            setError('Failed to start recording');
        }
    };

    const stopListening = async () => {
        if (!recording) {
            return;
        }
        setIsListening(false);
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);

            const transcribedText = await convertSpeechToText(uri);

            if (transcribedText) {
                setCommand(transcribedText);
                sendCommandToApi(transcribedText);
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
            setError('Failed to stop recording');
        }
    };

    const convertSpeechToText = async (audioUri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(audioUri);
            console.log('File info:', fileInfo);

            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            const fileData = await FileSystem.readAsStringAsync(audioUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const formData = new FormData();
            formData.append('file', {
                uri: audioUri,
                name: 'audio.3gp',
                type: 'audio/3gp',
            });
            formData.append('prompt', 'Convert this speech to text');

            const response = await axios.post(`${Config.backendUrl}/api/util/speech-to-text`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.data && response.data.transcribedText) {
                console.log('Transcribed text:', response.data.transcribedText);
                return response.data.transcribedText;
            } else {
                setError('Failed to transcribe audio.');
                return null;
            }
        } catch (err) {
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
            } else if (err.request) {
                console.error('Error request:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
            setError('Error converting speech to text.');
            return null;
        }
    };

    const sendCommandToApi = async (spokenCommand) => {
        try {
            console.log('Sending transcribed command to API:', spokenCommand);
            const response = await axios.post(`${Config.backendUrl}/api/os-commands/execute`, {
                command: spokenCommand,
            });
            console.log('Response from API:', response.data);
            setResponse(response.data.result);
        } catch (err) {
            console.error('Error sending command to API:', err);
            setError('Failed to send command to the server.');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Remove the token from storage
            navigation.navigate('welcome'); // Navigate to welcome screen
        } catch (err) {
            console.error('Error during logout:', err);
            setError('Failed to log out.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shravan&apos;s {"\n"}Voice Command Interface</Text>
            <Text style={styles.subtitle}>{}</Text>

            <TouchableOpacity
                onPress={isListening ? stopListening : startListening}
                style={[styles.button, isListening ? styles.stopButton : styles.startButton]}
            >
                <Text style={styles.buttonText}>
                    {isListening ? 'Stop Voice Command' : 'Start Voice Command'}
                </Text>
            </TouchableOpacity>

            {command ? (
                <Text style={styles.responseText}>
                    <Text style={styles.boldText}>Command:</Text> {command}
                </Text>
            ) : null}

            <TouchableOpacity onPress={() => sendCommandToApi(command)} style={styles.sendButton}>
                <Text style={styles.buttonText}>Send Command</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.responseBox}>
                <Text style={styles.responseLabel}>Response:</Text> {response || 'Awaiting response...'}
            </Text>

            {error ? (
                <Text style={styles.errorText}>
                    <Text style={styles.boldText}>Error:</Text> {error}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#1F2937', // Dark theme background
    },
    title: {
        alignItems:'center',
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#60A5FA', // Light blue title
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#A1A1AA', // Light gray subtitle
        marginBottom: 30,
    },
    button: {
        width: '60%',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#3B82F6', // Blue for start button
    },
    stopButton: {
        backgroundColor: '#EF4444', // Red for stop button
    },
    sendButton: {
        backgroundColor: '#10B981', // Green for send button
        width: '60%',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: '#F87171', // Red for logout button
        width: '60%',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
    },
    responseText: {
        fontSize: 16,
        color: '#F9FAFB', // Light text color
        marginBottom: 10,
        textAlign: 'center',
    },
    responseBox: {
        backgroundColor: '#374151', // Darker box for response
        color: '#60A5FA', // Light blue text for response label
        padding: 10,
        borderRadius: 8,
        width: '90%',
        marginTop: 20,
        textAlign: 'center',
    },
    responseLabel: {
        fontWeight: 'bold',
        color: '#60A5FA',
    },
    errorText: {
        fontSize: 16,
        color: '#F87171',
        marginTop: 10,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default OsCommandScreen;
