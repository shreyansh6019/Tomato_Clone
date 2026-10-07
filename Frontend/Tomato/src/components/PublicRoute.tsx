import { Navigate, Outlet} from 'react-router-dom';
import { useAppData } from '../context/useAppData';

const PublicRoute = () => {
    const { isAuthenticated, loading } = useAppData();

    if(loading) return null;

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;