import React, { useState } from "react";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import useLogout from "../hooks/useLogout";
import '../css/Navbar.css'; // Import the CSS file

const Navbar = () => {
  const { loading, logout } = useLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, message: "Your google applicaition was viewed!" },
    { id: 2, message: "Microsoft Job posting was removed." },
    { id: 3, message: "Complete your profile, go to Settings. " }
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout(); 
  };

  return (
    <div className="navbar">
      <div className="company-name">
        <h1>TopHire</h1>
      </div>

      <div className="right-section">
        <button className="notification-button" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell />
          <span className="notification-number">3</span> 
        </button>

        {showNotifications && (
          <div className="notification-popup">
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          </div>
        )}

        <button 
          className="logout-button"
          onClick={handleLogoutClick}
          disabled={loading}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <button className="app-logout" onClick={confirmLogout}>Logout</button>
            <button className="logout-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
