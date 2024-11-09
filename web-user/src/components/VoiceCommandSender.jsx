import React, { useState } from 'react';
import axios from 'axios';
import Config from '../config/Config';
import { useNavigate } from 'react-router-dom';

const VoiceCommandSender = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  // Function to capture voice input (using Web Speech API)
  const captureVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Voice recognition started");
    };

    recognition.onresult = (event) => {
      const spokenCommand = event.results[0][0].transcript;
      console.log(`Voice command recognized: ${spokenCommand}`);
      setCommand(spokenCommand);
    };

    recognition.start();
  };

  // Function to send the command to the backend
  const sendCommand = async () => {
    if (!command) return;

    try {
      const response = await axios.post(`${Config.backendUrl}/api/os-commands/module-execute`, { command }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming the user is authenticated
        }
      });
      setResponse(response.data);
      console.log("Command sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center text-cyan-300">Bylexa Voice Command Interface</h1>
      <h1 className="text-xl font-bold mb-6 text-center text-cyan-300">You are logged in!!</h1>
      
      <button 
        onClick={captureVoiceCommand} 
        className="mb-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Start Voice Command
      </button>
      
      <p className="text-xl mb-4 text-gray-400">Command: <span className="text-cyan-300">{command}</span></p>
      
      <button 
        onClick={sendCommand} 
        className="mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Send Command
      </button>

      {/* Logout Button */}
      <button 
        onClick={logout} 
        className="mb-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Logout
      </button>
      
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg text-left">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Response:</h2>
        <p className="text-gray-300 whitespace-pre-wrap">{response && JSON.stringify(response, null, 2)}</p>
      </div>
    </div>
  );
};

export default VoiceCommandSender;
