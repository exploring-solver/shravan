// src/components/Hero.jsx
import React from 'react';
import { Parallax } from 'react-parallax';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative h-screen flex items-center justify-center">
            {/* <ParticleBackground /> */}
            <Parallax bgImage="bg.webp" strength={500}>
                <div className="h-screen flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        <h1
                            className="text-5xl font-bold mb-4 glowing-text"
                        >
                            Bylexa G.O.A.T.
                        </h1>
                        <p
                            className="text-xl mb-8 glowing-text"
                        >
                            The Greatest Of Automated Tasks - Voice-Controlled Automation
                        </p>
                        <Link to={'/module-command'}>
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition duration-300 rounded-full">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </Parallax>
        </div>
    );
};

export default Hero;
