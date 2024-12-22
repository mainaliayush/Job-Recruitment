import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/applicantDetailsPage.css'; 
import { useLocation, useParams } from 'react-router-dom';

const ApplicantDetailsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {jobId} = useParams()
  const {title} = useLocation()

  console.log("JobId: ", jobId)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/applications/company-applications/${jobId}`); 
        setApplications(response.data.applications || []);
        console.log("Applications: ", response.data.applications)
        setLoading(false);
      } catch (err) {
        setError('Error fetching applications.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="applicant-details-page">
      <h2>Applicants for {title}</h2>
      <table className="applicant-details-table">
        <thead>
          <tr>
            {/* <th>Application ID</th> */}
            <th>Name</th>
            <th>Job Title</th>
            <th>Email</th>
            <th>Number</th>
            <th>Submitted On</th>
            <th>Last Updated</th>
            <th>Score</th>
            <th>Status</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications?.length > 0 ? (
            applications?.map((app) => (
              <tr key={app.application_id}>
                {/* <td>{app.application_id}</td> */}
                <td>{`${app.first_name} ${app.last_name}`}</td>
                <td>{app?.job_title}</td>
                <td>{app.email}</td>
                <td>{app.phone_number}</td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>{new Date(app.updated_at).toLocaleDateString()}</td>
                <td>{app.ranking}</td>
                <td>{app.status}</td>
                <td><a href={app.resume} target="_blank" rel="noopener noreferrer">Resume</a></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No applications so far.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantDetailsPage;
