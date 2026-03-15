import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Target, Trophy, Star, Zap } from 'lucide-react';
import { useGame } from '../store/gameStore';
import { BADGES, RARITY_COLORS } from '../data/badges';

const icons = { Flame, Target, Trophy, Star, Zap };

export default function BadgeNotification() {
  const { showBadge, dispatch } = useGame();

  const badge = showBadge ? BADGES.find(b => b.id === showBadge) : null;
  const rarity = badge ? RARITY_COLORS[badge.rarity] : null;
  const Icon = badge ? (icons[badge.icon] || Award) : Award;

  useEffect(() => {
    if (showBadge) {
      const timer = setTimeout(() => dispatch({ type: 'DISMISS_BADGE' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [showBadge, dispatch]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed top-6 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div
            className={`card-glass rounded-xl p-4 border-2 ${rarity.border}`}
            style={{ boxShadow: `0 0 30px ${badge.color}30` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${badge.color}30, ${badge.color}10)` }}
              >
                <Icon size={24} style={{ color: badge.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-medium text-accent-gold">
                  Badge Unlocked!
                </p>
                <p className="text-white font-semibold text-sm truncate">{badge.name}</p>
                <p className="text-slate-400 text-xs truncate">{badge.description}</p>
              </div>
              <span className={`text-[9px] uppercase tracking-wider font-bold ${rarity.text}`}>
                {badge.rarity}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
