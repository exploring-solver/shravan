import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Send speech to server with project ID
export const sendSpeechToServer = async (words, projectId) => {
  const prompt = "Please process the following command: " + words;
  try {
    const response = await axios.post(`${BASE_URL}/api/projects/${projectId}/execute`, { command: prompt });
    return response.data.action || 'Command executed.';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Fetch list of projects
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Fetch commands for a project
export const fetchProjectCommands = async (projectId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/commands/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project commands:', error);
    throw error;
  }
};

// Optionally, fetch current command
export const fetchCurrentCommand = async (projectId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/projects/${projectId}/current-command`);
    return response.data.currentCommand;
  } catch (error) {
    console.error('Error fetching current command:', error);
    throw error;
  }
};
