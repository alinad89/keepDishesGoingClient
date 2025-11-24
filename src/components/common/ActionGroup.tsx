import type { ReactNode } from 'react'
import './ActionGroup.css'

interface ActionGroupProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  direction?: 'row' | 'column'
}

export function ActionGroup({ children, align = 'left', direction = 'row' }: ActionGroupProps) {
  return (
    <div className={`action-group action-group-${direction} action-group-${align}`}>
      {children}
    </div>
  )
}
