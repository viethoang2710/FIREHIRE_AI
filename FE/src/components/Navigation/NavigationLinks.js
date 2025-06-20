import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks = () => {
  return (
    <div className="navigation-links">
      <Link to="/home" className="nav-link">Home</Link>
      <Link to="/profile" className="nav-link">Profile</Link>
      <Link to="/settings" className="nav-link">Settings</Link>
      {/* Other links */}
    </div>
  );
};

export default NavigationLinks;