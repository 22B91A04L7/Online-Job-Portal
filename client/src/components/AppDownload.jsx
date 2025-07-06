import React from "react";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="container px-2 sm:px-4 2xl:px-20 mx-auto my-12 sm:my-20">
      <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-6 sm:p-12 lg:p-24 xl:p-32 rounded-lg overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-md">
            Download Mobile App For Better Experience
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a href="#" className="inline-block">
            <img className="h-10 sm:h-12" src={assets.play_store} alt="" />
          </a>
          <a href="#" className="inline-block">
            <img className="h-10 sm:h-12" src={assets.app_store} alt="" />
          </a>
        </div>
        <img
          className="absolute w-60 sm:w-72 lg:w-80 right-0 bottom-0 mr-4 sm:mr-16 lg:mr-32 max-md:hidden opacity-90"
          src={assets.app_main_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default AppDownload;
