// src/pages/WorkoutPlans.jsx

import React, { useEffect, useState } from "react";
import {
  getAllPlans,
  addPlan,
  updatePlan,
  deletePlan,
  generateWorkout,
} from "../services/workoutService";
import WorkoutCard from "../components/workoutPlans/WorkoutCard";
import WorkoutFormModal from "../components/workoutPlans/WorkoutFormModal";

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, highlight = false }) => (
  <div
    className={`relative border p-5 flex flex-col gap-2 flex-1 min-w-0 transition-colors duration-150
      ${highlight
        ? "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
        : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700"
      }`}
  >
    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${highlight ? "border-amber-500/60" : "border-zinc-700"}`} />
    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{label}</span>
    <span className={`text-3xl font-black leading-none ${highlight ? "text-amber-400" : "text-white"}`}>
      {value}
    </span>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [aiPlans, setAiPlans] = useState({});
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const res = await getAllPlans();
    setPlans(res.data);
  };

  const handleSave = async (payload) => {
    if (editPlan) {
      await updatePlan(editPlan.id, payload);
    } else {
      await addPlan(payload);
    }
    fetchPlans();
    setEditPlan(null);
  };

  const handleDelete = async (id) => {
    await deletePlan(id);
    fetchPlans();
  };

  const handleGenerate = async (id) => {
    const res = await generateWorkout(id);
    setAiPlans((prev) => ({ ...prev, [id]: res.data }));
  };

  const handleEdit = (plan) => {
    setEditPlan(plan);
    setShowForm(true);
  };

  const filtered = plans.filter((p) =>
    p.planName.toLowerCase().includes(search.toLowerCase())
  );

  const totalDays = plans.reduce(
    (acc, p) => acc + (p.workoutDays ? Object.keys(p.workoutDays).length : 0),
    0
  );
  const hardCount = plans.filter((p) =>
    ["hard", "advanced"].includes((p.difficulty || "").toLowerCase())
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ── Page title ── */}
        <div className="mb-10">
          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
            Gym Genius / Workouts
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Workout
            <br />
            <span className="text-zinc-500">Plans</span>
          </h1>
        </div>

        {/* ── Stat cards ── */}
        <div className="flex items-stretch gap-3 mb-10">
          <StatCard label="Total Plans" value={plans.length} />
          <StatCard label="Training Days" value={totalDays} />
          <StatCard label="Advanced Plans" value={hardCount} highlight />
        </div>

        {/* ── Section header ── */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">
            01 / Plans
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 font-mono text-xs">
            {filtered.length} {filtered.length === 1 ? "plan" : "plans"}
          </span>
        </div>

        {/* ── Search + Add ── */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono">
              SEARCH
            </span>
            <input
              type="text"
              placeholder="e.g. Push Pull Legs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-20 pr-4 py-3 bg-zinc-900 border border-zinc-700 text-white
                         placeholder-zinc-600 text-sm font-mono focus:outline-none focus:border-amber-500
                         focus:ring-1 focus:ring-amber-500/30 transition-colors duration-150"
            />
          </div>
          <button
            onClick={() => { setEditPlan(null); setShowForm(true); }}
            className="px-6 py-3 bg-amber-500 text-zinc-950 font-black text-sm uppercase
                       tracking-widest hover:bg-amber-400 active:bg-amber-600 transition-colors
                       duration-150 whitespace-nowrap flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Plan
          </button>
        </div>

        {/* ── Plan cards ── */}
        <div className="space-y-3">
          {filtered.map((plan) => (
            <WorkoutCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGenerate={handleGenerate}
              aiPlan={aiPlans[plan.id]}
            />
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="border border-dashed border-zinc-800 py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-700 rotate-45" />
              <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
                {search ? `No plans matching "${search}"` : "No plans yet"}
              </p>
              <p className="text-zinc-700 font-mono text-xs">
                {search ? "Try a different search" : "Hit + Add Plan to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <WorkoutFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditPlan(null); }}
        onSave={handleSave}
        existingPlan={editPlan}
      />
    </div>
  );
};

export default WorkoutPlans;