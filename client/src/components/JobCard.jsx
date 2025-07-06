import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if job is posted within the last 7 days
  const isRecent = job.date && moment().diff(moment(job.date), "days") <= 7;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 group hover:-translate-y-1 relative">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
            <img
              src={job.companyId.image}
              alt="Company"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {job.companyId.name}
            </div>
            <div className="text-xs text-gray-400">
              {job.date
                ? `Posted ${moment(job.date).fromNow()}`
                : "Posted recently"}
            </div>
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
        {job.title}
      </h4>

      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
        <span className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
          <svg
            className="w-3 h-3 mr-1"
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
          <span className="truncate max-w-24 sm:max-w-none">
            {job.location}
          </span>
        </span>
        <span className="inline-flex items-center bg-green-50 border border-green-200 text-green-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
          {job.level}
        </span>
      </div>

      <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed line-clamp-3">
        {job.description
          ? job.description.replace(/<[^>]*>/g, "").slice(0, 100) +
            (job.description.length > 150 ? "..." : "")
          : "We are looking for talented professionals to join our dynamic team. This is an exciting opportunity to grow your career in a collaborative environment."}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-center text-sm sm:text-base"
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
