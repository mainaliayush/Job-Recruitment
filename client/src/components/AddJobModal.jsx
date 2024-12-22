import React, { useState, useEffect } from "react";
import "../css/addJobModal.css";

const AddJobModal = ({ isOpen, onClose, onSubmit, job }) => {
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    industry: "",
    description: "",
    salary: "",
    application_deadline: "",
  });

  useEffect(() => {
    if (job) {
      setJobData(job); 
    } else {
      setJobData({
        title: "",
        location: "",
        industry: "",
        description: "",
        salary: "",
        application_deadline: "",
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(jobData); 
  };

  if (!isOpen) return null;

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{job ? "Edit Job" : "Add Job"}</h2> 
        <form onSubmit={handleNewJobSubmit} className="job-form">
          <div className="job-modal-wrapper">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="job-modal-wrapper">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={jobData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="job-modal-wrapper">
            <label htmlFor="industry">Industry:</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={jobData.industry}
              onChange={handleInputChange}
            />
          </div>
          <div className="job-modal-wrapper">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="job-modal-wrapper">
            <label htmlFor="salary">Salary:</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={jobData.salary}
              onChange={handleInputChange}
            />
          </div>
          <div className="job-modal-wrapper">
            <label htmlFor="application_deadline">Application Deadline:</label>
            <input
              type="date"
              id="application_deadline"
              name="application_deadline"
              value={jobData.application_deadline}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              {job ? "Edit" : "Add"} Job
            </button>
            <button type="button" className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
