import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import kconvert from "k-convert";
import moment from "moment";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);

  // Function to fetch job details by ID
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message || "Job not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      if (error.response?.status === 404) {
        toast.error("Job not found");
        navigate("/");
      } else {
        toast.error(error.response?.data?.message || "Failed to load job");
      }
    }
  };

  const applyHandler = async () => {
    try {
      setIsApplying(true);

      if (!user) {
        toast.error("Please Login as Applicant to apply for the job.");
        return;
      }

      if (!userData) {
        toast.error("Please complete your profile first.");
        return;
      }

      if (!userData.resume) {
        toast.error("Upload Resume to apply.");
        navigate("/applications");
        return;
      }

      if (isAlreadyApplied) {
        toast.info("You have already applied for this job.");
        return;
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply-job`,
        { jobId: JobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Application submitted successfully!");
        setIsAlreadyApplied(true);
        fetchUserApplications(); // Refresh applications
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsApplying(false);
    }
  };

  // Fixed: Check if job exists in userApplications
  const checkAlreadyApplied = () => {
    if (!JobData || !userApplications) return;

    const hasApplied = userApplications.some(
      (item) => item.jobId?._id === JobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (id && backendUrl) {
      fetchJob();
    }
  }, [id, backendUrl]);

  useEffect(() => {
    if (JobData && userApplications) {
      checkAlreadyApplied();
    }
  }, [JobData, userApplications]);

  // Show loading state
  if (!JobData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-6 sm:py-10 container px-4 sm:px-6 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center lg:justify-between flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center lg:items-start">
              <img
                className="h-16 sm:h-20 lg:h-24 bg-white p-2 sm:p-3 lg:p-4 mr-0 md:mr-4 rounded-lg mb-4 md:mb-0 border border-gray-400 object-cover"
                src={JobData.companyId?.image || assets.company_icon}
                alt={JobData.companyId?.name || "Company Logo"}
                onError={(e) => {
                  e.target.src = assets.company_icon;
                }}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-medium mb-2">
                  {JobData.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center md:justify-start gap-2 sm:gap-4 lg:gap-6 items-center mt-2 text-gray-600 text-sm sm:text-base">
                  <span className="flex items-center gap-1">
                    <img
                      src={assets.suitcase_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {JobData.companyId?.name || "Company Name"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <img
                      src={assets.location_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {JobData.location}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" className="w-4 h-4" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" className="w-4 h-4" />
                    CTC: {kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end text-center lg:text-end text-sm mt-4 lg:mt-5">
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied || isApplying}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto ${
                  isAlreadyApplied
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : isApplying
                    ? "bg-blue-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isApplying
                  ? "Applying..."
                  : isAlreadyApplied
                  ? "Already Applied"
                  : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                Posted {moment(JobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Description Block */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-xl sm:text-2xl mb-4">
                Job Description
              </h2>
              <div
                className="rich-text prose prose-sm sm:prose max-w-none text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: JobData.description }}
              ></div>
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied || isApplying}
                className={`px-6 py-3 rounded-lg font-medium mt-6 sm:mt-10 transition-all duration-200 w-full sm:w-auto ${
                  isAlreadyApplied
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : isApplying
                    ? "bg-blue-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isApplying
                  ? "Applying..."
                  : isAlreadyApplied
                  ? "Already Applied"
                  : "Apply Now"}
              </button>
            </div>

            {/* Right Section for more Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="font-semibold text-lg">
                More Jobs from {JobData.companyId?.name || "This Company"}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== JobData._id &&
                    job.companyId?._id === JobData.companyId?._id
                )
                .filter((job) => {
                  // set of applied job IDs
                  const appliedJobs = new Set(
                    userApplications.map((app) => app.jobId?._id)
                  );
                  // return true if the job is not in the applied set
                  return !appliedJobs.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={job._id || index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
