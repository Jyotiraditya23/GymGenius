import React, { useEffect, useState } from "react";
import {
  getAllWorkout,
  getWorkoutByMuscle,
  deleteWorkout,
} from "../../services/workoutProgressService";

const muscles = ["All", "Chest", "Back", "Bicep", "Tricep", "Legs", "Shoulders"];

const muscleIcons = {
  All: "⬡",
  Chest: "◈",
  Back: "◉",
  Bicep: "◎",
  Tricep: "◍",
  Legs: "◆",
  Shoulders: "◇",
};

const WorkoutList = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [workouts, setWorkouts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchAll = async () => {
    try {
      const res = await getAllWorkout();
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchByMuscle = async (muscle) => {
    try {
      const res = await getWorkoutByMuscle(muscle);
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedMuscle === "All") fetchAll();
    else fetchByMuscle(selectedMuscle);
  }, [selectedMuscle]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteWorkout(id);
    setConfirmId(null);
    setDeletingId(null);
    if (selectedMuscle === "All") fetchAll();
    else fetchByMuscle(selectedMuscle);
  };

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">
          03 / Records
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 font-mono text-xs">
          {workouts.length} entries
        </span>
      </div>

      {/* Muscle filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {muscles.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMuscle(m)}
            className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest border transition-colors duration-150
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

      {/* Table header */}
      {workouts.length > 0 && (
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 pb-2 border-b border-zinc-800 mb-1">
          <span className="col-span-4 text-zinc-600 font-mono text-xs uppercase tracking-widest">Exercise</span>
          <span className="col-span-2 text-zinc-600 font-mono text-xs uppercase tracking-widest">Weight</span>
          <span className="col-span-1 text-zinc-600 font-mono text-xs uppercase tracking-widest">Reps</span>
          <span className="col-span-1 text-zinc-600 font-mono text-xs uppercase tracking-widest">Sets</span>
          <span className="col-span-2 text-zinc-600 font-mono text-xs uppercase tracking-widest">Date</span>
          <span className="col-span-2 text-zinc-600 font-mono text-xs uppercase tracking-widest text-right">Action</span>
        </div>
      )}

      {/* Workout rows */}
      <div className="space-y-1">
        {workouts.map((w, i) => (
          <div
            key={w.id}
            className="group border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-150"
          >
            {/* Mobile layout */}
            <div className="sm:hidden p-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-500 text-xs">{muscleIcons[w.muscleGroup] || "◈"}</span>
                  <p className="font-black text-white uppercase tracking-wide text-sm">{w.exerciseName}</p>
                </div>
                <p className="text-zinc-400 font-mono text-xs mb-0.5">
                  <span className="text-amber-400">{w.weight}kg</span>
                  <span className="text-zinc-600 mx-1">×</span>
                  {w.reps} reps
                  <span className="text-zinc-600 mx-1">×</span>
                  {w.sets} sets
                </p>
                <p className="text-zinc-600 font-mono text-xs">{w.date}</p>
              </div>
              <DeleteButton
                id={w.id}
                confirmId={confirmId}
                deletingId={deletingId}
                setConfirmId={setConfirmId}
                handleDelete={handleDelete}
              />
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 items-center">
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-amber-500/60 text-xs font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-black text-white uppercase tracking-wide text-sm truncate">{w.exerciseName}</p>
              </div>
              <div className="col-span-2">
                <span className="text-amber-400 font-mono font-bold">{w.weight}</span>
                <span className="text-zinc-500 font-mono text-xs ml-1">kg</span>
              </div>
              <div className="col-span-1">
                <span className="text-white font-mono text-sm">{w.reps}</span>
              </div>
              <div className="col-span-1">
                <span className="text-white font-mono text-sm">{w.sets}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500 font-mono text-xs">{w.date}</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <DeleteButton
                  id={w.id}
                  confirmId={confirmId}
                  deletingId={deletingId}
                  setConfirmId={setConfirmId}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {workouts.length === 0 && (
        <div className="border border-dashed border-zinc-800 py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-700 rotate-45" />
          <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
            No records for {selectedMuscle}
          </p>
          <p className="text-zinc-700 font-mono text-xs">Log a session to see it here</p>
        </div>
      )}
    </div>
  );
};

/* Inline confirm-to-delete button */
const DeleteButton = ({ id, confirmId, deletingId, setConfirmId, handleDelete }) => {
  if (deletingId === id) {
    return (
      <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
        Removing…
      </span>
    );
  }

  if (confirmId === id) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleDelete(id)}
          className="text-xs font-black uppercase tracking-widest text-red-400 border border-red-500/40 px-3 py-1 hover:bg-red-500/10 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirmId(null)}
          className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmId(id)}
      className="text-zinc-600 text-xs font-mono uppercase tracking-widest hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
    >
      Delete
    </button>
  );
};

export default WorkoutList;