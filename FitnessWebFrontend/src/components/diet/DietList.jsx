// src/components/diet/DietList.jsx

import React from "react";
import DietCard from "./DietCard";

const SkeletonCard = () => (
  <div className="border border-zinc-800 bg-zinc-900/40 h-48 mb-3 relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]
                    bg-gradient-to-r from-transparent via-zinc-800/30 to-transparent" />
  </div>
);

const DietList = ({ diets, loading, onDelete, onEdit }) => {
  if (loading) {
    return (
      <div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!diets || diets.length === 0) {
    return (
      <div className="border border-dashed border-zinc-800 py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-700 rotate-45" />
        <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
          No diet plans yet
        </p>
        <p className="text-zinc-700 font-mono text-xs">
          Create one manually or generate with AI
        </p>
      </div>
    );
  }

  return (
    <div>
      {diets.map((diet) => (
        <DietCard
          key={diet.id}
          diet={diet}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default DietList;