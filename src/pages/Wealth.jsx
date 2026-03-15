import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Crown, ArrowUp } from 'lucide-react';
import { useGame, getWealthLevel } from '../store/gameStore';

const WEALTH_TIERS = [
  { level: 1, name: 'Broke', min: 0, color: '#6b7280' },
  { level: 2, name: 'Surviving', min: 500, color: '#78716c' },
  { level: 3, name: 'Stable', min: 1500, color: '#a3a3a3' },
  { level: 4, name: 'Comfortable', min: 3000, color: '#a8a29e' },
  { level: 5, name: 'Prosperous', min: 5000, color: '#d97706' },
  { level: 6, name: 'Wealthy', min: 8000, color: '#f59e0b' },
  { level: 7, name: 'Rich', min: 15000, color: '#fbbf24' },
  { level: 8, name: 'Affluent', min: 30000, color: '#fcd34d' },
  { level: 9, name: 'Elite', min: 60000, color: '#fde68a' },
  { level: 10, name: 'Legendary', min: 100000, color: '#fef3c7' },
];

export default function Wealth() {
  const { monthlyIncome, wealthLevel, dispatch } = useGame();
  const [inputValue, setInputValue] = useState(monthlyIncome.toString());
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'SET_INCOME', payload: inputValue });
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
          <Wallet size={28} className="text-accent-gold" /> Wealth Level
        </h1>
        <p className="text-slate-400 text-sm mt-1">Track your income and level up your financial status.</p>
      </div>

      {/* Main Wealth Card */}
      <motion.div
        className="card-glass rounded-xl p-6 sm:p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Gold ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Level Badge */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 flex flex-col items-center justify-center glow-gold shrink-0">
            <Crown size={24} className="text-amber-900 mb-1" />
            <span className="font-display text-3xl font-black text-amber-900">{wealthLevel.level}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-xl font-bold text-amber-400 text-glow-gold tracking-wide">
                {wealthLevel.name}
              </h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Monthly Income: <span className="text-white font-mono">${monthlyIncome.toLocaleString()}</span>
            </p>

            {/* Progress to next */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>${wealthLevel.min?.toLocaleString()}</span>
                <span className="text-amber-400">{Math.round(wealthLevel.progress * 100)}%</span>
                <span>${wealthLevel.nextMin?.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${wealthLevel.progress * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <div
                    className="absolute inset-0 rounded-full progress-shimmer"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      backgroundSize: '200% auto',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Income Input */}
      <motion.div
        className="card-glass rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-accent-gold" /> Update Monthly Income
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="number"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setEditing(true); }}
              placeholder="Monthly income..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition font-mono"
            />
          </div>
          <motion.button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              editing
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-900 hover:brightness-110'
                : 'bg-white/5 text-slate-500'
            }`}
            whileHover={editing ? { scale: 1.02 } : {}}
            whileTap={editing ? { scale: 0.98 } : {}}
          >
            Save
          </motion.button>
        </div>
      </motion.div>

      {/* Wealth Tiers */}
      <motion.div
        className="card-glass rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-semibold text-sm mb-4">Wealth Tiers</h3>
        <div className="space-y-2">
          {WEALTH_TIERS.map((tier, i) => {
            const reached = monthlyIncome >= tier.min;
            const current = wealthLevel.level === tier.level;
            return (
              <motion.div
                key={tier.level}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  current ? 'bg-amber-500/10 border border-amber-500/20' : reached ? 'bg-white/[0.02]' : 'opacity-40'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: reached ? 1 : 0.4, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                    reached ? 'text-amber-900' : 'text-slate-600'
                  }`}
                  style={{ backgroundColor: reached ? tier.color : 'rgba(255,255,255,0.05)' }}
                >
                  {tier.level}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${current ? 'text-amber-400' : reached ? 'text-slate-300' : 'text-slate-600'}`}>
                    {tier.name}
                  </span>
                </div>
                <span className={`text-xs font-mono ${reached ? 'text-slate-400' : 'text-slate-600'}`}>
                  ${tier.min.toLocaleString()}/mo
                </span>
                {current && (
                  <ArrowUp size={14} className="text-amber-400" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
