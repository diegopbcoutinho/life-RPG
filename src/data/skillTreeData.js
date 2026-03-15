export const SKILL_BRANCHES = {
  health: {
    name: 'Health',
    icon: 'Heart',
    color: '#10b981',
    glowClass: 'glow-green',
    skills: [
      { id: 'h1', name: 'Early Riser', description: 'Wake up before 7 AM consistently', tier: 1, cost: 1, requires: [] },
      { id: 'h2', name: 'Better Sleep', description: 'Sleep 7-8 hours every night', tier: 1, cost: 1, requires: [] },
      { id: 'h3', name: 'Consistent Training', description: 'Exercise 4+ times per week', tier: 2, cost: 2, requires: ['h1'] },
      { id: 'h4', name: 'Nutrition Discipline', description: 'Follow a structured meal plan', tier: 2, cost: 2, requires: ['h2'] },
      { id: 'h5', name: 'Iron Body', description: 'Peak physical conditioning', tier: 3, cost: 3, requires: ['h3', 'h4'] },
    ],
  },
  money: {
    name: 'Money',
    icon: 'DollarSign',
    color: '#f59e0b',
    glowClass: 'glow-gold',
    skills: [
      { id: 'm1', name: 'Budget Master', description: 'Track all expenses monthly', tier: 1, cost: 1, requires: [] },
      { id: 'm2', name: 'Savings Habit', description: 'Save 20%+ of income', tier: 1, cost: 1, requires: [] },
      { id: 'm3', name: 'Investing Knowledge', description: 'Understand markets and assets', tier: 2, cost: 2, requires: ['m1'] },
      { id: 'm4', name: 'Business Execution', description: 'Launch and run a side business', tier: 2, cost: 2, requires: ['m2'] },
      { id: 'm5', name: 'Sales Confidence', description: 'Close deals and negotiate powerfully', tier: 3, cost: 3, requires: ['m3', 'm4'] },
    ],
  },
  networking: {
    name: 'Networking',
    icon: 'Users',
    color: '#8b5cf6',
    glowClass: 'glow-purple',
    skills: [
      { id: 'n1', name: 'Social Courage', description: 'Initiate conversations with strangers', tier: 1, cost: 1, requires: [] },
      { id: 'n2', name: 'Active Listener', description: 'Practice deep listening in conversations', tier: 1, cost: 1, requires: [] },
      { id: 'n3', name: 'Communication', description: 'Articulate ideas clearly and persuasively', tier: 2, cost: 2, requires: ['n1'] },
      { id: 'n4', name: 'Network Builder', description: 'Build and maintain professional network', tier: 2, cost: 2, requires: ['n2'] },
      { id: 'n5', name: 'Charisma', description: 'Natural magnetism and influence', tier: 3, cost: 3, requires: ['n3', 'n4'] },
    ],
  },
  discipline: {
    name: 'Discipline',
    icon: 'Flame',
    color: '#ef4444',
    glowClass: 'glow-red',
    skills: [
      { id: 'd1', name: 'Morning Routine', description: 'Follow a structured morning ritual', tier: 1, cost: 1, requires: [] },
      { id: 'd2', name: 'Focus Streak', description: 'Deep work sessions of 2+ hours', tier: 1, cost: 1, requires: [] },
      { id: 'd3', name: 'Deep Work', description: '4+ hours of uninterrupted focus daily', tier: 2, cost: 2, requires: ['d2'] },
      { id: 'd4', name: 'Routine Consistency', description: 'Maintain habits for 30+ days', tier: 2, cost: 2, requires: ['d1'] },
      { id: 'd5', name: 'Unbreakable Will', description: 'Total self-mastery and discipline', tier: 3, cost: 3, requires: ['d3', 'd4'] },
    ],
  },
  learning: {
    name: 'Learning',
    icon: 'BookOpen',
    color: '#06b6d4',
    glowClass: 'glow-cyan',
    skills: [
      { id: 'l1', name: 'Daily Reading', description: 'Read 30+ minutes every day', tier: 1, cost: 1, requires: [] },
      { id: 'l2', name: 'Note Taking', description: 'Document and organize knowledge', tier: 1, cost: 1, requires: [] },
      { id: 'l3', name: 'Skill Acquisition', description: 'Learn a new skill every quarter', tier: 2, cost: 2, requires: ['l1'] },
      { id: 'l4', name: 'Teaching Others', description: 'Share knowledge to deepen understanding', tier: 2, cost: 2, requires: ['l2'] },
      { id: 'l5', name: 'Polymath', description: 'Mastery across multiple domains', tier: 3, cost: 3, requires: ['l3', 'l4'] },
    ],
  },
};

export const CATEGORY_COLORS = {
  health: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', hex: '#10b981' },
  money: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', hex: '#f59e0b' },
  networking: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', hex: '#8b5cf6' },
  discipline: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', hex: '#ef4444' },
  learning: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', hex: '#06b6d4' },
};

export const DIFFICULTY_XP = {
  easy: 25,
  medium: 50,
  hard: 100,
};
