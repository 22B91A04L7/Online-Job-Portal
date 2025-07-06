import React, { useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import UserDashboard from "./pages/UserDashboard";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return companyToken ? children : <Navigate to="/" replace />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Dashboard Routes with Nested Structure */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Remove conditional rendering - always register routes */}
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
          {/* Default redirect */}
          <Route index element={<Navigate to="manage-jobs" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
