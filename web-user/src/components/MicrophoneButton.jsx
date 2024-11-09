// MicrophoneButton.js
import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

const MicrophoneButton = ({ isListening, onClick }) => (
  <div 
    onClick={onClick} 
    className={`relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 ${isListening ? 'animate-pulse-scale' : ''}`}
  >
    <div className={`absolute w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center ${isListening ? 'animate-listening' : ''}`}>
      <FaMicrophone className="w-10 h-10 text-blue-500" />
    </div>
  </div>
);

export default MicrophoneButton;
