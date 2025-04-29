import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="DYM Logo" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/product" className="text-gray-700 hover:text-blue-600 transition-colors">
              Product
            </Link>
            <Link to="/professionals" className="text-gray-700 hover:text-blue-600 transition-colors">
              Professionals
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full
                hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md
                hover:shadow-lg"
            >
              Try DYM free
            </Link>
          </div>

          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}; 