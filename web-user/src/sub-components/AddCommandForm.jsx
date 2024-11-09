import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const AddCommandForm = ({ handleAddCommand }) => {
    const [newCommand, setNewCommand] = useState({ name: '', description: '', parameters: [] });
    const [parameterInput, setParameterInput] = useState('');

    const handleAddParameter = () => {
        if (parameterInput.trim() !== '') {
            setNewCommand({
                ...newCommand,
                parameters: [...newCommand.parameters, parameterInput.trim()]
            });
            setParameterInput('');
        }
    };

    const handleSubmit = () => {
        handleAddCommand(newCommand);
        setNewCommand({ name: '', description: '', parameters: [] });
        setParameterInput('');
    };

    return (
        <>
            <TextField
                fullWidth
                label="New Command"
                value={newCommand.name}
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
                value={newCommand.description}
                onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                placeholder="Enter a command description"
                variant="outlined"
                margin="normal"
                style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
                InputLabelProps={{ style: { color: '#00E5FF' } }}
                InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
            />

            {/* Parameters Section */}
            <TextField
                fullWidth
                label="Add Parameter"
                value={parameterInput}
                onChange={(e) => setParameterInput(e.target.value)}
                placeholder="Enter a parameter"
                variant="outlined"
                margin="normal"
                style={{ backgroundColor: '#1C1C1C', color: '#00E5FF' }}
                InputLabelProps={{ style: { color: '#00E5FF' } }}
                InputProps={{ style: { color: '#00E5FF', border: '1px solid #00E5FF' } }}
            />
            <Button variant="contained" color="primary" onClick={handleAddParameter} style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
                Add Parameter (+)
            </Button>

            {newCommand.parameters.length == 0 ? (
                <>
                <br />
                No parameters Added
                </>
            ): (
                <ul>
                    <h1>Current Parameters:</h1>
                    {newCommand.parameters.map((param, index) => (
                        <li className='list-disc ml-10 text-bold' key={index} style={{ color: '#C6FFDD' }}>{param}</li>
                    ))}
                </ul>
            )}
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ backgroundColor: '#00E5FF', color: '#1C1C1C' }}>
                Add Command
            </Button>
        </>
    );
};

export default AddCommandForm;
