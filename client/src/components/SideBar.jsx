import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaStar, FaChartLine, FaHistory, FaCog } from 'react-icons/fa'; 
import { useAuthContext } from "../context/AuthContext";
import '../css/sideBar.css';

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { authUser } = useAuthContext();
  const role = authUser?.role;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  const applicantLinks = [
    { name: "Home", route: "/home", icon: <FaHome /> },
    { name: "Dashboard", route: "/dashboard", icon: <FaChartLine /> },
    { name: "History", route: "/history", icon: <FaHistory /> },
    { name: "Favourites", route: "/favourites", icon: <FaStar /> },
    { name: "Settings", route: "/settings", icon: <FaCog /> },
  ];

  const employerLinks = [
    { name: "Home", route: "/home", icon: <FaHome /> },
    { name: "Dashboard", route: "/dashboard", icon: <FaChartLine /> },
    { name: "Settings", route: "/settings", icon: <FaCog /> },
  ];

  const links = role === "applicant" ? applicantLinks : employerLinks;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.route}
            to={link.route}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="sidebar-item">
              {link.icon}
              {!isCollapsed && <span className="link-name">{link.name}</span>}
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
