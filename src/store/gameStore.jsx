import { createContext, useContext, useReducer, useEffect } from 'react';
import { DIFFICULTY_XP } from '../data/skillTreeData';
import { BADGES } from '../data/badges';
import { CHARACTER_CLASSES } from '../data/classes';
import { playQuestComplete, playLevelUp, playBadgeUnlock } from '../data/sounds';

const STORAGE_KEY = 'life-rpg-save';

// ── XP required per level (exponential curve) ──
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// ── Wealth level thresholds ──
const WEALTH_LEVELS = [
  { level: 1, name: 'Broke', min: 0 },
  { level: 2, name: 'Surviving', min: 500 },
  { level: 3, name: 'Stable', min: 1500 },
  { level: 4, name: 'Comfortable', min: 3000 },
  { level: 5, name: 'Prosperous', min: 5000 },
  { level: 6, name: 'Wealthy', min: 8000 },
  { level: 7, name: 'Rich', min: 15000 },
  { level: 8, name: 'Affluent', min: 30000 },
  { level: 9, name: 'Elite', min: 60000 },
  { level: 10, name: 'Legendary', min: 100000 },
];

export function getWealthLevel(income) {
  let wl = WEALTH_LEVELS[0];
  for (const w of WEALTH_LEVELS) {
    if (income >= w.min) wl = w;
  }
  const nextIdx = WEALTH_LEVELS.findIndex(w => w.level === wl.level + 1);
  const next = nextIdx >= 0 ? WEALTH_LEVELS[nextIdx] : null;
  const progress = next ? (income - wl.min) / (next.min - wl.min) : 1;
  return { ...wl, progress: Math.min(progress, 1), nextMin: next?.min ?? wl.min };
}

// ── Badge checking ──
function checkBadges(state) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (state.unlockedBadges.includes(badge.id)) continue;
    const { type, value } = badge.requirement;
    let met = false;
    if (type === 'streak') met = state.stats.longestStreak >= value;
    else if (type === 'questsCompleted') met = state.stats.questsCompleted >= value;
    else if (type === 'level') met = state.level >= value;
    else if (type === 'skillsUnlocked') met = state.stats.skillsUnlocked >= value;
    else if (type === 'totalXPEarned') met = state.stats.totalXPEarned >= value;
    if (met) newBadges.push(badge.id);
  }
  return newBadges;
}

// ── Initial State ──
const defaultState = {
  playerName: 'Adventurer',
  playerClass: null,
  totalXP: 0,
  level: 1,
  skillPoints: 0,
  unlockedSkills: [],
  unlockedBadges: [],
  monthlyIncome: 0,
  quests: [],
  completedQuests: [],
  showLevelUp: false,
  showBadge: null,
  newLevel: 1,
  stats: {
    questsCompleted: 0,
    totalXPEarned: 0,
    skillsUnlocked: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    questsCompletedToday: 0,
    lastResetDate: null,
  },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = { ...defaultState, ...parsed, showLevelUp: false, showBadge: null };
      merged.stats = { ...defaultState.stats, ...parsed.stats };
      // Daily reset check
      const today = new Date().toISOString().split('T')[0];
      if (merged.stats.lastResetDate !== today) {
        merged.stats.questsCompletedToday = 0;
        merged.stats.lastResetDate = today;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (merged.stats.lastCompletedDate && merged.stats.lastCompletedDate !== yesterday && merged.stats.lastCompletedDate !== today) {
          merged.stats.currentStreak = 0;
        }
      }
      return merged;
    }
  } catch (e) {
    console.warn('Failed to load save:', e);
  }
  return defaultState;
}

