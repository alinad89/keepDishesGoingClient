import './StatusBadge.css'

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'ready' | 'waiting' | 'active' | 'inactive'
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={`status-badge status-badge-${status}`}>
      {displayLabel}
    </span>
  )
}
