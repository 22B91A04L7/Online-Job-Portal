import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    setShowRecruiterLogin,
    companyData,
    setCompanyToken,
    setCompanyData,
  } = useContext(AppContext);

  // Logout function for recruiters
  const recruiterLogout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  return (
    <div className="shadow py-3 sm:py-4">
      <div className="container px-2 sm:px-4 2xl:px-20 mx-auto flex justify-between items-center text-gray-600">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer h-8 sm:h-10 w-auto rounded-full"
          src={assets.jobHunt}
          alt="Job Hunt Logo"
        />
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
            <Link
              to="/user-dashboard"
              className="hover:text-blue-600 transition-colors hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              to="/user-dashboard"
              className="hover:text-blue-600 transition-colors sm:hidden text-xs"
            >
              Dashboard
            </Link>
            <p className="hidden sm:block">|</p>
            <Link
              to="/applications"
              className="hover:text-blue-600 transition-colors hidden sm:block"
            >
              Applied Jobs
            </Link>
            <Link
              to="/applications"
              className="hover:text-blue-600 transition-colors sm:hidden text-xs"
            >
              Jobs
            </Link>
            <p className="hidden sm:block">|</p>
            <p className="hidden md:block text-sm">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <p className="block md:hidden text-xs">{user.firstName}</p>
            <UserButton />
          </div>
        ) : companyData ? (
          <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <p className="hidden sm:block">|</p>
            <p className="hidden md:block">Welcome, {companyData.name}</p>
            <p className="block md:hidden text-xs">
              {companyData.name.split(" ")[0]}
            </p>
            <div className="relative group">
              <img
                className="w-6 h-6 sm:w-8 sm:h-8 border rounded-full border-gray-400 cursor-pointer object-cover"
                src={companyData.image}
                alt={companyData.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/32x32?text=" +
                    companyData.name.charAt(0);
                }}
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-8 sm:pt-10">
                <ul className="list-none m-0 p-2 bg-white border text-xs sm:text-sm rounded-md border-gray-200 shadow-lg">
                  <li className="py-1 px-2 text-gray-600 font-medium border-b border-gray-100">
                    {companyData.name}
                  </li>
                  <li
                    onClick={() => navigate("/dashboard")}
                    className="py-2 px-3 cursor-pointer hover:bg-gray-100 rounded"
                  >
                    Dashboard
                  </li>
                  <li
                    onClick={recruiterLogout}
                    className="py-2 px-3 cursor-pointer hover:bg-red-50 text-red-600 rounded"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
            <button
              onClick={(e) => setShowRecruiterLogin(true)}
              className="text-gray-600 hover:text-blue-600 transition-colors px-2 sm:px-3 py-1 sm:py-2"
            >
              Recruiter Login
            </button>
            <button
              onClick={(e) => openSignIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 lg:px-9 py-1.5 sm:py-2 rounded-full transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
