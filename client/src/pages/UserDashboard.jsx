import React, { useState, useContext, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";
import moment from "moment";

const UserDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const {
    userData,
    backendUrl,
    userApplications,
    fetchUserApplications,
    fetchUserData,
    setUserData,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    bio: "",
  });

  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || user?.fullName || "",
        email: userData.email || user?.emailAddresses[0]?.emailAddress || "",
        phone: userData.phone || "",
        location: userData.location || "",
        skills: userData.skills || "",
        experience: userData.experience || "",
        education: userData.education || "",
        bio: userData.bio || "",
      });
    }
  }, [userData, user]);

  // Fetch user applications when component mounts
  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user, fetchUserApplications]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Resume uploaded successfully!");
        setUserData(data.user);
        fetchUserData();
      } else {
        toast.error(data.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/users/update-profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        // Update the userData in context with the new data
        setUserData(data.user);
        // Also fetch fresh data to ensure consistency
        fetchUserData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "applications", label: "Applications", icon: "📄" },
    { id: "resume", label: "Resume", icon: "📑" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Manage your profile, track applications, and find your dream
                job.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center">
                  📧{" "}
                  <span className="ml-1 truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </span>
                </span>
                <span>
                  📅 Member since {moment(user?.createdAt).format("MMM YYYY")}
                </span>
                <span>📊 {userApplications?.length || 0} Applications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm sm:text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Keep your profile updated to get better job matches
                  </span>
                </div>

                <form
                  onSubmit={handleProfileUpdate}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="React, Node.js, Python, etc. (comma separated)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <textarea
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Describe your work experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <textarea
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Describe your educational background..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>💾 Update Profile</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    My Applications
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {userApplications?.length || 0} applications submitted
                  </span>
                </div>

                {userApplications && userApplications.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userApplications.map((application, index) => (
                      <div
                        key={application._id || index}
                        className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                              <img
                                src={
                                  application.companyId?.image ||
                                  assets.company_icon
                                }
                                alt={application.companyId?.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = assets.company_icon;
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                  {application.jobId?.title || "Job Title"}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 truncate">
                                  {application.companyId?.name || "Company"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                📍{" "}
                                <span className="truncate">
                                  {application.jobId?.location}
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                📅 Applied {moment(application.date).fromNow()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status || "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start applying for jobs to see them here
                    </p>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Resume Management
                  </h2>
                  <span className="text-sm text-gray-500">
                    Keep your resume updated
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                  {userData?.resume ? (
                    <div className="space-y-4">
                      <div className="text-green-600 text-4xl">✅</div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Resume Uploaded
                      </h3>
                      <p className="text-gray-600">
                        Your resume is ready for applications
                      </p>
                      <div className="flex justify-center gap-4">
                        <a
                          href={userData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                          View Resume
                        </a>
                        <label className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer">
                          Update Resume
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className="hidden"
                            disabled={loading}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-gray-400 text-4xl">📄</div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No Resume Uploaded
                      </h3>
                      <p className="text-gray-600">
                        Upload your resume to start applying for jobs
                      </p>
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer inline-flex items-center gap-2">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>📤 Upload Resume</>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeUpload}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF files only, max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile Analytics
                  </h2>
                  <span className="text-sm text-gray-500">
                    Track your job search progress
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userApplications?.length || 0}
                    </div>
                    <div className="text-gray-600">Total Applications</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {userApplications?.filter(
                        (app) => app.status === "Pending" || !app.status
                      ).length || 0}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {userApplications?.filter(
                        (app) => app.status === "Accepted"
                      ).length || 0}
                    </div>
                    <div className="text-gray-600">Accepted</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {userApplications?.filter(
                        (app) => app.status === "Rejected"
                      ).length || 0}
                    </div>
                    <div className="text-gray-600">Rejected</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Completeness
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Basic Information</span>
                        <span className="text-green-600 font-medium">
                          ✅ Complete
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Resume</span>
                        <span
                          className={
                            userData?.resume
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {userData?.resume ? "✅ Complete" : "❌ Missing"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Skills</span>
                        <span
                          className={
                            profileData.skills
                              ? "text-green-600 font-medium"
                              : "text-yellow-600 font-medium"
                          }
                        >
                          {profileData.skills ? "✅ Complete" : "⚠️ Incomplete"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Experience</span>
                        <span
                          className={
                            profileData.experience
                              ? "text-green-600 font-medium"
                              : "text-yellow-600 font-medium"
                          }
                        >
                          {profileData.experience
                            ? "✅ Complete"
                            : "⚠️ Incomplete"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Education</span>
                        <span
                          className={
                            profileData.education
                              ? "text-green-600 font-medium"
                              : "text-yellow-600 font-medium"
                          }
                        >
                          {profileData.education
                            ? "✅ Complete"
                            : "⚠️ Incomplete"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Application Status Breakdown
                    </h3>
                    {userApplications && userApplications.length > 0 ? (
                      <div className="space-y-3">
                        {[
                          { status: "Pending", color: "yellow" },
                          { status: "Accepted", color: "green" },
                          { status: "Rejected", color: "red" },
                        ].map(({ status, color }) => {
                          const count = userApplications.filter((app) =>
                            status === "Pending"
                              ? app.status === "Pending" || !app.status
                              : app.status === status
                          ).length;
                          const percentage =
                            userApplications.length > 0
                              ? Math.round(
                                  (count / userApplications.length) * 100
                                )
                              : 0;

                          return (
                            <div key={status}>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">{status}</span>
                                <span className="font-medium">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className={`h-2 rounded-full ${
                                    color === "yellow"
                                      ? "bg-yellow-500"
                                      : color === "green"
                                      ? "bg-green-500"
                                      : color === "red"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No applications yet to analyze
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
