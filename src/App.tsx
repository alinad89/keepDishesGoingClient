import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import { ChatBox } from './components/ChatBox'
import { authRoutes, developerRoutes, publicRoutes } from './routes/routeConfig'
import { renderAuthRoutes, renderDeveloperRoutes, renderPublicRoutes } from './routes/routeUtils'
import './App.css'
import DeveloperDashboardLayout from './layouts/DeveloperDashboardLayout'
import { Protected } from './routes/Protected'
import InvitationsPage from "./pages/InvitationsPage.tsx";
import DeveloperDashboardPage from "./pages/DeveloperDashboardPage.tsx";
import ManageGamesPage from "./pages/ManageGamesPage.tsx";
import {CreateGamePage} from "./pages/CreateGamePage.tsx";
import GameDetailsPage from "./pages/GameDetailsPage.tsx";
import EditGamePage from './pages/EditGamePage.tsx'

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
          <Route path="/developer/dashboard" element={
            <Protected requireRole={['developer', 'admin']}>
              <DeveloperDashboardLayout>
                <DeveloperDashboardPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games" element={
            <Protected requireRole={['developer', 'admin']}>
              <DeveloperDashboardLayout>
                <ManageGamesPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/new" element={
            <Protected requireRole={['developer', 'admin']}>
              <DeveloperDashboardLayout>
                <CreateGamePage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/:id" element={
            <Protected requireRole={['developer', 'admin']}>
              <DeveloperDashboardLayout>
                <GameDetailsPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/:id/edit" element={
            <Protected requireRole={['developer', 'admin']}>
              <DeveloperDashboardLayout>
                <EditGamePage />
              </DeveloperDashboardLayout>
            </Protected>
          } />

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
