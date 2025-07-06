import React, { useEffect, useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  // Function to fetch applications
  const fetchCompanyJobApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });
      if (data.success) {
        setApplicants(data.applications?.reverse() || []);
      } else {
        toast.error(data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to update the status of an application
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Filter applications based on status
  const filteredApplicants = applicants
    .filter((applicant) => {
      if (filterStatus === "All") return true;
      return applicant.status === filterStatus;
    })
    .filter((item) => item.jobId && item.userId);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading applications...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!applicants || applicants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-600">
                Applications will appear here when candidates apply for your
                jobs.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Job Applications
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Total applications: {applicants.length} | Filtered:{" "}
                {filteredApplicants.length}
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 sm:whitespace-nowrap">
                Filter by status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={fetchCompanyJobApplications}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Applications - Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table content will be added below */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700">
                    Applicant
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700 max-lg:hidden">
                    Job Details
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700 max-sm:hidden">
                    Applied Date
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700">
                    Resume
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-4 px-6 border-b border-gray-200 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplicants.map((applicant, index) => (
                  <tr
                    key={applicant._id || index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-center text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {applicant.userId?.image ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                              src={applicant.userId.image}
                              alt={applicant.userId?.name || "User"}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center"
                            style={{
                              display: applicant.userId?.image
                                ? "none"
                                : "flex",
                            }}
                          >
                            <span className="text-blue-600 font-semibold text-lg">
                              {applicant.userId?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.userId?.name || "Unknown User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-lg:hidden">
                      <div className="text-sm text-gray-900 font-medium">
                        {applicant.jobId?.title || "Unknown Job"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {applicant.jobId?.location || "Unknown Location"}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-sm:hidden">
                      <div className="text-sm text-gray-900">
                        {moment(applicant.date).format("MMM DD, YYYY")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {moment(applicant.date).fromNow()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {applicant.userId?.resume ? (
                        <a
                          href={applicant.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-sm font-medium"
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
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No resume</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          applicant.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : applicant.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {applicant.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {applicant.status === "Pending" ? (
                        <div className="relative inline-block group">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-0 mt-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Accepted"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 rounded-t-lg transition-colors font-medium"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Rejected"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors font-medium"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No action needed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Footer */}
        {filteredApplicants.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {applicants.filter((app) => app.status === "Pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {applicants.filter((app) => app.status === "Accepted").length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {applicants.filter((app) => app.status === "Rejected").length}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {applicants.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
