import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Movies from './components/Movies';
import TV from './components/TV';
import Suggest from './components/Suggest';
import Login from './components/Login';



const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    fetch('/api/checkAuth')
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error checking authentication status:", error);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const MainApp: React.FC = () => {
    const location = useLocation();
  
    return (
      <>
        {location.pathname !== "/login" && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/movies" element={<PrivateRoute><Movies /></PrivateRoute>} />
          <Route path="/tv" element={<PrivateRoute><TV /></PrivateRoute>} />
          <Route path="/suggest" element={<PrivateRoute><Suggest /></PrivateRoute>} />
        </Routes>
      </>
    );
  }
  
  const App: React.FC = () => {
    return (
      <Router>
        <MainApp />
      </Router>
    );
  }
  
  export default App;
