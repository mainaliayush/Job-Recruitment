import React, { useState, useEffect } from 'react';
import '../css/applyJobModal.css'; 

const ApplyJobModal = ({ isOpen, onClose, job, onSubmit, applicantDetails }) => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email:"",
    address: "",
    resume: "",
    github_link: "",
    linkedin_link: "",
  });

  const [hasApplied, setHasApplied] = useState(false);


  useEffect(() => {
    if (applicantDetails) {
      setProfile({
        first_name: applicantDetails.first_name || "",
        last_name: applicantDetails.last_name || "",
        phone_number: applicantDetails.phone_number || "",
        email: applicantDetails.email || "",
        address: applicantDetails.address || "",
        resume: applicantDetails.resume || "",
        github_link: applicantDetails.github_link || "",
        linkedin_link: applicantDetails.linkedin_link || "",
      });
    }
  }, [applicantDetails]); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(profile);
      // setHasApplied(true); 
      onClose(); 
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div className="apply-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="job-details">
            <h3>Job Details:</h3>
            <p><strong>Title:</strong> {job?.title}</p>
            <p><strong>Company:</strong> {job?.company_name}</p>
            <p><strong>Industry:</strong> {job?.industry}</p>
            <p><strong>Location:</strong> {job?.location}</p>
            <p><strong>Salary:</strong> ${job?.salary}/yr</p>
            <p><strong>Description:</strong> {job?.description}</p>
            <p><strong>Posted Date:</strong> {new Date(job?.posted_date).toLocaleDateString()}</p>
          </div>
          <form onSubmit={handleApplySubmit} className="application-form">
            <h3>Confirm Details:</h3>
            <label>
              First Name:
              <input type="text" name="first_name" value={profile.first_name} onChange={handleInputChange} />
            </label>
            <label>
              Last Name:
              <input type="text" name="last_name" value={profile.last_name} onChange={handleInputChange} />
            </label>
            <label>
              Phone Number:
              <input type="text" name="phone_number" value={profile.phone_number} onChange={handleInputChange} />
            </label>
            <label>
              Email:
              <input type="text" name="email" value={profile.email} onChange={handleInputChange} />
            </label>
            <label>
              Resume:
              <input type="text" name="resume" value={profile.resume} onChange={handleInputChange} />
            </label>
            <label>
              GitHub Link:
              <input type="text" name="github_link" value={profile.github_link} onChange={handleInputChange} />
            </label>
            <label>
              LinkedIn Link:
              <input type="text" name="linkedin_link" value={profile.linkedin_link} onChange={handleInputChange} />
            </label>
            <div className="modal-actions">
              <button type="submit" className="submit-btn">Submit Application</button>
              <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
