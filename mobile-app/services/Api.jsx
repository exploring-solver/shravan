import axios from 'axios';
import Config from '../config/Config';

const api = axios.create({
  baseURL: Config.backendUrl,
});

export const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectDetails = async (id) => {
  try {
    const projectResponse = await api.get(`/api/projects/${id}`);
    const commandsResponse = await api.get(`/api/commands/project/${id}`);
    return {
      project: projectResponse.data,
      commands: commandsResponse.data,
    };
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const parseProjectCode = async (projectId, codeData) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/parse-code`, codeData);
    return response.data;
  } catch (error) {
    console.error('Error parsing project code:', error);
    throw error;
  }
};

export const executeCommand = async (projectId, command) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/execute`, { command });
    return response.data;
  } catch (error) {
    console.error('Error executing command:', error);
    throw error;
  }
};

export const sendSpeechToServer = async (transcript, projectId) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/execute`, { transcript });
    return response.data.action;
  } catch (error) {
    console.error('Error sending speech to server:', error);
    throw error;
  }
};

export const fetchProjectCommands = async (projectId) => {
  try {
    const response = await api.get(`/api/commands/project/${projectId}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching project commands:', error);
    throw error;
  }
};

export const osCommand = async (projectId, command) => {
  try {
    const response = await api.post(`/api/os-commands/execute`, { command });
    return response.data;
  } catch (error) {
    console.error('Error fetching command response:', error);
    throw error;
  }
};
