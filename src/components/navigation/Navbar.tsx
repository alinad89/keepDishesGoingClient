import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { keycloak, initialized } = useKeycloak()

  useEffect(() => {
    // Always set dark mode
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/lobby', label: 'Lobby' },
    { path: '/friends', label: 'Friends' },
    { path: '/achievements', label: 'Achievements' },
    { path: '/developer', label: 'Developers' },
  ]

  const handleLogin = () => {
    // Redirect to auth callback with player role
    const redirectUri = `${window.location.origin}/auth/callback?role=player`
    keycloak.login({ redirectUri })
  }

  const handleLogout = () => {
    const redirectUri = window.location.origin
    keycloak.logout({ redirectUri })
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/images/hexagon-platform-logo.png" alt="Hexagon Logo" style={{ height: '50px', width: 'auto' }} />
          <span>Hexagon</span>
        </Link>

        <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Authentication Button */}
          <div className="navbar-auth">
            {initialized && (
              <>
                {keycloak.authenticated ? (
                  <div className="navbar-user">
                    <span className="user-name">
                      {keycloak.tokenParsed?.preferred_username || 'User'}
                    </span>
                    <button onClick={handleLogout} className="btn-logout">
                      Logout
                    </button>
                  </div>
                ) : (
                  <button onClick={handleLogin} className="btn-login">
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
