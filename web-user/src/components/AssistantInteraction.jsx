import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, MicOff } from 'lucide-react';
import Config from '../config/Config';

const AssistantInteraction = () => {
    const [userCommand, setUserCommand] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                setUserCommand((prev) => prev + ' ' + transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setError('Failed to recognize speech.');
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const handleInputChange = (e) => {
        setUserCommand(e.target.value);
    };

    const sendCommandToAssistant = async (command = userCommand) => {
        if (!command.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${Config.backendUrl}/api/commands/assistant-command`, {
                command: command,
            });

            setAssistantResponse(response.data.response);
            speakResponse(response.data.response);
        } catch (err) {
            setError('Failed to get assistant response.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            setError('Speech recognition is not supported in this browser.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const speakResponse = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="bg-[#0b0f1a] bg-radial-gradient from-[rgba(0,229,255,0.1)] to-transparent min-h-screen text-white p-8 font-['Orbitron']">
            <div className="max-w-2xl mx-auto bg-[rgba(13,17,29,0.8)] p-8 rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                <h1 className="text-4xl text-[#00e5ff] text-center mb-8 font-bold shadow-[0_0_10px_rgba(0,229,255,0.7)]">Voice Assistant</h1>
                <div className="mb-6">
                    <textarea
                        className="w-full h-24 p-3 bg-[#151b2b] border border-[#00e5ff] text-[#00e5ff] text-lg rounded-lg outline-none transition-colors duration-300 focus:border-[#00c1e5]"
                        value={userCommand}
                        onChange={handleInputChange}
                        placeholder="Ask a question or give a command..."
                    ></textarea>
                </div>

                <div className="flex justify-between mb-6">
                    <button
                        className={`px-5 py-3 text-lg font-bold uppercase bg-transparent text-[#00e5ff] border-2 border-[#00e5ff] rounded-lg cursor-pointer relative transition-all duration-300 hover:after:opacity-100 after:content-[''] after:absolute after:top-[-4px] after:right-[-4px] after:bottom-[-4px] after:left-[-4px] after:rounded-lg after:border-2 after:border-transparent after:bg-gradient-to-r after:from-[#00e5ff] after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 ${
                            isLoading ? 'bg-[#3a3f50] text-[#b0b0b0] cursor-not-allowed' : 'hover:bg-[#00e5ff] hover:text-[#0b0f1a]'
                        }`}
                        onClick={() => sendCommandToAssistant()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Send Command'}
                    </button>
                    <button
                        className={`px-5 py-3 text-lg font-bold uppercase bg-transparent text-[#00e5ff] border-2 border-[#00e5ff] rounded-lg cursor-pointer relative transition-all duration-300 hover:after:opacity-100 after:content-[''] after:absolute after:top-[-4px] after:right-[-4px] after:bottom-[-4px] after:left-[-4px] after:rounded-lg after:border-2 after:border-transparent after:bg-gradient-to-r after:from-[#00e5ff] after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 flex items-center ${
                            isListening ? 'bg-[#ff3d00]' : 'bg-black'
                        }`}
                        onClick={toggleListening}
                    >
                        {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>
                </div>

                {assistantResponse && (
                    <div className="bg-[#151b2b] p-5 rounded-lg shadow-[0_0_10px_rgba(0,229,255,0.4)] animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-2">Assistant Response:</h2>
                        <p className="text-lg">{assistantResponse}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-[#ff3d00] p-5 rounded-lg shadow-[0_0_10px_rgba(255,61,0,0.4)] animate-fadeIn">
                        <p className="text-lg">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssistantInteraction;