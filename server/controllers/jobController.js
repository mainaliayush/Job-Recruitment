import { addJob, fetchEmployerJobListing, fetchApplicantJobView, deleteJobById, editJobById} from '../models/jobModels.js';

export const createJob = async (req, res) => {
    const jobData = req.body;
    console.log("job Data: ", jobData)

    try {
        const newJob = await addJob(jobData);
        console.log("New job:", newJob)
        res.status(201).json({ message: 'Job added successfully', newJob });
    } catch (error) {
        console.log("Error adding job:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllJobs = async (req, res) => {
    const { role, userId } = req.query;

    try {
        let jobs;
        if (role === 'employer' && userId) {
            jobs = await fetchEmployerJobListing(userId);
        } else {
            jobs = await fetchApplicantJobView();
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs from controller:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
};

export const getJob = async (req, res) => {

};

export const editJob = async (req, res) => {
    const { jobId } = req.params;
    const job = req.body;

    try {
        const updatedJob = await editJobById(jobId, job);
        if (updatedJob) {
            res.status(200).json({ message: 'Job updated successfully', updatedJob });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.log("Error updating job:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    const { jobId } = req.params;
  
    try {
        await deleteJobById(jobId);
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
