import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';
import { Button, TextField, Card, CardContent, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [editCommand, setEditCommand] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [deleteCommandId, setDeleteCommandId] = useState(null);
  const [projectDetails, setProjectDetails] = useState({ name: '', description: '' });
  const [editCommandData, setEditCommandData] = useState({ name: '', description: '', parameters: [] });

  // Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  recognition.continuous = true;
  recognition.interimResults = false;

  useEffect(() => {
    const fetchProjectAndCommands = async () => {
      try {
        const projectResponse = await axios.get(`${Config.backendUrl}/api/projects/${id}`);
        setProject(projectResponse.data);
        setProjectDetails({ name: projectResponse.data.name, description: projectResponse.data.description });

        const commandsResponse = await axios.get(`${Config.backendUrl}/api/commands/project/${id}`);
        setCommands(commandsResponse.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchProjectAndCommands();
  }, [id]);

  const handleExecuteCommand = async () => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/projects/${id}/execute`, { command: newCommand });
      alert(`Command executed: ${response.data.action}`);
      setNewCommand('');
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  const toggleListening = () => {
    setIsListening(prevState => !prevState);
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setNewCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const handleUpdateProject = async () => {
    try {
      await axios.put(`${Config.backendUrl}/api/projects/${id}`, projectDetails);
      alert('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteCommand = async () => {
    try {
      await axios.delete(`${Config.backendUrl}/api/commands/${deleteCommandId}`);
      setCommands(commands.filter(cmd => cmd._id !== deleteCommandId));
      setOpenModal(false);
    } catch (error) {
      console.error('Error deleting command:', error);
    }
  };

  const handleUpdateCommand = async (commandId) => {
    try {
      const response = await axios.put(`${Config.backendUrl}/api/commands/${commandId}`, editCommandData);
      setCommands(commands.map(cmd => cmd._id === commandId ? response.data : cmd));
      setEditCommand(null);
      setOpenUpdateModal(false);
    } catch (error) {
      console.error('Error updating command:', error);
    }
  };

  const handleAddCommand = async () => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/commands`, { ...newCommand, project: id });
      setCommands([...commands, response.data]);
      setNewCommand('');
    } catch (error) {
      console.error('Error adding command:', error);
    }
  };

  if (!project) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className='px-20 text-white bg-gray-900 min-h-screen p-6'>
      {/* Project Header */}
      <Typography variant="h2" gutterBottom color="primary" style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        {project.name}
      </Typography>
      <a href={Config.assistanturl} className="mb-6 text-red-600 hover:underline">Click here to visit the online voice assistant</a>
      <TextField
        fullWidth
        label="Project Name"
        value={projectDetails.name}
        onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
        variant="outlined"
        margin="normal"
        style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
        InputLabelProps={{ style: { color: '#00E5FF' } }}
        InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
      />
      <TextField
        fullWidth
        label="Project Description"
        value={projectDetails.description}
        onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
        InputLabelProps={{ style: { color: '#00E5FF' } }}
        InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
      />
      <Button variant="contained" color="primary" onClick={handleUpdateProject} style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
        Update Project
      </Button>

      <br /><br />

      {/* Commands Section */}
      <Typography variant="h4" gutterBottom style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        Available Commands
      </Typography>
      {commands.map(command => (
        <Card key={command._id} variant="outlined" style={{ marginBottom: '16px', backgroundColor: '#1C1C1C', border: '1px solid #00E5FF' }}>
          <CardContent>
            <Typography variant="h6" color="textPrimary" style={{ color: '#00E5FF' }}>
              {command.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ color: '#C6FFDD' }}>
              {command.description}
            </Typography>

            {command.parameters && command.parameters.length > 0 && (
              <div>
                <Typography variant="subtitle1" color="secondary" style={{ color: '#76FF03' }}>Parameters:</Typography>
                <ul>
                  {command.parameters.map((param, index) => (
                    <li key={index} style={{ color: '#C6FFDD' }}>{param}</li>
                  ))}
                </ul>
              </div>
            )}

            <IconButton color="primary" onClick={() => { setEditCommand(command); setEditCommandData(command); setOpenUpdateModal(true); }}>
              <Edit style={{ color: '#76FF03' }} />
            </IconButton>
            <IconButton color="secondary" onClick={() => { setDeleteCommandId(command._id); setOpenModal(true); }}>
              <Delete style={{ color: '#F44336' }} />
            </IconButton>
          </CardContent>
        </Card>
      ))}

      {/* Add Command Section */}
      <TextField
        fullWidth
        label="New Command"
        value={newCommand.name || ''}
        onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
        placeholder="Enter a command name"
        variant="outlined"
        margin="normal"
        style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
        InputLabelProps={{ style: { color: '#00E5FF' } }}
        InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
      />
      <TextField
        fullWidth
        label="Command Description"
        value={newCommand.description || ''}
        onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
        placeholder="Enter a command description"
        variant="outlined"
        margin="normal"
        style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
        InputLabelProps={{ style: { color: '#00E5FF' } }}
        InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
      />
      <Button variant="contained" color="primary" onClick={handleAddCommand} style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
        Add Command
      </Button>

      {/* Delete Confirmation Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this command? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary" style={{ color: '#00E5FF' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteCommand} color="secondary" style={{ color: '#F44336' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Command Modal */}
      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
        <DialogTitle>Update Command</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Command Name"
            value={editCommandData.name}
            onChange={(e) => setEditCommandData({ ...editCommandData, name: e.target.value })}
            margin="normal"
            variant="outlined"
            style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
            InputLabelProps={{ style: { color: '#00E5FF' } }}
            InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
          />
          <TextField
            fullWidth
            label="Command Description"
            value={editCommandData.description}
            onChange={(e) => setEditCommandData({ ...editCommandData, description: e.target.value })}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
            InputLabelProps={{ style: { color: '#00E5FF' } }}
            InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)} color="primary" style={{ color: '#00E5FF' }}>
            Cancel
          </Button>
          <Button onClick={() => handleUpdateCommand(editCommand._id)} color="primary" style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Microcontroller Integration Section */}
      <Typography variant="h4" gutterBottom style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        Microcontroller Integration
      </Typography>
      <Typography variant="body1" style={{ color: '#C6FFDD' }}>
        To integrate this project with your microcontroller, use the following URL:
      </Typography>
      <Box
        component="code"
        sx={{ display: 'block', padding: '12px', backgroundColor: '#1C1C1C', borderRadius: '8px', color: '#00E5FF', overflowX: 'auto' }}
      >
        {`${Config.backendUrl}/api/projects/${id}/current-command`}
      </Box>
    </div>
  );
};

export default ProjectDetail;
