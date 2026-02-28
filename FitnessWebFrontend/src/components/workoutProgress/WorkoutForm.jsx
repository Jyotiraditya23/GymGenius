import React, { useState } from "react";
import { addWorkout } from "../../services/workoutProgressService";

const Field = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
      {label}
    </label>
    <input
      className="bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3
                 text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1
                 focus:ring-amber-500/30 transition-colors duration-150 w-full"
      {...props}
    />
  </div>
);

const WorkoutForm = ({ selectedMuscle, refreshChart }) => {
  const [formData, setFormData] = useState({
    exerciseName: "",
    weight: "",
    reps: "",
    sets: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedMuscle) {
      alert("Please select a muscle group first.");
      setLoading(false);
      return;
    }

    const payload = {
      exerciseName: formData.exerciseName,
      muscleGroup: selectedMuscle,
      weight: Number(formData.weight),
      reps: Number(formData.reps),
      sets: Number(formData.sets),
      date: formData.date,
    };

    try {
      await addWorkout(payload);
      refreshChart(selectedMuscle);
      setFormData({
        exerciseName: "",
        weight: "",
        reps: "",
        sets: "",
        date: "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error("Error adding workout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">
          02 / Log Session
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Exercise name spans full width */}
        <div className="sm:col-span-2">
          <Field
            label="Exercise Name"
            type="text"
            name="exerciseName"
            placeholder="e.g. Bench Press"
            value={formData.exerciseName}
            onChange={handleChange}
            required
          />
        </div>

        <Field
          label="Weight (kg)"
          type="number"
          name="weight"
          placeholder="100"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <Field
          label="Reps"
          type="number"
          name="reps"
          placeholder="8"
          value={formData.reps}
          onChange={handleChange}
          required
        />
        <Field
          label="Sets"
          type="number"
          name="sets"
          placeholder="4"
          value={formData.sets}
          onChange={handleChange}
          required
        />
        <Field
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <div className="sm:col-span-2 flex items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="relative bg-amber-500 text-zinc-950 font-black text-sm tracking-widest
                       uppercase px-8 py-3 hover:bg-amber-400 active:bg-amber-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-150 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Logging…
              </>
            ) : (
              "Log Workout"
            )}
          </button>
          {success && (
            <span className="text-amber-400 font-mono text-xs tracking-widest uppercase animate-pulse">
              ✓ Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
