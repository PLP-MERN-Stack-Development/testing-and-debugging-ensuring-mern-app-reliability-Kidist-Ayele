import React from 'react';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="bg-gray-50 min-h-screen">{children}</main>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
