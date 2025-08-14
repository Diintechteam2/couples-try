import { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaIdCard, FaGlobe, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';

const RegisterForm = ({ onSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');
  const [logoFileName, setLogoFileName] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = 'user/register';
      const clientId = 'CLI746136Q0EY';
      const response = await axios.post(`${API_BASE_URL}/clients/${clientId}/mobile/${endpoint}`, formData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      // Show success message and switch to login
      setError('');
      onSuccess();
      alert(`User registration successful! You can now log in.`);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const renderUserFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaUser className="mr-2 text-gray-500" /> Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaEnvelope className="mr-2 text-gray-500" /> Email
        </label>
        <input
          type="email"
          name="email"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaLock className="mr-2 text-gray-500" /> Password
        </label>
        <input
          type="password"
          name="password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Create a password"
        />
      </div>
      
    </div>
  );


  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Create Your Account
        </h2>
        <p className="text-lg text-gray-600">
          Join our community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderUserFields()}
        

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={switchToLogin}
            className="text-sm text-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 