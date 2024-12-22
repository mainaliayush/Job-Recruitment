import express from 'express';
import { getAllJobs, getJob, createJob, editJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

//For Applicants and Employers both
router.get('/', getAllJobs);
router.get('/:id', getJob);

//For Employers
router.post('/', createJob);
router.put('/:jobId', editJob);
router.delete('/:jobId', deleteJob);

export default router;