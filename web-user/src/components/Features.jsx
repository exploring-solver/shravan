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
    description: 'Interact with the shravan assistant.',
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

// Animation variants for sliding in from left or right
const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const Features = () => {
  return (
    <section className="py-20 px-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12 neon-glow">
        Features
      </h2>
      <div className="flex flex-col gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={index % 2 === 0 ? slideInLeft : slideInRight}
            className={`${index % 2 === 0 ? 'self-start' : 'self-end'} w-1/2`}
          >
            <div className="relative w-full" style={{ paddingBottom: '65%' }}>
              {/* Card content positioned absolutely to fit inside the responsive container */}
              <div className="absolute inset-0 p-6 bg-gray-800 rounded-lg flex flex-row items-center justify-between transition-all duration-300 hover:bg-gray-700 cursor-pointer">
                <Link to={feature.link} className=" w-full h-full flex items-center">
                  {/* Text Content: Title and Description on the Left */}
                  
                  {/* Icon on the Right, Larger */}
                  <div className="w-1/2 flex justify-center items-center text-blue-400">
                    <feature.icon className="text-8xl" /> {/* Increase the icon size */}
                  </div>
                  <div className="flex flex-col justify-center w-1/2 text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
