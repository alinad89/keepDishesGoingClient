import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Snowfall from 'react-snowfall'
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
import RagManagementPage from './pages/RagManagementPage'
import { WinterModeProvider, useWinterMode } from './contexts/WinterModeContext'

function AppContent() {
  const { isWinterMode } = useWinterMode();

  console.log('[App] Winter mode:', isWinterMode);

  return (
    <BrowserRouter>
      {isWinterMode && (
        <>
          {console.log('[App] Rendering Snowfall')}
          <Snowfall
            snowflakeCount={200}
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          />
        </>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text)',
            border: '2px solid var(--accent)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--card-bg)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: 'var(--card-bg)',
            },
          },
        }}
      />
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

          {/* Admin routes - using main navbar instead of developer layout */}
          <Route path="/admin/games" element={
            <Protected requireRole="admin">
              <>
                <Navbar />
                <main className="main-container">
                  <ManageGamesPage />
                </main>
              </>
            </Protected>
          } />
          <Route path="/admin/games/new" element={
            <Protected requireRole="admin">
              <>
                <Navbar />
                <main className="main-container">
                  <CreateGamePage />
                </main>
              </>
            </Protected>
          } />
          <Route path="/admin/games/:id" element={
            <Protected requireRole="admin">
              <>
                <Navbar />
                <main className="main-container">
                  <GameDetailsPage />
                </main>
              </>
            </Protected>
          } />
          <Route path="/admin/games/:id/edit" element={
            <Protected requireRole="admin">
              <>
                <Navbar />
                <main className="main-container">
                  <EditGamePage />
                </main>
              </>
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

          {/* Admin RAG Management Route - Admin only with main navbar */}
          <Route path="/admin/rag" element={
            <Protected requireRole="admin">
              <>
                <Navbar />
                <main className="main-container">
                  <RagManagementPage />
                </main>
              </>
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

function App() {
  return (
    <WinterModeProvider>
      <AppContent />
    </WinterModeProvider>
  )
}

export default App
