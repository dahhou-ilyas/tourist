import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home' , active : true},
    { to: '/about', label: 'About', active : false },
    { to: '/contact', label: 'Contact', active : false },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-10000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <MapPin className="mr-2 text-blue-500" size={24} />
              My Map
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={toggleMenu}
                  className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;