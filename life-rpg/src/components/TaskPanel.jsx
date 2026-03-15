import { useMemo, useState } from 'react'
import { DIFFICULTY_XP, getQuestCooldown } from '../utils/gameMath'

const CATEGORIES = [
  { id: 'health', label: 'Health', badge: 'bg-emerald-500/20 text-emerald-200' },
  { id: 'money', label: 'Money', badge: 'bg-amber-500/20 text-amber-200' },
  { id: 'networking', label: 'Networking', badge: 'bg-sky-500/20 text-sky-200' },
  { id: 'learning', label: 'Learning', badge: 'bg-violet-500/20 text-violet-200' },
  { id: 'discipline', label: 'Discipline', badge: 'bg-rose-500/20 text-rose-200' },
]

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

export default function TaskPanel({
  tasks,
  onAddTask,
  onCompleteTask,
  onRemoveTask,
  todayKey,
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0].id)

  const reward = useMemo(() => DIFFICULTY_XP[difficulty], [difficulty])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) return
    onAddTask({
      title: title.trim(),
      category,
      difficulty,
      xp: reward,
    })
    setTitle('')
    setDifficulty(DIFFICULTIES[0].id)
    setCategory(CATEGORIES[0].id)
  }

  return (
    <div className="hud-panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="hud-title">Quest Board</p>
          <h2 className="mt-2 text-xl text-white">Daily Missions</h2>
        </div>
        <span className="stat-pill">{tasks.filter((task) => !task.completed).length} Active</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a quest"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
        >
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none"
        >
          {DIFFICULTIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-3 text-sm uppercase tracking-[0.2em] text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/30"
        >
          Add +{reward} XP
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {tasks.length === 0 && (
          <p className="text-sm text-slate-400">No quests yet. Forge your first mission.</p>
        )}
        {tasks.map((task) => {
          const categoryMeta = CATEGORIES.find((item) => item.id === task.category)
          const cooldownDays = getQuestCooldown(task.difficulty)
          const toDate = (key) => new Date(`${key}T00:00:00`)
          const cooldownLeft = task.cooldownUntil
            ? Math.max(
                0,
                Math.ceil(
                  (toDate(task.cooldownUntil) - toDate(todayKey)) /
                    (1000 * 60 * 60 * 24),
                ),
              )
            : 0
          return (
            <div
              key={task.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div>
                <p className="text-sm text-white">{task.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className={`rounded-full px-2 py-1 ${categoryMeta?.badge || 'bg-white/10 text-white'}`}>
                    {categoryMeta?.label || task.category}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1 uppercase tracking-[0.2em]">
                    {task.difficulty}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1">+{task.xp} XP</span>
                  <span className="rounded-full border border-white/10 px-2 py-1">CD {cooldownDays}d</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!task.completed && cooldownLeft === 0 ? (
                  <button
                    type="button"
                    onClick={() => onCompleteTask(task.id)}
                    className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/30"
                  >
                    Complete
                  </button>
                ) : cooldownLeft > 0 ? (
                  <span className="rounded-full border border-amber-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
                    Cooldown {cooldownLeft}d
                  </span>
                ) : (
                  <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                    Claimed
                  </span>
                )}
                {!task.completed && (
                  <button
                    type="button"
                    onClick={() => onRemoveTask(task.id)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-white/20"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
