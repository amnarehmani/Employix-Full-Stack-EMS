import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

const ProtectedRoute = ({ roles }) => {
  const { user, booting } = useAuth();

  if (booting) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Loading Employix...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
