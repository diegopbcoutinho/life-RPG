export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div>
        <p className="hud-title">Life OS</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          LIFE RPG
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Turn daily momentum into a cinematic quest line.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="stat-pill">{today}</span>
        <span className="stat-pill">Local First</span>
      </div>
    </div>
  )
}
