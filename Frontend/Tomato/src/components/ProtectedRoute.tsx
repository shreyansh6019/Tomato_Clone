import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppData } from '../context/useAppData';

const ProtectedRoute = () => {
    const { isAuthenticated, user, loading } = useAppData();
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("User role:", user?.role, "Current path:", location.pathname);

    if (user?.role === "user" && location.pathname !== "/select-role") {
        return <Navigate to="/select-role" state={{ from: location }} replace />;
    }

    if (user?.role !== "user" && location.pathname === "/select-role") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;