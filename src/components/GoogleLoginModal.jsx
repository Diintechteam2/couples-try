import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const GoogleLoginModal = ({ isOpen, onClose, onLoginSuccess, productInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.post(`${API_BASE_URL}/clients/CLI746136Q0EY/mobile/user/google-login`, {
        token: credentialResponse.credential,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      // Store user data
      localStorage.setItem('usertoken', response.data.jwt_token || response.data.token);
      localStorage.setItem('userData', JSON.stringify({
        role: "user",
        name: response.data.user?.name || response.data.name,
        email: response.data.user?.email || response.data.email,
        clientId: response.data.user?.clientId || response.data.clientId,
        id: response.data.user?._id || response.data.id
      }));

      // Call success callback with product info to continue cart process
      onLoginSuccess(productInfo);
      onClose();
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign In was unsuccessful. Please try again.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Login to Continue</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Product Info */}
        {productInfo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-pink-500" size={20} />
              <div>
                <p className="text-sm text-gray-600 mb-1">You're adding to cart:</p>
                <p className="font-medium text-gray-900">{productInfo.type}</p>
                <p className="text-sm text-gray-600">Size: {productInfo.size} | Qty: {productInfo.quantity}</p>
              </div>
            </div>
          </div>
        )}

        {/* Google Login */}
        <div className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            Sign in with Google to add this item to your cart
          </p>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="signin_with"
              theme="filled_blue"
              shape="rectangular"
              size="large"
              logo_alignment="center"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Logging you in...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginModal;
