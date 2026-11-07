import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export function ProtectedRoute({ children }) {
  const isAuthenticated = Cookies.get('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}