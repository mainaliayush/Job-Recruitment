import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../context/AuthContext";
import axios from 'axios';
import '../css/historyPage.css'; 
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const HistoryPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser } = useAuthContext();
  const { id, role } = authUser;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userId = id;
        const response = await axios.get(`http://localhost:3001/api/applications/user-applications/${userId}`); 
        console.log("response.data.applications", response.data.applications)
        setApplications(response.data.applications);
        setLoading(false);
      } catch (err) {
        setError('Error fetching applications.');
        setLoading(false);
      }
    };

    if(id){
      fetchApplications();
    }
  }, [id]);

  const handleDeleteApplication = async (applicationId) => {
    console.log(applicationId)
    try {
      const response = await axios.delete(`http://localhost:3001/api/applications/user-application-history${applicationId}`);
      // if (response.status === 200) {
      //   setApplications(applications.filter(app => app.id !== applicationId));
      // }
    } catch (err) {
      console.error("Error deleting application", err);
      setError("Failed to delete application.");
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="history-page">
      <h2>Your Application History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Posted Date</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.created_at}>
                <td>{app.company_name}</td>
                <td>{app.job_title}</td>
                <td>{app.industry}</td>
                <td>{app.location}</td>
                <td>{`$${app.salary}`}</td>
                <td>{new Date(app.posted_date).toLocaleDateString()}</td>
                <td>{app.status}</td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteApplication(app.id)} 
                    style={{ cursor: 'pointer', color: 'red' }} 
                  />
                </td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
