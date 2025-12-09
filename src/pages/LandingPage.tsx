import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

function LandingPage() {
    return (
        <div className="page-root">
            <main className="page-main">
                {/* CTA Section */}
                <section className="cta-section">
                    <div className="cta-card">
                        <h3 className="cta-title">Ready to Get Started?</h3>
                        <p className="cta-description">
                            Join Hexagon today and experience the future of gaming platforms.
                            Whether you&apos;re a player or a developer, we&apos;ve got you covered.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/games">
                                <Button variant="primary">Explore Games</Button>
                            </Link>
                            <Link to="/lobby">
                                <Button variant="secondary">Join a Lobby</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default LandingPage
