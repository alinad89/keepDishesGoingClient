import type { ReactNode } from 'react'
import './PageContainer.css'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: 'narrow' | 'normal' | 'wide' | 'full'
}

export function PageContainer({ children, maxWidth = 'normal' }: PageContainerProps) {
  return (
    <div className={`page-container page-container-${maxWidth}`}>
      {children}
    </div>
  )
}
