import React from "react";

const Loading = ({
  size = "default",
  fullScreen = true,
  message = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    default: "h-12 w-12 border-4",
    large: "h-16 w-16 border-4",
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-blue-600`}
        ></div>
        <div
          className={`absolute inset-0 rounded-full ${sizeClasses[size]} border-transparent border-r-blue-400 animate-pulse`}
        ></div>
      </div>
      {message && (
        <div className="mt-4 text-center">
          <div className="text-lg font-medium text-gray-700">{message}</div>
          <div className="text-sm text-gray-500 mt-1 animate-pulse">
            Please wait a moment
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
