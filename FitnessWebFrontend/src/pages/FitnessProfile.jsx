// src/pages/FitnessProfile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../services/fitnessProfileService";
import { clearAuth } from "../services/authService";
import StatCard from "../components/fitnessProfile/StatCard";
import DetailRow from "../components/fitnessProfile/DetailRow";
import ProfileForm from "../components/fitnessProfile/ProfileForm";

const EMPTY_FORM = {
  age: "",
  height: "",
  weight: "",
  goal: "Muscle Gain",
  dietPreference: "High Protein",
  monthlyBudget: "",
  workoutDays: "3-4 days/week",
};

/* ─────────────────────────────────────────────────────────────────────────── */

const FitnessProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data) { setProfile(data); setFormData(data); }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) { clearAuth(); navigate("/login"); }
      else if (status === 404) { setProfile(null); }
      else { setError("Failed to load profile"); setProfile(null); }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      monthlyBudget: formData.monthlyBudget ? parseInt(formData.monthlyBudget, 10) : null,
    };
    try {
      if (isEditing) {
        const updated = await updateProfile(payload);
        setProfile(updated || payload);
        setIsEditing(false);
      } else {
        const created = await createProfile(payload);
        setProfile(created || payload);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save profile");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile();
      setProfile(null);
      setFormData(EMPTY_FORM);
      setConfirmDelete(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete profile");
    }
  };

  const cancelForm = () => {
    setError("");
    if (isEditing) { setIsEditing(false); setFormData(profile); }
    else { setShowForm(false); setFormData(EMPTY_FORM); }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  /* ─── Form (create or edit) ─── */
  if (showForm || isEditing) {
    return (
      <ProfileForm
        isEditing={isEditing}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={cancelForm}
        error={error}
      />
    );
  }

  /* ─── Empty state ─── */
  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          {/* Icon */}
          <div className="mx-auto mb-8 w-16 h-16 border-2 border-dashed border-zinc-700 rotate-45 flex items-center justify-center">
            <svg
              className="-rotate-45 text-zinc-500 w-7 h-7"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-3">
            01 / Setup
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-4">
            No Profile
            <br />
            <span className="text-zinc-600">Yet</span>
          </h1>
          <p className="text-zinc-500 text-sm font-mono leading-relaxed mb-10">
            Set up your fitness profile to personalise workouts, diet plans, and goal tracking.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-zinc-950 font-black text-sm uppercase tracking-widest
                       px-8 py-3 hover:bg-amber-400 transition-colors duration-150 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Profile
          </button>

          <div className="mt-8">
            <button
              onClick={() => { clearAuth(); navigate("/login"); }}
              className="text-zinc-600 hover:text-zinc-400 font-mono text-xs uppercase tracking-widest transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── BMI calc ─── */
  const bmi = profile?.weight && profile?.height
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : null;
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : "Overweight";
  const bmiColor = bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-amber-400" : "text-red-400";

  /* ─── Profile Dashboard ─── */
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ── Top bar ── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
              Gym Genius / Profile
            </p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              Fitness
              <br />
              <span className="text-zinc-500">Profile</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsEditing(true); setFormData(profile); }}
              className="px-6 py-2.5 bg-amber-500 text-zinc-950 font-black text-xs uppercase
                         tracking-widest hover:bg-amber-400 transition-colors duration-150"
            >
              Edit
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 border border-red-500/50 text-red-400 font-black text-xs
                             uppercase tracking-widest hover:bg-red-500/10 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2.5 border border-zinc-700 text-zinc-400 font-mono text-xs
                             uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-6 py-2.5 border border-zinc-700 text-zinc-500 font-mono text-xs
                           uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-colors duration-150"
              >
                Delete
              </button>
            )}
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400 font-mono text-xs uppercase tracking-widest">
            ⚠ {error}
          </div>
        )}

        {/* ── Section: Stats ── */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">01 / Body Stats</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard label="Age" value={profile.age} unit="yrs" />
          <StatCard label="Height" value={profile.height} unit="cm" />
          <StatCard label="Weight" value={profile.weight} unit="kg" />

          {/* BMI card */}
          <div className="relative border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-2 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/40" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">BMI Index</span>
            <span className="text-3xl font-black text-white leading-none">{bmi}</span>
            <span className={`font-mono text-xs uppercase tracking-widest mt-auto ${bmiColor}`}>
              {bmiLabel}
            </span>
          </div>
        </div>

        {/* ── Section: Preferences ── */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">02 / Preferences</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            <DetailRow
              label="Primary Goal"
              value={profile.goal}
              accent="text-amber-400"
            />
            <DetailRow label="Diet Preference" value={profile.dietPreference} />
            <DetailRow label="Workout Frequency" value={profile.workoutDays} />
            <DetailRow
              label="Monthly Budget"
              value={`₹${profile.monthlyBudget?.toLocaleString()}`}
              accent="text-emerald-400"
            />
          </div>
        </div>

        {/* Log out */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => { clearAuth(); navigate("/login"); }}
            className="text-zinc-600 hover:text-zinc-400 font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessProfile;