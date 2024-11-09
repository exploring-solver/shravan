// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          
          {/* Company Mission Statement */}
          <div className="md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-cyan-400">About Us</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Leveraging advanced AI and data-driven insights to transform your business operations, our mission is to empower companies with cutting-edge AI technology for smarter, faster, and safer decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/3 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-6 md:mb-0">
            <div>
              <h2 className="text-lg font-semibold text-cyan-400">Quick Links</h2>
              <ul className="mt-2 space-y-2 text-sm">
                <li><a href="/about" className="hover:text-cyan-400 transition duration-200">About Us</a></li>
                <li><a href="/services" className="hover:text-cyan-400 transition duration-200">Our Services</a></li>
                <li><a href="/solutions" className="hover:text-cyan-400 transition duration-200">Solutions</a></li>
                <li><a href="/careers" className="hover:text-cyan-400 transition duration-200">Careers</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition duration-200">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* AI Features/Technologies */}
          <div className="md:w-1/3 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-cyan-400">Our Technology</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="/ai-powered-automation" className="hover:text-cyan-400 transition duration-200">AI-Powered Automation</a></li>
              <li><a href="/predictive-analytics" className="hover:text-cyan-400 transition duration-200">Predictive Analytics</a></li>
              <li><a href="/natural-language-processing" className="hover:text-cyan-400 transition duration-200">Natural Language Processing</a></li>
              <li><a href="/data-security" className="hover:text-cyan-400 transition duration-200">Data Security</a></li>
              <li><a href="/machine-learning" className="hover:text-cyan-400 transition duration-200">Machine Learning Models</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-700">
          
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-200">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-200">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-200">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-200">GitHub</a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm mt-4 md:mt-0">
            <p>&copy; {new Date().getFullYear()} AI Innovate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
