import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Filter and sort jobs based on searchFilter
  const filteredJobs = jobs
    .filter((job) => {
      const titleMatch = searchFilter.title
        ? job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        : true;
      const locationMatch = searchFilter.location
        ? job.location
            .toLowerCase()
            .includes(searchFilter.location.toLowerCase())
        : true;
      const categoryMatch =
        selectedCategories.length > 0
          ? selectedCategories.includes(job.category)
          : true;
      const locationCheckboxMatch =
        selectedLocations.length > 0
          ? selectedLocations.includes(job.location)
          : true;
      return (
        titleMatch && locationMatch && categoryMatch && locationCheckboxMatch
      );
    })
    .sort((a, b) => {
      // Sort by date (latest first)
      return new Date(b.date) - new Date(a.date);
    });

  // Pagination logic
  const jobsPerPage = 6;
  const maxPage = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Reset to page 1 if filter changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > maxPage) setCurrentPage(1);
  }, [searchFilter, maxPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="container mx-auto 2xl:px-20 flex flex-col px-2 lg:flex-row max-lg:space-y-8 py-8 ">
      {/* Side Bar */}
      <div className="w-full lg:w-1/4 bg-white px-10">
        {/* Search filter from hero component */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600 flex">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="inline-flex ml-3 items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={(e) => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Show Filters"}
        </button>

        {/* Job Category Filter by categories */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-3 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="gap-2 flex items-center">
                <input
                  className="scale-125"
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Job Category Filter by Location */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 mt-10">Search by Location</h4>
          <ul className="space-y-3 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="gap-2 flex items-center">
                <input
                  className="scale-125"
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings */}
      <section className="w-full text-gray-600 max-lg:px-4 mx-auto lg:mr-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-medium text-3xl py-2" id="job-list">
            Latest Jobs
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
              🔥 HOT
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredJobs.length} Jobs
            </span>
          </div>
        </div>
        <p className="mb-8 text-gray-500">
          Get your desired job from top companies • Updated daily • Sorted by
          newest first
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Render filtered and paginated jobs */}
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job, index) => (
              <JobCard key={job._id || index} job={job} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                {filteredJobs.length === 0 && jobs.length > 0
                  ? "Try adjusting your filters to see more jobs"
                  : "New jobs are being added daily. Check back soon!"}
              </p>
              {(selectedCategories.length > 0 ||
                selectedLocations.length > 0 ||
                searchFilter.title ||
                searchFilter.location) && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLocations([]);
                    setSearchFilter({ title: "", location: "" });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > jobsPerPage && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  document
                    .getElementById("job-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded transition-all ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              aria-label="Previous Page"
            >
              <img src={assets.left_arrow_icon} alt="Previous" />
            </button>
            {Array.from({ length: maxPage }).map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded transition-all ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setCurrentPage(index + 1);
                  document
                    .getElementById("job-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => {
                if (currentPage < maxPage) {
                  setCurrentPage(currentPage + 1);
                  document
                    .getElementById("job-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              disabled={currentPage === maxPage}
              className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded transition-all ${
                currentPage === maxPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              aria-label="Next Page"
            >
              <img src={assets.right_arrow_icon} alt="Next" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
