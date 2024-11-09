const { GoogleGenerativeAI } = require('@google/generative-ai');
const { spawn } = require('child_process');
const { sendCommandToAgent } = require('../config/websocket');
const config = require('../config');
const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const jwt = require('jsonwebtoken');
// const {interpretCommand} = require('../services/ollamaService')

//Todo : single command based output to reduce redundancy and optimize the workflow
const interpretCommand = async (command) => {
  const prompt = `
You are an assistant that interprets user commands into structured JSON objects for execution.
enter all urls with https untill mentioned explicitly to be http or something else
**Instructions:**

- Read the following command: "${command}"
- Extract relevant information and represent it as a JSON object.
- Possible keys include:
  whenever a script is mentioned pass the action as "script" and name of script in "script_name"
  - **action**: The primary action to perform (e.g., "open", "run", "script", "copy", "delete", "move", "schedule", "media", "close").
  - **application**: The application name involved (e.g., "notepad", "media player", "any application name give in command","pass it as chrome if a website is to be opened").
  - **task**: Specific task or URL (e.g., "google.com", "write a letter").
  - **file_path**: Path to a file or directory.
  - **command_line**: Command-line instruction to execute.
  - **script_name**: Name of the custom script to execute (used with action: "script").
  write everything in small character in key and value
  - **args**: Array of arguments/parameters for scripts (e.g., ["--input", "file.txt", "--verbose"]). and if there is aruement with a key and value then pass as [{"key1_name":"value1", {"key2_name":"value2"}, {"key3_name":"value3"}]
  - **time**: Time for scheduling tasks (e.g., "5 PM", "2023-10-01 14:00").
  - **media_action**: Action for media control (e.g., "play", "pause", "stop", "forward", "rewind", "volume_up", "volume_down", "mute", "seek").
  - **media**: Media file, stream, or player to control.
  - **seek_time**: Time in seconds to seek forward/backward (e.g., 30 for 30 seconds).
  - **volume_level**: Volume level for media (0-100).
  - **clipboard_action**: Action for clipboard (e.g., "copy", "paste").
  - **text**: Text to copy to or paste from clipboard.
  - **file_action**: File operation (e.g., "copy", "move", "delete", "create_directory").
  - **source**: Source path for file operations.
  - **destination**: Destination path for file operations.

- If a parameter is not applicable or not mentioned, omit it.
- **Output the result as minified JSON only.**

**Examples:**

1. **Command**: "Run the backup script with verbose mode and target directory /data"
   **Output**: {"action":"script","script_name":"backup","args":["--verbose","--target","/data"]}

2. **Command**: "Fast forward the media player by 30 seconds"
   **Output**: {"action":"media","media_action":"forward","seek_time":30}

3. **Command**: "Set media volume to 75 percent"
   **Output**: {"action":"media","media_action":"volume","volume_level":75}

4. **Command**: "Run data processing script with input file data.csv and output file result.json"
   **Output**: {"action":"script","script_name":"data_processing","args":["--input","data.csv","--output","result.json"]}

5. **Command**: "Pause the current media"
   **Output**: {"action":"media","media_action":"pause"}

6. **Command**: "Run network diagnostic script with retry count 3 and verbose logging"
   **Output**: {"action":"script","script_name":"network_diagnostic","args":["--retries","3","--verbose"]}

Now, interpret the following command and provide the JSON output.
`;

  try {
    console.log(`Sending prompt to LLM: ${prompt}`);
    const result = await model.generateContent(prompt);
    let responseText = (await result.response.text()).trim();

    // Sanitize the response to ensure it's valid JSON
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Validate JSON format
    if (!responseText.startsWith('{') && !responseText.startsWith('[')) {
      throw new Error('Response is not valid JSON');
    }

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

// Function to execute the OS command using Python script
const executeOSCommand = async (interpretation) => {
  return new Promise((resolve, reject) => {
    console.log('Executing OS command with interpretation:', interpretation); // Log interpretation
    const pythonProcess = spawn('python', ['scripts/os_interaction.py', JSON.stringify(interpretation)]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Python script output: ${data.toString()}`); // Log Python script output
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`); // Log any errors from the Python script
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python script finished successfully'); // Log successful completion
        resolve(output.trim());
      } else {
        console.error(`Python script exited with code ${code}`); // Log error code if script fails
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
};

// Controller to handle the OS command
exports.handleOSCommand = async (req, res) => {
  try {
    const { command } = req.body;
    console.log(`Received command: ${command}`); // Log received command

    // Interpret the command
    const interpretation = await interpretCommand(command);
    console.log('Interpretation result:', interpretation); // Log result of interpretation

    // If the interpretation has a message, return it to the client
    if (interpretation.message) {
      return res.status(200).json({ success: false, message: interpretation.message });
    }

    // Otherwise, execute the OS command
    const result = await executeOSCommand(interpretation);
    console.log('Final result after executing OS command:', result); // Log result of OS command execution

    // Respond back to the client
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Unexpected error handling OS command:', error.message); // Log any unexpected errors
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
  }
};

exports.handleModuleOsCommand = async (req, res) => {
  const { command } = req.body;
  const userToken = req.user.token;
  const decoded = jwt.verify(userToken, config.API_KEY_JWT);
  req.user = decoded;

  if (!command) {
    return res.status(400).json({ message: 'No command provided' });
  }

  try {
    // Interpret the command using Gemini
    const interpretedCommand = await interpretCommand(command);

    if (interpretedCommand.success === false) {
      return res.status(400).json({ message: interpretedCommand.message });
    }

    // Send the interpreted command to the user's Python module via WebSocket
    sendCommandToAgent(req.user.email, interpretedCommand);

    // Send response back to the frontend
    res.status(200).json({ message: 'Command sent successfully', command: interpretedCommand });
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(500).json({ message: 'Failed to process command' });
  }
};