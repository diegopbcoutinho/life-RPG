import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, Star, Zap } from 'lucide-react';
import { useGame } from '../store/gameStore';

const PARTICLE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899'];

function Particle({ delay, x, size = 'md' }) {
  const color = useMemo(() => PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)], []);
  const xDrift = useMemo(() => (Math.random() - 0.5) * 200, []);
  const sizeMap = { sm: 'w-1 h-1', md: 'w-2 h-2', lg: 'w-3 h-3' };

  return (
    <motion.div
      className={`absolute rounded-full ${sizeMap[size]}`}
      style={{ background: color, left: `${x}%`, bottom: '30%' }}
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -80, -180, -250],
        scale: [0, 1.5, 1, 0],
        x: [0, xDrift * 0.3, xDrift * 0.7, xDrift],
      }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
    />
  );
}

function Ring({ delay, color, size }) {
  return (
    <motion.div
      className="absolute rounded-full border-2"
      style={{ borderColor: color, width: size, height: size, left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{ scale: 0.3, opacity: 1 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
    />
  );
}

export default function LevelUpModal() {
  const { showLevelUp, newLevel, dispatch } = useGame();

  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.8,
      x: 5 + Math.random() * 90,
      size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)],
    })), []);

  const rings = useMemo(() => [
    { id: 0, delay: 0.1, color: '#3b82f680', size: 120 },
    { id: 1, delay: 0.3, color: '#8b5cf680', size: 160 },
    { id: 2, delay: 0.5, color: '#f59e0b60', size: 200 },
    { id: 3, delay: 0.7, color: '#10b98150', size: 240 },
  ], []);

  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => dispatch({ type: 'DISMISS_LEVEL_UP' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, dispatch]);

  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ background: 'rgba(0,0,0,0)' }}
            animate={{ background: 'rgba(0,0,0,0.8)' }}
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={() => dispatch({ type: 'DISMISS_LEVEL_UP' })}
          />

          {/* Full-screen radial flash */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />

          {/* Particles */}
          {particles.map(p => (
            <Particle key={p.id} delay={p.delay} x={p.x} size={p.size} />
          ))}

          {/* Central content */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Expanding rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {rings.map(r => <Ring key={r.id} {...r} />)}
            </div>

            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${20 + Math.random() * 60}%`, top: `${10 + Math.random() * 80}%` }}
                animate={{ y: [0, -20, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 2, delay: 0.5 + i * 0.2, repeat: Infinity }}
              >
                <Star size={12} className="text-accent-gold" fill="#f59e0b" />
              </motion.div>
            ))}

            {/* Main icon */}
            <motion.div
              className="relative mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-8"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #f59e0b)',
                boxShadow: '0 0 60px rgba(59,130,246,0.4), 0 0 120px rgba(139,92,246,0.2)',
              }}
              animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                <ChevronUp size={56} className="text-white" />
              </motion.div>
            </motion.div>

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2
                className="font-display text-4xl sm:text-5xl font-black text-white tracking-widest mb-2"
                style={{ textShadow: '0 0 30px rgba(59,130,246,0.5)' }}
              >
                LEVEL UP!
              </h2>

              <div className="flex items-center justify-center gap-3 mt-4">
                <Sparkles className="text-accent-gold" size={24} />
                <motion.span
                  className="font-display text-7xl font-black bg-gradient-to-r from-accent-blue via-accent-purple to-accent-gold bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5, stiffness: 300 }}
                >
                  {newLevel}
                </motion.span>
                <Sparkles className="text-accent-gold" size={24} />
              </div>

              <motion.div
                className="flex items-center justify-center gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="flex items-center gap-1 text-sm text-accent-gold">
                  <Star size={14} /> +1 Skill Point
                </span>
                <span className="flex items-center gap-1 text-sm text-accent-blue">
                  <Zap size={14} /> Stats Increased
                </span>
              </motion.div>

              <motion.button
                onClick={() => dispatch({ type: 'DISMISS_LEVEL_UP' })}
                className="mt-8 px-8 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 text-white text-sm font-display font-bold tracking-wider hover:bg-accent-blue/30 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
