import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-2 sm:px-4 2xl:px-20 mx-auto flex items-center gap-2 sm:gap-4 py-3 mt-12 sm:mt-20">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-6xl mx-auto w-full">
        <img
          className="rounded-full w-32 sm:w-40"
          src={assets.jobHunt}
          alt=""
        />
        <p className="flex-1 sm:border-l border-gray-400 sm:pl-4 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Copyright @Venkat.dev | All right reserved.
        </p>
        <div className="flex gap-2 sm:gap-2.5">
          <img className="w-8 sm:w-9" src={assets.facebook_icon} alt="" />
          <img className="w-8 sm:w-9" src={assets.twitter_icon} alt="" />
          <img className="w-8 sm:w-9" src={assets.instagram_icon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
