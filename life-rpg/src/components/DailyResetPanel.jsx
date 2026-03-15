export default function DailyResetPanel({ todayKey, lastReset, onReset }) {
  return (
    <div className="hud-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="hud-title">Daily Reset</p>
          <h2 className="mt-2 text-xl text-white">Quest Cycle</h2>
          <p className="text-sm text-slate-300">Today: {todayKey}</p>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.2em] text-slate-400">
          Last reset: {lastReset || 'Never'}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/20"
      >
        Reset Daily Quests
      </button>
    </div>
  )
}