function saveState(state) {
  try {
    const { showLevelUp, showBadge, newLevel, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

// ── Streak logic ──
function updateStreak(stats) {
  const today = new Date().toISOString().split('T')[0];
  const last = stats.lastCompletedDate;
  if (last === today) return { ...stats, questsCompletedToday: stats.questsCompletedToday + 1 };

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = last === yesterday ? stats.currentStreak + 1 : 1;
  return {
    ...stats,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, stats.longestStreak),
    lastCompletedDate: today,
    questsCompletedToday: stats.questsCompletedToday + 1,
    lastResetDate: today,
  };
}

// ── XP with class bonus + streak bonus ──
function calcXP(baseXP, category, playerClass) {
  if (!playerClass) return baseXP;
  const cls = CHARACTER_CLASSES[playerClass];
  if (!cls) return baseXP;
  if (cls.bonusCategories.includes(category)) {
    return Math.floor(baseXP * cls.xpMultiplier);
  }
  return baseXP;
}

function streakBonusXP(baseXP, currentStreak) {
  if (currentStreak >= 30) return Math.floor(baseXP * 0.5);
  if (currentStreak >= 14) return Math.floor(baseXP * 0.3);
  if (currentStreak >= 7) return Math.floor(baseXP * 0.2);
  if (currentStreak >= 3) return Math.floor(baseXP * 0.1);
  return 0;
}

// ── Reducer ──
function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload };

    case 'SET_CLASS':
      return { ...state, playerClass: action.payload };

    case 'ADD_QUEST':
      return {
        ...state,
        quests: [...state.quests, { ...action.payload, id: crypto.randomUUID(), createdAt: Date.now() }],
      };

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.payload);
      if (!quest) return state;

      const baseXP = DIFFICULTY_XP[quest.difficulty] || 25;
      const classXP = calcXP(baseXP, quest.category, state.playerClass);
      const updatedStats = updateStreak(state.stats);
      const bonusXP = streakBonusXP(classXP, updatedStats.currentStreak);
      const totalGain = classXP + bonusXP;
      const newTotalXP = state.totalXP + totalGain;

      let newLevel = 1;
      let xpRem = newTotalXP;
      for (let l = 1; l <= 100; l++) {
        const req = xpForLevel(l);
        if (xpRem < req) { newLevel = l; break; }
        xpRem -= req;
      }

      const levelsGained = newLevel - state.level;

      const newState = {
        ...state,
        totalXP: newTotalXP,
        level: newLevel,
        skillPoints: state.skillPoints + (levelsGained > 0 ? levelsGained : 0),
        quests: state.quests.filter(q => q.id !== action.payload),
        completedQuests: [{ ...quest, completedAt: Date.now(), xpEarned: totalGain, bonusXP }, ...state.completedQuests].slice(0, 200),
        showLevelUp: levelsGained > 0,
        newLevel: levelsGained > 0 ? newLevel : state.newLevel,
        stats: {
          ...updatedStats,
          questsCompleted: updatedStats.questsCompleted + 1,
          totalXPEarned: updatedStats.totalXPEarned + totalGain,
        },
      };

      const newBadges = checkBadges(newState);
      if (newBadges.length > 0) {
        newState.unlockedBadges = [...state.unlockedBadges, ...newBadges];
        newState.showBadge = newBadges[0];
        setTimeout(() => playBadgeUnlock(), 100);
      }

      if (levelsGained > 0) {
        setTimeout(() => playLevelUp(), 200);
      } else {
        playQuestComplete();
      }

      return newState;
    }

    case 'DELETE_QUEST':
      return { ...state, quests: state.quests.filter(q => q.id !== action.payload) };

    case 'UNLOCK_SKILL': {
      const skillId = action.payload;
      if (state.unlockedSkills.includes(skillId)) return state;
      const cost = action.cost || 1;
      if (state.skillPoints < cost) return state;
      const newState = {
        ...state,
        skillPoints: state.skillPoints - cost,
        unlockedSkills: [...state.unlockedSkills, skillId],
        stats: { ...state.stats, skillsUnlocked: state.stats.skillsUnlocked + 1 },
      };
      const newBadges = checkBadges(newState);
      if (newBadges.length > 0) {
        newState.unlockedBadges = [...state.unlockedBadges, ...newBadges];
        newState.showBadge = newBadges[0];
      }
      return newState;
    }

    case 'SET_INCOME':
      return { ...state, monthlyIncome: Math.max(0, Number(action.payload) || 0) };

    case 'DISMISS_LEVEL_UP':
      return { ...state, showLevelUp: false };

    case 'DISMISS_BADGE':
      return { ...state, showBadge: null };

    case 'RESET_GAME':
      localStorage.removeItem(STORAGE_KEY);
      return { ...defaultState };

    default:
      return state;
  }
}

// ── Context ──
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  let xpIntoCurrentLevel = state.totalXP;
  for (let l = 1; l < state.level; l++) {
    xpIntoCurrentLevel -= xpForLevel(l);
  }
  const xpNeeded = xpForLevel(state.level);
  const xpProgress = Math.min(xpIntoCurrentLevel / xpNeeded, 1);

  const value = {
    ...state,
    xpIntoCurrentLevel,
    xpNeeded,
    xpProgress,
    wealthLevel: getWealthLevel(state.monthlyIncome),
    dispatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
