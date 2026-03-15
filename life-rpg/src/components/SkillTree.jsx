export default function SkillTree({ skills, unlockedSkills, skillPoints, onUnlock }) {
  const isUnlocked = (id) => unlockedSkills.includes(id)
  const isAvailable = (skill) =>
    !isUnlocked(skill.id) && skill.requires.every((req) => unlockedSkills.includes(req))

  const lines = skills.flatMap((skill) =>
    skill.requires.map((parentId) => {
      const parent = skills.find((node) => node.id === parentId)
      if (!parent) return null
      return {
        id: `${parentId}-${skill.id}`,
        from: parent,
        to: skill,
      }
    })
  )

  return (
    <div className="hud-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="hud-title">Skill Tree</p>
          <h2 className="mt-2 text-xl text-white">Upgrade Your Life</h2>
        </div>
        <span className="stat-pill">{skillPoints} Points Ready</span>
      </div>

      <div className="hud-scroll relative mt-8 h-[440px] overflow-auto rounded-2xl border border-white/5 bg-slate-950/50">
        <div className="relative h-[520px] min-w-[720px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {lines.filter(Boolean).map((line) => {
              const unlocked = isUnlocked(line.from.id) && isUnlocked(line.to.id)
              const available = isUnlocked(line.from.id) && !isUnlocked(line.to.id)
              return (
                <line
                  key={line.id}
                  x1={line.from.x}
                  y1={line.from.y}
                  x2={line.to.x}
                  y2={line.to.y}
                  stroke={unlocked ? '#34d399' : available ? '#7dd3fc' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1.5"
                />
              )
            })}
          </svg>

          {skills.map((skill) => {
            const unlocked = isUnlocked(skill.id)
            const available = isAvailable(skill)
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => available && skillPoints > 0 && onUnlock(skill.id)}
                className={`skill-node ${
                  unlocked ? 'unlocked' : available ? 'available' : 'locked'
                }`}
                style={{ left: `${skill.x}%`, top: `${skill.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                title={skill.name}
              >
                {skill.branch.slice(0, 2)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
        <p>Click an available node to spend 1 point.</p>
        <p>Unlock paths to open deeper nodes.</p>
      </div>
    </div>
  )
}
