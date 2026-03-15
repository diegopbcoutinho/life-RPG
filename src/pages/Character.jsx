import { motion } from 'framer-motion';
import {
  User, Trophy, Zap, Flame, Star, Target, Shield,
  Sword, Wand2, Eye, ShieldCheck, Award, Lock,
  Heart, DollarSign, Users, BookOpen
} from 'lucide-react';
import { useGame, xpForLevel } from '../store/gameStore';
import { CHARACTER_CLASSES, STAT_LABELS } from '../data/classes';
import { BADGES, RARITY_COLORS } from '../data/badges';
import XPBar from '../components/XPBar';

const classIcons = { Sword, Wand2, Eye, ShieldCheck };
const badgeIcons = { Flame, Target, Trophy, Star, Zap };

export default function Character() {
  const { playerName, playerClass, level, totalXP, stats, unlockedBadges, unlockedSkills, skillPoints } = useGame();
  const cls = CHARACTER_CLASSES[playerClass];
  const ClassIcon = cls ? classIcons[cls.icon] : Shield;

  // Compute stat bonuses from level
  const statBonus = Math.floor(level / 5);

  // Calculate derived stats
  const derivedStats = cls ? Object.entries(cls.stats).map(([key, base]) => ({
    key,
    ...STAT_LABELS[key],
    base,
    bonus: statBonus,
    total: base + statBonus,
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <User size={28} className="text-accent-blue" /> Character
        </h1>
        <p className="text-slate-400 text-sm mt-1">Your hero profile, stats, and achievements.</p>
      </div>

      {/* Character Card */}
      <motion.div
        className="card-glass rounded-xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ background: cls ? cls.color + '10' : 'rgba(59,130,246,0.05)' }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0"
            style={{ background: cls ? `linear-gradient(135deg, ${cls.color}40, ${cls.color}15)` : 'rgba(59,130,246,0.1)', boxShadow: cls ? `0 0 30px ${cls.color}20` : undefined }}
          >
            <ClassIcon size={32} style={{ color: cls?.color || '#3b82f6' }} />
            <span className="font-display text-xs font-bold mt-1" style={{ color: cls?.color || '#3b82f6' }}>
              Lv.{level}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-white tracking-wide">{playerName}</h2>
            {cls && (
              <p className="text-sm font-medium mt-0.5" style={{ color: cls.color }}>
                {cls.name} — {cls.title}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Target size={12} /> {stats.questsCompleted} Quests</span>
              <span className="flex items-center gap-1"><Zap size={12} /> {stats.totalXPEarned} XP</span>
              <span className="flex items-center gap-1"><Flame size={12} /> {stats.currentStreak} Day Streak</span>
              <span className="flex items-center gap-1"><Star size={12} /> {skillPoints} SP</span>
            </div>
            <XPBar className="mt-4" />
          </div>
        </div>
      </motion.div>

      {/* Stats + Streak Info */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Stats Panel */}
        {derivedStats.length > 0 && (
          <motion.div
            className="card-glass rounded-xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Shield size={16} className="text-accent-blue" /> Character Stats
            </h3>
            <div className="space-y-3">
              {derivedStats.map((stat, i) => (
                <motion.div
                  key={stat.key}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <span className="font-mono text-xs font-bold w-8" style={{ color: stat.color }}>{stat.label}</span>
                  <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative"
                      style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}aa)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.total / 15) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                  <span className="font-mono text-xs text-white w-6 text-right">{stat.total}</span>
                  {stat.bonus > 0 && (
                    <span className="text-[10px] text-accent-green">+{stat.bonus}</span>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3">Stats gain +1 every 5 levels</p>
          </motion.div>
        )}

        {/* Streak & Cooldowns */}
        <motion.div
          className="card-glass rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Flame size={16} className="text-accent-red" /> Streak & Activity
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="font-display text-2xl font-bold text-accent-red">{stats.currentStreak}</p>
              <p className="text-[10px] text-slate-500 mt-1">Current Streak</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="font-display text-2xl font-bold text-accent-gold">{stats.longestStreak}</p>
              <p className="text-[10px] text-slate-500 mt-1">Best Streak</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="font-display text-2xl font-bold text-accent-blue">{stats.questsCompletedToday}</p>
              <p className="text-[10px] text-slate-500 mt-1">Today's Quests</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="font-display text-2xl font-bold text-accent-green">{unlockedSkills.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Skills Unlocked</p>
            </div>
          </div>

          {/* Streak Bonus Info */}
          <div className="mt-4 space-y-1">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Streak XP Bonuses</p>
            {[
              { days: 3, bonus: '+10%', active: stats.currentStreak >= 3 },
              { days: 7, bonus: '+20%', active: stats.currentStreak >= 7 },
              { days: 14, bonus: '+30%', active: stats.currentStreak >= 14 },
              { days: 30, bonus: '+50%', active: stats.currentStreak >= 30 },
            ].map(s => (
              <div key={s.days} className={`flex items-center gap-2 text-xs ${s.active ? 'text-accent-green' : 'text-slate-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-accent-green' : 'bg-slate-700'}`} />
                <span>{s.days}+ days: {s.bonus} XP</span>
                {s.active && <span className="text-[9px] text-accent-green font-medium">ACTIVE</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        className="card-glass rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Award size={16} className="text-accent-gold" /> Badges & Achievements
          <span className="text-xs text-slate-500 ml-auto">{unlockedBadges.length}/{BADGES.length}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BADGES.map((badge, i) => {
            const unlocked = unlockedBadges.includes(badge.id);
            const rarity = RARITY_COLORS[badge.rarity];
            const Icon = badgeIcons[badge.icon] || Star;
            return (
              <motion.div
                key={badge.id}
                className={`rounded-lg p-3 border transition-all duration-300 ${
                  unlocked
                    ? `${rarity.bg} ${rarity.border}`
                    : 'bg-white/[0.02] border-white/5 opacity-40'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: unlocked ? 1 : 0.4, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.03 }}
                whileHover={unlocked ? { y: -2, scale: 1.02 } : {}}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {unlocked ? (
                    <Icon size={16} style={{ color: badge.color }} />
                  ) : (
                    <Lock size={14} className="text-slate-600" />
                  )}
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${rarity.text}`}>
                    {badge.rarity}
                  </span>
                </div>
                <p className={`text-xs font-medium ${unlocked ? 'text-white' : 'text-slate-600'}`}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
