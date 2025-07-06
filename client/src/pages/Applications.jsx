import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  const { userData, backendUrl, userApplications, fetchUserData } =
    useContext(AppContext);

  //Handle resume upload
  const updateResume = async () => {
    if (!resume) {
      toast.error("Please select a resume file first.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchUserData();
        toast.success(data.message || "Resume updated successfully!");
        // Reset state after successful upload
        setIsEdit(false);
        setResume(null);
      } else {
        toast.error(data.message || "Failed to update resume");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error(error.response?.data?.message || "Failed to update resume");
    } finally {
      setIsUploading(false);
    }
  };

  // Better loading state
  if (!userApplications) {
    return <Loading />;
  }

  //  Helper function for status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container px-2 sm:px-4 2xl:px-20 mx-auto py-6 sm:py-10">
          {/* Resume Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Your Resume
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              {isEdit || !userData?.resume ? (
                <>
                  <label
                    htmlFor="resumeUpload"
                    className="cursor-pointer w-full sm:w-auto"
                  >
                    <div className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="truncate">
                        {resume ? resume.name : "Select Resume"}
                      </span>
                    </div>
                    <input
                      id="resumeUpload"
                      onChange={(e) => setResume(e.target.files[0])}
                      accept="application/pdf"
                      type="file"
                      hidden
                    />
                  </label>
                  <button
                    onClick={updateResume}
                    disabled={!resume || isUploading}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                      !resume || isUploading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Save"}
                  </button>
                  {isEdit && (
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setResume(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <div className="flex gap-3">
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Resume
                  </a>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                  />
                </svg>
                Applied Jobs ({userApplications.length})
              </h2>
            </div>

            {userApplications.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userApplications.map((job, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                  src={
                                    job.companyId?.image || assets.company_icon
                                  } // Added null safety
                                  alt={job.companyId?.name || "Company"}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {job.companyId?.name || "Company Name"}{" "}
                                  {/* {Added null safety */}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.jobId?.title || "Job Title"}{" "}
                              {/* Added null safety */}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
                            <div className="text-sm text-gray-600">
                              {job.jobId?.location || "Location"}{" "}
                              {/* Added null safety */}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
                            <div className="text-sm text-gray-600">
                              {moment(job.date).format("MMM DD, YYYY")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {moment(job.date).fromNow()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                                job.status
                              )}`}
                            >
                              {job.status}
                            </span>
                          </td>
                        </tr>
                      ))}{" "}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  {userApplications.map((job, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            src={job.companyId?.image || assets.company_icon}
                            alt={job.companyId?.name || "Company"}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {job.jobId?.title || "Job Title"}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {job.companyId?.name || "Company Name"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {job.jobId?.location || "Location"}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                  job.status
                                )}`}
                              >
                                {job.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {moment(job.date).format("MMM DD, YYYY")}
                            </span>
                            <span>{moment(job.date).fromNow()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start applying to jobs to see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
