import { motion } from 'framer-motion';
import {
  Zap, Trophy, Target, Flame, Star, TrendingUp,
  Heart, DollarSign, Users, BookOpen, Shield, Award
} from 'lucide-react';
import { useGame } from '../store/gameStore';
import XPBar from '../components/XPBar';
import { CATEGORY_COLORS } from '../data/skillTreeData';
import { CHARACTER_CLASSES } from '../data/classes';
import { BADGES } from '../data/badges';

const statCards = [
  { key: 'questsCompleted', label: 'Quests Done', icon: Target, color: 'text-accent-blue' },
  { key: 'totalXPEarned', label: 'Total XP', icon: Zap, color: 'text-accent-purple' },
  { key: 'skillsUnlocked', label: 'Skills', icon: Star, color: 'text-accent-gold' },
  { key: 'currentStreak', label: 'Day Streak', icon: Flame, color: 'text-accent-red' },
];

const categoryIcons = { health: Heart, money: DollarSign, networking: Users, discipline: Shield, learning: BookOpen };

export default function Dashboard({ onNavigate }) {
  const { playerName, playerClass, level, totalXP, skillPoints, quests, completedQuests, stats, wealthLevel, unlockedBadges } = useGame();
  const cls = playerClass ? CHARACTER_CLASSES[playerClass] : null;

  const categoryStats = {};
  for (const q of completedQuests) {
    categoryStats[q.category] = (categoryStats[q.category] || 0) + (q.xpEarned || 0);
  }

  const streakLabel = stats.currentStreak >= 30 ? '+50%' : stats.currentStreak >= 14 ? '+30%' : stats.currentStreak >= 7 ? '+20%' : stats.currentStreak >= 3 ? '+10%' : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {playerName}'s Dashboard
          </motion.h1>
          <div className="flex items-center gap-2 mt-1">
            {cls && <span className="text-xs font-medium" style={{ color: cls.color }}>{cls.name}</span>}
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs">Your adventure continues.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streakLabel && (
            <div className="card-glass rounded-lg px-3 py-2 flex items-center gap-1.5">
              <Flame size={14} className="text-accent-red" />
              <span className="text-xs font-mono text-accent-red">{streakLabel} XP</span>
            </div>
          )}
          <div className="card-glass rounded-lg px-4 py-2 flex items-center gap-2">
            <Star size={16} className="text-accent-gold" />
            <span className="text-sm font-mono text-accent-gold">{skillPoints} SP</span>
          </div>
          <div className="card-glass rounded-lg px-4 py-2 flex items-center gap-2">
            <Trophy size={16} className="text-accent-blue" />
            <span className="text-sm font-mono text-white">Lv. {level}</span>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <motion.div className="card-glass rounded-xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: cls ? `linear-gradient(135deg, ${cls.color}, ${cls.color}88)` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Experience Points</h3>
            <p className="text-slate-500 text-xs">Total: {totalXP} XP</p>
          </div>
          {stats.questsCompletedToday > 0 && (
            <span className="ml-auto text-xs text-accent-green font-mono">{stats.questsCompletedToday} today</span>
          )}
        </div>
        <XPBar />
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.key} className="card-glass rounded-xl p-4 hover:bg-bg-card-hover transition-colors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} whileHover={{ y: -2 }}>
              <Icon size={20} className={`${card.color} mb-2`} />
              <p className="text-2xl font-bold text-white font-mono">{stats[card.key]}</p>
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Three columns */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Wealth */}
        <motion.div className="card-glass rounded-xl p-5 cursor-pointer hover:bg-bg-card-hover transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} onClick={() => onNavigate('wealth')} whileHover={{ y: -2 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center"><DollarSign size={20} className="text-white" /></div>
            <div><h3 className="text-white font-semibold text-sm">Wealth</h3><p className="text-amber-400 text-xs font-medium">{wealthLevel.name}</p></div>
            <span className="ml-auto font-display text-2xl font-bold text-amber-400 text-glow-gold">{wealthLevel.level}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" initial={{ width: 0 }} animate={{ width: `${wealthLevel.progress * 100}%` }} transition={{ duration: 1 }} />
          </div>
        </motion.div>

        {/* Category */}
        <motion.div className="card-glass rounded-xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-cyan" /> XP by Category
          </h3>
          <div className="space-y-2">
            {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => {
              const Icon = categoryIcons[cat];
              const xp = categoryStats[cat] || 0;
              const maxXP = Math.max(...Object.values(categoryStats), 1);
              const isBonus = cls?.bonusCategories?.includes(cat);
              return (
                <div key={cat} className="flex items-center gap-2">
                  <Icon size={14} className={colors.text} />
                  <span className={`text-xs w-20 capitalize ${colors.text}`}>{cat}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: colors.hex }} initial={{ width: 0 }} animate={{ width: `${(xp / maxXP) * 100}%` }} transition={{ duration: 0.8, delay: 0.5 }} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-10 text-right">{xp}</span>
                  {isBonus && <span className="text-[8px] text-accent-green font-medium">+</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div className="card-glass rounded-xl p-5 cursor-pointer hover:bg-bg-card-hover transition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} onClick={() => onNavigate('character')} whileHover={{ y: -2 }}>
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Award size={16} className="text-accent-gold" /> Badges
            <span className="text-xs text-slate-500 ml-auto">{unlockedBadges.length}/{BADGES.length}</span>
          </h3>
          {unlockedBadges.length === 0 ? (
            <p className="text-slate-600 text-xs text-center py-4">Complete quests to earn badges!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.slice(0, 6).map(bid => {
                const badge = BADGES.find(b => b.id === bid);
                if (!badge) return null;
                return <div key={bid} className="px-2 py-1 rounded-md text-[10px] font-medium" style={{ backgroundColor: badge.color + '15', color: badge.color }}>{badge.name}</div>;
              })}
              {unlockedBadges.length > 6 && <span className="text-xs text-slate-500">+{unlockedBadges.length - 6} more</span>}
            </div>
          )}
        </motion.div>
      </div>

      {/* Active Quests */}
      <motion.div className="card-glass rounded-xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2"><Target size={16} className="text-accent-blue" /> Active Quests</h3>
          <button onClick={() => onNavigate('quests')} className="text-xs text-accent-blue hover:text-accent-blue/80 transition">View All</button>
        </div>
        {quests.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4">No active quests. Create one to start earning XP!</p>
        ) : (
          <div className="space-y-2">
            {quests.slice(0, 4).map(q => {
              const colors = CATEGORY_COLORS[q.category];
              return (
                <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition">
                  <div className="w-2 h-2 rounded-full" style={{ background: colors?.hex }} />
                  <span className="text-sm text-slate-300 flex-1 truncate">{q.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${colors?.bg} ${colors?.text}`}>{q.category}</span>
                  <span className="text-xs font-mono text-accent-blue">+{q.difficulty === 'easy' ? 25 : q.difficulty === 'medium' ? 50 : 100}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
