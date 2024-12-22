import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../css/jobCard.css';

const JobCard = ({ job, userId, role, onDelete, onEdit, onApply, hasApplied, setHasApplied }) => {
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const navigate = useNavigate();

  const { id, title, company_name, location, salary, description, posted_date, user_id } = job;
  const jobId = job.id;
  const timeSincePosted = moment(posted_date).fromNow();

  const handleDeleteClick = () => {
    setConfirmDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/jobs/${jobId}`);

      if (response.status === 200) {
        console.log('Job deleted successfully');
        onDelete(jobId); 
        setConfirmDeleteModal(false);
      } else {
        console.error('Failed to delete the job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleJobApply = () => {
    try {
      onApply(job);  
    } catch (error) {
      console.error('Error applying for the job:', error);
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDeleteModal(false);
  };

  const handleJobApplicantsDetails = (jobId) => {
    navigate(`/applicant-details/${jobId}?title=${title}`);
  };

  useEffect(() => {
    setApplied(hasApplied)
  }, [hasApplied]);

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{title}</h3>
        {role === 'employer' && userId === user_id && (
          <div className="job-card-actions">
            <FaEdit className="icon edit-icon" title="Edit Job" onClick={() => onEdit(job)} />
            <FaTrashAlt className="icon delete-icon" title="Delete Job" onClick={handleDeleteClick} />
          </div>
        )}
      </div>
      <div className="job-company">{company_name}</div>
      <p className="job-location">{location}</p>
      <p className="job-salary">${salary.toLocaleString()} / yr</p>
      <p className="job-description">{description}</p>
      <div className="job-meta">
        <FaClock className="icon time-icon" />
        <span className="time-since-posted">{timeSincePosted}</span>
      </div>

      <button className="view-details-btn" onClick={() => {}}>Details</button>

      {role === 'applicant' ? (
        hasApplied ? (
          <button className="apply-btn" disabled={true} style={{pointerEvents: "none", backgroundColor: "#ddd"}}>Applied!</button> 
        ) : (
          <button className="apply-btn" onClick={handleJobApply}>Apply</button>
        )
      ) : (
        <button className="apply-btn" onClick={() => handleJobApplicantsDetails(jobId)}>Applicant Details</button>
      )}


      {confirmDeleteModal && (
        <div className="delete-job-modal">
          <div className="delete-job-modal-content">
            <p>Are you sure you want to delete this job?</p>
            <button className="delete-confirm" onClick={handleDeleteConfirm}>Delete</button>
            <button className="delete-cancel" onClick={handleDeleteCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
