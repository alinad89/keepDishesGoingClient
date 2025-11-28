import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import GamesPage from './pages/GamesPage'
import LobbyPage from './pages/LobbyPage'
import FriendsPage from './pages/FriendsPage'
import AchievementsPage from './pages/AchievementsPage'
import DeveloperPage from './pages/DeveloperPage'
import DeveloperDashboardPage from './pages/DeveloperDashboardPage'
import { CreateGamePage } from './pages/CreateGamePage'
import ManageGamesPage from './pages/ManageGamesPage'
import GameDetailsPage from './pages/GameDetailsPage'
import EditGamePage from './pages/EditGamePage'
import DeveloperDashboardLayout from './layouts/DeveloperDashboardLayout'
import { ChatBox } from './components/ChatBox'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Developer Dashboard Routes - With developer navbar */}
          <Route path="/developer/dashboard" element={
            <DeveloperDashboardLayout>
              <DeveloperDashboardPage />
            </DeveloperDashboardLayout>
          } />
          <Route path="/developer/games" element={
            <DeveloperDashboardLayout>
              <ManageGamesPage />
            </DeveloperDashboardLayout>
          } />
          <Route path="/developer/games/new" element={
            <DeveloperDashboardLayout>
              <CreateGamePage />
            </DeveloperDashboardLayout>
          } />
          <Route path="/developer/games/:id" element={
            <DeveloperDashboardLayout>
              <GameDetailsPage />
            </DeveloperDashboardLayout>
          } />
          <Route path="/developer/games/:id/edit" element={
            <DeveloperDashboardLayout>
              <EditGamePage />
            </DeveloperDashboardLayout>
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
