import { Link } from 'react-router-dom'
import './DeveloperNavbar.css'

function DeveloperNavbar() {
  return (
    <nav className="developer-navbar">
      <div className="developer-navbar-container">
        <Link to="/developer/dashboard" className="developer-navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Hexagon Logo" style={{ height: '45px', width: 'auto' }} />
          <span>Hexagon Developer Console</span>
        </Link>

        <div className="developer-navbar-actions">
          <Link to="/developer/games" className="btn btn-secondary">
            Manage Games
          </Link>
          <Link to="/developer/games/new" className="btn btn-primary">
            Add a New Game
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default DeveloperNavbar
