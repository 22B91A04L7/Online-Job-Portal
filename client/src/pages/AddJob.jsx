import Quill from "quill";
import React, { useContext, useEffect, useRef, useState } from "react";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;
      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        {
          title,
          description,
          location,
          salary,
          category,
          level,
        },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="container p-2 sm:p-5 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r bg-blue-500 px-4 sm:px-8 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Post a New Job
          </h1>
          <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
            Fill out the details below to attract the best candidates
          </p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="p-4 sm:p-8 space-y-4 sm:space-y-6"
        >
          {/* Job Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Developer"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Description <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div ref={editorRef} className="min-h-32 sm:min-h-40"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Provide a detailed description of the role, responsibilities, and
              requirements
            </p>
          </div>

          {/* Form Grid for Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Job Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                {JobCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Location */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              >
                {JobLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Level */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Experience Level
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={(e) => setLevel(e.target.value)}
                value={level}
              >
                <option value="Beginner Level">Beginner Level</option>
                <option value="Intermediate Level">Intermediate Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
          </div>

          {/* Salary Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Annual Salary
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </span>
              <input
                min={0}
                className="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                onChange={(e) => setSalary(e.target.value)}
                type="number"
                placeholder="75000"
                value={salary}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Enter the annual salary amount
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
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
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
