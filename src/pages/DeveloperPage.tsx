import { Link } from 'react-router-dom'
import Button from '../components/Button'

function DeveloperPage() {
    return (
        <div className="page-root">
            <main className="page-main">
                <div
                    style={{
                        minHeight: '60vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Link to="/developer/dashboard">
                        <Button variant="primary">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default DeveloperPage
