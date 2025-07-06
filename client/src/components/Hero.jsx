import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useRef } from "react";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-6 sm:my-10 px-4">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-12 sm:py-16 text-center mx-2 sm:mx-6 lg:mx-10 rounded-xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 px-4">
          Over 10,000+ jobs to apply
        </h2>
        <p className="mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base font-light px-4 sm:px-5">
          Your Next Big Career Move Starts Right Here - Explore the Best Job
          Opportunities and Take the First Step Toward Your Future!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded text-gray-600 max-w-xl mx-4 sm:mx-auto overflow-hidden">
          <div className="flex items-center flex-1 w-full sm:w-auto">
            <div className="flex items-center pl-3 sm:pl-4">
              <img
                className="h-4 sm:h-5"
                src={assets.search_icon}
                alt="search icon"
              />
            </div>
            <input
              type="text"
              placeholder="Search for Jobs"
              className="text-xs sm:text-sm p-2 sm:p-3 outline-none w-full"
              ref={titleRef}
            />
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
          <div className="flex items-center flex-1 w-full sm:w-auto">
            <div className="flex items-center pl-3 sm:pl-4">
              <img
                className="h-4 sm:h-5"
                src={assets.location_icon}
                alt="location icon"
              />
            </div>
            <input
              type="text"
              placeholder="Search by Location"
              className="text-xs sm:text-sm p-2 sm:p-3 outline-none w-full"
              ref={locationRef}
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-none sm:rounded m-0 sm:m-1 w-full sm:w-auto text-sm sm:text-base font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 sm:mt-5">
        <p className="font-semibold text-sm sm:text-lg text-gray-500 bg-white px-3 sm:px-4 py-1 sm:py-2 rounded shadow">
          Trusted By
        </p>
      </div>
      <div className="border border-gray-300 rounded shadow-md mx-2 sm:mx-6 lg:mx-10 mt-4 sm:mt-5 p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-nowrap min-w-max gap-6 sm:gap-10 lg:gap-16 animate-marquee pause-on-hover justify-center items-center">
          <img
            className="h-4 sm:h-6"
            src={assets.accenture_logo}
            alt="accenture"
          />
          <img className="h-4 sm:h-6" src={assets.adobe_logo} alt="adobe" />
          <img className="h-4 sm:h-6" src={assets.amazon_logo} alt="amazon" />
          <img
            className="h-4 sm:h-6"
            src={assets.microsoft_logo}
            alt="microsoft"
          />
          <img className="h-4 sm:h-6" src={assets.walmart_logo} alt="walmart" />
          <img className="h-4 sm:h-6" src={assets.samsung_logo} alt="samsung" />
          {/* Repeat for seamless circular effect */}
          <img
            className="h-4 sm:h-6"
            src={assets.accenture_logo}
            alt="accenture"
          />
          <img className="h-4 sm:h-6" src={assets.adobe_logo} alt="adobe" />
          <img className="h-4 sm:h-6" src={assets.amazon_logo} alt="amazon" />
          <img
            className="h-4 sm:h-6"
            src={assets.microsoft_logo}
            alt="microsoft"
          />
          <img className="h-4 sm:h-6" src={assets.walmart_logo} alt="walmart" />
          <img className="h-4 sm:h-6" src={assets.samsung_logo} alt="samsung" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
