// src/pages/DietPlans.jsx

import React, { useState, useEffect } from "react";
import DietList from "../components/diet/DietList";
import DietForm from "../components/diet/DietForm";
import { dietService } from "../services/dietService";

const DietPlans = () => {
  const [diets, setDiets]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [editDiet, setEditDiet]       = useState(null);
  const [toast, setToast]             = useState(null);
  const [search, setSearch]           = useState("");

  const notify = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchDiets = async () => {
    try {
      setLoading(true);
      const data = await dietService.getAllDiets();
      setDiets(Array.isArray(data) ? data : []);
    } catch {
      notify("Failed to load diet plans", "error");
      setDiets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiets(); }, []);

  const handleSave = async (data) => {
    try {
      setFormLoading(true);
      if (data.id) {
        await dietService.updateDiet(data.id, data);
        notify("Diet plan updated!", "success");
      } else {
        await dietService.createDiet(data);
        notify("Diet plan created!", "success");
      }
      setShowForm(false);
      setEditDiet(null);
      fetchDiets();
    } catch (e) {
      notify(e.message || "Save failed", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGenerate = async (profileData) => {
    try {
      setFormLoading(true);
      await dietService.generateDiet(profileData);
      notify("AI diet plan generated!", "success");
      setShowForm(false);
      fetchDiets();
    } catch (e) {
      notify(e.message || "Generation failed", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dietService.deleteDiet(id);
      notify("Diet plan deleted", "success");
      fetchDiets();
    } catch {
      notify("Failed to delete", "error");
    }
  };

  const handleEdit = (diet) => {
    setEditDiet(diet);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = diets.filter((d) =>
    d.planName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMeals = diets.reduce((s, d) => s + (d.meals?.length || 0), 0);
  const avgCals    = diets.length
    ? Math.round(diets.reduce((s, d) => s + (d.totalCalories || 0), 0) / diets.length)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ── Page title ── */}
        <div className="mb-10">
          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
            Gym Genius / Nutrition
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Diet
            <br />
            <span className="text-zinc-500">Plans</span>
          </h1>
        </div>

        {/* ── Stat cards ── */}
        {!loading && diets.length > 0 && (
          <div className="flex items-stretch gap-3 mb-10">
            <StatCard label="Total Plans"  value={diets.length} />
            <StatCard label="Avg Calories" value={avgCals}      unit="kcal" />
            <StatCard label="Meals Logged" value={totalMeals}   highlight />
          </div>
        )}

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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono uppercase tracking-widest pointer-events-none">
              Search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. High Protein..."
              className="w-full pl-24 pr-4 py-3 bg-zinc-900 border border-zinc-700 text-white
                         placeholder-zinc-600 text-sm font-mono focus:outline-none focus:border-amber-500
                         focus:ring-1 focus:ring-amber-500/30 transition-colors duration-150"
            />
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditDiet(null); }}
            className={`px-6 py-3 font-black text-sm uppercase tracking-widest transition-colors duration-150 whitespace-nowrap flex items-center gap-2
              ${showForm
                ? "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                : "bg-amber-500 text-zinc-950 hover:bg-amber-400 active:bg-amber-600"
              }`}
          >
            <span className={`text-lg leading-none transition-transform duration-300 ${showForm ? "rotate-45" : ""}`}>+</span>
            {showForm ? "Close" : "Add Diet"}
          </button>
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="mb-8 border border-zinc-700 bg-zinc-900/40">
            <DietForm
              initial={editDiet}
              onSave={handleSave}
              onGenerate={handleGenerate}
              onCancel={() => { setShowForm(false); setEditDiet(null); }}
              loading={formLoading}
            />
          </div>
        )}

        {/* ── Diet list ── */}
        <DietList
          diets={filtered}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, unit, highlight = false }) => (
  <div className={`relative border p-5 flex flex-col gap-2 flex-1 min-w-0 transition-colors duration-150
    ${highlight
      ? "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
      : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700"
    }`}
  >
    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${highlight ? "border-amber-500/60" : "border-zinc-700"}`} />
    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{label}</span>
    <span className={`text-3xl font-black leading-none ${highlight ? "text-amber-400" : "text-white"}`}>
      {value}
      {unit && <span className="text-sm text-zinc-500 font-normal ml-1.5">{unit}</span>}
    </span>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const toastStyles = {
  success: "border-emerald-500/40 text-emerald-400",
  error:   "border-red-500/40 text-red-400",
  info:    "border-amber-500/40 text-amber-400",
};

const Toast = ({ message, type = "info", onClose }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 min-w-72
    bg-zinc-900 border ${toastStyles[type]} px-4 py-3 shadow-2xl`}>
    <p className="text-zinc-200 text-sm font-mono flex-1">{message}</p>
    <button onClick={onClose} className="text-zinc-600 hover:text-white font-mono transition-colors">✕</button>
  </div>
);

export default DietPlans;