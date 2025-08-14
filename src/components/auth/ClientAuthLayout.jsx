import { useState } from 'react';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import ClientLoginForm from './ClientLoginForm';
import ClientRegisterForm from './ClientRegisterForm';

const ClientAuthLayout = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();

  const switchToRegister = () => {
    setAuthMode('register');
    navigate('/admin/register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
    navigate('/admin/login');
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
    navigate('/admin/login');
  };

  const handleLoginSuccess = (loginData) => {
    onLogin(loginData);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Secured access for administrators</p>
        </div>

        <Routes>
          <Route path="/login" element={
            <ClientLoginForm 
              onLogin={handleLoginSuccess} 
              switchToRegister={switchToRegister} 
            />
          } />
          <Route path="/register" element={
            <ClientRegisterForm 
              onSuccess={handleRegisterSuccess} 
              switchToLogin={switchToLogin} 
            />
          } />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="text-center">
            {authMode === 'login' ? (
              <div className="mt-4">
                <p className="text-gray-600">Need to create an account?</p>
                <Link 
                  to="/admin/register" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToRegister}
                >
                  Register as Admin
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-gray-600">Already have an account?</p>
                <Link 
                  to="/admin/login" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToLogin}
                >
                  Log in as Admin
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Link to="/admin" className="text-gray-500 hover:text-gray-700">
              Return to main login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuthLayout; 