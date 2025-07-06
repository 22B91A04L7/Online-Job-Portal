import Job from "../models/Job.js"
import JobApplication from "../models/jobApplication.js"

// Get all Jobs posted by a Company

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({visible:true})
            .populate({path:'companyId', select:'-password'})
            .sort({ date: -1 }) // Sort by date, newest first

        // Adding number of applications to each job
        const jobsWithApplicants = await Promise.all(
            jobs.map(async (job) => {
                const applicantCount = await JobApplication.countDocuments({ jobId: job._id })
                return {
                    ...job.toObject(),
                    applicants: applicantCount
                }
            })
        )

        res.json({
            success: true,
            jobs: jobsWithApplicants
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// get a specific job by ID

export const getJobById = async (req, res) => {
   try {
     const {id} = req.params
     const job = await Job.findById(id).populate({path:'companyId', select:'-password'})

     if(!job){
        return res.json({
            success: false,
            message: "Job not found"
        })
     }

     // Add applicant count to the job
     const applicantCount = await JobApplication.countDocuments({ jobId: job._id })
     const jobWithApplicants = {
         ...job.toObject(),
         applicants: applicantCount
     }

    return res.json({
        success: true,
        job: jobWithApplicants
     })
   } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
   }
}

