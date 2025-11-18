import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">Page not found</h2>
    <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
    <Link 
      to="/" 
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold no-underline transition-colors inline-block"
    >
      Go back home
    </Link>
  </div>
);

export default NotFound;
