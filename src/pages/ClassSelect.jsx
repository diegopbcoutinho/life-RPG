import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Wand2, Eye, ShieldCheck, ChevronRight } from 'lucide-react';
import { useGame } from '../store/gameStore';
import { CHARACTER_CLASSES, STAT_LABELS } from '../data/classes';
import { playClick } from '../data/sounds';

const classIcons = { Sword, Wand2, Eye, ShieldCheck };

export default function ClassSelect() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');

  const handleConfirm = () => {
    if (!selected) return;
    if (name.trim()) dispatch({ type: 'SET_NAME', payload: name.trim() });
    dispatch({ type: 'SET_CLASS', payload: selected });
    playClick();
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex items-center justify-center p-4">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <div className="text-center mb-10">
          <motion.h1
            className="font-display text-4xl sm:text-5xl font-black text-white tracking-wider mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-gold bg-clip-text text-transparent">
              LIFE RPG
            </span>
          </motion.h1>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Choose your path. Your class determines bonus XP for certain categories.
          </motion.p>
        </div>

        {/* Name Input */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-xs text-slate-500 mb-1.5 block text-center">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 transition font-medium"
          />
        </motion.div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.values(CHARACTER_CLASSES).map((cls, i) => {
            const Icon = classIcons[cls.icon];
            const isSelected = selected === cls.id;
            return (
              <motion.button
                key={cls.id}
                onClick={() => { setSelected(cls.id); playClick(); }}
                className={`relative card-glass rounded-xl p-5 text-left transition-all duration-300 ${
                  isSelected ? 'ring-2' : 'hover:bg-bg-card-hover'
                }`}
                style={isSelected ? { ringColor: cls.color, borderColor: cls.color + '60' } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ boxShadow: `0 0 30px ${cls.color}25, inset 0 0 30px ${cls.color}08` }}
                    layoutId="class-glow"
                  />
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `linear-gradient(135deg, ${cls.color}30, ${cls.color}10)` }}
                >
                  <Icon size={24} style={{ color: cls.color }} />
                </div>

                <h3 className="font-display text-sm font-bold text-white tracking-wide">{cls.name}</h3>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: cls.color }}>{cls.title}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cls.description}</p>

                {/* Stats */}
                <div className="mt-3 space-y-1">
                  {Object.entries(cls.stats).map(([stat, val]) => (
                    <div key={stat} className="flex items-center gap-2">
                      <span className="text-[9px] font-mono w-6" style={{ color: STAT_LABELS[stat].color }}>
                        {STAT_LABELS[stat].label}
                      </span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: STAT_LABELS[stat].color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(val / 10) * 100}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 w-3">{val}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <motion.div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: cls.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <ChevronRight size={12} className="text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleConfirm}
            disabled={!selected}
            className={`px-8 py-3 rounded-xl font-display text-sm font-bold tracking-wider transition ${
              selected
                ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white glow-blue hover:brightness-110'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
            whileHover={selected ? { scale: 1.03 } : {}}
            whileTap={selected ? { scale: 0.97 } : {}}
          >
            BEGIN ADVENTURE
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
