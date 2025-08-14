import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AddressForm from "./Addressform";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [user,setUser]=useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from navigation state or URL params
  const productData = location.state?.productData;
  const token = localStorage.getItem("usertoken");
  console.log(productData)
  useEffect(() => {
    if (productData) {
      // Generate order summary for single product
      generateOrderSummary();
    } else {
      // Get order summary from cart
      fetchOrderSummary();
    }
  }, [productData]);

  const generateOrderSummary = () => {
    if (!productData) return;
    
    const summary = {
      items: [{
        product: productData,
        quantity: productData.quantity,
        size: productData.selectedSize || "M",
        price: productData.price
      }],
      subtotal: (productData.price)*(productData.quantity),
      delivery: 0, // Free delivery
      taxes: (productData.price)*(productData.quantity)* 0.18,
      total: (productData.price)*(productData.quantity)* 1.18
    };
    setOrderSummary(summary);
  };

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrderSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching order summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        items: orderSummary.items,
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        totalAmount: orderSummary.total
      };

      const response = await axios.post(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Navigate to order confirmation
        console.log(response.data)
        if(paymentMethod === "online")
        {
          navigate("/payment", { 
            state: { orderId: response.data.orderId } 
          });
        }
        else {
          navigate("/order-success", { 
            state: { 
              orderData: {
                orderId: response.data.orderId,
                totalAmount: orderSummary.total,
                paymentMethod: paymentMethod
              }
            } 
          })
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
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
        // Refresh user profile to get the updated address
        await fetchUserProfile();
      } else {
        alert("Failed to save address: " + (response.data.message || "Unknown error"));
      }
    } 
    catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address: " + (error.message || "Network error"));
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response  = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/mobile/user/userprofile`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })  
      if(response.data.success)
      {
        console.log("userprofile",response.data);
        setUser(response.data.user)
        setDeliveryAddress(response.data.user.shippingAddress)
      }
      
    } 
    catch (error) {
      console.log(error)
    }
  }
useEffect(()=>{
 fetchUserProfile();
},[])

console.log(deliveryAddress)


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Section - Product Details & Checkout Info */}
          <div className="flex-1 space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                Product Details
              </h2>
              
              {/* Items */}
              <div className="space-y-4">
                {orderSummary?.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.type}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.product.type}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Size: <span className="font-medium">{item.size}</span></p>
                        <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                        <p>Price: <span className="font-medium">₹{item.price}</span></p>
                        {item.product.description && (
                          <p className="text-gray-500">{item.product.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} />
                Delivery Address
              </h2>
              {deliveryAddress ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="font-medium text-gray-900">{deliveryAddress.name}</p>
                  <p className="text-gray-600">{deliveryAddress.address}</p>
                  <p className="text-gray-600">{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pincode}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">No delivery address found</p>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="text-pink-500 hover:text-pink-600 font-medium"
                  >
                    Add Delivery Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-500"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-500"
                    // disabled
                  />
                  <div>
                    <span className="font-medium">Online Payment</span>
                    <p className="text-sm text-gray-500">Credit/Debit cards, UPI, Net Banking (Coming Soon)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Section - Price Details & Order Summary */}
          <div className="w-4/12 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({orderSummary?.items[0]?.quantity || 0} items)</span>
                  <span className="font-medium">₹{orderSummary?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Charges</span>
                  <span className="font-medium">₹{orderSummary?.taxes?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-pink-600">₹{orderSummary?.total?.toFixed(2)}</span>
                </div>
                <p className="text-sm text-green-600 mt-1 text-center">
                  You save ₹{((orderSummary?.subtotal * 0.2) || 0).toFixed(2)} on this order
                </p>
              </div>

              {/* Delivery Estimate */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-blue-800">
                  <Truck size={16} />
                  <span className="text-sm font-medium">Estimated Delivery</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !deliveryAddress}
                className="w-full bg-pink-500 text-white py-4 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {loading ? "Processing..." : "PLACE ORDER"}
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