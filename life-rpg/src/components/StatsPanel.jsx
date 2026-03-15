import ProgressBar from './ProgressBar'

export default function StatsPanel({ levelInfo, totalXP, skillPoints }) {
  return (
    <div className="hud-panel glow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="hud-title">Player Core</p>
          <h2 className="mt-2 text-2xl text-white">Level {levelInfo.level}</h2>
          <p className="text-sm text-slate-300">
            Total XP: <span className="text-white">{totalXP}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Skill Points
            </p>
            <p className="text-2xl text-white">{skillPoints}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Next Level
            </p>
            <p className="text-2xl text-white">{levelInfo.nextBase}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>XP Progress</span>
          <span>
            {levelInfo.current} / {levelInfo.needed}
          </span>
        </div>
        <ProgressBar value={levelInfo.progress} colorClass="bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />
      </div>
    </div>
  )
}
