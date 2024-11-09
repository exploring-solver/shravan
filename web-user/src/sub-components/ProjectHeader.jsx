import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import Config from '../config/Config';

const ProjectHeader = ({ projectDetails, setProjectDetails, handleUpdateProject }) => {
  return (
    <>
      <Typography variant="h2" gutterBottom color="primary" style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        {projectDetails.name}
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
    </>
  );
};

export default ProjectHeader;
