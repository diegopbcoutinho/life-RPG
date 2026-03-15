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
// ── Daily quest suggestions by category ──
export const DAILY_SUGGESTIONS = {
  health: [
    'Drink 2L of water', 'Walk 10,000 steps', 'Stretch for 15 min',
    'No sugar today', 'Sleep before 11 PM', 'Take vitamins',
    'Do 50 push-ups', 'Eat 3 servings of vegetables', 'Meditate 10 min',
    'Cold shower', 'No processed food today', 'Track all meals',
  ],
  discipline: [
    '2h deep work block', 'No social media until noon', 'Wake before 6 AM',
    'Follow morning routine', 'Journal for 10 min', 'Plan tomorrow tonight',
    'Inbox zero', 'No phone first hour', 'Complete top 3 priorities',
    'Time-block your day', 'No YouTube/Netflix today', 'Review weekly goals',
  ],
  learning: [
    'Read 30 min', 'Watch an educational video', 'Practice a new language 15 min',
    'Take notes on something new', 'Listen to a podcast', 'Solve a coding challenge',
    'Write 500 words', 'Review flashcards', 'Teach someone a concept',
    'Study for 1 hour', 'Research a new topic', 'Complete an online lesson',
  ],
  money: [
    'Track expenses today', 'No unnecessary spending', 'Review budget',
    'Research an investment', 'Work on side project 1h', 'Send a proposal/pitch',
    'Network with a potential client', 'Optimize a subscription',
    'Read about personal finance', 'Update financial spreadsheet',
  ],
  networking: [
    'Message an old friend', 'Attend a meetup/event', 'Comment on 5 LinkedIn posts',
    'Have a meaningful conversation', 'Send a thank-you message',
    'Connect with someone new', 'Schedule a coffee chat', 'Help someone with a problem',
    'Share valuable content online', 'Introduce two people who should know each other',
  ],
};

// ── Get today's suggested dailies (deterministic per day, rotates) ──
export function getDailySuggestions(dayOffset = 0) {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000) + dayOffset;
  const suggestions = [];
  for (const [category, items] of Object.entries(DAILY_SUGGESTIONS)) {
    const idx = dayOfYear % items.length;
    const idx2 = (dayOfYear + 3) % items.length;
    suggestions.push({ title: items[idx], category, difficulty: 'easy', type: 'suggested' });
    if (idx !== idx2) {
      suggestions.push({ title: items[idx2], category, difficulty: 'easy', type: 'suggested' });
    }
  }
  return suggestions;
}

