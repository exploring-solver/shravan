/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate } from 'react-router-dom';
// import VoiceCommandSender from '../components/VoiceCommandSender';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
    // return <VoiceCommandSender/>;
  }

  return children;
};

export default PrivateRoute;
