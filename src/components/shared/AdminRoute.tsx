import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * AdminRoute — restricts routes to admin users.
 *
 * Must be nested inside ProtectedRoute so a logged-in user is guaranteed
 * before the role check runs. Redirects non-admin users (customers) to
 * the product catalog instead of the login page.
 *
 * Routes guarded: /products/new, /products/:id/edit
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    // Logged-in customer — redirect to catalog instead of login
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
