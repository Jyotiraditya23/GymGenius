// src/components/fitnessProfile/ProfileForm.jsx

const WORKOUT_OPTIONS = ["1-2 days/week", "3-4 days/week", "5-6 days/week", "Everyday"];
const GOAL_OPTIONS = ["Weight Loss", "Muscle Gain", "Maintenance", "General Fitness", "Endurance"];
const DIET_OPTIONS = ["High Protein", "Vegetarian", "Vegan", "Keto", "Paleo", "Omnivore", "Pescatarian"];

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 text-sm font-mono " +
  "focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors duration-150 w-full";

const ProfileForm = ({ isEditing, formData, onChange, onSubmit, onCancel, error }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase mb-2">
            {isEditing ? "02 / Edit" : "01 / Setup"}
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
            {isEditing ? "Update" : "Build Your"}
            <br />
            <span className="text-zinc-500">
              {isEditing ? "Profile" : "Fitness Profile"}
            </span>
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400 font-mono text-xs uppercase tracking-widest">
            ⚠ {error}
          </div>
        )}

        {/* Form card */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Numeric fields */}
            <Field label="Age">
              <input className={inputClass} type="number" name="age"
                placeholder="e.g. 25" min={10} max={120}
                value={formData.age} onChange={onChange} required />
            </Field>

            <Field label="Height (cm)">
              <input className={inputClass} type="number" name="height"
                placeholder="e.g. 175" step="0.1"
                value={formData.height} onChange={onChange} required />
            </Field>

            <Field label="Weight (kg)">
              <input className={inputClass} type="number" name="weight"
                placeholder="e.g. 70.5" step="0.1"
                value={formData.weight} onChange={onChange} required />
            </Field>

            <Field label="Monthly Budget (₹)">
              <input className={inputClass} type="number" name="monthlyBudget"
                placeholder="e.g. 5000"
                value={formData.monthlyBudget} onChange={onChange} required />
            </Field>

            {/* Select fields */}
            {[
              { label: "Primary Goal", name: "goal", options: GOAL_OPTIONS },
              { label: "Diet Preference", name: "dietPreference", options: DIET_OPTIONS },
              { label: "Workout Frequency", name: "workoutDays", options: WORKOUT_OPTIONS },
            ].map(({ label, name, options }) => (
              <Field key={name} label={label}>
                <select
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  className={inputClass + " appearance-none cursor-pointer"}
                >
                  {options.map((o) => (
                    <option key={o} value={o} className="bg-zinc-900">{o}</option>
                  ))}
                </select>
              </Field>
            ))}

            {/* Actions */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                className="flex-1 py-3 bg-amber-500 text-zinc-950 font-black text-sm uppercase
                           tracking-widest hover:bg-amber-400 active:bg-amber-600 transition-colors duration-150"
              >
                {isEditing ? "Save Changes" : "Create Profile"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 border border-zinc-700 text-zinc-400 font-mono text-sm uppercase
                           tracking-widest hover:border-zinc-500 hover:text-white transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;