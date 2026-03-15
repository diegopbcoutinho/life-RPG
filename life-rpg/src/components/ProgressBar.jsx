export default function ProgressBar({ value, colorClass }) {
  const clamped = Math.min(Math.max(value || 0, 0), 1)
  return (
    <div className="progress-track">
      <div
        className={`progress-fill ${colorClass}`}
        style={{ width: `${Math.round(clamped * 100)}%` }}
      />
    </div>
  )
}
