/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';

const DocumentationPage = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white px-8 py-12 '>
      <div className='max-w-5xl mx-auto'>
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Project Documentation: Integrating Voice Assistant with IoT Microcontroller</h1>

        <p className="mb-6 text-lg">
          This documentation explains how the voice assistant can be used to control IoT devices by integrating microcontroller functions with voice commands. The system works by parsing the voice commands through a server and executing the appropriate function on your IoT device based on the server's response.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Overview of the System</h2>
        <p className="mb-4">
          The code provided will be used to extract the functions implemented in your microcontroller and allow you to control the IoT devices using voice commands. The voice assistant interacts with the server, which processes the spoken command and identifies the appropriate action by matching it with the predefined functions in your code.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Voice Integration with Your Microcontroller</h2>
        <p className="mb-4">
          To enable voice control, you need to integrate the URL provided by the server with your microcontroller project. The URL is specific to your project and is shared with you during the setup. The URL is where you will send a <strong>GET request</strong> to retrieve the current command that has been set in the database by the voice assistant.
        </p>
        <p className="mb-4">
          Your microcontroller's firmware should periodically poll the server for the current command and execute the corresponding function. If the current command returned from the server matches a function in your microcontroller code, that function should be executed.
        </p>

        <h3 className="text-xl font-semibold mb-4 text-blue-300">Handling Non-Executable Functions</h3>
        <p className="mb-4">
          Certain functions in your microcontroller code (such as <code>loop()</code>, <code>setup()</code>, or <code>start()</code>) may not be directly related to the bot's actionable commands. These are part of initialization or continuous logic and should not be executed as part of a voice command. You can skip executing these functions when they are returned by the server.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Server Response Time and Future Enhancements</h2>
        <p className="mb-4">
          The system's performance in executing commands depends heavily on the server's response time. After you speak a command to the voice assistant, the server processes it and stores the result in the database. Your microcontroller polls the server to check for new commands.
        </p>
        <p className="mb-4">
          As of now, this process is based on HTTP requests, which may introduce a slight delay between issuing the command and seeing the action on your IoT device. In future iterations, the system will adopt a faster communication method such as <strong>UDP or WebSockets</strong> for real-time, low-latency control of the bot.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Example of Code Integration</h2>

        <h3 className="text-xl font-semibold mb-2 text-blue-300">Original Microcontroller Code</h3>
        <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (buttonPressed()) {
    turnOnLed();
  }
}

void turnOnLed() {
  digitalWrite(LED_BUILTIN, HIGH);
}

void turnOffLed() {
  digitalWrite(LED_BUILTIN, LOW);
}
`}
        </pre>

        <h3 className="text-xl font-semibold mb-2 text-blue-300">Voicified Code Example</h3>
        <p className="mb-4">
          Below is the same code modified to respond to voice commands. The microcontroller now polls the server at the provided URL to check for a new command. If the command matches the name of a function, that function is executed:
        </p>
        <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  // Initialize WiFi connection
}

void loop() {
  String command = getCommandFromServer(); // Poll the server for the current command
  if (command == "turnOnLed") {
    turnOnLed();
  } else if (command == "turnOffLed") {
    turnOffLed();
  }
}

void turnOnLed() {
  digitalWrite(LED_BUILTIN, HIGH);
}

void turnOffLed() {
  digitalWrite(LED_BUILTIN, LOW);
}

String getCommandFromServer() {
  // Make a GET request to the server URL
  // Parse the response and return the command as a string
}
`}
        </pre>

        <h3 className="text-xl font-semibold mb-2 text-blue-300">How to Use the Voicified Code</h3>
        <p className="mb-4">
          To integrate voice control into your existing IoT project:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Send a GET request to the provided URL at regular intervals to check for new commands.</li>
          <li>Compare the command from the server to the function names in your code.</li>
          <li>Execute the corresponding function when the command matches.</li>
          <li>Ensure non-executable functions like <code>loop()</code> and <code>setup()</code> are not treated as bot commands.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Future Plans: Real-Time Communication</h2>
        <p className="mb-4">
          Currently, the communication between the voice assistant and the bot is done via HTTP GET requests, which may introduce a slight delay depending on network conditions. In the future, this will be improved by introducing <strong>UDP or WebSocket-based communication</strong> for faster, real-time command execution with minimal latency.
        </p>

        <p className="text-lg font-semibold">
          We hope this guide helps you integrate voice control seamlessly with your microcontroller project. Feel free to customize the system to suit your project's needs.
        </p>
      </div>
    </div>
  );
};

export default DocumentationPage;
