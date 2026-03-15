import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';

export default function XPBar({ className = '' }) {
  const { level, xpIntoCurrentLevel, xpNeeded, xpProgress } = useGame();

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-400">Level {level} Progress</span>
        <span className="text-xs font-mono text-accent-blue">
          {xpIntoCurrentLevel} / {xpNeeded} XP
        </span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
            backgroundSize: '200% auto',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div
            className="absolute inset-0 rounded-full progress-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              backgroundSize: '200% auto',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
