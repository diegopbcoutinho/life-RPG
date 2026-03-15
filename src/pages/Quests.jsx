import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Check, Trash2, X, Zap, ScrollText, Crown, Calendar, CalendarDays,
  Heart, DollarSign, Users, BookOpen, Shield, ChevronDown, ChevronUp,
  Sparkles, Settings, RotateCcw, Target, Trophy, MessageSquare, Star,
  Flame, TrendingUp
} from 'lucide-react';
import { useGame } from '../store/gameStore';
import { CATEGORY_COLORS, DIFFICULTY_XP } from '../data/skillTreeData';
import { getDailySuggestions, getCurrentWeek } from '../store/gameStore';

const CATEGORIES = ['health', 'money', 'networking', 'discipline', 'learning'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const categoryIcons = {
  health: Heart,
  money: DollarSign,
  networking: Users,
  discipline: Shield,
  learning: BookOpen,
};

const difficultyColors = {
  easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  hard: 'text-red-400 bg-red-500/10 border-red-500/30',
};

// ── Mini form for adding quests ──
function QuestForm({ onSubmit, onCancel, defaultDifficulty = 'medium', showRecurring = false, onAddRecurring }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('discipline');
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isRecurring && onAddRecurring) {
      onAddRecurring({ title: title.trim(), category, difficulty });
    } else {
      onSubmit({ title: title.trim(), category, difficulty });
    }
    setTitle('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card-glass rounded-xl p-4 space-y-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">New Quest</h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-300">
          <X size={16} />
        </button>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quest title..."
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 transition"
        autoFocus
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-slate-500 mb-1.5 block">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => {
              const Icon = categoryIcons[cat];
              const colors = CATEGORY_COLORS[cat];
              const selected = category === cat;
              return (
                <button
                  key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize transition border
                    ${selected ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
                >
                  <Icon size={12} /> {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Difficulty</label>
          <div className="flex gap-1.5">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff} type="button" onClick={() => setDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition border
                  ${difficulty === diff ? difficultyColors[diff] + ' border' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
              >
                {diff} (+{DIFFICULTY_XP[diff]} XP)
              </button>
            ))}
          </div>
        </div>
      </div>

      {showRecurring && (
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
          <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)}
            className="rounded border-white/20 bg-white/5 text-accent-blue focus:ring-accent-blue/50" />
          <RotateCcw size={12} /> Make this a recurring quest (repeats every {defaultDifficulty === 'easy' ? 'day' : 'week'})
        </label>
      )}

      <div className="flex justify-end">
        <motion.button type="submit"
          className="px-5 py-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg text-white text-sm font-medium hover:brightness-110 transition"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          {isRecurring ? 'Create Recurring' : 'Create Quest'}
        </motion.button>
      </div>
    </motion.form>
  );
}

