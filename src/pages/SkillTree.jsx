import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Star, GitBranch, Heart, DollarSign, Users, Flame, BookOpen, Zap } from 'lucide-react';
import { useGame } from '../store/gameStore';
import { SKILL_BRANCHES } from '../data/skillTreeData';
import { playSkillUnlock, playError } from '../data/sounds';

const branchIcons = {
  health: Heart,
  money: DollarSign,
  networking: Users,
  discipline: Flame,
  learning: BookOpen,
};

export default function SkillTreePage() {
  const { skillPoints, unlockedSkills, dispatch } = useGame();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const canUnlock = (skill) => {
    if (unlockedSkills.includes(skill.id)) return false;
    if (skillPoints < skill.cost) return false;
    return skill.requires.every(req => unlockedSkills.includes(req));
  };

  const isLocked = (skill) => {
    if (unlockedSkills.includes(skill.id)) return false;
    return !skill.requires.every(req => unlockedSkills.includes(req));
  };

  const handleUnlock = (skill) => {
    if (!canUnlock(skill)) { playError(); return; }
    dispatch({ type: 'UNLOCK_SKILL', payload: skill.id, cost: skill.cost });
    playSkillUnlock();
    setSelectedSkill(null);
  };

  const branchEntries = Object.entries(SKILL_BRANCHES);
  const BRANCH_WIDTH = 200;
  const NODE_SIZE = 80;
  const TIER_GAP = 120;
  const totalWidth = branchEntries.length * BRANCH_WIDTH;
  const svgHeight = 480;

  // Compute node positions
  const nodePositions = {};
  branchEntries.forEach(([key, branch], branchIdx) => {
    const centerX = branchIdx * BRANCH_WIDTH + BRANCH_WIDTH / 2;
    [1, 2, 3].forEach(tier => {
      const tierSkills = branch.skills.filter(s => s.tier === tier);
      const tierWidth = tierSkills.length * (NODE_SIZE + 20);
      tierSkills.forEach((skill, i) => {
        const x = centerX - tierWidth / 2 + i * (NODE_SIZE + 20) + (NODE_SIZE + 20) / 2;
        const y = 60 + (tier - 1) * TIER_GAP + TIER_GAP / 2;
        nodePositions[skill.id] = { x, y };
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <GitBranch size={28} className="text-accent-purple" /> Skill Tree
          </h1>
          <p className="text-slate-400 text-sm mt-1">Unlock abilities across all branches. Scroll to explore.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card-glass rounded-lg px-4 py-2 flex items-center gap-2">
            <Star size={16} className="text-accent-gold" />
            <span className="text-sm font-mono text-accent-gold">{skillPoints} SP</span>
          </div>
          <div className="card-glass rounded-lg px-3 py-2 text-xs text-slate-400">
            {unlockedSkills.length}/{Object.values(SKILL_BRANCHES).reduce((a, b) => a + b.skills.length, 0)}
          </div>
        </div>
      </div>

      {/* Scrollable Skill Map */}
      <div className="card-glass rounded-xl overflow-x-auto overflow-y-hidden">
        <div style={{ minWidth: totalWidth + 40, padding: '20px' }}>
          {/* Branch Headers */}
          <div className="flex">
            {branchEntries.map(([key, branch]) => {
              const Icon = branchIcons[key];
              const count = branch.skills.filter(s => unlockedSkills.includes(s.id)).length;
              return (
                <div key={key} className="text-center" style={{ width: BRANCH_WIDTH }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon size={16} style={{ color: branch.color }} />
                    <span className="font-display text-xs font-bold tracking-wide" style={{ color: branch.color }}>
                      {branch.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600">{count}/{branch.skills.length}</p>
                </div>
              );
            })}
          </div>

          {/* SVG Canvas */}
          <svg width={totalWidth} height={svgHeight} className="mt-2">
            {/* Connectors */}
            {branchEntries.map(([key, branch]) =>
              branch.skills.map(skill =>
                skill.requires.map(reqId => {
                  const from = nodePositions[reqId];
                  const to = nodePositions[skill.id];
                  if (!from || !to) return null;
                  const bothUnlocked = unlockedSkills.includes(reqId) && unlockedSkills.includes(skill.id);
                  const oneUnlocked = unlockedSkills.includes(reqId);
                  return (
                    <motion.line
                      key={`${reqId}-${skill.id}`}
                      x1={from.x} y1={from.y + NODE_SIZE / 2 - 8}
                      x2={to.x} y2={to.y - NODE_SIZE / 2 + 8}
                      stroke={bothUnlocked ? branch.color : oneUnlocked ? branch.color + '60' : branch.color + '15'}
                      strokeWidth={bothUnlocked ? 3 : 1.5}
                      strokeDasharray={bothUnlocked ? '0' : '6 4'}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                  );
                })
              )
            )}

            {/* Animated energy pulses */}
            {branchEntries.map(([key, branch]) =>
              branch.skills.map(skill =>
                skill.requires.map(reqId => {
                  const from = nodePositions[reqId];
                  const to = nodePositions[skill.id];
                  if (!from || !to) return null;
                  if (!unlockedSkills.includes(reqId) || !unlockedSkills.includes(skill.id)) return null;
                  return (
                    <motion.circle
                      key={`pulse-${reqId}-${skill.id}`}
                      r={3}
                      fill={branch.color}
                      initial={{ cx: from.x, cy: from.y + NODE_SIZE / 2 - 8, opacity: 0 }}
                      animate={{
                        cx: [from.x, to.x],
                        cy: [from.y + NODE_SIZE / 2 - 8, to.y - NODE_SIZE / 2 + 8],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    />
                  );
                })
              )
            )}

            {/* Skill Nodes */}
            {branchEntries.map(([key, branch]) =>
              branch.skills.map(skill => {
                const pos = nodePositions[skill.id];
                if (!pos) return null;
                const unlocked = unlockedSkills.includes(skill.id);
                const available = canUnlock(skill);
                const locked = isLocked(skill);
                const selected = selectedSkill?.id === skill.id;
                const half = NODE_SIZE / 2;

                return (
                  <g key={skill.id}>
                    {available && (
                      <motion.circle
                        cx={pos.x} cy={pos.y} r={half + 8}
                        fill="none" stroke={branch.color} strokeWidth={1.5}
                        animate={{ r: [half + 5, half + 15, half + 5], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {selected && (
                      <motion.rect
                        x={pos.x - half - 4} y={pos.y - half - 4}
                        width={NODE_SIZE + 8} height={NODE_SIZE + 8} rx={14}
                        fill="none" stroke={branch.color} strokeWidth={2}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      />
                    )}

                    <motion.rect
                      x={pos.x - half} y={pos.y - half}
                      width={NODE_SIZE} height={NODE_SIZE} rx={12}
                      fill={unlocked ? branch.color + '20' : available ? branch.color + '10' : '#ffffff05'}
                      stroke={unlocked ? branch.color + '80' : available ? branch.color + '40' : '#ffffff15'}
                      strokeWidth={unlocked ? 2 : 1}
                      className="cursor-pointer"
                      onClick={() => setSelectedSkill(selected ? null : skill)}
                      whileHover={{ scale: locked ? 1 : 1.08 }}
                      whileTap={{ scale: locked ? 1 : 0.95 }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: locked ? 0.4 : 1 }}
                      transition={{ duration: 0.4, delay: skill.tier * 0.1 }}
                    />

                    <foreignObject x={pos.x - half} y={pos.y - half} width={NODE_SIZE} height={NODE_SIZE} className="pointer-events-none">
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        {unlocked ? (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: branch.color + '30' }}>
                            <Check size={12} style={{ color: branch.color }} />
                          </div>
                        ) : locked ? (
                          <Lock size={14} className="text-slate-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center" style={{ borderColor: branch.color + '60' }}>
                            <Zap size={10} style={{ color: branch.color }} />
                          </div>
                        )}
                        <span className={`text-[9px] font-medium text-center leading-tight px-1 ${unlocked ? 'text-white' : locked ? 'text-slate-600' : 'text-slate-300'}`}>
                          {skill.name}
                        </span>
                      </div>
                    </foreignObject>

                    <rect
                      x={pos.x - half} y={pos.y - half}
                      width={NODE_SIZE} height={NODE_SIZE}
                      fill="transparent" className="cursor-pointer"
                      onClick={() => setSelectedSkill(selected ? null : skill)}
                    />
                  </g>
                );
              })
            )}
          </svg>
        </div>
      </div>

      {/* Skill Detail Panel */}
      <AnimatePresence>
        {selectedSkill && (() => {
          const branchKey = Object.entries(SKILL_BRANCHES).find(([, b]) => b.skills.some(s => s.id === selectedSkill.id))?.[0];
          const branch = SKILL_BRANCHES[branchKey];
          if (!branch) return null;
          return (
            <motion.div
              className="card-glass rounded-xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: branch.color + '20' }}>
                      {unlockedSkills.includes(selectedSkill.id) ? <Check size={14} style={{ color: branch.color }} /> : <Zap size={14} style={{ color: branch.color }} />}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedSkill.name}</h3>
                      <span className="text-[10px] font-medium capitalize" style={{ color: branch.color }}>{branch.name}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{selectedSkill.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-500">Tier {selectedSkill.tier}</span>
                    <span className="text-xs text-slate-500">Cost: {selectedSkill.cost} SP</span>
                    {selectedSkill.requires.length > 0 && (
                      <span className="text-xs text-slate-500">
                        Requires: {selectedSkill.requires.map(r => branch.skills.find(s => s.id === r)?.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                {unlockedSkills.includes(selectedSkill.id) ? (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium shrink-0" style={{ backgroundColor: branch.color + '20', color: branch.color }}>Unlocked</span>
                ) : canUnlock(selectedSkill) ? (
                  <motion.button
                    onClick={() => handleUnlock(selectedSkill)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${branch.color}, ${branch.color}cc)` }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Unlock ({selectedSkill.cost} SP)
                  </motion.button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-500 text-xs shrink-0">
                    {skillPoints < selectedSkill.cost ? 'Need more SP' : 'Prerequisites locked'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
