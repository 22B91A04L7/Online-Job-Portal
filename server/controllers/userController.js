import Job from "../models/Job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/User.js"
import {v2 as cloudinary} from 'cloudinary'


// Get user data
export const getUserData = async (req, res) => {
    const userId = req.auth().userId
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        return res.json({
            success:true,
            user
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message})
    }
}

// Apply for a job
export const applyForJob = async (req, res) => {
    const {jobId} = req.body
    const userId = req.auth().userId
    try {
        const isAlreadyApplied = await JobApplication.find({jobId, userId})
        if(isAlreadyApplied.length > 0){
            return res.json({
                success: false,
                message: "You have already applied for this job"
            })
        }
        const jobData = await Job.findById(jobId)
        if(!jobData){
            return res.json({
                success: false,
                message: "Job not found"
            })
        }
        await JobApplication.create({
            userId,
            companyId: jobData.companyId,
            jobId,
            date: Date.now()
        })

        return res.json({
            success: true,
            message: "Job Application Submitted Successfully"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get user job applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth().userId

        const appliactions = await JobApplication.find({userId}).populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec()
        if(!appliactions || appliactions.length === 0){
            return res.json({
                success: false,
                message: "No job applications found"
            })
        }

       return res.json({
            success: true,
            applications: appliactions
        })
 
    } catch (error) {
        res.json({
            success: false, 
            message: error.message
        })
    }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.auth().userId
        const { name, email, phone, location, skills, experience, education, bio } = req.body

        const userData = await User.findById(userId)
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // Update fields if provided
        if (name) userData.name = name
        if (email) userData.email = email
        if (phone) userData.phone = phone
        if (location) userData.location = location
        if (skills) userData.skills = skills
        if (experience) userData.experience = experience
        if (education) userData.education = education
        if (bio) userData.bio = bio

        await userData.save()
        
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: userData
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Update user resume
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth().userId
        const resumeFile = req.file

        const userData = await User.findById(userId)

        if(resumeFile)
        {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path) 
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()
        return res.json({  
            success: true,
            message: "Resume updated successfully",
            user: userData
        })  

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}