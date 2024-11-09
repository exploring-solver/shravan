import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const UpdateCommandModal = ({ open, onClose, command, handleUpdateCommand }) => {
  const [editCommandData, setEditCommandData] = useState({ ...command });
  const [parameterInput, setParameterInput] = useState('');

  const handleAddParameter = () => {
    if (parameterInput.trim() !== '') {
      setEditCommandData({
        ...editCommandData,
        parameters: [...(editCommandData.parameters || []), parameterInput.trim()]
      });
      setParameterInput('');
    }
  };

  const handleDeleteParameter = (paramToDelete) => {
    setEditCommandData({
      ...editCommandData,
      parameters: editCommandData.parameters.filter(param => param !== paramToDelete)
    });
  };

  const handleSubmit = () => {
    handleUpdateCommand(editCommandData);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{background:""}}>
      <DialogTitle>Update Command</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Command Name"
          value={editCommandData.name}
          onChange={(e) => setEditCommandData({ ...editCommandData, name: e.target.value })}
          margin="normal"
          variant="outlined"
          style={{ color: '#00E5FF' }}
          InputProps={{ style: { border: '1px solid #00E5FF' } }}
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
          style={{ color: '#00E5FF' }}
          InputProps={{ style: { border: '1px solid #00E5FF' } }}
        />

        {/* Parameters Editing */}
        <TextField
          fullWidth
          label="Add Parameter"
          value={parameterInput}
          onChange={(e) => setParameterInput(e.target.value)}
          placeholder="Enter a parameter"
          variant="outlined"
          margin="normal"
          style={{ color: '#00E5FF' }}
          InputProps={{ style: { border: '1px solid #00E5FF' } }}
        />
        <Button variant="contained" color="primary" onClick={handleAddParameter} style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
          Add Parameter
        </Button>

        {editCommandData.parameters && editCommandData.parameters.length > 0 && (
          <ul className=''>
            <h1 className='text-xl pt-3'>Current Parameters:</h1>
            {editCommandData.parameters.map((param, index) => (
              <li key={index} className='my-2 p-2 w-fit rounded' style={{ color: '#C6FFDD', background:"black" }}>
                {param}
                <IconButton onClick={() => handleDeleteParameter(param)} color="secondary" size="small">
                  <Delete style={{ color: '#F44336' }} />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" style={{ color: '#00E5FF' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCommandModal;
