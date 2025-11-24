import type { ReactNode } from 'react'
import DeveloperNavbar from '../components/DeveloperNavbar'
import './DeveloperDashboardLayout.css'

interface DeveloperDashboardLayoutProps {
  children: ReactNode
}

function DeveloperDashboardLayout({ children }: DeveloperDashboardLayoutProps) {
  return (
    <div className="developer-dashboard-layout">
      <DeveloperNavbar />
      <main className="developer-main-container">
        {children}
      </main>
    </div>
  )
}

export default DeveloperDashboardLayout
