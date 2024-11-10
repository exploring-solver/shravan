/* eslint-disable no-unused-vars */
// src/components/Footer.jsx
import React from 'react';
import { Linkedin, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-6 relative">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Company Name and Copyright */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white">Shravan AI</h4>
            <p className="text-xs text-gray-600 mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-6">
            <a href="/documentation" className="hover:text-white text-sm">Documentation</a>
            <a href="/os-command" className="hover:text-white text-sm">OS Commander</a>
            <a href="/create" className="hover:text-white text-sm">IOT Project</a>
          </div>
          
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/exploring-solver/shravan" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
