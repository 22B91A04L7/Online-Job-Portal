import express from 'express';
import { changeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplications, getcompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyControllers.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a new company
router.post('/register', upload.single('image'),registerCompany)

// Company login
router.post('/login', loginCompany)

// Get company data
router.get('/company',protectCompany, getCompanyData)

//  Post a job
router.post('/post-job',protectCompany, postJob)

// Get Applicants for a job
router.get('/applicants',protectCompany, getCompanyJobApplications)

// Get Company posted jobs
router.get('/list-jobs',protectCompany, getcompanyPostedJobs)

// Change Job Application Status
router.post('/change-status',protectCompany, changeJobApplicationStatus)

// Change Job Visibility
router.post('/change-visibility',protectCompany, changeVisibility)


export default router;