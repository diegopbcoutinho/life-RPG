export const BADGES = [
  // ── Streak Badges ──
  { id: 'streak-3', name: 'Getting Started', description: 'Maintain a 3-day streak', icon: 'Flame', category: 'streak', requirement: { type: 'streak', value: 3 }, color: '#f59e0b', rarity: 'common' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'Flame', category: 'streak', requirement: { type: 'streak', value: 7 }, color: '#f59e0b', rarity: 'uncommon' },
  { id: 'streak-14', name: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: 'Flame', category: 'streak', requirement: { type: 'streak', value: 14 }, color: '#ef4444', rarity: 'rare' },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: 'Flame', category: 'streak', requirement: { type: 'streak', value: 30 }, color: '#8b5cf6', rarity: 'epic' },
  { id: 'streak-100', name: 'Unstoppable', description: 'Maintain a 100-day streak', icon: 'Flame', category: 'streak', requirement: { type: 'streak', value: 100 }, color: '#06b6d4', rarity: 'legendary' },

  // ── Quest Badges ──
  { id: 'quests-10', name: 'Quester', description: 'Complete 10 quests', icon: 'Target', category: 'quests', requirement: { type: 'questsCompleted', value: 10 }, color: '#3b82f6', rarity: 'common' },
  { id: 'quests-50', name: 'Quest Hunter', description: 'Complete 50 quests', icon: 'Target', category: 'quests', requirement: { type: 'questsCompleted', value: 50 }, color: '#3b82f6', rarity: 'uncommon' },
  { id: 'quests-100', name: 'Centurion', description: 'Complete 100 quests', icon: 'Target', category: 'quests', requirement: { type: 'questsCompleted', value: 100 }, color: '#8b5cf6', rarity: 'rare' },
  { id: 'quests-500', name: 'Legend', description: 'Complete 500 quests', icon: 'Target', category: 'quests', requirement: { type: 'questsCompleted', value: 500 }, color: '#f59e0b', rarity: 'legendary' },

  // ── Level Badges ──
  { id: 'level-5', name: 'Apprentice', description: 'Reach level 5', icon: 'Trophy', category: 'level', requirement: { type: 'level', value: 5 }, color: '#10b981', rarity: 'common' },
  { id: 'level-10', name: 'Journeyman', description: 'Reach level 10', icon: 'Trophy', category: 'level', requirement: { type: 'level', value: 10 }, color: '#3b82f6', rarity: 'uncommon' },
  { id: 'level-25', name: 'Expert', description: 'Reach level 25', icon: 'Trophy', category: 'level', requirement: { type: 'level', value: 25 }, color: '#8b5cf6', rarity: 'rare' },
  { id: 'level-50', name: 'Grandmaster', description: 'Reach level 50', icon: 'Trophy', category: 'level', requirement: { type: 'level', value: 50 }, color: '#f59e0b', rarity: 'legendary' },

  // ── Skill Badges ──
  { id: 'skills-5', name: 'Skilled', description: 'Unlock 5 skills', icon: 'Star', category: 'skills', requirement: { type: 'skillsUnlocked', value: 5 }, color: '#06b6d4', rarity: 'common' },
  { id: 'skills-15', name: 'Versatile', description: 'Unlock 15 skills', icon: 'Star', category: 'skills', requirement: { type: 'skillsUnlocked', value: 15 }, color: '#8b5cf6', rarity: 'rare' },
  { id: 'skills-25', name: 'Omni-Skilled', description: 'Unlock all 25 skills', icon: 'Star', category: 'skills', requirement: { type: 'skillsUnlocked', value: 25 }, color: '#f59e0b', rarity: 'legendary' },

  // ── XP Badges ──
  { id: 'xp-1000', name: 'XP Farmer', description: 'Earn 1,000 total XP', icon: 'Zap', category: 'xp', requirement: { type: 'totalXPEarned', value: 1000 }, color: '#3b82f6', rarity: 'common' },
  { id: 'xp-10000', name: 'XP Machine', description: 'Earn 10,000 total XP', icon: 'Zap', category: 'xp', requirement: { type: 'totalXPEarned', value: 10000 }, color: '#8b5cf6', rarity: 'rare' },
  { id: 'xp-50000', name: 'XP Overlord', description: 'Earn 50,000 total XP', icon: 'Zap', category: 'xp', requirement: { type: 'totalXPEarned', value: 50000 }, color: '#f59e0b', rarity: 'legendary' },
];

export const RARITY_COLORS = {
  common: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', hex: '#94a3b8' },
  uncommon: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', hex: '#10b981' },
  rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', hex: '#3b82f6' },
  epic: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', hex: '#8b5cf6' },
  legendary: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', hex: '#f59e0b' },
};
