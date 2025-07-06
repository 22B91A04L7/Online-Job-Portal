import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setImage(false);
    setIsTextDataSubmitted(false);
    setShowPassword(false);
  };

  const handleStateChange = (newState) => {
    setState(newState);
    resetForm();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    setIsLoading(true);

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          // Check if the error is about no account found
          if (data.message && data.message.includes("No account found")) {
            toast.error(data.message);
            // Auto-switch to Sign Up mode
            handleStateChange("Sign Up");
            toast.info(
              "Switching to Sign Up mode. Please create your account."
            );
          } else {
            toast.error(data.message || "Login failed. Please try again.");
          }
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);

        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData
        );

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex items-center justify-center">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {state === "Login"
                  ? "Signing you in..."
                  : "Creating your account..."}
              </h3>
              <p className="text-sm text-gray-600">
                {state === "Login"
                  ? "Please wait"
                  : "Setting up your recruiter dashboard"}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm text-center">
          {state === "Login"
            ? "Welcome back! Please sign in to continue"
            : "Create your recruiter account to start posting jobs"}
        </p>
        {state === "Sign Up" && isTextDataSubmitted ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-4">
              <p className="text-sm text-blue-700">
                📸 Please upload your company logo to complete the registration
              </p>
            </div>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
              <p>
                Upload Company <br /> logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state != "Login" && (
              <div className="border border-gray-200 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border border-gray-200 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email Id"
                required
              />
            </div>
            <div className="border border-gray-200 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm flex-1"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? (
                  <FaRegEyeSlash className="w-4 h-4" />
                ) : (
                  <FaRegEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 my-3 cursor-pointer">
            Forgot Password ?
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed w-full text-white py-3 rounded-full mt-4 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>
                {state === "Login"
                  ? "Signing In..."
                  : isTextDataSubmitted
                  ? "Creating Account..."
                  : "Processing..."}
              </span>
            </>
          ) : (
            <span>
              {state === "Login"
                ? "Sign In"
                : isTextDataSubmitted
                ? "Create Account"
                : "Continue"}
            </span>
          )}
        </button>
        {state === "Login" ? (
          <p className="text-sm text-gray-600 my-2 cursor-pointer text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => handleStateChange("Sign Up")}
            >
              Sign Up here
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-600 my-2 cursor-pointer text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => handleStateChange("Login")}
            >
              Sign In here
            </span>
          </p>
        )}

        <img
          onClick={(e) => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
