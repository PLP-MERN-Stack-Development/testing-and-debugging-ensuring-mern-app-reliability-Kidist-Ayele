import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold hover:text-white no-underline flex items-center gap-2">
          <span role="img" aria-label="pen">
            ✍️
          </span>
          MERN Blog
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `text-white hover:text-blue-300 no-underline font-medium transition-colors ${isActive ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : ''}`
            }
          >
            Posts
          </NavLink>
          <NavLink 
            to="/create"
            className={({ isActive }) => 
              `text-white hover:text-blue-300 no-underline font-medium transition-colors ${isActive ? 'text-blue-300 border-b-2 border-blue-300 pb-1' : ''}`
            }
          >
            Write
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
