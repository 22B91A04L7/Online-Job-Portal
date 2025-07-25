import express from 'express';
import { getJobById, getJobs } from '../controllers/jobController.js';

const router = express.Router();

// Route to get all jobs
router.get('/', getJobs)

// Route to get a specific job by ID
router.get('/:id', getJobById)

export default router;
