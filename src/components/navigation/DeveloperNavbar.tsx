import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import WinterToggleButton from '../ui/WinterToggleButton'
import './Navbar.css'
import './DeveloperNavbar.css'

function DeveloperNavbar() {
  const { username, userEmail, logout, accountManagement } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/developer/dashboard" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/images/hexagon-platform-logo.png" alt="Hexagon Logo" style={{ height: '50px', width: 'auto' }} />
          <span>Hexagon Developer Console</span>
        </Link>

        <div className="navbar-menu">
          <ul className="navbar-links">
            <li>
              <Link to="/developer/games">
                Manage Games
              </Link>
            </li>
            <li>
              <Link to="/developer/games/new">
                Add New Game
              </Link>
            </li>
          </ul>

          {/* Winter Mode Toggle */}
          <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <WinterToggleButton />
          </div>

          {/* User Info and Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
              {username || userEmail || 'User'}
            </span>
            <button
              onClick={accountManagement}
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Account
            </button>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DeveloperNavbar
