// src/components/Features.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaPlusCircle, FaCogs, FaShieldAlt, FaRobot, FaBook } from 'react-icons/fa';

const features = [
  {
    title: 'Projects',
    description: 'View and manage all your projects.',
    icon: FaProjectDiagram,
    link: '/project-list',
  },
  {
    title: 'Create Project',
    description: 'Start a new project effortlessly.',
    icon: FaPlusCircle,
    link: '/create',
  },
  {
    title: 'Python Client Commander',
    description: 'Send commands to the Python client.',
    icon: FaCogs,
    link: '/module-command',
  },
  {
    title: 'OS Commander',
    description: 'Control your OS with voice commands.',
    icon: FaShieldAlt,
    link: '/os-command',
  },
  {
    title: 'Assistant',
    description: 'Interact with the Bylexa assistant.',
    icon: FaRobot,
    link: '/assistant',
  },
  {
    title: 'Documentation/Guide',
    description: 'Learn how to use the system.',
    icon: FaBook,
    link: '/documentation',
  },
];

const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: '0px 0px 15px rgba(0, 255, 255, 0.7)',
    transition: { duration: 0.3 },
  },
};

const Features = () => {
  return (
    <section className="py-20 px-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12 neon-glow">
        Features
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover="hover"
            className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-all duration-300 cursor-pointer w-64"
            variants={buttonVariants}
          >
            <Link to={feature.link}>
              <div className="text-5xl text-blue-400 mb-4">
                <feature.icon />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 hidden hover:block">{feature.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
