import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";




// Register a Company
export const registerCompany = async (req, res) =>{

    const {name, email, password } = req.body;
    // Check if the image is provided
    const image = req.file;

    if(!name || !email || !password || !image){
        return res.json({success:false, message:"Error! Missing Details"});
    }

    try {
        const companyExits = await Company.findOne({email});
        if(companyExits)
        {
            return res.json({success:false, message:"Company already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(image.path)

        // Storing company data in the database
        const company = await Company.create({
            name,
            email,
            password:hashPassword,
            image:imageUpload.secure_url
        })

        res.json({
            success:true,
            message:"Company registered successfully",
            company:{
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token : generateToken(company._id)
        
        })

    } catch (error) {
        res.json({
            success:false,
        message:error.message})
    }
}

// Company Login
export const loginCompany = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({
            success: false,
            message: "Please provide email and password"
        });
    }

    try {
        const company = await Company.findOne({email});
        if (!company) {
            return res.json({
                success: false,
                message: "No account found with this email. Please sign up first."
            });
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (isMatch) {
            res.json({
                success: true,
                message: "Company logged in successfully",
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });
        } else {
            res.json({
                success: false,
                message: "Incorrect password. Please try again."
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }

}

// Get Company data
export const getCompanyData = async(req, res) => {
    try {
        const company = req.company
        res.json({success:true, company})
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Post a job
export const postJob = async(req, res) => {

    const {title, description, location, salary,level, category} = req.body;

    const companyId = req.company._id;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            level,
            category,  
            companyId,
            date: Date.now(),

        })
        await newJob.save()

        res.json({
            success:true,
            message:"Job posted successfully",
            newJob
        })
        
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
        
    }    

}

// Get Company JOb Applications
export const getCompanyJobApplications = async(req, res) => {
  try {
    const companyId = req.company._id
    // Find all job Applications for the company
    const applications = await JobApplication.find({ companyId }).populate('userId', 'name image resume')
    .populate('jobId', 'title location category level salary')
    .exec();

    return res.json({
        success: true,
        applications 
    })
  } catch (error) {
    return res.json({
        success: false,
        message: error.message
    })
    
  }
}

// get Company posted jobs
export const getcompanyPostedJobs = async(req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await Job.find({companyId})
        
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
            success:true,
            jobs: jobsWithApplicants
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Change JOb Application Status
export const changeJobApplicationStatus = async(req, res) => {
    try {
        const {id, status} = req.body
    // Find the job application and update its status
    await JobApplication.findByIdAndUpdate({_id:id},{status})
    res.json({
        success:true,
        message:"Status Changed Successfully"
    })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Chane Job Visibiltiy
export const changeVisibility = async(req, res) => {
    try {
        const {id} = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)
        if(companyId.toString() === job.companyId.toString()){
            job.visible = !job.visible
            await job.save()
            res.json({
                success:true,
                message:"Job visibility changed successfully",
                job
            })
        }
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}


