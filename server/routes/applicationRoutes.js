import express from 'express';
import { createJobApplication, getAllApplications, getApplicationById, deleteJobApplicationById, getApplicationsHistory } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', createJobApplication);

// Employer side
router.get('/company-applications/:jobId', getAllApplications);  //get all applications for a specific job
router.get('/company-application-history/:applicationId', getApplicationById);   //get specific application by id

// Applicant side
router.get('/user-applications/:userId', getApplicationsHistory);  //get all applications the user has applied, Applicant side
router.delete('/user-application-history/:applicationId', deleteJobApplicationById); //they will delete their application from history, won't show that job again in that user's view.  

export default router;