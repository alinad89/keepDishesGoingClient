import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import './LandingPage.css'

function LandingPage() {
    return (
        <div className="page-root">
            <main className="page-main landing-main">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">HEXAGON</h1>
                        <p className="hero-subtitle">
                            Play. Compete. Connect.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/games">
                                <Button variant="primary">Browse Games</Button>
                            </Link>
                            <Link to="/auth">
                                <Button variant="secondary">Sign In</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3 className="feature-title">Multiplayer Lobbies</h3>
                            <p className="feature-description">
                                Create or join game lobbies. Invite friends and compete in real-time matches.
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Track Progress</h3>
                            <p className="feature-description">
                                Unlock achievements, view match history, and see how you stack up.
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Connect with Friends</h3>
                            <p className="feature-description">
                                Add friends, send invitations, and build your gaming network.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default LandingPage
