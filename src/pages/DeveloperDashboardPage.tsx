import { Link } from 'react-router-dom'

function DeveloperDashboardPage() {
  return (
    <div className="developer-dashboard-page">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">Welcome to Your Developer Dashboard</h1>
          <p className="dashboard-subtitle">
            Start by registering your game with the Hexagon platform
          </p>
        </div>

        <div className="dashboard-main-card">
          <h2 className="card-title">Add a New Game</h2>
          <p className="card-description">
            Register your game with Hexagon to reach thousands of players.
            Define achievements, metadata, and messaging configuration.
          </p>

          <div className="card-features">
            <div className="feature-item">
              <span>Register game metadata</span>
            </div>
            <div className="feature-item">
              <span>Define achievements</span>
            </div>
            <div className="feature-item">
              <span>Configure message queue</span>
            </div>
            <div className="feature-item">
              <span>Get API credentials</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/developer/games/new" className="btn btn-primary">
              Register Your Game
            </Link>
            <Link to="/developer/games" className="btn btn-secondary">
              Manage Games
            </Link>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-box">
            <h3>Quick Start</h3>
            <p>
              New to Hexagon? Check out our{' '}
              <a href="#" className="info-link">integration guide</a>{' '}
              to get started in minutes.
            </p>
          </div>
          <div className="info-box">
            <h3>Need Help?</h3>
            <p>
              Join our{' '}
              <a href="#" className="info-link">developer community</a>{' '}
              or reach out to{' '}
              <a href="#" className="info-link">support</a>.
            </p>
          </div>
        </div>
    </div>
  )
}

export default DeveloperDashboardPage
