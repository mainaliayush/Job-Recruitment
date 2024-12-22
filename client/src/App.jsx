import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import FavouritesPage from './pages/FavouritesPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout'; // Import Layout component
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ApplicantDetailsPage from './pages/ApplicantDetailsPage';

function App() {
  const { authUser } = useAuthContext();
  
  if (!authUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const role = authUser.role;

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}> 
          {/* All the following routes will use Layout (Navbar, Sidebar, etc.) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {role === "applicant" && <Route path="/history" element={<HistoryPage />} />}
          {role === "applicant" && <Route path="/favourites" element={<FavouritesPage />} />}

          {role === "employer" && <Route path="/applicant-details/:jobId" element={<ApplicantDetailsPage />} />}

        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
