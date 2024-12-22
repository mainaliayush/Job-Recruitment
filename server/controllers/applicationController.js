import { addJobApplication, getAllApplicationsFromDB, getAllApplicationsHistoryFromDB } from '../models/applicationModels.js';

export const createJobApplication = async (req, res) => {
    const applicationData = req.body;

    try {
        const newApplication = await addJobApplication(applicationData);
        console.log("New Application:", newApplication);
        res.status(201).json({ message: 'Application submitted successfully', newApplication });
    } catch (error) {
        console.log("Error submitting application:", error);
        res.status(500).json({ message: error.message });
    }
};


export const getAllApplications = async (req, res) => {
    const { jobId } = req.params
    try {
        const applications = await getAllApplicationsFromDB(jobId);
        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error in getting all applications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getApplicationsHistory = async (req, res) => {
    try {
        const {userId} = req.params
        const applications = await getAllApplicationsHistoryFromDB(userId);
        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error in getting all applications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const getApplicationById = (req, res) =>{
    try {
        
    } catch (error) {
        console.error('Error in getting application by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
} 

export const deleteJobApplicationById = (req, res) =>{
    try {
        console.log("Reached delete application")
    } catch (error) {
        console.error('Error in deleting job application:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

