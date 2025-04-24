import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // or return a loading spinner component
    }
    
    if (isAuthenticated) {
        return <Outlet />;
    }
    
    return <Navigate to="/auth/login" />;
}

export default ProtectedRoute;