import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../config/Config';
import ClipLoader from 'react-spinners/ClipLoader';  // Import the loader

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);  // State to track loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state to true when the form is submitted
    try {
      const response = await axios.post(`${Config.backendUrl}/api/projects`, { name, description });
      const projectId = response.data._id;

      await axios.post(`${Config.backendUrl}/api/projects/${projectId}/parse-code`, { code });

      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);  // Set loading state to false when request completes
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-3xl mx-auto'>
        <h2 className="text-4xl font-bold mb-8 text-blue-400">Create New Project</h2>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="#4A90E2" size={50} loading={loading} />
            <p className="ml-4">Creating project, please wait...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-lg">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-lg">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="code" className="block mb-2 text-lg">Microcontroller Code:</label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-green-400 h-64 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}  // Disable the button while loading
              className={`w-full px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProject;
