import  { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  ${
      isScrolled ? 'bg-black shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="font-bold text-xl text-white hover:text-cyan-400 transition-colors">
          Shravan AI
        </a>

        {/* Navbar Links */}
        <ul className="hidden md:flex items-center space-x-6">
        
          <li>
            <a href="/project-list" className="text-white hover:text-cyan-400 transition-colors">
              Projects
            </a>
          </li>
          <li>
            <a href="/create" className="text-white hover:text-cyan-400 transition-colors">
              Create Project
            </a>
          </li>
          <li>
            <a href="/os-command" className="text-white hover:text-cyan-400 transition-colors">
              OS Commander
            </a>
          </li>
          <li>
            <a href="/assistant" className="text-white hover:text-cyan-400 transition-colors">
              Assistant
            </a>
          </li>
          <li>
            <a href="/documentation" className="text-white hover:text-cyan-400 transition-colors">
              IOT DOC/Guide
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white hover:text-cyan-400 transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;