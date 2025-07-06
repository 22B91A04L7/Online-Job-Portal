import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch company's jobs
  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        toast.error(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("An error occurred while fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle job visibility
  const toggleVisibility = async (jobId, currentVisibility) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visibility",
        { id: jobId },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        // Update the job in the state
        setJobs(
          jobs.map((job) =>
            job._id === jobId ? { ...job, visible: !currentVisibility } : job
          )
        );
        toast.success("Job visibility updated successfully");
      } else {
        toast.error(data.message || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("An error occurred while updating visibility");
    }
  };

  // Auto-refresh jobs data every 30 seconds to get updated applicants count
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 mx-auto max-w-7xl">
      <div className="w-full">
        {/* Add refresh button to manually update data */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Manage Jobs
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchCompanyJobs}
              disabled={loading}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => navigate("/dashboard/add-job")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg px-4 sm:px-6 py-2 transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Job
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 mx-auto max-w-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-blue-400 animate-pulse"></div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Loading your jobs...
              </div>
              <div className="text-sm text-gray-500 animate-pulse">
                Fetching the latest job postings
              </div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 mx-auto max-w-2xl">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              No Jobs Posted Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              Ready to build your dream team? Start by posting your first job
              opening and connect with talented professionals who are perfect
              for your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => navigate("/dashboard/add-job")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Post Your First Job
              </button>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                It takes less than 5 minutes to create your first posting
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                      Job Title
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                      Date Posted
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-center font-semibold text-gray-700">
                      Applicants
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job, index) => (
                    <tr
                      className="text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      key={job._id}
                    >
                      <td className="py-4 px-6 font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {job.title}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {moment(job.date).format("MMM DD, YYYY")}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {job.location}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {job.applicants || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            className="sr-only"
                            type="checkbox"
                            checked={job.visible}
                            onChange={() =>
                              toggleVisibility(job._id, job.visible)
                            }
                          />
                          <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              job.visible ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                                job.visible ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </div>
                          <span
                            className={`ml-3 text-sm font-medium ${
                              job.visible ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {job.visible ? "Visible" : "Hidden"}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {jobs.map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                        <span>
                          📅 {moment(job.date).format("MMM DD, YYYY")}
                        </span>
                        <span>📍 {job.location}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                      {job.applicants || 0} applicants
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        className="sr-only"
                        type="checkbox"
                        checked={job.visible}
                        onChange={() => toggleVisibility(job._id, job.visible)}
                      />
                      <div
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                          job.visible ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ${
                            job.visible ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </div>
                      <span
                        className={`ml-2 text-xs font-medium ${
                          job.visible ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {job.visible ? "Visible" : "Hidden"}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
