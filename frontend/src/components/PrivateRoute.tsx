import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    path: string;
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, path }) => {
    const [loading, setLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/checkAuth')
            .then(res => res.json())
            .then(data => {
                setAuthStatus(data.authenticated);
                setLoading(false);
                if (!data.authenticated) {
                    navigate('/login');
                }
            });
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    return authStatus ? <Route path={path}>{children}</Route> : null;
}

export default PrivateRoute;
