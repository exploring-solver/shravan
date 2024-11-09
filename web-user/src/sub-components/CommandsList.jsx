import React from 'react';
import CommandCard from './CommandCard';

const CommandsList = ({ commands, setDeleteCommandId, setOpenDeleteModal, setEditCommand, setOpenUpdateModal }) => {
  return (
    <>
      {commands.map(command => (
        <CommandCard
          key={command._id}
          command={command}
          setDeleteCommandId={setDeleteCommandId}
          setOpenDeleteModal={setOpenDeleteModal}
          setEditCommand={setEditCommand}
          setOpenUpdateModal={setOpenUpdateModal}
        />
      ))}
    </>
  );
};

export default CommandsList;
