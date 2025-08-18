import { useState } from 'react';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthLayout = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();

  const switchToRegister = () => {
    setAuthMode('register');
    navigate('/auth/register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
    navigate('/auth/login');
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
    navigate('/auth/login');
  };

  const handleLoginSuccess = (loginData) => {
    onLogin(loginData);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">User Portal</h1>
        </div>

        <Routes>
          <Route path="/login" element={
            <LoginForm
              onLogin={handleLoginSuccess} 
              switchToRegister={switchToRegister} 
            />
          } />
          <Route path="/register" element={
            <RegisterForm 
              onSuccess={handleRegisterSuccess} 
              switchToLogin={switchToLogin} 
            />
          } />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="text-center">
            {authMode === 'login' ? (
              <div className="mt-4">
                <p className="text-gray-600">Need to create an account?</p>
                
                <Link 
                  to="/auth/register" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToRegister}
                >
                  Register as New User
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-gray-600">Already have an account?</p>
                <Link 
                  to="/auth/login" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToLogin}
                >
                  Log in as User
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-gray-500 hover:text-gray-700">
              Return to main login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 