import express from 'express';
import { applyForJob, getUserData, getUserJobApplications, updateUserResume, updateUserProfile } from '../controllers/userController.js';
import upload from '../config/multer.js';

const router = express.Router();

// get User data
router.get('/user', getUserData)

// Apply for a job
router.post('/apply-job', applyForJob)

// Get User Job Applications
router.get('/applications', getUserJobApplications )

// Update User Profile resume
router.post('/update-resume',upload.single('resume'), updateUserResume)

// Update User Profile
router.put('/update-profile', updateUserProfile)


export default router;