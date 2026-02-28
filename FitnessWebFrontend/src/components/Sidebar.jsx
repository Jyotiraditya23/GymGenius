import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getCurrentUser } from "../services/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const linkStyle = ({ isActive }) =>
    `block px-3 py-2 rounded-lg transition ${
      isActive ? "bg-white text-black" : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 h-screen bg-black border-r border-white/10 text-white flex flex-col px-6 py-8 sticky top-0">
      {/* User Section */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold">
          {user?.fullName?.charAt(0)?.toUpperCase() ||
            user?.email?.charAt(0)?.toUpperCase() ||
            "U"}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {user?.fullName || "User"}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[11rem]">
            {user?.email || "email@example.com"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 text-sm">
        {/* <NavLink to="#" className={linkStyle}>
          Dashboard
        </NavLink> */}

        <NavLink to="/profile" className={linkStyle}>
          Fitness Profile
        </NavLink>

        {/* NEW WORKOUT PAGE LINK */}
        <NavLink to="/workouts" className={linkStyle}>
          Workout Plans
        </NavLink>

        <NavLink to="/diet" className={linkStyle}>
          Diet Plans
        </NavLink>
        <NavLink to="/chatbot" className={linkStyle}>
          Chatbot
        </NavLink>
        <NavLink to="/workout-progress" className={linkStyle}>
          Workout Progress
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full py-2 rounded-lg border border-white/30 text-sm hover:bg-white hover:text-black transition"
      >
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;
