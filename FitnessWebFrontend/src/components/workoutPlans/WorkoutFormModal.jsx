// src/components/workoutPlans/WorkoutFormModal.jsx

import { useState, useEffect } from "react";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const diffStyle = {
  Easy:   "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  Medium: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  Hard:   "border-red-500/40 text-red-400 bg-red-500/10",
};

const inputClass =
  "bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 " +
  "text-sm font-mono focus:outline-none focus:border-amber-500 focus:ring-1 " +
  "focus:ring-amber-500/30 transition-colors duration-150 w-full";

const WorkoutFormModal = ({ isOpen, onClose, onSave, existingPlan }) => {
  const [formData, setFormData] = useState({ planName: "", difficulty: "" });
  const [workoutDaysList, setWorkoutDaysList] = useState([{ day: "", muscle: "" }]);

  useEffect(() => {
    if (existingPlan) {
      setFormData({ planName: existingPlan.planName, difficulty: existingPlan.difficulty });
      if (existingPlan.workoutDays) {
        setWorkoutDaysList(
          Object.entries(existingPlan.workoutDays).map(([day, muscle]) => ({ day, muscle }))
        );
      }
    } else {
      setFormData({ planName: "", difficulty: "" });
      setWorkoutDaysList([{ day: "", muscle: "" }]);
    }
  }, [existingPlan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const workoutDays = {};
    workoutDaysList.forEach(({ day, muscle }) => { if (day && muscle) workoutDays[day] = muscle; });
    onSave({ ...formData, workoutDays });
    onClose();
  };

  const updateDay = (i, field, value) => {
    const updated = [...workoutDaysList];
    updated[i][field] = value;
    setWorkoutDaysList(updated);
  };

  const removeDay = (i) => setWorkoutDaysList(workoutDaysList.filter((_, idx) => idx !== i));
  const addDay = () => setWorkoutDaysList([...workoutDaysList, { day: "", muscle: "" }]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-700 shadow-2xl max-h-[90vh] flex flex-col">

        {/* ── Modal header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 flex-shrink-0">
          <div>
            <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-1">
              {existingPlan ? "Edit / Update" : "New Plan"}
            </p>
            <h2 className="text-white font-black uppercase text-lg tracking-tight leading-none">
              {existingPlan ? "Update Plan" : "Create Workout Plan"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white font-mono text-lg transition-colors duration-150 leading-none"
          >
            ✕
          </button>
        </div>

        {/* ── Form body (scrollable) ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">

            {/* Plan Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Plan Name
              </label>
              <input
                type="text"
                placeholder="e.g. Push Pull Legs"
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: d })}
                    className={`flex-1 py-3 font-black text-xs uppercase tracking-widest border transition-colors duration-150
                      ${formData.difficulty === d
                        ? diffStyle[d]
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Split */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Weekly Split
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-600 font-mono text-xs">{workoutDaysList.length} days</span>
              </div>

              {/* Column labels */}
              <div className="grid grid-cols-12 gap-2 px-1">
                <span className="col-span-5 text-zinc-600 font-mono text-xs uppercase tracking-widest">Day</span>
                <span className="col-span-6 text-zinc-600 font-mono text-xs uppercase tracking-widest">Muscle Group</span>
              </div>

              <div className="space-y-2">
                {workoutDaysList.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center group">
                    <input
                      type="text"
                      placeholder="Monday"
                      value={item.day}
                      onChange={(e) => updateDay(i, "day", e.target.value)}
                      className={inputClass + " col-span-5"}
                    />
                    <input
                      type="text"
                      placeholder="Chest"
                      value={item.muscle}
                      onChange={(e) => updateDay(i, "muscle", e.target.value)}
                      className={inputClass + " col-span-6"}
                    />
                    <button
                      type="button"
                      onClick={() => removeDay(i)}
                      className="col-span-1 h-full flex items-center justify-center text-zinc-700
                                 hover:text-red-400 transition-colors duration-150 font-mono text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addDay}
                className="text-xs font-black uppercase tracking-widest text-amber-500
                           hover:text-amber-400 transition-colors duration-150 self-start"
              >
                + Add Day
              </button>
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className="flex gap-3 px-6 py-5 border-t border-zinc-800 flex-shrink-0">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 text-zinc-950 font-black text-sm uppercase
                         tracking-widest hover:bg-amber-400 active:bg-amber-600 transition-colors duration-150"
            >
              {existingPlan ? "Save Changes" : "Create Plan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-zinc-700 text-zinc-400 font-mono text-sm uppercase
                         tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutFormModal;