import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import GoogleLoginModal from "./GoogleLoginModal";

// AddressForm component defined outside main component
const AddressForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
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

export default function Mycart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("usertoken");

  // Check if user is authenticated
  const isAuthenticated = !!token;

  // Fetch cart items
  const fetchCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/clients/CLI746136Q0EY/user/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cart fetch response:", response.data);

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          "Failed to load cart: " + (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.response?.status === 401) {
        setError("Please login to view your cart");
      } else {
        setError("Failed to load cart: " + (err.message || "Network error"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle successful login
  const handleLoginSuccess = async () => {
    console.log("Login successful, fetching cart...");
    // Close the modal
    setShowLoginModal(false);
    // Fetch cart items after successful login
    await fetchCart();
  };

  // Update cart item quantity
  const updateCartItem = async (dressId, size, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      await removeCartItem(dressId, size);
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await axios.patch(
        `${API_BASE_URL}/clients/CLI746136Q0EY/user/cart/items`,
        {
          dressId,
          size,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update cart response:", response.data);

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          "Failed to update cart: " + (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update cart: " + (err.message || "Network error"));
    } finally {
      setUpdating(false);
    }
  };

  // Remove cart item
  const removeCartItem = async (dressId, size) => {
    try {
      setUpdating(true);
      setError("");

      const response = await axios.delete(
        `${API_BASE_URL}/clients/CLI746136Q0EY/user/cart/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { dressId, size },
        }
      );

      console.log("Remove cart response:", response.data);

      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setError(
          "Failed to remove item: " + (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError("Failed to remove item: " + (err.message || "Network error"));
    } finally {
      setUpdating(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await axios.delete(
        `${API_BASE_URL}/clients/CLI746136Q0EY/user/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Clear cart response:", response.data);

      if (response.data.success) {
        setCart(response.data.cart);
        alert("Cart cleared successfully!");
      } else {
        setError(
          "Failed to clear cart: " + (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart: " + (err.message || "Network error"));
    } finally {
      setUpdating(false);
    }
  };

  // Calculate cart totals
  const calculateTotals = () => {
    if (!cart || !cart.items) return { totalItems: 0, totalAmount: 0 };

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );

    return { totalItems, totalAmount };
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/mobile/user/checkout-ready`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Checkout readiness response:", response.data);
      if (response.data.success) {
        if (response.data.canCheckout) {
          navigate("/checkout",{
            state:{
              productData:{
                ...cart.items
              }
            }
          });
        } else {
          setShowAddressForm(true);
        }
      }
    } 
    catch (error) {
      console.error("Error checking checkout readiness:", error);
      setError(
        "Failed to check checkout readiness: " +
          (error.message || "Network error")
      );
    }
  };

    const handleAddressSave = async (addressData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/clients/CLI746136Q0EY/mobile/user/address`, {
        address: addressData.address,
        city: addressData.city,
        pincode: addressData.pincode,
        state: addressData.state,
        landmark: addressData.landmark,
        mobileNo: addressData.mobileNo
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Address save response:", response.data);
      if (response.data.success) {
        alert("Address saved successfully!");
        setShowAddressForm(false); // Close the modal on success
        // Re-check checkout readiness after saving address
        handleCheckout();
      } else {
        setError("Failed to save address: " + (response.data.message || "Unknown error"));
      }
    } 
    catch (error) {
      console.error("Error saving address:", error);
      setError("Failed to save address: " + (error.message || "Network error"));
    }
  }

  // Load cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your cart.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Login with Google
          </button>
        </div>

        {/* Google Login Modal */}
        <GoogleLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          productInfo={null} // No specific product for cart login
        />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-pink-500 mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const { totalItems, totalAmount } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">My Cart</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Empty Cart */}
        {(!cart || cart.items.length === 0) && (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cart && cart.items.length > 0 && (
          <div className="flex gap-6">
            {/* Left Section - Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cart Items ({totalItems})
                    </h2>
                    <button
                      onClick={clearCart}
                      disabled={updating}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                         onClick={() => navigate(`/product/${item.product._id}`)}>
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.type || "Product"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.log("Image failed to load:", item.product.imageUrl);
                                e.target.style.display = "none";
                                // Show fallback image
                                const fallback = e.target.nextElementSibling;
                                if (fallback) {
                                  fallback.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          {/* Fallback image when main image fails or doesn't exist */}
                          <div
                            className="w-full h-full bg-gray-300 flex items-center justify-center"
                            style={{
                              display: item.product?.imageUrl ? "none" : "flex",
                            }}
                          >
                            <div className="text-center">
                              <ShoppingCart size={20} className="text-gray-400 mx-auto mb-1" />
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 cursor-pointer"
                           onClick={() => navigate(`/product/${item.product._id}`)}>
                            {item.product?.type || "Product"}
                          </h3>
                          <div className="space-y-1 mb-3">
                            <p className="text-sm text-gray-600">
                              Size: <span className="font-medium">{item.size}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Color: <span className="font-medium">Multicolor</span>
                            </p>
                          </div>
                          
                          {/* Price Display */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{item.priceAtAdd}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{(item.priceAtAdd * 1.2).toFixed(0)}
                            </span>
                            <span className="text-sm text-green-600 font-medium">
                              {Math.round(20)}% Off
                            </span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.product._id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              disabled={updating}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItem(
                                  item.product._id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              disabled={updating}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Right Side Actions */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              removeCartItem(item.product._id, item.size)
                            }
                            disabled={updating}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            REMOVE
                          </button>
                          
                          {/* Delivery Info */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Delivery by</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-100 text-gray-700 py-3 px-8 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Right Section - Price Details */}
            <div className="w-4/12 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  PRICE DETAILS
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price ({totalItems} items)</span>
                    <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">
                      - ₹{(totalAmount * 0.2).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">₹{(totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-pink-600">
                      ₹{(totalAmount * 0.98).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    You will save ₹{(totalAmount * 0.22).toFixed(2)} on this order
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={updating || cart.items.length === 0}
                  className="w-full bg-pink-500 text-white py-4 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
                >
                  PROCEED TO CHECKOUT
                </button>
                
                {/* Security Message */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Safe and Secure Payments. Easy returns.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {updating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <Loader2
                size={32}
                className="animate-spin text-pink-500 mx-auto mb-4"
              />
              <p className="text-gray-600">Updating cart...</p>
            </div>
          </div>
        )}
      </div>

      {showAddressForm && (
        <AddressForm
          onSubmit={handleAddressSave}
          onCancel={() => setShowAddressForm(false)}
        />
      )}
    </div>
  );
}
