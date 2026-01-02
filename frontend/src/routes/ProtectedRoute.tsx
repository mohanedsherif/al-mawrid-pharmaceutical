import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthed = useAppSelector((state) => Boolean(state.auth.accessToken));

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;



