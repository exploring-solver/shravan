import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';
import { Typography } from '@mui/material';
import CommandsList from '../sub-components/CommandsList';
import AddCommandForm from '../sub-components/AddCommandForm';
import DeleteConfirmationDialog from '../sub-components/DeleteConfirmationDialog';
import UpdateCommandModal from '../sub-components/UpdateCommandModal';
import ProjectHeader from '../sub-components/ProjectHeader';


const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [commands, setCommands] = useState([]);
  const [projectDetails, setProjectDetails] = useState({ name: '', description: '' });
  const [deleteCommandId, setDeleteCommandId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editCommand, setEditCommand] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

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
      setOpenDeleteModal(false);
    } catch (error) {
      console.error('Error deleting command:', error);
    }
  };

  const handleUpdateCommand = async (updatedCommand) => {
    try {
      const response = await axios.put(`${Config.backendUrl}/api/commands/${updatedCommand._id}`, updatedCommand);
      setCommands(commands.map(cmd => cmd._id === updatedCommand._id ? response.data : cmd));
      setEditCommand(null);
      setOpenUpdateModal(false);
    } catch (error) {
      console.error('Error updating command:', error);
    }
  };

  const handleAddCommand = async (newCommand) => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/commands`, { ...newCommand, project: id });
      setCommands([...commands, response.data]);
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
      <ProjectHeader
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
        handleUpdateProject={handleUpdateProject}
      />

      {/* Commands Section */}
      <Typography variant="h4" gutterBottom style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        Available Commands
      </Typography>

      <CommandsList
        commands={commands}
        setDeleteCommandId={setDeleteCommandId}
        setOpenDeleteModal={setOpenDeleteModal}
        setEditCommand={setEditCommand}
        setOpenUpdateModal={setOpenUpdateModal}
      />

      {/* Add Command Section */}
      <AddCommandForm handleAddCommand={handleAddCommand} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteCommand}
      />

      {/* Update Command Modal */}
      {editCommand && (
        <UpdateCommandModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          command={editCommand}
          handleUpdateCommand={handleUpdateCommand}
        />
      )}

      {/* Microcontroller Integration Section */}
      <Typography variant="h4" gutterBottom style={{ color: '#00E5FF', textShadow: '0px 0px 8px rgba(0, 229, 255, 1)' }}>
        Microcontroller Integration
      </Typography>
      <Typography variant="body1" style={{ color: '#C6FFDD' }}>
        To integrate this project with your microcontroller, use the following URL:
      </Typography>
      <div
        style={{ display: 'block', padding: '12px', backgroundColor: '#1C1C1C', borderRadius: '8px', color: '#00E5FF', overflowX: 'auto' }}
      >
        {`${Config.backendUrl}/api/projects/${id}/current-command`}
      </div>
    </div>
  );
};

export default ProjectDetail;
