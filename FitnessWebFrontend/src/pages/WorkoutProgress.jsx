import React, { useEffect, useState } from "react";
import ProgressChart from "../components/workoutProgress/ProgressChart";
import WorkoutForm from "../components/workoutProgress/WorkoutForm";
import { getVolumeByMuscle } from "../services/workoutProgressService";
import WorkoutList from "../components/workoutProgress/WorkoutList";

const muscles = ["Chest", "Back", "Bicep", "Tricep", "Legs", "Shoulders"];

/* Small stat card */
const StatBadge = ({ label, value }) => (
  <div className="border border-zinc-800 bg-zinc-900/60 px-5 py-3 flex flex-col gap-1">
    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
      {label}
    </span>
    <span className="text-white font-black text-xl">{value}</span>
  </div>
);

const WorkoutProgress = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [chartData, setChartData] = useState([]);

  const fetchProgress = async (muscle) => {
    try {
      const res = await getVolumeByMuscle(muscle);
      const formatted = res.data
        .map((item) => ({
          date: item.date,
          volume: item.totalVolume,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(formatted);
    } catch (error) {
      console.error("Error fetching progress", error);
    }
  };

  useEffect(() => {
    fetchProgress(selectedMuscle);
  }, [selectedMuscle]);

  /* Derive simple stats from chart data */
  const totalVol = chartData.reduce((s, d) => s + d.volume, 0);
  const peakVol = chartData.length
    ? Math.max(...chartData.map((d) => d.volume))
    : 0;
  const sessions = chartData.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10">
        {/* ── Page title ── */}
        <div className="mb-10">
          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
            Gym Genius / Progress
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Muscle-Wise
            <br />
            <span className="text-zinc-500">Volume</span>
          </h1>
        </div>

        {/* ── Muscle selector tabs ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {muscles.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className={`px-5 py-2 text-xs font-black uppercase tracking-widest border transition-colors duration-150
                ${
                  selectedMuscle === m
                    ? "bg-amber-500 text-zinc-950 border-amber-500"
                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatBadge
            label="Total Volume"
            value={`${(totalVol / 1000).toFixed(1)} units`}
          />
          <StatBadge
            label="Peak Session"
            value={`${peakVol.toLocaleString()} units`}
          />
          <StatBadge label="Sessions" value={sessions} />
        </div>

        {/* ── Chart card ── */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 mb-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-sm uppercase tracking-widest text-zinc-300">
              {selectedMuscle} — Volume Over Time
            </h2>
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
              kg × reps × sets
            </span>
          </div>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-zinc-600 font-mono text-sm">
              No data yet — log a session below.
            </div>
          ) : (
            <ProgressChart data={chartData} />
          )}
        </div>

        {/* ── Form card ── */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 mt-6">
          <WorkoutForm
            selectedMuscle={selectedMuscle}
            refreshChart={fetchProgress}
          />
        </div>

        {/* ── Workout List ── */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 mt-6">
          <WorkoutList />
        </div>
      </main>
    </div>
  );
};

export default WorkoutProgress;
