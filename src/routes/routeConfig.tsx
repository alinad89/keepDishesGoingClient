import type { ReactNode } from 'react';
import LandingPage from '../pages/LandingPage';
import GamesPage from '../pages/GamesPage';
import LobbyPage from '../pages/LobbyPage';
import FriendsPage from '../pages/FriendsPage';
import AchievementsPage from '../pages/AchievementsPage';
import DeveloperPage from '../pages/DeveloperPage';
import DeveloperDashboardPage from '../pages/DeveloperDashboardPage';
import { CreateGamePage } from '../pages/CreateGamePage';
import ManageGamesPage from '../pages/ManageGamesPage';
import GameDetailsPage from '../pages/GameDetailsPage';
import EditGamePage from '../pages/EditGamePage';
import AuthLanding from '../pages/AuthLanding';
import AuthCallback from '../pages/AuthCallback';
import GameLibraryPage from "../pages/GameLibraryPage.tsx";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  protected?: boolean;
}

export interface AuthRouteConfig {
  path: string;
  element: ReactNode;
}

export interface DeveloperRouteConfig {
  path: string;
  element: ReactNode;
}

export interface PublicRouteConfig {
  path: string;
  element: ReactNode;
}

export const authRoutes: AuthRouteConfig[] = [
  {
    path: '/auth',
    element: <AuthLanding />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
];

export const developerRoutes: DeveloperRouteConfig[] = [
  {
    path: '/developer/dashboard',
    element: <DeveloperDashboardPage />,
  },
  {
    path: '/developer/games',
    element: <ManageGamesPage />,
  },
  {
    path: '/developer/games/new',
    element: <CreateGamePage />,
  },
  {
    path: '/developer/games/:id',
    element: <GameDetailsPage />,
  },
  {
    path: '/developer/games/:id/edit',
    element: <EditGamePage />,
  },
];

export const publicRoutes: PublicRouteConfig[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/games',
    element: <GamesPage />,
  },
  {
    path: '/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/friends',
    element: <FriendsPage />,
  },
  {
    path: '/achievements',
    element: <AchievementsPage />,
  },
  {
    path: '/developer',
    element: <DeveloperPage />,
  },
  {
    path: '/library',
    element: <GameLibraryPage />
  }
];
