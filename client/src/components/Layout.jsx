import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../css/layout.css'; 

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`layout-container ${isCollapsed ? 'collapsed' : ''}`}>
      <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />
      <div className="main-content">
        <Navbar />
        <div className="home-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
