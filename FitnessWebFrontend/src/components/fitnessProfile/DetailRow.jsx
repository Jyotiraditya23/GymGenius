// src/components/fitnessProfile/DetailRow.jsx

const DetailRow = ({ label, value, accent }) => (
  <div className="flex flex-col gap-1 py-4 border-b border-zinc-800 last:border-none">
    <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
      {label}
    </span>
    <span className={`text-sm font-bold uppercase tracking-wide ${accent || "text-white"}`}>
      {value}
    </span>
  </div>
);

export default DetailRow;