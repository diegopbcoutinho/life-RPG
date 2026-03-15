export default function CharacterPanel({ avatar, onAvatarChange, title, archetype, streak, badges }) {
  return (
    <div className="hud-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="hud-title">Identity</p>
          <h2 className="mt-2 text-xl text-white">{title}</h2>
          <p className="text-sm text-slate-300">{archetype}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
          Streak {streak} Days
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-slate-500">
              Upload
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            title="Upload avatar"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
