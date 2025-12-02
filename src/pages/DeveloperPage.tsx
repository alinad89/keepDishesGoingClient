import { useNavigate } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { useEffect } from 'react'
import Button from '../components/Button'
import { isDeveloper } from '../utils/keycloakRoles'

function DeveloperPage() {
    const { keycloak, initialized } = useKeycloak()
    const navigate = useNavigate()

    // Redirect to dashboard if already a developer
    useEffect(() => {
        if (initialized && keycloak.authenticated && isDeveloper(keycloak)) {
            navigate('/developer/dashboard')
        }
    }, [initialized, keycloak.authenticated, keycloak, navigate])

    // Handle login
    const handleLogin = () => {
        const redirectUri = `${window.location.origin}/auth/callback`
        keycloak.login({ redirectUri })
    }

    // Handle developer registration
    const handleRegister = () => {
        const redirectUri = `${window.location.origin}/auth/callback?role=developer`
        keycloak.register({ redirectUri })
    }

    return (
        <div className="page-root">
            <main className="page-main">
                <div
                    style={{
                        minHeight: '60vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}
                >
                    {initialized && keycloak.authenticated ? (
                        // User is logged in but not a developer
                        <div style={{ textAlign: 'center' }}>
                            <h2>You're not registered as a developer yet</h2>
                            <p>Contact an administrator to get developer access</p>
                        </div>
                    ) : (
                        // User is not logged in
                        <>
                            <h2>Developer Portal</h2>
                            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                <Button variant="primary" onClick={handleLogin} disabled={!initialized}>
                                    Login as Developer
                                </Button>
                                <Button variant="secondary" onClick={handleRegister} disabled={!initialized}>
                                    Register as Developer
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default DeveloperPage
