import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Config from '../config/Config';
import MicrophoneButton from './MicrophoneButton';

const VoiceCommandSender = () => {
  const [command, setCommand] = useState('');
  const [osResponse, setOsResponse] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false); // New state for Developer Mode
  const navigate = useNavigate();

  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const sendToAssistant = async (command) => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/commands/assistant-command`, {
        command: command,
      });
      setAssistantResponse(response.data.response);
      speakResponse(response.data.response);
    } catch (error) {
      console.error("Error sending to assistant:", error);
      speakResponse("Sorry, I couldn't process that request.");
    }
  };

  const sendToOsCommand = async (command) => {
    try {
      const response = await axios.post(
        `${Config.backendUrl}/api/os-commands/module-execute`, 
        { command }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setOsResponse(response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending OS command:", error);
      return null;
    }
  };

  const captureVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
    };

    recognition.onresult = async (event) => {
      const spokenCommand = event.results[0][0].transcript;
      setCommand(spokenCommand);
      setIsProcessing(true);

      // Send command to both systems
      await Promise.all([
        sendToOsCommand(spokenCommand),
        sendToAssistant(spokenCommand)
      ]);

      setIsProcessing(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      speakResponse("Sorry, I couldn't understand that. Please try again.");
    };

    recognition.start();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-sans p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-cyan-300">Shravan Voice Command Interface</h1>
      <h2 className="text-xl font-bold mb-6 text-center text-cyan-300">You are logged in!</h2>

      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <MicrophoneButton 
          isListening={isListening} 
          onClick={captureVoiceCommand}
          disabled={isProcessing}
        />

        <p className="text-xl mt-4 text-gray-400">
          Command: <span className="text-cyan-300">{command}</span>
        </p>

        {isProcessing && (
          <div className="text-cyan-300 animate-pulse">
            Processing your command...
          </div>
        )}

        <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Assistant Response:</h2>
          <p className="text-gray-300 whitespace-pre-wrap mb-6">{assistantResponse}</p>

          {developerMode && ( // Conditionally render based on developer mode
            <>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Shravan:</h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {osResponse && JSON.stringify(osResponse, null, 2)}
              </p>
            </>
          )}
        </div>

        <button 
          onClick={() => setDeveloperMode(!developerMode)} 
          className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {developerMode ? "Disable Developer Mode" : "Enable Developer Mode"}
        </button>

        <button 
          onClick={logout} 
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-pink-500 hover:to-red-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VoiceCommandSender;
