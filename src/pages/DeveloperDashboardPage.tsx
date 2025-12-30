import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

function DeveloperDashboardPage() {
  const { userEmail, username, logout, accountManagement } = useAuth()

  return (
    <div className="developer-dashboard-page">
        {/* User Info Card */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                  Welcome back, {username || 'Developer'}!
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
                  {userEmail || 'No email available'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={accountManagement}
                  startIcon={<ManageAccountsIcon />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Manage Account
                </Button>
                <Button
                  variant="contained"
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <div className="dashboard-hero">
          <h1 className="dashboard-title">Developer Dashboard</h1>
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