// ── Get current ISO week string ──
export function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

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
  // Epic Quests — long-term goals with milestones
  epicQuests: [],
  // Custom recurring quests — user-configured templates
  customDailies: [],   // [{ id, title, category, difficulty }]
  customWeeklies: [],   // [{ id, title, category, difficulty }]
  // Active daily/weekly instances
  activeDailies: [],    // [{ id, templateId?, title, category, difficulty, completed, date }]
  activeWeeklies: [],   // [{ id, templateId?, title, category, difficulty, completed, week }]
  // Track which suggested dailies were accepted/dismissed today
  dailySuggestionsDate: null,
  acceptedSuggestions: [],
  dismissedSuggestions: [],
  // Weekly check-in
  weeklyCheckin: null,  // { week, reflection, rating, goals }
  weeklyCheckins: [],   // history
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
      // Ensure arrays exist
      merged.epicQuests = merged.epicQuests || [];
      merged.customDailies = merged.customDailies || [];
      merged.customWeeklies = merged.customWeeklies || [];
      merged.activeDailies = merged.activeDailies || [];
      merged.activeWeeklies = merged.activeWeeklies || [];
      merged.acceptedSuggestions = merged.acceptedSuggestions || [];
      merged.dismissedSuggestions = merged.dismissedSuggestions || [];
      merged.weeklyCheckins = merged.weeklyCheckins || [];

      const today = new Date().toISOString().split('T')[0];
      const currentWeek = getCurrentWeek();

      // Daily reset check
      if (merged.stats.lastResetDate !== today) {
        merged.stats.questsCompletedToday = 0;
        merged.stats.lastResetDate = today;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (merged.stats.lastCompletedDate && merged.stats.lastCompletedDate !== yesterday && merged.stats.lastCompletedDate !== today) {
          merged.stats.currentStreak = 0;
        }
        // Reset daily quests — regenerate from custom templates
        merged.activeDailies = merged.customDailies.map(t => ({
          id: crypto.randomUUID(),
          templateId: t.id,
          title: t.title,
          category: t.category,
          difficulty: t.difficulty || 'easy',
          completed: false,
          date: today,
        }));
        // Reset daily suggestions tracking
        merged.dailySuggestionsDate = today;
        merged.acceptedSuggestions = [];
        merged.dismissedSuggestions = [];
      }

      // Weekly reset check
      const activeWeeklyWeek = merged.activeWeeklies?.[0]?.week;
      if (activeWeeklyWeek !== currentWeek) {
        merged.activeWeeklies = merged.customWeeklies.map(t => ({
          id: crypto.randomUUID(),
          templateId: t.id,
          title: t.title,
          category: t.category,
          difficulty: t.difficulty || 'medium',
          completed: false,
          week: currentWeek,
        }));
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

    // ── Epic Quests ──
    case 'ADD_EPIC_QUEST':
      return {
        ...state,
        epicQuests: [...state.epicQuests, {
          ...action.payload,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          milestones: action.payload.milestones || [],
          progress: 0,
        }],
      };

    case 'UPDATE_EPIC_PROGRESS': {
      return {
        ...state,
        epicQuests: state.epicQuests.map(eq =>
          eq.id === action.payload.id ? { ...eq, progress: Math.min(100, Math.max(0, action.payload.progress)) } : eq
        ),
      };
    }

    case 'TOGGLE_EPIC_MILESTONE': {
      return {
        ...state,
        epicQuests: state.epicQuests.map(eq => {
          if (eq.id !== action.payload.questId) return eq;
          const milestones = eq.milestones.map((m, i) =>
            i === action.payload.milestoneIndex ? { ...m, completed: !m.completed } : m
          );
          const completedCount = milestones.filter(m => m.completed).length;
          const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : eq.progress;
          return { ...eq, milestones, progress };
        }),
      };
    }

    case 'DELETE_EPIC_QUEST':
      return { ...state, epicQuests: state.epicQuests.filter(eq => eq.id !== action.payload) };

    case 'COMPLETE_EPIC_QUEST': {
      const epicQuest = state.epicQuests.find(eq => eq.id === action.payload);
      if (!epicQuest) return state;
      const baseXP = DIFFICULTY_XP['hard'] * 3; // Epic = 300 XP
      const classXP = calcXP(baseXP, epicQuest.category, state.playerClass);
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
        epicQuests: state.epicQuests.filter(eq => eq.id !== action.payload),
        completedQuests: [{ ...epicQuest, type: 'epic', completedAt: Date.now(), xpEarned: totalGain, bonusXP }, ...state.completedQuests].slice(0, 200),
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
      if (levelsGained > 0) setTimeout(() => playLevelUp(), 200);
      else playQuestComplete();
      return newState;
    }

    // ── Custom Recurring Templates ──
    case 'ADD_CUSTOM_DAILY': {
      const template = { ...action.payload, id: crypto.randomUUID() };
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        customDailies: [...state.customDailies, template],
        activeDailies: [...state.activeDailies, {
          id: crypto.randomUUID(),
          templateId: template.id,
          title: template.title,
          category: template.category,
          difficulty: template.difficulty || 'easy',
          completed: false,
          date: today,
        }],
      };
    }

    case 'DELETE_CUSTOM_DAILY':
      return {
        ...state,
        customDailies: state.customDailies.filter(d => d.id !== action.payload),
        activeDailies: state.activeDailies.filter(d => d.templateId !== action.payload),
      };

    case 'ADD_CUSTOM_WEEKLY': {
      const template = { ...action.payload, id: crypto.randomUUID() };
      const currentWeek = getCurrentWeek();
      return {
        ...state,
        customWeeklies: [...state.customWeeklies, template],
        activeWeeklies: [...state.activeWeeklies, {
          id: crypto.randomUUID(),
          templateId: template.id,
          title: template.title,
          category: template.category,
          difficulty: template.difficulty || 'medium',
          completed: false,
          week: currentWeek,
        }],
      };
    }

    case 'DELETE_CUSTOM_WEEKLY':
      return {
        ...state,
        customWeeklies: state.customWeeklies.filter(w => w.id !== action.payload),
        activeWeeklies: state.activeWeeklies.filter(w => w.templateId !== action.payload),
      };

    // ── Complete Daily/Weekly Quest ──
    case 'COMPLETE_DAILY':
    case 'COMPLETE_WEEKLY': {
      const isDaily = action.type === 'COMPLETE_DAILY';
      const listKey = isDaily ? 'activeDailies' : 'activeWeeklies';
      const quest = state[listKey].find(q => q.id === action.payload);
      if (!quest || quest.completed) return state;

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
        [listKey]: state[listKey].map(q =>
          q.id === action.payload ? { ...q, completed: true } : q
        ),
        completedQuests: [{ ...quest, type: isDaily ? 'daily' : 'weekly', completedAt: Date.now(), xpEarned: totalGain, bonusXP }, ...state.completedQuests].slice(0, 200),
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
      if (levelsGained > 0) setTimeout(() => playLevelUp(), 200);
      else playQuestComplete();
      return newState;
    }

    // ── Accept a daily suggestion (add to activeDailies for today) ──
    case 'ACCEPT_SUGGESTION': {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        acceptedSuggestions: [...state.acceptedSuggestions, action.payload.title],
        activeDailies: [...state.activeDailies, {
          id: crypto.randomUUID(),
          title: action.payload.title,
          category: action.payload.category,
          difficulty: action.payload.difficulty || 'easy',
          completed: false,
          date: today,
          suggested: true,
        }],
      };
    }

    case 'DISMISS_SUGGESTION':
      return {
        ...state,
        dismissedSuggestions: [...state.dismissedSuggestions, action.payload],
      };

    // ── Add one-off daily/weekly ──
    case 'ADD_ONEOFF_DAILY': {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        activeDailies: [...state.activeDailies, {
          id: crypto.randomUUID(),
          title: action.payload.title,
          category: action.payload.category,
          difficulty: action.payload.difficulty || 'easy',
          completed: false,
          date: today,
          oneoff: true,
        }],
      };
    }

    case 'ADD_ONEOFF_WEEKLY': {
      const currentWeek = getCurrentWeek();
      return {
        ...state,
        activeWeeklies: [...state.activeWeeklies, {
          id: crypto.randomUUID(),
          title: action.payload.title,
          category: action.payload.category,
          difficulty: action.payload.difficulty || 'medium',
          completed: false,
          week: currentWeek,
          oneoff: true,
        }],
      };
    }

    // ── Weekly Check-in ──
    case 'SAVE_WEEKLY_CHECKIN': {
      const checkin = { ...action.payload, week: getCurrentWeek(), savedAt: Date.now() };
      // Give XP for checking in
      const checkinXP = 50;
      const newTotalXP = state.totalXP + checkinXP;
      let newLevel = 1;
      let xpRem = newTotalXP;
      for (let l = 1; l <= 100; l++) {
        const req = xpForLevel(l);
        if (xpRem < req) { newLevel = l; break; }
        xpRem -= req;
      }
      const levelsGained = newLevel - state.level;
      return {
        ...state,
        totalXP: newTotalXP,
        level: newLevel,
        skillPoints: state.skillPoints + (levelsGained > 0 ? levelsGained : 0),
        weeklyCheckin: checkin,
        weeklyCheckins: [checkin, ...(state.weeklyCheckins || [])].slice(0, 52),
        showLevelUp: levelsGained > 0,
        newLevel: levelsGained > 0 ? newLevel : state.newLevel,
        stats: {
          ...state.stats,
          totalXPEarned: state.stats.totalXPEarned + checkinXP,
        },
      };
    }

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
