// MicrophoneButton.js
import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

const MicrophoneButton = ({ isListening, onClick }) => (
  <div 
    onClick={onClick} 
    className="relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500"
  >
    {/* Outer Rings */}
    {isListening && (
      <>
        <div style={ringStyle1} className="absolute rounded-full border-2 border-cyan-500 animate-pulse-ring"></div>
        <div style={ringStyle2} className="absolute rounded-full border-2 border-blue-500 animate-pulse-ring"></div>
        <div style={ringStyle3} className="absolute rounded-full border-2 border-cyan-500 animate-pulse-ring"></div>
      </>
    )}

    {/* Inner Microphone Container */}
    <div className="absolute w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
      <FaMicrophone className="w-10 h-10 text-blue-500" />
    </div>

    {/* Inline CSS for Keyframes Animation */}
    <style>
      {`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}
    </style>
  </div>
);

// Ring styles for each of the three rings with increasing sizes and delays
const ringStyle1 = {
  width: '6rem',
  height: '6rem',
  animationDelay: '0s',
};

const ringStyle2 = {
  width: '8rem',
  height: '8rem',
  animationDelay: '0.15s',
};

const ringStyle3 = {
  width: '10rem',
  height: '10rem',
  animationDelay: '0.3s',
};

export default MicrophoneButton;
