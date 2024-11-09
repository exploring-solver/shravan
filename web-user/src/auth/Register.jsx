import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Config from '../config/Config';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Config.backendUrl}/api/auth/register`, { email, password });
      navigate('/login');  // Navigate to login page after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-lg shadow-lg w-96 border border-gray-700 relative">
        {/* Sci-fi glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 opacity-50 blur-xl -z-10"></div>

        {/* Register Title */}
        <h2 className="text-4xl font-extrabold text-center text-cyan-300 tracking-widest mb-6">
          Register For Shravan AI
        </h2>
        <p className="text-center text-gray-500 italic text-sm mb-6">
          Join the network. Begin your journey today.
        </p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-80 text-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
            />
          </div>
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-80 text-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-2 bg-cyan-500 bg-opacity-80 text-gray-900 font-semibold rounded-lg hover:bg-cyan-600 hover:bg-opacity-90 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-gray-400 text-center mt-4 text-sm">
          Already registered?{' '}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
