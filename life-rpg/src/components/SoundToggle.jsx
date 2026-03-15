export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className="stat-pill border border-white/10 bg-white/5 transition hover:border-white/20"
    >
      Sound {enabled ? 'On' : 'Off'}
    </button>
  )
}
