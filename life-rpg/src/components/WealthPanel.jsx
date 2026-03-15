import ProgressBar from './ProgressBar'

export default function WealthPanel({ income, onIncomeChange, wealthInfo }) {
  return (
    <div className="hud-panel gold-card border-amber-400/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="hud-title">Wealth Engine</p>
          <h2 className="mt-2 text-xl text-white">Wealth Level {wealthInfo.level}</h2>
          <p className="text-sm text-slate-300">
            Current tier starts at {wealthInfo.currentBase}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Monthly Income</p>
          <input
            type="number"
            min="0"
            value={income}
            onChange={(event) => onIncomeChange(event.target.value)}
            className="mt-2 w-40 rounded-lg border border-amber-400/40 bg-transparent px-3 py-2 text-sm text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-amber-200/80">
          <span>Wealth Progress</span>
          <span>
            {wealthInfo.currentBase} / {wealthInfo.nextBase}
          </span>
        </div>
        <ProgressBar value={wealthInfo.progress} colorClass="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-200" />
      </div>
    </div>
  )
}
