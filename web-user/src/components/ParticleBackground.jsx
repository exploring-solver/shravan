// src/components/ParticleBackground.jsx
import React from 'react';
import Particles from 'react-tsparticles';

const ParticleBackground = () => {
  return (
    <Particles
      options={{
        background: {
          color: '#000',
        },
        particles: {
          color: {
            value: '#ffffff',
          },
          number: {
            value: 100,
          },
          size: {
            value: 3,
          },
          move: {
            speed: 1,
          },
        },
      }}
    />
  );
};

export default ParticleBackground;
