  import React from 'react';
  import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import ProjectList from './components/ProjectList';
  import ProjectDetail from './components/ProjectDetail';
  import CreateProject from './components/CreateProject';
  import DocumentationPage from './components/DocumentationPage';
  import OsCommander from './components/OsCommander';
  import AssistantInteraction from './components/AssistantInteraction';
  import VoiceCommandSender from './components/VoiceCommandSender';
  import PrivateRoute from './auth/PrivateRoute';
  import Register from './auth/Register';
  import Login from './auth/Login';
  import Home from './pages/Home';

const navLinkVariants = {
  hover: {
    scale: 1.2,
    textShadow: '0px 0px 8px rgba(255, 255, 255, 1)',
    // boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)',
    transition: {
      duration: 0.3,
      yoyo: Infinity, // makes it pulsate
    },
  },
};

const App = () => {
  return (
    <Router>
      <div className="px-10 p-4 bg-gray-900 text-white ">
      <nav className="sticky top-0 z-50 bg-gray-900">
          <ul className="flex justify-between flex-wrap ">
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}

            >
              <Link to="/" className="text-white">Home</Link>
            </motion.li>
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/project-list" className="text-white">Projects</Link>
            </motion.li>
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/create" className="text-white">Create Project</Link>
            </motion.li>
            {/* <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/module-command" className="text-white">Python Client Commander</Link>
            </motion.li> */}
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/os-command" className="text-white">OS Commander</Link>
            </motion.li>
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/assistant" className="text-white">Assistant</Link>
            </motion.li>
            <motion.li
              whileHover="hover"
              className="transition-all duration-300 hover:text-blue-400"
              variants={navLinkVariants}
            >
              <Link to="/documentation" className="text-white">Documentation/Guide</Link>
            </motion.li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project-list" element={<ProjectList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/os-command1" element={<OsCommander />} />
        <Route path="/os-command" element={<PrivateRoute><VoiceCommandSender /></PrivateRoute>} />
        <Route path="/assistant" element={<AssistantInteraction />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
