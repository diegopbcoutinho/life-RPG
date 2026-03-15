// Web Audio API sound effects — no external files needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playQuestComplete() {
  playTone(523.25, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.12), 80);
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.12), 160);
}

export function playLevelUp() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.15), i * 120);
  });
  setTimeout(() => playTone(1046.5, 0.4, 'triangle', 0.1), 500);
}

export function playSkillUnlock() {
  playTone(440, 0.08, 'square', 0.08);
  setTimeout(() => playTone(554.37, 0.08, 'square', 0.08), 60);
  setTimeout(() => playTone(659.25, 0.15, 'square', 0.1), 120);
}

export function playBadgeUnlock() {
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.1), i * 100);
  });
}

export function playClick() {
  playTone(800, 0.03, 'square', 0.05);
}

export function playError() {
  playTone(200, 0.15, 'sawtooth', 0.08);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.06), 120);
}
