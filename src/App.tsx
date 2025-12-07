import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import GamesPage from './pages/GamesPage'
import LobbyPage from './pages/LobbyPage'
import InvitationsPage from './pages/InvitationsPage'
import FriendsPage from './pages/FriendsPage'
import AchievementsPage from './pages/AchievementsPage'
import DeveloperPage from './pages/DeveloperPage'
import DeveloperDashboardPage from './pages/DeveloperDashboardPage'
import { CreateGamePage } from './pages/CreateGamePage'
import ManageGamesPage from './pages/ManageGamesPage'
import GameDetailsPage from './pages/GameDetailsPage'
import EditGamePage from './pages/EditGamePage'
import DeveloperDashboardLayout from './layouts/DeveloperDashboardLayout'
import AuthLanding from './pages/AuthLanding'
import AuthCallback from './pages/AuthCallback'
import { Protected } from './routes/Protected'
import { ChatBox } from './components/ChatBox'
import './App.css'

function App() {
  // Note: User registration is now handled in AuthCallback page
  // based on their role (developer vs player)

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/auth" element={<AuthLanding />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Developer Dashboard Routes - Protected with authentication */}
          <Route path="/developer/dashboard" element={
            <Protected>
              <DeveloperDashboardLayout>
                <DeveloperDashboardPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games" element={
            <Protected>
              <DeveloperDashboardLayout>
                <ManageGamesPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/new" element={
            <Protected>
              <DeveloperDashboardLayout>
                <CreateGamePage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/:id" element={
            <Protected>
              <DeveloperDashboardLayout>
                <GameDetailsPage />
              </DeveloperDashboardLayout>
            </Protected>
          } />
          <Route path="/developer/games/:id/edit" element={
            <Protected>
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
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/lobby" element={<LobbyPage />} />
                  <Route path="/invitations" element={<InvitationsPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
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
