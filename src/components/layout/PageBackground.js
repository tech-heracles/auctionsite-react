import React from 'react';
import './PageBackground.css';

const PageBackground = ({ children }) => {
  return (
    <div className="greek-background">
      {/* Subtle column silhouettes on the sides - only visible on large screens */}
      <div className="bg-column bg-column-left"></div>
      <div className="bg-column bg-column-right"></div>
      
      {/* Main content */}
      <div className="bg-content">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;