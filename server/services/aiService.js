const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY_12607);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


exports.getAssistantResponse = async (command) => {
  const prompt = `You are a helpful voice assistant. Given the following user command: "${command}", 
  respond with an appropriate and natural answer`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log(result)
    return responseText;
  } catch (error) {
    console.error('Error generating assistant response:', error);
    throw new Error('Failed to get assistant response');
  }
};

exports.interpretCommand = async (command, availableCommands) => {
  const prompt = `Interpret the following command for an IoT device: "${command}". 
Available commands are: ${availableCommands.join(', ')}. 
Return only the name of the most appropriate command from the available list without any additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const interpretedCommand = result.response.text().trim();

    if (availableCommands.includes(interpretedCommand)) {
      return { commandName: interpretedCommand };
    } else {
      return null; // No valid command found
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to interpret command');
  }
};


exports.getParameterValues = async (userCommand, parameterNames) => {
  const prompt = `Given the user command: "${userCommand}", and the required parameters: ${parameterNames.join(', ')}, 
provide the most probable values for these parameters based on the command context.
Return the values in the same order as the parameters, separated by commas.
Format: "value1, value2, ...".
Do not include any additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const parameterValuesString = result.response.text().trim();

    const parameterValues = parameterValuesString.split(',').map(value => value.trim());

    if (parameterValues.length !== parameterNames.length) {
      // Handle mismatch between expected and received parameters
      throw new Error('Mismatch between parameter names and values');
    }
    console.log(parameterValues);
    return parameterValues;
  } catch (error) {
    console.error('Error generating parameter values:', error);
    throw new Error('Failed to get parameter values');
  }
};



// not being used actually
// Extract task, application, and action from the command using LLM
exports.extractTaskApplicationAction = async (command) => {
  const prompt = `Analyze the following user command: "${command}".
Extract and return the 'task', 'application', and 'action' as a JSON object in the format:
{"task": "value", "application": "value", "action": "value"}.
If any field is not applicable, set its value to null.`;

  try {
    const result = await model.generateContent(prompt);
    const parsedResponse = JSON.parse(result.response.text.trim());
    return parsedResponse;
  } catch (error) {
    console.error('Error extracting task, application, and action:', error);
    throw new Error('Failed to extract task, application, and action');
  }
};