import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Check, Trash2, X, Zap, ScrollText,
  Heart, DollarSign, Users, BookOpen, Shield,
  ChevronDown
} from 'lucide-react';
import { useGame } from '../store/gameStore';
import { CATEGORY_COLORS, DIFFICULTY_XP } from '../data/skillTreeData';

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

export default function Quests() {
  const { quests, completedQuests, dispatch } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('discipline');
  const [difficulty, setDifficulty] = useState('medium');
  const [tab, setTab] = useState('active');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: 'ADD_QUEST',
      payload: { title: title.trim(), category, difficulty },
    });
    setTitle('');
    setShowForm(false);
  };

  const filteredQuests = filter === 'all' ? quests : quests.filter(q => q.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <ScrollText size={28} className="text-accent-blue" /> Quest Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Complete quests to earn XP and level up.</p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg text-white text-sm font-medium glow-blue hover:brightness-110 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} /> New Quest
        </motion.button>
      </div>

      {/* New Quest Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="card-glass rounded-xl p-5 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Create New Quest</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300">
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
              {/* Category Selection */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-slate-500 mb-1.5 block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => {
                    const Icon = categoryIcons[cat];
                    const colors = CATEGORY_COLORS[cat];
                    const selected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize transition border
                          ${selected
                            ? `${colors.bg} ${colors.text} ${colors.border}`
                            : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                          }`}
                      >
                        <Icon size={12} /> {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Difficulty</label>
                <div className="flex gap-1.5">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize transition border
                        ${difficulty === diff
                          ? difficultyColors[diff] + ' border'
                          : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                        }`}
                    >
                      {diff} (+{DIFFICULTY_XP[diff]} XP)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg text-white text-sm font-medium hover:brightness-110 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Quest
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-fit">
        {['active', 'completed'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition capitalize
              ${tab === t ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t} {t === 'active' ? `(${quests.length})` : `(${completedQuests.length})`}
          </button>
        ))}
      </div>

      {/* Filter (active only) */}
      {tab === 'active' && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs transition ${
              filter === 'all' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => {
            const colors = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition ${
                  filter === cat ? `${colors.bg} ${colors.text}` : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Quest List */}
      {tab === 'active' ? (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredQuests.length === 0 ? (
              <motion.p
                className="text-center text-slate-600 py-12 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {quests.length === 0 ? 'No quests yet. Create your first quest!' : 'No quests in this category.'}
              </motion.p>
            ) : (
              filteredQuests.map((quest, i) => {
                const colors = CATEGORY_COLORS[quest.category];
                const Icon = categoryIcons[quest.category];
                const xp = DIFFICULTY_XP[quest.difficulty];
                return (
                  <motion.div
                    key={quest.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-glass rounded-xl p-4 flex items-center gap-4 group hover:bg-bg-card-hover transition"
                  >
                    {/* Complete Button */}
                    <motion.button
                      onClick={() => dispatch({ type: 'COMPLETE_QUEST', payload: quest.id })}
                      className="w-9 h-9 rounded-lg bg-accent-green/10 border border-accent-green/30 flex items-center justify-center text-accent-green hover:bg-accent-green/20 transition shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check size={16} />
                    </motion.button>

                    {/* Quest Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{quest.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`flex items-center gap-1 text-xs ${colors.text}`}>
                          <Icon size={10} /> {quest.category}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColors[quest.difficulty]}`}>
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Zap size={14} className="text-accent-blue" />
                      <span className="text-sm font-mono text-accent-blue font-medium">+{xp}</span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => dispatch({ type: 'DELETE_QUEST', payload: quest.id })}
                      className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Completed Quests */
        <div className="space-y-2">
          {completedQuests.length === 0 ? (
            <p className="text-center text-slate-600 py-12 text-sm">No completed quests yet.</p>
          ) : (
            completedQuests.slice(0, 20).map((quest, i) => {
              const colors = CATEGORY_COLORS[quest.category];
              return (
                <motion.div
                  key={quest.id + quest.completedAt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card-glass rounded-xl p-4 flex items-center gap-4 opacity-60"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-green/20 flex items-center justify-center text-accent-green shrink-0">
                    <Check size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm line-through truncate">{quest.title}</p>
                    <span className={`text-xs ${colors?.text}`}>{quest.category}</span>
                  </div>
                  <span className="text-xs font-mono text-accent-green shrink-0">+{quest.xpEarned} XP</span>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
