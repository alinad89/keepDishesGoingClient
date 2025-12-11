import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import { ChatBox } from './components/ChatBox'
import { authRoutes, developerRoutes, publicRoutes } from './routes/routeConfig'
import { renderAuthRoutes, renderDeveloperRoutes, renderPublicRoutes } from './routes/routeUtils'
import './App.css'
import InvitationsPage from "./pages/InvitationsPage.tsx";

function App() {
  // Note: User registration is now handled in AuthCallback page
  // based on their role (developer vs player)

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Authentication Routes */}
          {renderAuthRoutes(authRoutes)}

          {/* Developer Dashboard Routes - Protected with authentication */}
          {renderDeveloperRoutes(developerRoutes)}

          {/* Main App Routes - With main navbar */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="main-container">
                <Routes>
                  {renderPublicRoutes(publicRoutes)}
                  <Route path="/invitations" element={<InvitationsPage />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>

        {/* Global Chat Widget */}
        <ChatBox />
      </div>
    </BrowserRouter>
  )
}

export default App
