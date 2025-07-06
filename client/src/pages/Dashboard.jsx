import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Dashboard = () => {
  const navigate = useNavigate();

  const { companyData, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  // Logout function to clear company data and token
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  // Default view for the dashboard
  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  return (
    <div className="min-h-screen">
      {/* Nav bar for Recruiter Panel */}
      <div className="shadow py-3 sm:py-4">
        <div className="px-3 sm:px-5 flex justify-between items-center">
          <img
            onClick={(e) => navigate("/")}
            className="cursor-pointer h-8 sm:h-10 w-auto"
            src={assets.jobHunt}
            alt=""
          />
          {companyData && (
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="hidden sm:block text-sm sm:text-base">
                Welcome, {companyData.name}
              </p>
              <div className="relative group">
                <img
                  className="w-6 sm:w-8 border rounded border-gray-400"
                  src={companyData.image}
                  alt=""
                />
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-8 sm:pt-12">
                  <ul className="list-none m-0 p-2 bg-white border text-xs sm:text-sm rounded-md border-gray-200 shadow">
                    <li
                      onClick={logout}
                      className="py-1 px-2 cursor-pointer pr-8 sm:pr-10"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start">
        {/* Sidebar to add, manage and view Job Applications */}
        <div className="border-r-2 inline-block min-h-screen border-gray-300">
          <ul className="flex flex-col items-start pt-3 sm:pt-5 text-gray-800">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-2 sm:p-3 lg:px-6 gap-1 sm:gap-2 w-full hover:bg-gray-100 text-xs sm:text-sm ${
                  isActive && "bg-blue-100  border-blue-500 border-r-4"
                }`
              }
              to={"/dashboard/add-job"}
            >
              <img
                className="min-w-3 sm:min-w-4 w-3 sm:w-4"
                src={assets.add_icon}
                alt=""
              />
              <p className="hidden sm:block">Add a Job</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-2 sm:p-3 lg:px-6 gap-1 sm:gap-2 w-full hover:bg-gray-100 text-xs sm:text-sm ${
                  isActive && "bg-blue-100  border-blue-500 border-r-4"
                }`
              }
              to={"/dashboard/manage-jobs"}
            >
              <img
                className="min-w-3 sm:min-w-4 w-3 sm:w-4"
                src={assets.home_icon}
                alt=""
              />
              <p className="hidden sm:block">Manage Jobs</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-2 sm:p-3 lg:px-6 gap-1 sm:gap-2 w-full hover:bg-gray-100 text-xs sm:text-sm ${
                  isActive && "bg-blue-100  border-blue-500 border-r-4"
                }`
              }
              to={"/dashboard/view-applications"}
            >
              <img
                className="min-w-3 sm:min-w-4 w-3 sm:w-4"
                src={assets.person_tick_icon}
                alt=""
              />
              <p className="hidden sm:block">View Applications</p>
            </NavLink>
          </ul>
        </div>
        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
