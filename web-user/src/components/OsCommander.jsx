import React, { useState } from "react";
import axios from "axios";
import Config from "../config/Config";
import './OsCommander.css';  // Import custom CSS file

const OsCommander = () => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [isShivamMode, setIsShivamMode] = useState(false);
  const [isAukaatMode, setIsAukaatMode] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = () => {
    if (!recognition) {
      setError("Speech Recognition API is not supported in your browser.");
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onspeechend = () => {
      setIsListening(false);
      recognition.stop();
    };

    recognition.onresult = (event) => {
      const spokenCommand = event.results[0][0].transcript;
      console.log("Command recognized:", spokenCommand);
      setCommand(spokenCommand);

      if (isShivamMode) {
        playAudio("shivam.mp3");
      } else if (isAukaatMode) {
        playAudio("aukaat.mp3");
      } else {
        sendCommandToApi(spokenCommand);
      }
    };

    recognition.onerror = (event) => {
      setError("Error occurred in recognition: " + event.error);
      setIsListening(false);
    };
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognition) {
      recognition.stop();
    }
  };

  const sendCommandToApi = async (spokenCommand) => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/os-commands/execute`, {
        command: spokenCommand,
      });
      console.log("Response from API:", response.data);
      setResponse(response.data.result);
    } catch (err) {
      console.error("Error sending command to API:", err);
      setError("Failed to send command to the server.");
    }
  };

  const playAudio = (fileName) => {
    const audio = new Audio(`/${fileName}`);
    audio.play().catch((err) => {
      setError("Error playing audio: " + err.message);
    });
  };

  return (
    <div className="jarvis-container">
      <h1 className="jarvis-title">Bylexa Voice Command Interface</h1>
      
      <div className="jarvis-buttons">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`jarvis-btn ${isListening ? "listening" : ""}`}
        >
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="jarvis-btn stop-btn"
        >
          Stop Listening
        </button>
      </div>

      {command && (
        <p className="jarvis-command">
          <span>Command:</span> {command}
        </p>
      )}

      {response && (
        <p className="jarvis-response">
          <span>Response from Server:</span> {response}
        </p>
      )}

      {error && (
        <p className="jarvis-error">
          <span>Error:</span> {error}
        </p>
      )}
    </div>
  );
};

export default OsCommander;
