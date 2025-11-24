import type { ReactNode } from 'react'
import './InfoBox.css'

interface InfoBoxProps {
  title?: string
  children: ReactNode
  variant?: 'default' | 'accent'
}

export function InfoBox({ title, children, variant = 'default' }: InfoBoxProps) {
  return (
    <div className={`info-box info-box-${variant}`}>
      {title && <h4 className="info-box-title">{title}</h4>}
      <div className="info-box-content">{children}</div>
    </div>
  )
}
