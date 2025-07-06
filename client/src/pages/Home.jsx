import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-x-hidden">
      <Navbar />

      {/* Hero Section with simple decorative elements */}
      <div className="relative">
        <Hero />

        {/* Simple Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-100 rounded-full opacity-30"></div>
        </div>
      </div>

      {/* Enhanced Statistics Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Jobs", icon: "💼" },
              { number: "25K+", label: "Companies", icon: "🏢" },
              { number: "100K+", label: "Job Seekers", icon: "👥" },
              { number: "95%", label: "Success Rate", icon: "📈" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 hover:scale-105 ${
                  isLoaded ? "animate-fade-in-up" : ""
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Job Listing Section */}
      <div className="relative py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Latest{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing career opportunities from top companies worldwide
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <JobListing />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose JobHunt?
            </h2>
            <p className="text-gray-600">Your success is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Smart Matching",
                description:
                  "AI-powered job recommendations based on your skills and preferences",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "⚡",
                title: "Instant Apply",
                description:
                  "One-click applications with your saved profile and resume",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description:
                  "Your data is protected with enterprise-grade security",
                color: "from-green-500 to-green-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced App Download Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full animate-float blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float-delayed blur-lg"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse blur-md"></div>

          {/* Mesh Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <AppDownload />
        </div>
      </div>

      {/* Enhanced Footer */}
      <Footer />

      {/* Enhanced Scroll-to-Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-15 right-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 group"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-y-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Enhanced Custom Styles */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-180deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        ${[...Array(8)]
          .map(
            (_, i) => `
          .animate-particle-${i + 1} {
            animation: particle-float-${i + 1} ${4 + i}s ease-in-out infinite;
          }
          
          @keyframes particle-float-${i + 1} {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.4;
            }
            50% { 
              transform: translate(${(i % 2 ? 1 : -1) * 20}px, ${
              (i % 3 ? 1 : -1) * 15
            }px) scale(1.2);
              opacity: 0.8;
            }
          }
        `
          )
          .join("")}
      `}</style>
    </div>
  );
};

export default Home;
