export default function LevelUpModal({ open, level, gainedPoints, onClose }) {
  if (!open) return null

  return (
    <div className="level-modal">
      <div className="level-card animate-levelUp">
        <p className="hud-title text-sky-200">Ascension Triggered</p>
        <h2 className="mt-3 text-3xl text-white text-glow">Level Up</h2>
        <p className="mt-2 text-sm text-slate-300">You reached level {level}.</p>
        <div className="mt-6 rounded-2xl border border-sky-400/40 bg-sky-500/10 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Skill Points Gained</p>
          <p className="mt-2 text-3xl text-white">+{gainedPoints}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-3 text-sm uppercase tracking-[0.2em] text-sky-100 transition hover:border-sky-400 hover:bg-sky-500/30"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
