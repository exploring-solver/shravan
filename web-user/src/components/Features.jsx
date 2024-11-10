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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const Features = () => {
  return (
    <section className="py-8 md:py-12 lg:py-20 px-4 md:px-8 lg:px-20">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-8 md:mb-12 neon-glow">
        Features
      </h2>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={index % 2 === 0 ? slideInLeft : slideInRight}
            className={`w-full md:w-3/4 lg:w-1/2 ${
              index % 2 === 0 
                ? 'md:self-start' 
                : 'md:self-end'
            }`}
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 p-4 md:p-6 bg-gray-800 rounded-lg flex flex-col md:flex-row items-center justify-between transition-all duration-300 hover:bg-gray-700 cursor-pointer">
                <Link to={feature.link} className="w-full h-full flex flex-col md:flex-row items-center">
                  {/* Icon - Top on mobile, Left on desktop */}
                  <div className="w-full md:w-1/3 lg:w-1/2 flex justify-center items-center text-blue-400 mb-4 md:mb-0">
                    <feature.icon className="text-4xl md:text-6xl lg:text-8xl" />
                  </div>
                  
                  {/* Text Content - Bottom on mobile, Right on desktop */}
                  <div className="flex flex-col justify-center w-full md:w-2/3 lg:w-1/2 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      {feature.description}
                    </p>
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