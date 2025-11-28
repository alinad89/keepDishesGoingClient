import { Link } from 'react-router-dom'
import './Navbar.css'
import './DeveloperNavbar.css'

function DeveloperNavbar() {
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
        </div>
      </div>
    </nav>
  )
}

export default DeveloperNavbar
