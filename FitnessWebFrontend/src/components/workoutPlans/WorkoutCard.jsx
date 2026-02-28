// src/components/workoutPlans/WorkoutCard.jsx

import { useState } from "react";

const getDifficultyStyle = (difficulty = "") => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return { bar: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", width: "w-1/3" };
  if (d === "medium" || d === "intermediate") return { bar: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", width: "w-2/3" };
  if (d === "hard" || d === "advanced") return { bar: "bg-red-500", text: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", width: "w-full" };
  return { bar: "bg-zinc-500", text: "text-zinc-400", border: "border-zinc-500/30", bg: "bg-zinc-500/10", width: "w-1/2" };
};

const WorkoutCard = ({ plan, onDelete, onGenerate, onEdit, aiPlan }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generating, setGenerating] = useState(false);

  const diff = getDifficultyStyle(plan.difficulty);
  const dayCount = plan.workoutDays ? Object.keys(plan.workoutDays).length : 0;

  const handleGenerate = async () => {
    setGenerating(true);
    await onGenerate(plan.id);
    setGenerating(false);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors duration-150">
      {/* ── Card top ── */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* plan index + name */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-zinc-600 font-mono text-xs"># {String(plan.id).padStart(2, "0")}</span>
              <h3 className="text-white font-black uppercase tracking-wide text-sm truncate">
                {plan.planName}
              </h3>
            </div>
            <p className="text-zinc-600 font-mono text-xs">
              {dayCount} training {dayCount === 1 ? "day" : "days"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(plan)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-400 font-mono text-xs uppercase
                         tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150"
            >
              Edit
            </button>

            {confirmDelete ? (
              <>
                <button
                  onClick={() => onDelete(plan.id)}
                  className="px-4 py-1.5 border border-red-500/40 text-red-400 font-mono text-xs uppercase
                             tracking-widest hover:bg-red-500/10 transition-colors duration-150"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-zinc-600 font-mono text-xs hover:text-zinc-400 transition-colors"
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-1.5 border border-zinc-800 text-zinc-600 font-mono text-xs uppercase
                           tracking-widest hover:border-red-500/40 hover:text-red-400 transition-colors duration-150"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* ── Difficulty bar ── */}
        <div className="mt-5 border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Difficulty</span>
            <span className={`font-black text-xs uppercase tracking-widest px-2.5 py-1 border ${diff.text} ${diff.border} ${diff.bg}`}>
              {plan.difficulty || "—"}
            </span>
          </div>
          <div className="w-full h-1 bg-zinc-800">
            <div className={`h-full ${diff.bar} ${diff.width} transition-all duration-700`} />
          </div>
        </div>

        {/* ── Weekly split pills ── */}
        {dayCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(plan.workoutDays).map(([day, muscle]) => (
              <span
                key={day}
                className="text-xs px-3 py-1.5 border border-zinc-800 bg-zinc-950/40 text-zinc-400 font-mono"
              >
                <span className="text-amber-500 font-black">{day.slice(0, 3).toUpperCase()}</span>
                <span className="text-zinc-600 mx-1">·</span>
                {muscle}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-3 border-t border-zinc-800 text-zinc-600 font-mono text-xs uppercase
                   tracking-widest hover:text-zinc-400 hover:bg-zinc-900/60 flex items-center justify-center
                   gap-2 transition-colors duration-150"
      >
        <span className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>▾</span>
        {expanded ? "Collapse" : "AI Generate & Details"}
      </button>

      {/* ── Expanded: AI section ── */}
      {expanded && (
        <div className="border-t border-zinc-800 p-5 sm:p-6">
          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-zinc-950 font-black text-xs
                       uppercase tracking-widest hover:bg-amber-400 active:bg-amber-600 transition-colors
                       duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating…
              </>
            ) : (
              <>✦ Generate AI Plan</>
            )}
          </button>

          {/* AI result */}
          {aiPlan && (
            <div className="mt-5 border border-zinc-700 bg-zinc-950/60">
              {/* AI plan header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                <span className="bg-amber-500 text-zinc-950 font-black text-xs px-2 py-0.5 uppercase tracking-widest">
                  AI
                </span>
                <h4 className="text-white font-black uppercase text-sm tracking-wide">
                  {aiPlan.planName}
                </h4>
              </div>

              <div className="p-5 space-y-6">
                {aiPlan.days?.map((dayObj, i) => (
                  <div
                    key={i}
                    className={`pb-6 ${i !== aiPlan.days.length - 1 ? "border-b border-zinc-800" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-amber-500 font-mono text-xs uppercase tracking-widest">
                        {dayObj.day}
                      </span>
                      <div className="flex-1 h-px bg-zinc-800" />
                      <span className="text-white font-black uppercase text-xs tracking-wide">
                        {dayObj.muscleGroup}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayObj.exercises?.map((ex, j) => (
                        <div key={j}>
                          <div className="grid grid-cols-12 gap-3 px-4 py-3 border border-zinc-800 bg-zinc-900/40
                                          hover:border-zinc-700 transition-colors duration-150 items-center">
                            <span className="col-span-1 text-zinc-600 font-mono text-xs">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span className="col-span-8 text-sm text-zinc-200 font-medium">
                              {ex.name}
                            </span>
                            <span className="col-span-3 text-right text-sm font-black text-amber-400 font-mono">
                              {ex.sets} × {ex.reps}
                            </span>
                          </div>
                          {ex.notes && (
                            <p className="text-zinc-600 font-mono text-xs mt-1 px-4">{ex.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;