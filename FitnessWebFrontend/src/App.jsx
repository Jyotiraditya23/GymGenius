import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FitnessProfile from "./pages/FitnessProfile";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import WorkoutPlans from "./pages/WorkoutPlans";
import DietPlans from "./pages/DietPlans";
import Chatbot from "./pages/Chatbot";
import WorkoutProgress from "./pages/WorkoutProgress";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AuthenticatedLayout />}>
          <Route path="/profile" element={<FitnessProfile />} />
          <Route path="/fitness-profile" element={<FitnessProfile />} />
          <Route path="/workouts" element={<WorkoutPlans />} />
          <Route path="/diet" element={<DietPlans />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/workout-progress" element={<WorkoutProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;