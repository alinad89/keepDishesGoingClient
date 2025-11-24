import type { ReactNode } from 'react'
import './Grid.css'

interface GridProps {
  children: ReactNode
  columns?: 'auto' | 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  className?: string
}

export function Grid({ children, columns = 'auto', gap = 'medium', className = '' }: GridProps) {
  const classNames = [
    'grid',
    `grid-columns-${columns}`,
    `grid-gap-${gap}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      {children}
    </div>
  )
}
