import React from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.jpeg";
import section2 from "../assets/section1.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white">
      {/* HERO SECTION */}
      <section
        className="h-screen w-full bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build Your Ultimate Fitness Experience
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Track. Train. Transform. Your AI-powered fitness journey starts
            here.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-300 transition duration-300"
          >
            Get Started
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-gray-400">↓</div>
      </section>

      {/* SECOND SECTION */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20 gap-12">
        {/* Text Side */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Smart Workout & Diet Planning
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            Manage your complete fitness profile with intelligent tracking. Set
            your goals, monitor body metrics, and let our AI engine generate
            personalized workout plans tailored to your strength, endurance, and
            muscle focus.
          </p>

          <p className="text-gray-400 leading-relaxed">
            Get customized diet recommendations based on your calorie and macro
            targets, chat with your AI-powered Gym Buddy for real-time guidance,
            and visualize your muscle-wise progress through interactive
            performance analytics.
          </p>
        </div>

        {/* Image Side */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img
            src={section2}
            alt="Workout"
            className="w-full md:w-4/5 rounded-xl shadow-2xl"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
