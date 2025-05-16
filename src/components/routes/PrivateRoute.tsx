import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NotFound } from '../../pages/NotFound/NotFound';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <NotFound />;
  }

  if (requireAdmin && (!user?.is_staff && !user?.is_superuser)) {
    return <NotFound />;
  }

  return <>{children}</>;
}; 