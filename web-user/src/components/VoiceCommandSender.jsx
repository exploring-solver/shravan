import React, { useState } from 'react';
import axios from 'axios';
import Config from '../config/Config';
import { useNavigate } from 'react-router-dom';
import MicrophoneButton from './MicrophoneButton'; // Import the new component

const VoiceCommandSender = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const captureVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const spokenCommand = event.results[0][0].transcript;
      console.log(`Voice command recognized: ${spokenCommand}`);
      setCommand(spokenCommand);
      setIsListening(false);

      try {
        const response = await axios.post(`${Config.backendUrl}/api/os-commands/module-execute`, { command: spokenCommand }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResponse(response.data);
        console.log("Command sent successfully:", response.data);
      } catch (error) {
        console.error("Error sending command:", error);
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.start();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center text-cyan-300">Shravan Voice Command Interface</h1>
      <h1 className="text-xl font-bold mb-6 text-center text-cyan-300">You are logged in!!</h1>

      {/* Reusable MicrophoneButton Component */}
      <MicrophoneButton isListening={isListening} onClick={captureVoiceCommand} />

      <p className="text-xl mt-4 text-gray-400">Command: <span className="text-cyan-300">{command}</span></p>

      <button 
        onClick={logout} 
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-pink-500 hover:to-red-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Logout
      </button>
      
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-left mt-6">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Response:</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{response && JSON.stringify(response, null, 2)}</p>
      </div>
    </div>
  );
};

export default VoiceCommandSender;
