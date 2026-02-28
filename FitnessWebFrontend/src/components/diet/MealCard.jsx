// src/components/diet/MealCard.jsx

import React, { useState } from "react";

const mealTypeConfig = {
  VEG: {
    accent: "border-l-emerald-500",
    badge:  "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    dot:    "bg-emerald-500",
    label:  "Veg",
  },
  NON_VEG: {
    accent: "border-l-red-500",
    badge:  "border border-red-500/30 bg-red-500/10 text-red-400",
    dot:    "bg-red-500",
    label:  "Non-Veg",
  },
  VEGAN: {
    accent: "border-l-amber-500",
    badge:  "border border-amber-500/30 bg-amber-500/10 text-amber-400",
    dot:    "bg-amber-500",
    label:  "Vegan",
  },
};

const MealCard = ({ meal, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const config = mealTypeConfig[meal.mealType] || mealTypeConfig.VEG;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`border border-zinc-800 border-l-4 ${config.accent}
        bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700
        transition-colors duration-150 cursor-pointer`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
          <div className="min-w-0">
            <p className="text-white font-black uppercase text-xs tracking-wide truncate">
              {meal.mealName}
            </p>
            <span className={`font-mono text-xs px-2 py-0.5 mt-0.5 inline-block ${config.badge}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Right: macros */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {[
            { label: "kcal", val: meal.calories },
            { label: "P",    val: `${meal.protein}g` },
            { label: "C",    val: `${meal.carbs}g` },
            { label: "F",    val: `${meal.fats}g` },
          ].map(({ label, val }) => (
            <div key={label} className="text-center hidden sm:block">
              <p className="text-white font-black font-mono text-xs leading-none">{val}</p>
              <p className="text-zinc-600 font-mono text-xs mt-0.5 uppercase tracking-widest">{label}</p>
            </div>
          ))}

          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(meal.id); }}
              className="text-zinc-600 hover:text-red-400 font-mono text-xs transition-colors duration-150 px-1"
            >
              ✕
            </button>
          )}

          <span className={`text-zinc-600 text-xs transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
            ▾
          </span>
        </div>
      </div>

      {/* Expanded recipe */}
      {expanded && (
        <div className="px-4 pb-3 pt-0 border-t border-zinc-800">
          <p className="text-zinc-400 font-mono text-xs leading-relaxed pt-3">
            {meal.recipe}
          </p>
        </div>
      )}
    </div>
  );
};

export default MealCard;