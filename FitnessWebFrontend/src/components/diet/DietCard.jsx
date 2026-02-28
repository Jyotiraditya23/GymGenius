// src/components/diet/DietCard.jsx

import React, { useState } from "react";
import MealCard from "./MealCard";

const MacroRow = ({ label, value, max, color }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{label}</span>
        <span className="text-white font-black font-mono text-xs">{value}g</span>
      </div>
      <div className="w-full h-1 bg-zinc-800">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const DietCard = ({ diet, onDelete, onEdit }) => {
  const [showMeals, setShowMeals] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors duration-150 mb-3">

      {/* ── Card header ── */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-zinc-600 font-mono text-xs"># {String(diet.id).padStart(2, "0")}</span>
              <h3 className="text-white font-black uppercase tracking-wide text-sm truncate">
                {diet.planName}
              </h3>
            </div>
            <p className="text-zinc-600 font-mono text-xs">
              {diet.meals?.length || 0} {diet.meals?.length === 1 ? "meal" : "meals"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(diet)}
                className="px-4 py-1.5 border border-zinc-700 text-zinc-400 font-mono text-xs uppercase
                           tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150"
              >
                Edit
              </button>
            )}
            {onDelete && (
              confirmDelete ? (
                <>
                  <button onClick={() => onDelete(diet.id)}
                    className="px-4 py-1.5 border border-red-500/40 text-red-400 font-mono text-xs uppercase
                               tracking-widest hover:bg-red-500/10 transition-colors duration-150">
                    Confirm
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-zinc-600 font-mono text-xs hover:text-zinc-400 transition-colors">
                    ✕
                  </button>
                </>
              ) : (
                <button onClick={() => setConfirmDelete(true)}
                  className="px-4 py-1.5 border border-zinc-800 text-zinc-600 font-mono text-xs uppercase
                             tracking-widest hover:border-red-500/40 hover:text-red-400 transition-colors duration-150">
                  Delete
                </button>
              )
            )}
          </div>
        </div>

        {/* ── Calorie block ── */}
        <div className="border border-zinc-800 bg-zinc-950/60 px-5 py-4 mb-5 flex items-center justify-between">
          <div>
            <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest block mb-1">
              Total Calories
            </span>
            <span className="text-3xl font-black text-white leading-none">
              {diet.totalCalories}
              <span className="text-sm text-zinc-500 font-normal ml-1.5">kcal</span>
            </span>
          </div>
          {/* Macro badges */}
          <div className="flex flex-col gap-1.5 items-end">
            <span className="font-mono text-xs px-2.5 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              P: {diet.protein}g
            </span>
            <span className="font-mono text-xs px-2.5 py-1 border border-amber-500/30 bg-amber-500/10 text-amber-400">
              C: {diet.carbs}g
            </span>
            <span className="font-mono text-xs px-2.5 py-1 border border-red-500/30 bg-red-500/10 text-red-400">
              F: {diet.fats}g
            </span>
          </div>
        </div>

        {/* ── Macro bars ── */}
        <div className="space-y-3">
          <MacroRow label="Protein"       value={diet.protein} max={200} color="bg-emerald-500" />
          <MacroRow label="Carbohydrates" value={diet.carbs}   max={500} color="bg-amber-500" />
          <MacroRow label="Fats"          value={diet.fats}    max={150} color="bg-red-500" />
        </div>
      </div>

      {/* ── Toggle meals ── */}
      <button
        onClick={() => setShowMeals(!showMeals)}
        className="w-full px-6 py-3 border-t border-zinc-800 text-zinc-600 font-mono text-xs uppercase
                   tracking-widest hover:text-zinc-400 hover:bg-zinc-900/60 flex items-center justify-center
                   gap-2 transition-colors duration-150"
      >
        <span className={`transition-transform duration-300 ${showMeals ? "rotate-180" : ""}`}>▾</span>
        {showMeals ? "Hide Meals" : `View ${diet.meals?.length || 0} Meals`}
      </button>

      {/* ── Meals ── */}
      {showMeals && diet.meals && (
        <div className="border-t border-zinc-800 p-5 sm:p-6 space-y-2">
          {diet.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DietCard;