import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const CommandCard = ({ command, setDeleteCommandId, setOpenDeleteModal, setEditCommand, setOpenUpdateModal }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '16px', backgroundColor: '#1C1C1C', border: '1px solid #00E5FF' }}>
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

        <IconButton color="primary" onClick={() => { setEditCommand(command); setOpenUpdateModal(true); }}>
          <Edit style={{ color: '#76FF03' }} />
        </IconButton>
        <IconButton color="secondary" onClick={() => { setDeleteCommandId(command._id); setOpenDeleteModal(true); }}>
          <Delete style={{ color: '#F44336' }} />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default CommandCard;
