import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import AddJobModal from "../components/AddJobModal";
import ApplyJobModal from "../components/ApplyJobModal";
import { toast, ToastContainer } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import "../css/homePage.css";
import { FaSearch } from "react-icons/fa";

const HomePage = () => {
  const { authUser } = useAuthContext();
  const { id, role } = authUser;

  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplicationDisabled, setIsApplicationDisabled] = useState(true)
  const [appliedJobs, setAppliedJobs] = useState(new Set())


  const [profileDetails, setProfileDetails] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_photo: "",
    address: "",
    dob: "",
    resume: "",
    github_link: "",
    linkedin_link: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyJob = (job) => {
    setJobToApply(job);
    setApplyModalOpen(true);
  };

  const handleSubmitJobApplication = async (applicationData) => {
    console.log("Application Data: ", applicationData);
    try {
      const response = await axios.post(
        `http://localhost:3001/api/applications`,
        {
          ...applicationData,
          jobId: jobToApply.id,
          applicantId: profileDetails.id,
          status: "applied",
        }
      );
      if (response.status === 201) {
        toast.success("Application successfully submitted!");
        setApplyModalOpen(false);
        setAppliedJobs((prevAppliedJobs) => new Set(prevAppliedJobs.add(jobToApply.id)));
        // Update userApplications after successful application
        setUserApplications([...userApplications, response.data.application]);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application.");
    }
  };

  const handleAddJob = async (jobData) => {
    if (selectedJob) {
      // Edit existing job
      try {
        const response = await axios.put(
          `http://localhost:3001/api/jobs/${selectedJob.id}`,
          jobData
        );
        if (response.status === 200) {
          const updatedJob = response.data.updatedJob;
          setJobs(
            jobs.map((job) => (job.id === selectedJob.id ? updatedJob : job))
          );
          toast.success("Job successfully edited!");
          setSelectedJob(null);
        }
      } catch (error) {
        console.error("Error editing job:", error);
      }
    } else {
      // Add new job
      try {
        const response = await axios.post(
          `http://localhost:3001/api/jobs`,
          { ...jobData, id }
        );
        if (response.status === 201) {
          const newJob = response.data.newJob;
          setJobs([...jobs, newJob]);
          setSelectedJob(null);
          toast.success("Job successfully added!");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchJobsFromAPI = async () => {
      try {
        let url = "http://localhost:3001/api/jobs";
        if (role === "employer") {
          url = `http://localhost:3001/api/jobs?role=${role}&userId=${id}`;
        }

        const response = await axios.get(url);
        if (response.status === 200) {
          setJobs(response.data);
          console.log("All jobs: ", response.data)
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobsFromAPI();
  }, [role, id]);

  useEffect(() => {
    const fetchProfileFromAPI = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${id}?role=${role}`
        );
        const fetchedProfile = response.data;

        setProfileDetails(fetchedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfileFromAPI();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userId = id;
        const response = await axios.get(
          `http://localhost:3001/api/applications/user-applications/${userId}`
        );
        console.log("application: ", response.data.applications)
        let tempAppliedJobs = response.data.applications.map((application) => application.job_id)
        tempAppliedJobs = new Set([...tempAppliedJobs])
        setAppliedJobs(tempAppliedJobs)
        setIsApplicationDisabled(false)
        // setUserApplications(response.data.applications);
      } catch (err) {
        console.log("Error fetching applications.", err);
      }
    };

    if (id) {
      fetchApplications();
    }
  }, [id]);

  return (
    <div className="homepage-content">
      <header className="homepage-header">
        <h1 className="homepage-title">
          Hello {role === "applicant" ? profileDetails.first_name : profileDetails.company_name}!
        </h1>
        <div className="header-actions">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for jobs..."
              className="search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {role === "employer" && (
            <button
              className="add-job-btn"
              onClick={() => {
                setSelectedJob(null);
                setIsModalOpen(true);
              }}
            >
              Add Job +
            </button>
          )}
        </div>
      </header>
      <main className="job-listings">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              userId={id}
              role={role}
              onDelete={(jobId) => setJobs(jobs.filter((j) => j.id !== jobId))}
              onEdit={handleEditJob}
              onApply={handleApplyJob}
              hasApplied={!isApplicationDisabled && appliedJobs.has(job.id)}
            />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </main>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddJob}
        job={selectedJob}
      />

      <ApplyJobModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={jobToApply}
        onSubmit={handleSubmitJobApplication}
        applicantDetails={profileDetails}
      />
      <ToastContainer />
    </div>
  );
};

export default HomePage;
