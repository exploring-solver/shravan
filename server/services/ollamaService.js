const axios = require('axios');

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

/**
 * Utility function to interact with Ollama API
 * @param {string} prompt - The prompt to send to Ollama
 * @param {Object} options - Configuration options
 * @param {string} options.model - The model to use (default: 'mistral')
 * @param {number} options.temperature - Temperature for response generation (default: 0.7)
 * @returns {Promise<string>} - The generated response
 */
const generateWithOllama = async (prompt, options = {}) => {
  const {
    model = 'llama3.2:1b',
    temperature = 0.7
  } = options;

  try {
    // Configure the request payload
    const payload = {
      model,
      prompt,
      stream: false,
      options: {
        temperature
      }
    };

    // Make the request to Ollama
    const response = await axios.post(OLLAMA_API_URL, payload);
    
    // Extract the response text
    const generatedText = response.data.response;
console.log(generatedText);
    // Clean up the response similar to the original code
    let cleanedResponse = generatedText.trim();
    
    // Remove any markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return cleanedResponse;
  } catch (error) {
    console.error('Error generating response with Ollama:', error);
    throw new Error('Failed to generate response with Ollama: ' + error.message);
  }
};

/**
 * Modified interpretCommand function using Ollama
 * @param {string} command - The command to interpret
 * @returns {Promise<Object>} - The interpretation result
 */
const interpretCommand = async (command) => {
  const prompt = `
You are a JSON command interpreter that converts user commands into structured JSON objects. Return only the JSON object without any additional text or formatting.
set null to the commands not applicable
Required JSON structure:
- action: primary action (open, script, copy, delete, move, schedule, media, close)
- application: target application name (application name mentioned after open)
- task: specific task or url (always use https:// unless specified)
- command_line: command to execute, or null if not provided
- script_name: name of script (when action is "script")
- args: array of arguments OR array of objects for key-value pairs [{key_name:value}]
- media: media file/stream
- seek_time: seconds to seek
- volume_level: 0-100

Rules:
- Use lowercase for all keys and values
- Omit any unused parameters
- Return only the JSON object
- No additional text or explanation
- Ensure valid JSON format for direct parsing

Parse the following command and return only the JSON object:`;

  try {
    console.log(`Sending prompt to Ollama: ${prompt}`);
    const responseText = await generateWithOllama(prompt);

    // Validate JSON format
    if (!responseText.startsWith('{') && !responseText.startsWith('[')) {
      throw new Error('Response is not valid JSON');
    }
    console.log("Response: ",responseText);
    const interpretedCommand = JSON.parse(responseText);
    console.log('Interpreted command:', interpretedCommand);

    // Validate required fields based on action type
    if (!interpretedCommand.action) {
      return { success: false, message: "Error: 'action' not specified in command." };
    }

    // Additional validation for script commands
    if (interpretedCommand.action === 'script' && !interpretedCommand.script_name) {
      return { success: false, message: "Error: 'script_name' required for script action." };
    }

    // Additional validation for media commands
    if (interpretedCommand.action === 'media' && !interpretedCommand.media_action) {
      return { success: false, message: "Error: 'media_action' required for media action." };
    }

    return { success: true, command: interpretedCommand };
  } catch (error) {
    console.error('Error interpreting command:', error);

    if (error instanceof SyntaxError || error.message.includes('Unexpected token')) {
      return { success: false, message: 'Sorry, I didn\'t get that. Please try again.' };
    }

    return { success: false, message: 'Failed to interpret the command.' };
  }
};

module.exports = {
  generateWithOllama,
  interpretCommand
};