// ── Epic Quest Form ──
function EpicQuestForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('discipline');
  const [milestones, setMilestones] = useState(['']);
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const validMilestones = milestones.filter(m => m.trim()).map(m => ({ text: m.trim(), completed: false }));
    onSubmit({ title: title.trim(), category, difficulty: 'hard', milestones: validMilestones, deadline });
    setTitle('');
    setMilestones(['']);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card-glass rounded-xl p-4 space-y-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Crown size={14} className="text-amber-400" /> New Epic Quest
        </h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
      </div>

      <input type="text" value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Epic quest title (e.g. Burn 5kg by Q2)..."
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition"
        autoFocus />

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-slate-500 mb-1.5 block">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => {
              const Icon = categoryIcons[cat];
              const colors = CATEGORY_COLORS[cat];
              return (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize transition border
                    ${category === cat ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
                >
                  <Icon size={12} /> {cat}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">Deadline</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50" />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1.5 block">Milestones (optional)</label>
        {milestones.map((m, i) => (
          <div key={i} className="flex gap-2 mb-1.5">
            <input type="text" value={m} onChange={e => {
              const updated = [...milestones];
              updated[i] = e.target.value;
              setMilestones(updated);
            }}
              placeholder={`Milestone ${i + 1}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/30" />
            {milestones.length > 1 && (
              <button type="button" onClick={() => setMilestones(milestones.filter((_, j) => j !== i))}
                className="text-slate-600 hover:text-red-400"><X size={14} /></button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setMilestones([...milestones, ''])}
          className="text-xs text-accent-blue hover:text-accent-blue/80 flex items-center gap-1 mt-1">
          <Plus size={12} /> Add milestone
        </button>
      </div>

      <div className="flex justify-end">
        <motion.button type="submit"
          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white text-sm font-medium hover:brightness-110 transition"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Create Epic Quest (+300 XP)
        </motion.button>
      </div>
    </motion.form>
  );
}

// ── Quest Item Component ──
function QuestItem({ quest, onComplete, onDelete, showDelete = true, isEpic = false }) {
  const colors = CATEGORY_COLORS[quest.category];
  const Icon = categoryIcons[quest.category];
  const xp = isEpic ? 300 : (DIFFICULTY_XP[quest.difficulty] || 25);
  const completed = quest.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`card-glass rounded-xl p-3.5 flex items-center gap-3 group hover:bg-bg-card-hover transition ${completed ? 'opacity-50' : ''}`}
    >
      <motion.button
        onClick={() => !completed && onComplete(quest.id)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 ${
          completed
            ? 'bg-accent-green/20 text-accent-green'
            : 'bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20'
        }`}
        whileHover={!completed ? { scale: 1.1 } : {}}
        whileTap={!completed ? { scale: 0.9 } : {}}
        disabled={completed}
      >
        <Check size={14} />
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? 'text-slate-500 line-through' : 'text-white'}`}>{quest.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`flex items-center gap-1 text-xs ${colors?.text}`}>
            <Icon size={10} /> {quest.category}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColors[quest.difficulty]}`}>
            {quest.difficulty}
          </span>
          {quest.templateId && <RotateCcw size={10} className="text-slate-600" title="Recurring" />}
          {quest.suggested && <Sparkles size={10} className="text-amber-500" title="Suggested" />}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Zap size={12} className="text-accent-blue" />
        <span className="text-xs font-mono text-accent-blue font-medium">+{xp}</span>
      </div>

      {showDelete && !completed && (
        <button onClick={() => onDelete(quest.id)}
          className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0">
          <Trash2 size={12} />
        </button>
      )}
    </motion.div>
  );
}

// ── Epic Quest Card ──
function EpicQuestCard({ quest, dispatch }) {
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[quest.category];
  const Icon = categoryIcons[quest.category];
  const daysLeft = quest.deadline ? Math.ceil((new Date(quest.deadline) - new Date()) / 86400000) : null;

  return (
    <motion.div layout className="card-glass rounded-xl p-4 space-y-3 border border-amber-500/10 hover:border-amber-500/20 transition">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
          <Crown size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{quest.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1 text-xs ${colors?.text}`}>
              <Icon size={10} /> {quest.category}
            </span>
            {daysLeft !== null && (
              <span className={`text-xs font-mono ${daysLeft <= 7 ? 'text-red-400' : daysLeft <= 30 ? 'text-amber-400' : 'text-slate-500'}`}>
                {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)}d overdue`}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-amber-400 font-bold">{quest.progress}%</span>
          <button onClick={() => setExpanded(!expanded)} className="text-slate-500 hover:text-slate-300">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${quest.progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-2 border-t border-white/5"
          >
            {/* Milestones */}
            {quest.milestones && quest.milestones.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium">Milestones</p>
                {quest.milestones.map((m, i) => (
                  <button key={i}
                    onClick={() => dispatch({ type: 'TOGGLE_EPIC_MILESTONE', payload: { questId: quest.id, milestoneIndex: i } })}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-xs transition ${
                      m.completed ? 'bg-accent-green/5 text-slate-500 line-through' : 'bg-white/[0.02] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      m.completed ? 'bg-accent-green/20 text-accent-green' : 'border border-white/20'
                    }`}>
                      {m.completed && <Check size={10} />}
                    </div>
                    {m.text}
                  </button>
                ))}
              </div>
            )}

            {/* Manual progress slider */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Adjust Progress</label>
              <input type="range" min="0" max="100" value={quest.progress}
                onChange={e => dispatch({ type: 'UPDATE_EPIC_PROGRESS', payload: { id: quest.id, progress: Number(e.target.value) } })}
                className="w-full accent-amber-500" />
            </div>

            <div className="flex gap-2">
              {quest.progress >= 100 && (
                <motion.button
                  onClick={() => dispatch({ type: 'COMPLETE_EPIC_QUEST', payload: quest.id })}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-green to-emerald-600 rounded-lg text-white text-xs font-medium hover:brightness-110 transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <Trophy size={14} /> Complete Epic Quest (+300 XP)
                </motion.button>
              )}
              <button
                onClick={() => dispatch({ type: 'DELETE_EPIC_QUEST', payload: quest.id })}
                className="px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Daily Suggestions Panel ──
function DailySuggestions({ dispatch, acceptedSuggestions, dismissedSuggestions }) {
  const suggestions = getDailySuggestions();
  const available = suggestions.filter(s =>
    !acceptedSuggestions.includes(s.title) && !dismissedSuggestions.includes(s.title)
  );

  if (available.length === 0) return null;

  return (
    <div className="card-glass rounded-xl p-4 border border-accent-purple/10">
      <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-accent-purple" /> Today's Suggested Quests
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {available.slice(0, 6).map((s, i) => {
          const colors = CATEGORY_COLORS[s.category];
          const Icon = categoryIcons[s.category];
          return (
            <motion.div key={s.title + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-accent-purple/20 transition group"
            >
              <Icon size={12} className={colors?.text} />
              <span className="text-xs text-slate-300 flex-1 truncate">{s.title}</span>
              <button onClick={() => dispatch({ type: 'ACCEPT_SUGGESTION', payload: s })}
                className="text-accent-green hover:text-accent-green/80 opacity-0 group-hover:opacity-100 transition" title="Accept">
                <Plus size={14} />
              </button>
              <button onClick={() => dispatch({ type: 'DISMISS_SUGGESTION', payload: s.title })}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition" title="Dismiss">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Weekly Check-in Panel ──
function WeeklyCheckin({ dispatch, weeklyCheckin }) {
  const currentWeek = getCurrentWeek();
  const alreadyDone = weeklyCheckin?.week === currentWeek;
  const [reflection, setReflection] = useState('');
  const [rating, setRating] = useState(3);
  const [showForm, setShowForm] = useState(false);

  if (alreadyDone) {
    return (
      <div className="card-glass rounded-xl p-4 border border-accent-green/10">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
          <MessageSquare size={14} className="text-accent-green" /> Weekly Check-in Complete
        </h4>
        <p className="text-xs text-slate-500">"{weeklyCheckin.reflection}"</p>
        <div className="flex gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={12} className={s <= weeklyCheckin.rating ? 'text-accent-gold fill-accent-gold' : 'text-slate-700'} />
          ))}
        </div>
        <p className="text-xs text-accent-green mt-1">+50 XP earned</p>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-xl p-4 border border-accent-blue/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <MessageSquare size={14} className="text-accent-blue" /> Weekly Check-in
        </h4>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="text-xs text-accent-blue hover:text-accent-blue/80 transition">
            Check in now (+50 XP)
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">How was your week?</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star size={20} className={s <= rating ? 'text-accent-gold fill-accent-gold' : 'text-slate-700 hover:text-slate-500'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)}
              placeholder="Reflect on your week... What went well? What to improve?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 transition resize-none h-20" />
            <button onClick={() => {
              dispatch({ type: 'SAVE_WEEKLY_CHECKIN', payload: { reflection, rating } });
              setShowForm(false);
            }}
              className="px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg text-white text-xs font-medium hover:brightness-110 transition">
              Submit Check-in (+50 XP)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Recurring Quests Manager ──
function RecurringManager({ customList, deleteAction, dispatch, type }) {
  const [show, setShow] = useState(false);
  if (customList.length === 0 && !show) return null;

  return (
    <div className="card-glass rounded-xl p-4 border border-white/5">
      <button onClick={() => setShow(!show)} className="w-full flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Settings size={12} /> Recurring {type === 'daily' ? 'Dailies' : 'Weeklies'} ({customList.length})
        </h4>
        {show ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 pt-3">
            {customList.map(q => {
              const colors = CATEGORY_COLORS[q.category];
              return (
                <div key={q.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                  <RotateCcw size={10} className="text-slate-600 shrink-0" />
                  <span className="text-xs text-slate-300 flex-1 truncate">{q.title}</span>
                  <span className={`text-[10px] ${colors?.text}`}>{q.category}</span>
                  <button onClick={() => dispatch({ type: deleteAction, payload: q.id })}
                    className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── MAIN QUESTS PAGE ──
// ══════════════════════════════════════════════
export default function Quests() {
  const {
    quests, completedQuests, epicQuests,
    activeDailies, activeWeeklies,
    customDailies, customWeeklies,
    acceptedSuggestions, dismissedSuggestions,
    weeklyCheckin,
    dispatch
  } = useGame();

  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);

  // Overview stats
  const todayDone = activeDailies.filter(q => q.completed).length;
  const todayTotal = activeDailies.length;
  const weekDone = activeWeeklies.filter(q => q.completed).length;
  const weekTotal = activeWeeklies.length;
  const epicCount = epicQuests.length;
  const epicAvgProgress = epicQuests.length > 0
    ? Math.round(epicQuests.reduce((sum, q) => sum + q.progress, 0) / epicQuests.length)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'daily', label: 'Daily', icon: Calendar, badge: `${todayDone}/${todayTotal}` },
    { id: 'weekly', label: 'Weekly', icon: CalendarDays, badge: `${weekDone}/${weekTotal}` },
    { id: 'epic', label: 'Epic', icon: Crown, badge: epicCount > 0 ? String(epicCount) : null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <ScrollText size={28} className="text-accent-blue" /> Quest Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your daily grind, weekly goals, and epic adventures.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit flex-wrap">
        {tabs.map(t => {
          const TabIcon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition
                ${tab === t.id ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-400 hover:text-slate-200'}`}>
              <TabIcon size={14} />
              {t.label}
              {t.badge && <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded">{t.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* ══ OVERVIEW TAB ══ */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div className="card-glass rounded-xl p-4 cursor-pointer hover:bg-bg-card-hover transition"
              onClick={() => setTab('daily')} whileHover={{ y: -2 }}>
              <Calendar size={18} className="text-accent-blue mb-2" />
              <p className="text-2xl font-bold text-white font-mono">{todayDone}/{todayTotal}</p>
              <p className="text-xs text-slate-500 mt-1">Daily Quests</p>
              {todayTotal > 0 && (
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-accent-blue transition-all" style={{ width: `${(todayDone / todayTotal) * 100}%` }} />
                </div>
              )}
            </motion.div>

            <motion.div className="card-glass rounded-xl p-4 cursor-pointer hover:bg-bg-card-hover transition"
              onClick={() => setTab('weekly')} whileHover={{ y: -2 }}>
              <CalendarDays size={18} className="text-accent-purple mb-2" />
              <p className="text-2xl font-bold text-white font-mono">{weekDone}/{weekTotal}</p>
              <p className="text-xs text-slate-500 mt-1">Weekly Quests</p>
              {weekTotal > 0 && (
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-accent-purple transition-all" style={{ width: `${(weekDone / weekTotal) * 100}%` }} />
                </div>
              )}
            </motion.div>

            <motion.div className="card-glass rounded-xl p-4 cursor-pointer hover:bg-bg-card-hover transition"
              onClick={() => setTab('epic')} whileHover={{ y: -2 }}>
              <Crown size={18} className="text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white font-mono">{epicCount}</p>
              <p className="text-xs text-slate-500 mt-1">Epic Quests</p>
              {epicCount > 0 && (
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${epicAvgProgress}%` }} />
                </div>
              )}
            </motion.div>

            <motion.div className="card-glass rounded-xl p-4" whileHover={{ y: -2 }}>
              <TrendingUp size={18} className="text-accent-green mb-2" />
              <p className="text-2xl font-bold text-white font-mono">{completedQuests.length}</p>
              <p className="text-xs text-slate-500 mt-1">All-time Completed</p>
            </motion.div>
          </div>

          {/* Daily Suggestions */}
          <DailySuggestions dispatch={dispatch} acceptedSuggestions={acceptedSuggestions || []} dismissedSuggestions={dismissedSuggestions || []} />

          {/* Weekly Check-in */}
          <WeeklyCheckin dispatch={dispatch} weeklyCheckin={weeklyCheckin} />

          {/* Legacy quests (if any exist from before) */}
          {quests.length > 0 && (
            <div className="card-glass rounded-xl p-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Target size={14} className="text-accent-blue" /> Unclassified Quests
              </h4>
              <p className="text-xs text-slate-500 mb-2">These are quests from before the new system. Complete or delete them.</p>
              <div className="space-y-2">
                {quests.map(q => (
                  <QuestItem key={q.id} quest={q}
                    onComplete={id => dispatch({ type: 'COMPLETE_QUEST', payload: id })}
                    onDelete={id => dispatch({ type: 'DELETE_QUEST', payload: id })} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ DAILY TAB ══ */}
      {tab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Calendar size={18} className="text-accent-blue" /> Today's Quests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Resets every day at midnight. {todayDone}/{todayTotal} completed.</p>
            </div>
            <motion.button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg text-white text-xs font-medium hover:brightness-110 transition"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus size={14} /> Add Daily
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <QuestForm
                onSubmit={p => { dispatch({ type: 'ADD_ONEOFF_DAILY', payload: p }); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
                defaultDifficulty="easy"
                showRecurring
                onAddRecurring={p => { dispatch({ type: 'ADD_CUSTOM_DAILY', payload: p }); setShowForm(false); }}
              />
            )}
          </AnimatePresence>

          {/* Daily Suggestions */}
          <DailySuggestions dispatch={dispatch} acceptedSuggestions={acceptedSuggestions || []} dismissedSuggestions={dismissedSuggestions || []} />

          {/* Active dailies */}
          <div className="space-y-2">
            <AnimatePresence>
              {activeDailies.length === 0 ? (
                <motion.p className="text-center text-slate-600 py-8 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No daily quests yet. Add one or accept a suggestion above!
                </motion.p>
              ) : (
                activeDailies.map(q => (
                  <QuestItem key={q.id} quest={q}
                    onComplete={id => dispatch({ type: 'COMPLETE_DAILY', payload: id })}
                    onDelete={id => {
                      if (q.templateId) dispatch({ type: 'DELETE_CUSTOM_DAILY', payload: q.templateId });
                      // For one-offs, just mark completed to avoid confusion (they'll reset tomorrow anyway)
                    }}
                    showDelete={!q.completed} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Recurring manager */}
          <RecurringManager customList={customDailies || []} deleteAction="DELETE_CUSTOM_DAILY" dispatch={dispatch} type="daily" />
        </div>
      )}

      {/* ══ WEEKLY TAB ══ */}
      {tab === 'weekly' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <CalendarDays size={18} className="text-accent-purple" /> Weekly Quests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Resets every Monday. {weekDone}/{weekTotal} completed this week.</p>
            </div>
            <motion.button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-accent-purple to-pink-500 rounded-lg text-white text-xs font-medium hover:brightness-110 transition"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus size={14} /> Add Weekly
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <QuestForm
                onSubmit={p => { dispatch({ type: 'ADD_ONEOFF_WEEKLY', payload: p }); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
                defaultDifficulty="medium"
                showRecurring
                onAddRecurring={p => { dispatch({ type: 'ADD_CUSTOM_WEEKLY', payload: p }); setShowForm(false); }}
              />
            )}
          </AnimatePresence>

          {/* Weekly Check-in */}
          <WeeklyCheckin dispatch={dispatch} weeklyCheckin={weeklyCheckin} />

          {/* Active weeklies */}
          <div className="space-y-2">
            <AnimatePresence>
              {activeWeeklies.length === 0 ? (
                <motion.p className="text-center text-slate-600 py-8 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No weekly quests yet. Add one to get started!
                </motion.p>
              ) : (
                activeWeeklies.map(q => (
                  <QuestItem key={q.id} quest={q}
                    onComplete={id => dispatch({ type: 'COMPLETE_WEEKLY', payload: id })}
                    onDelete={id => {
                      if (q.templateId) dispatch({ type: 'DELETE_CUSTOM_WEEKLY', payload: q.templateId });
                    }}
                    showDelete={!q.completed} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Recurring manager */}
          <RecurringManager customList={customWeeklies || []} deleteAction="DELETE_CUSTOM_WEEKLY" dispatch={dispatch} type="weekly" />
        </div>
      )}

      {/* ══ EPIC TAB ══ */}
      {tab === 'epic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Crown size={18} className="text-amber-400" /> Epic Quests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Long-term goals with milestones. Worth 300 XP each.</p>
            </div>
            <motion.button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white text-xs font-medium hover:brightness-110 transition"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus size={14} /> New Epic
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <EpicQuestForm
                onSubmit={p => { dispatch({ type: 'ADD_EPIC_QUEST', payload: p }); setShowForm(false); }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <AnimatePresence>
              {epicQuests.length === 0 ? (
                <motion.p className="text-center text-slate-600 py-12 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No epic quests yet. These are your big goals — add one!
                </motion.p>
              ) : (
                epicQuests.map(eq => (
                  <EpicQuestCard key={eq.id} quest={eq} dispatch={dispatch} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
