import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black shadow-md' : 'bg-transparent'
        }`}
      >
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
          <button onClick={toggleSidebar} className="md:hidden text-white hover:text-cyan-400 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar for Mobile View */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="font-bold text-xl">Menu</h2>
          <button onClick={toggleSidebar}>
            <X className="h-6 w-6 text-white hover:text-cyan-400" />
          </button>
        </div>
        <ul className="mt-4 space-y-4 px-6">
          <li>
            <a href="/project-list" onClick={toggleSidebar} className="block text-white hover:text-cyan-400 transition-colors">
              Projects
            </a>
          </li>
          <li>
            <a href="/create" onClick={toggleSidebar} className="block text-white hover:text-cyan-400 transition-colors">
              Create Project
            </a>
          </li>
          <li>
            <a href="/os-command" onClick={toggleSidebar} className="block text-white hover:text-cyan-400 transition-colors">
              OS Commander
            </a>
          </li>
          <li>
            <a href="/assistant" onClick={toggleSidebar} className="block text-white hover:text-cyan-400 transition-colors">
              Assistant
            </a>
          </li>
          <li>
            <a href="/documentation" onClick={toggleSidebar} className="block text-white hover:text-cyan-400 transition-colors">
              IOT DOC/Guide
            </a>
          </li>
        </ul>
      </div>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
