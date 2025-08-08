import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ClientAuthLayout from './components/auth/ClientAuthLayout';
import ClientDashboard from './components/dashboards/ClientDashboard'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const clienttoken = sessionStorage.getItem('clienttoken');
      const clientData = sessionStorage.getItem('clientData');
      
      if (clienttoken && clientData) {
        try {
          const parsedclientData = JSON.parse(clientData);
          if (parsedclientData.role === 'admin') {
            setIsAuthenticated(true);
            // Update admin user data if needed
            sessionStorage.setItem('clientData', JSON.stringify({
              ...parsedclientData,
              name: parsedclientData.name
            }));
          } else {
            throw new Error('Invalid role');
          }
        } catch (error) {
          console.error('Error validating admin token:', error);
          clearAuth();
        }
      }
      
      setIsLoading(false);
      setIsAuthenticated(false);
    };
    
    initializeAuth();
  }, []);

  const clearAuth = () => {
    sessionStorage.removeItem('clienttoken');
    sessionStorage.removeItem('clientData');
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const handleAuthSuccess = (clientData) => {
    // Store admin token and user data
    sessionStorage.setItem('clienttoken', clientData.token);
    sessionStorage.setItem('clientData', JSON.stringify({
      role: clientData.role,
      name: clientData.name,
      email: clientData.email
    }));
    
    setIsAuthenticated(true);
    console.log("Admin authentication successful");
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
        <Routes>
        <Route path='/' element={<ClientAuthLayout onLogin={handleAuthSuccess}/>}/>
        {
            isAuthenticated?
            (
                <>
                <Route path='/dashboard' element={<ClientDashboard onLogout={handleLogout}/>}/>
                </>
            )
            :
            (
                <Route path='*' element={<ClientAuthLayout onLogin={handleAuthSuccess}/>}/>

            )
        }
        </Routes>
    </div>
  );
};

export default Admin;