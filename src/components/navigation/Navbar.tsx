import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import './Navbar.css'
import {useMyLobbyInvitations} from "../../hooks/useLobbies.ts";
import WinterToggleButton from '../ui/WinterToggleButton';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { keycloak, initialized } = useKeycloak()
  const { invitations } = useMyLobbyInvitations()

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

  // Only show invitation badge when user is authenticated
  const invitationCount = keycloak.authenticated ? invitations.length : 0

  // Check if user is admin or developer
  const isAdmin = keycloak.authenticated && keycloak.hasRealmRole('admin')
  const isDeveloper = keycloak.authenticated && keycloak.hasRealmRole('developer')

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/lobby', label: 'Lobby' },
    { path: '/invitations', label: 'My Invitations', badge: invitationCount > 0 ? invitationCount : undefined },
    { path: '/friends', label: 'Friends' },
    { path: '/achievements', label: 'Achievements' },
    { path: '/developer', label: 'Developers' },
  ]

  // Add Game Management link for admins and developers
  if (isAdmin || isDeveloper) {
    navLinks.push({ path: '/developer/games', label: isAdmin ? 'Manage Games (Admin)' : 'My Games' })
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
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  {link.label}
                  {link.badge && link.badge > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-12px',
                      background: 'var(--accent)',
                      color: 'var(--bg)',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Winter Mode Toggle */}
          <div style={{ marginRight: '1rem' }}>
            <WinterToggleButton />
          </div>

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
                  <Link to="/auth">
                    <button className="btn-login">
                      Login
                    </button>
                  </Link>
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
