// src/components/fitnessProfile/StatCard.jsx

const StatCard = ({ label, value, unit, highlight = false }) => (
  <div
    className={`relative border p-5 flex flex-col gap-2 transition-all duration-200 group
      ${highlight
        ? "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
        : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700"
      }`}
  >
    {/* corner accent */}
    <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${highlight ? "border-amber-500/60" : "border-zinc-700"}`} />

    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
      {label}
    </span>
    <span className={`text-3xl font-black leading-none ${highlight ? "text-amber-400" : "text-white"}`}>
      {value}
      {unit && (
        <span className="text-sm text-zinc-500 font-normal ml-1.5">{unit}</span>
      )}
    </span>
  </div>
);

export default StatCard;