import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';
import { ClipLoader } from 'react-spinners';  // Importing react-spinners loader

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);  // State for error handling

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${Config.backendUrl}/api/projects`);
        setProjects(response.data);
        setLoading(false);  // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Error fetching projects');  // Set error message
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <ClipLoader color="#00BFFF" size={60} />  {/* Loading animation */}
        <p className="text-xl mt-4">Please wait, fetching projects list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <p className="text-xl text-red-500">{error}</p>  {/* Error message */}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-4xl mx-auto'>
        <h2 className="text-4xl font-bold mb-8 text-blue-400">Projects</h2>
        <ul className="space-y-6">
          {projects.map(project => (
            <li key={project._id} className="border border-gray-700 p-6 rounded-lg bg-gray-800 hover:border-blue-500 transition-colors">
              <Link to={`/project/${project._id}`} className="text-2xl font-semibold text-blue-400 hover:underline">
                {project.name}
              </Link>
              <p className="text-gray-300 mt-2">{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectList;
