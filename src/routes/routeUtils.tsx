import { Route } from 'react-router-dom';
import { Protected } from './Protected';
import DeveloperDashboardLayout from '../layouts/DeveloperDashboardLayout';
import type { AuthRouteConfig, DeveloperRouteConfig, PublicRouteConfig } from './routeConfig';

export function renderAuthRoutes(routes: AuthRouteConfig[]) {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ));
}

export function renderDeveloperRoutes(routes: DeveloperRouteConfig[]) {
  return routes.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Protected>
          <DeveloperDashboardLayout>
            {route.element}
          </DeveloperDashboardLayout>
        </Protected>
      }
    />
  ));
}

export function renderPublicRoutes(routes: PublicRouteConfig[]) {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ));
}
