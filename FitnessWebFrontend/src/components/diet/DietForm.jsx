// src/components/diet/DietForm.jsx

import React, { useState } from "react";

const inputCls =
  "w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 " +
  "px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 " +
  "focus:ring-1 focus:ring-amber-500/30 transition-colors duration-150";

const labelCls = "text-zinc-500 font-mono text-xs uppercase tracking-widest";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const DietForm = ({ initial = null, onSave, onGenerate, onCancel, loading }) => {
  const isEdit = !!initial;
  const [tab, setTab] = useState(isEdit ? "manual" : "generate");

  const [manual, setManual] = useState({
    planName:      initial?.planName      || "",
    totalCalories: initial?.totalCalories || "",
    protein:       initial?.protein       || "",
    carbs:         initial?.carbs         || "",
    fats:          initial?.fats          || "",
  });

  const [gen, setGen] = useState({
    planName: "", age: "", height: "", weight: "",
    goal: "muscle_gain",
    targetCalories: "", targetProtein: "", targetCarbs: "", targetFats: "",
    note: "",
  });

  const updateManual = (e) => setManual({ ...manual, [e.target.name]: e.target.value });
  const updateGen    = (e) => setGen({ ...gen, [e.target.name]: e.target.value });

  const submitManual = () => {
    if (!manual.planName.trim()) return;
    onSave({
      ...manual,
      totalCalories: Number(manual.totalCalories),
      protein: Number(manual.protein),
      carbs:   Number(manual.carbs),
      fats:    Number(manual.fats),
      ...(initial?.id && { id: initial.id }),
    });
  };

  const submitGenerate = () => {
    onGenerate({
      planName: gen.planName,
      age: Number(gen.age), height: Number(gen.height), weight: Number(gen.weight),
      goal: gen.goal,
      targetCalories: Number(gen.targetCalories),
      targetProtein:  Number(gen.targetProtein),
      targetCarbs:    Number(gen.targetCarbs),
      targetFats:     Number(gen.targetFats),
      note: gen.note,
    });
  };

  return (
    <div className="p-6 sm:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-1">
            {isEdit ? "Edit" : "New"}
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight leading-none text-white">
            {isEdit ? "Update Plan" : "Diet Plan"}
          </h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-zinc-600 hover:text-white font-mono text-lg transition-colors leading-none px-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs — only when creating */}
      {!isEdit && (
        <div className="flex gap-0 mb-8 border border-zinc-700">
          {[
            { id: "generate", label: "✦ AI Generate" },
            { id: "manual",   label: "Manual Entry" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest transition-colors duration-150
                ${tab === id
                  ? "bg-amber-500 text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── AI Generate Form ── */}
      {tab === "generate" && !isEdit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Plan Name">
            <input className={inputCls} name="planName" placeholder="e.g. Lean Muscle 2026"
              value={gen.planName} onChange={updateGen} />
          </Field>
          <Field label="Age">
            <input className={inputCls} name="age" type="number" placeholder="22"
              value={gen.age} onChange={updateGen} />
          </Field>
          <Field label="Height (cm)">
            <input className={inputCls} name="height" type="number" placeholder="175"
              value={gen.height} onChange={updateGen} />
          </Field>
          <Field label="Weight (kg)">
            <input className={inputCls} name="weight" type="number" placeholder="70"
              value={gen.weight} onChange={updateGen} />
          </Field>
          <Field label="Goal">
            <select className={inputCls + " appearance-none cursor-pointer"} name="goal"
              value={gen.goal} onChange={updateGen}>
              <option value="muscle_gain" className="bg-zinc-900">Muscle Gain</option>
              <option value="weight_loss" className="bg-zinc-900">Weight Loss</option>
              <option value="maintenance" className="bg-zinc-900">Maintenance</option>
            </select>
          </Field>
          <Field label="Target Calories">
            <input className={inputCls} name="targetCalories" type="number" placeholder="2800"
              value={gen.targetCalories} onChange={updateGen} />
          </Field>
          <Field label="Target Protein (g)">
            <input className={inputCls} name="targetProtein" type="number" placeholder="160"
              value={gen.targetProtein} onChange={updateGen} />
          </Field>
          <Field label="Target Carbs (g)">
            <input className={inputCls} name="targetCarbs" type="number" placeholder="350"
              value={gen.targetCarbs} onChange={updateGen} />
          </Field>
          <Field label="Target Fats (g)">
            <input className={inputCls} name="targetFats" type="number" placeholder="80"
              value={gen.targetFats} onChange={updateGen} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Special Notes">
              <textarea className={inputCls + " resize-none"} name="note" rows={3}
                placeholder="e.g. Allergic to peanuts, prefer vegetarian..."
                value={gen.note} onChange={updateGen} />
            </Field>
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-zinc-800">
            {onCancel && (
              <button onClick={onCancel}
                className="flex-1 py-3 border border-zinc-700 text-zinc-400 font-mono text-sm uppercase
                           tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150">
                Cancel
              </button>
            )}
            <button onClick={submitGenerate} disabled={loading}
              className="flex-[2] py-3 bg-amber-500 text-zinc-950 font-black text-sm uppercase tracking-widest
                         hover:bg-amber-400 active:bg-amber-600 transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating…
                </>
              ) : "✦ Generate with AI"}
            </button>
          </div>
        </div>
      )}

      {/* ── Manual Form ── */}
      {(tab === "manual" || isEdit) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Plan Name">
              <input className={inputCls} name="planName" placeholder="e.g. High Protein Vegetarian"
                value={manual.planName} onChange={updateManual} />
            </Field>
          </div>
          <Field label="Total Calories">
            <input className={inputCls} name="totalCalories" type="number" placeholder="2800"
              value={manual.totalCalories} onChange={updateManual} />
          </Field>
          <Field label="Protein (g)">
            <input className={inputCls} name="protein" type="number" placeholder="160"
              value={manual.protein} onChange={updateManual} />
          </Field>
          <Field label="Carbs (g)">
            <input className={inputCls} name="carbs" type="number" placeholder="350"
              value={manual.carbs} onChange={updateManual} />
          </Field>
          <Field label="Fats (g)">
            <input className={inputCls} name="fats" type="number" placeholder="80"
              value={manual.fats} onChange={updateManual} />
          </Field>
          <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-zinc-800">
            {onCancel && (
              <button onClick={onCancel}
                className="flex-1 py-3 border border-zinc-700 text-zinc-400 font-mono text-sm uppercase
                           tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150">
                Cancel
              </button>
            )}
            <button onClick={submitManual} disabled={loading}
              className="flex-[2] py-3 bg-amber-500 text-zinc-950 font-black text-sm uppercase tracking-widest
                         hover:bg-amber-400 transition-colors duration-150 disabled:opacity-50">
              {isEdit ? "Save Changes" : "Create Plan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietForm;