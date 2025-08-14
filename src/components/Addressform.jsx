import React, { useState } from 'react'

export default function AddressForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
      address: '',
      city: '',
      pincode: '',
      state: '',
      landmark: '',
      mobileNo: ''
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Call the onSubmit prop with the form data
        onSubmit(formData);
      } catch (error) {
        console.error('Address save error:', error);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl text-center font-bold mb-4 text-pink-500">First Fill Your Profile Completely</h2>
          <h3 className="text-md font-semibold mb-4 text-center">Enter Your Address</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (House No, Street, Area)</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                required
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City/Town</label>
              <input 
                type="text" 
                id="city" 
                name="city" 
                required
                value={formData.city} 
                onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input 
                type="text" 
                id="pincode" 
                name="pincode" 
                required
                value={formData.pincode} 
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input 
                type="text" 
                id="state" 
                name="state" 
                value={formData.state} 
                onChange={(e) => setFormData({ ...formData, state: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark (Optional)</label>
              <input 
                type="text" 
                id="landmark" 
                name="landmark" 
                value={formData.landmark} 
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile No</label>
              <input 
                type="text" 
                id="mobileNo" 
                name="mobileNo" 
                required
                value={formData.mobileNo} 
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border" 
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={onCancel} 
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
