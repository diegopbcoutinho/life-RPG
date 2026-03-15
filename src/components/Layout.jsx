import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, LayoutDashboard, ScrollText, GitBranch, Wallet,
  ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { useGame } from '../store/gameStore';
import { CHARACTER_CLASSES } from '../data/classes';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'quests', label: 'Quests', icon: ScrollText },
  { id: 'skills', label: 'Skill Tree', icon: GitBranch },
  { id: 'character', label: 'Character', icon: User },
  { id: 'wealth', label: 'Wealth', icon: Wallet },
];

export default function Layout({ activePage, onNavigate, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { playerName, playerClass, level, xpProgress, stats } = useGame();
  const cls = playerClass ? CHARACTER_CLASSES[playerClass] : null;

  return (
    <div className="flex h-screen bg-bg-primary bg-grid">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-screen flex flex-col border-r border-white/5 bg-bg-secondary/80 backdrop-blur-xl relative z-20"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center glow-blue shrink-0">
            <Swords size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display font-bold text-sm tracking-wider text-white whitespace-nowrap"
              >
                LIFE RPG
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Player Badge */}
        <div className="px-3 py-4 border-b border-white/5">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{
                background: cls
                  ? `linear-gradient(135deg, ${cls.color}, ${cls.color}aa)`
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              }}
            >
              {level}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs text-slate-400 truncate">{playerName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {cls && <span className="text-[9px] font-medium" style={{ color: cls.color }}>{cls.name}</span>}
                    {stats.currentStreak > 0 && (
                      <span className="text-[9px] text-accent-red font-mono">{stats.currentStreak}d</span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: cls
                          ? `linear-gradient(90deg, ${cls.color}, ${cls.color}88)`
                          : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${active
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  } ${collapsed ? 'justify-center' : ''}`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-blue rounded-r"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-2 mb-3 p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition flex items-center justify-center"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </motion.aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="p-6 lg:p-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
