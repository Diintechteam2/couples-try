import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, CheckCircle, Lock, Shield } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import OrderSuccess from "./OrderSuccess";

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalOrderData, setModalOrderData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem("usertoken");
  const searchParams = new URLSearchParams(location.search);
  const orderId = location.state?.orderId || searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      // Check if this is a return from Paytm payment
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('status');
      const returnedOrderId = urlParams.get('orderId');
      const error = urlParams.get('error');
      const message = urlParams.get('message');
      
      if (paymentStatus && returnedOrderId === orderId) {
        if (paymentStatus === 'SUCCESS') {
          setPaymentStatus('SUCCESS');
          setError("");
          setModalOrderData({
            orderId: orderId,
            totalAmount: orderData?.totalAmount || 0,
            paymentMethod: 'online'
          });
          setShowSuccessModal(true);
        } else if (paymentStatus === 'FAILED') {
          setError(error || "Payment failed. Please try again.");
          setPaymentStatus('FAILED');
        } else if (paymentStatus === 'PENDING') {
          setError(message || "Payment is still pending. Please wait or try again.");
          setPaymentStatus('PENDING');
        }
        
        // Auto-check payment status to get full details
        setTimeout(() => {
          checkPaymentStatus();
        }, 1000);
      }
      
      // Auto-check payment status when component loads
      setTimeout(() => {
        checkPaymentStatus();
      }, 2000); // Check after 2 seconds
    } else {
      navigate("/auth/cart");
    }
  }, [orderId, navigate]);

  // Auto-check payment status every 30 seconds for pending payments
  // useEffect(() => {
  //   if (!orderId || !orderData) return;
    
  //        const interval = setInterval(async () => {
  //      try {
  //        const response = await axios.get(`${API_BASE_URL}/payment/status/${orderId}`, {
  //          headers: { Authorization: `Bearer ${token}` }
  //        });
         
  //        if (response.data.success) {
  //          const payment = response.data.payment;
  //          setPaymentStatus(payment.status);
  //          setPaymentDetails(payment);
           
  //          if (payment.status === "SUCCESS") {
  //            clearInterval(interval);
  //            setModalOrderData({
  //              orderId: orderId,
  //              totalAmount: orderData.totalAmount,
  //              paymentMethod: 'online'
  //            });
  //            setShowSuccessModal(true);
  //          }
  //        }
  //      } catch (error) {
  //        console.error("Auto-check payment status error:", error);
  //      }
  //    }, 30000); // Check every 30 seconds
    
  //   return () => clearInterval(interval);
  // }, [orderId, orderData, token, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrderData(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      
      // Initialize Paytm payment
      const response = await axios.post(`${API_BASE_URL}/payment/initialize`, {
        orderId: orderId,
        projectId:"couplestry"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Create a form and submit to Paytm
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.paytmUrl;

        Object.keys(response.data.paytmParams).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = response.data.paytmParams[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setError('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
          const response = await axios.get(`${API_BASE_URL}/payment/status/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
      
      // Save details for UI (includes customerEmail)
      if (response.data && response.data.success && response.data.payment) {
        setPaymentDetails(response.data.payment);
      }

      if (response.data.success && response.data.payment.status === "SUCCESS") {
        setModalOrderData({
          orderId: orderId,
          totalAmount: orderData.totalAmount,
          paymentMethod: 'online'
        });
        setShowSuccessModal(true);
      } else if (response.data.success && response.data.payment.status === "FAILED") {
        setError("Payment failed. Please try again.");
        } else if (response.data.success && response.data.payment.status === "PENDING") {
        setError("Payment is still pending. Please wait or try again.");
      }
    } 
    catch (error) {
      console.error("Error checking payment status:", error);
      setError("Failed to check payment status");
    }
  }

  // const verifyPayment = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("Verifying payment with:", {
  //       paytmorderId: orderData?.paytmorderId || orderId,
  //       orderId: orderId,
  //       token: token ? "Present" : "Missing"
  //     });
      
  //     const response = await axios.post(`${API_BASE_URL}/payment/verify`, {
  //       paytmorderId: orderData?.paytmorderId || orderId
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     console.log("Verify payment response:", response.data);
      
  //     if (response.data.success) {
  //       setError(""); // Clear any previous errors
  //       setPaymentStatus("SUCCESS");
  //       setPaymentDetails(response.data.payment || response.data);
        
  //       // Show success message for a few seconds before redirecting
  //       // setTimeout(() => {
  //       //   navigate('/auth/order-success', {
  //       //     state: { 
  //       //       orderData: {
  //       //         orderId: orderId,
  //       //         totalAmount: orderData.totalAmount,
  //       //         paymentMethod: paymentMethod
  //       //       }
  //       //     } 
  //       //   });
  //       // }, 3000); // Wait 3 seconds to show success message
  //     } else {
  //       setError(response.data.message || "Payment verification failed");
  //     }
  //   } 
  //   catch (error) {
  //     console.error("Payment verification error:", error);
  //     if (error.response) {
  //       console.error("Error response:", error.response.data);
  //       setError(`Verification failed: ${error.response.data.message || error.message}`);
  //     } else {
  //       setError("Failed to verify payment - Network error");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button 
            onClick={() => navigate("/auth/cart")}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Complete Payment</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Payment Status Display */}
        {paymentDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Payment Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    paymentStatus === "SUCCESS" ? "text-green-600" : 
                    paymentStatus === "FAILED" ? "text-red-600" : 
                    "text-orange-600"
                  }`}>
                    {paymentStatus === "SUCCESS" ? "✅ Payment Successful" :
                     paymentStatus === "FAILED" ? "❌ Payment Failed" :
                     "⏳ Payment Pending"}
                  </span>
                </div>
                
                {paymentDetails.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.transactionId}</span>
                  </div>
                )}
                
                {paymentDetails.paytmorderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paytm Order ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.paytmorderId}</span>
                  </div>
                )}
                
                {paymentDetails.paymentMode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Mode:</span>
                    <span className="font-medium">{paymentDetails.paymentMode}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {paymentDetails.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{paymentDetails.bankName}</span>
                  </div>
                )}
                
                {paymentDetails.responseCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Code:</span>
                    <span className="font-mono text-sm">{paymentDetails.responseCode}</span>
                  </div>
                )}
                
                {paymentDetails.responseMsg && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Message:</span>
                    <span className="font-medium">{paymentDetails.responseMsg}</span>
                  </div>
                )}
                
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-green-600">₹{paymentDetails.amount}</span>
                  </div>
                )}
              </div>
            </div>
            
            {paymentStatus === "SUCCESS" && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={16} />
                  <span className="font-medium">
                    Payment completed successfully! {paymentDetails?.customerEmail ? `Order confirmation will be sent to your email (${paymentDetails.customerEmail}).` : 'Order confirmation will be sent to your email.'} Redirecting to order success page...
                  </span>
                </div>
              </div>
            )}
            
            {/* Refresh Status Button */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={checkPaymentStatus}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "Refreshing..." : "🔄 Refresh Status"}
              </button>
              
              <span className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex gap-6">
          {/* Left Section - Order Details & Payment Options */}
          <div className="flex-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} />
                Order Summary
              </h2>
              
              {/* Order Items */}
              <div className="space-y-4">
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.type}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.product?.type}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Size: <span className="font-medium">{item.size}</span></p>
                        <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                        <p>Price: <span className="font-medium">₹{item.price}</span></p>
                        {item.product?.description && (
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
              {orderData.deliveryAddress ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="font-medium text-gray-900">{orderData.deliveryAddress.name}</p>
                  <p className="text-gray-600">{orderData.deliveryAddress.address}</p>
                  <p className="text-gray-600">{orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.pincode}</p>
                  <p className="text-gray-600">Mobile: {orderData.deliveryAddress.mobileNo}</p>
                </div>
              ) : (
                <p className="text-gray-500">No delivery address found</p>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Choose Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Paytm Payment Gateway</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <Shield size={16} />
                        <span className="text-xs">Secure</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Credit/Debit cards, UPI, Net Banking, Paytm Wallet</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Secure Payment</h3>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                    to protect your data during transmission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Payment Summary */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Summary
              </h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({orderData.items?.length || 0} items)</span>
                  <span className="font-medium">₹{orderData.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Charges</span>
                  <span className="font-medium">₹{(orderData.totalAmount * 0.18).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-pink-600">₹{orderData.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Order ID:</span> {orderData._id}</p>
                  <p><span className="font-medium">Order Date:</span> {new Date(orderData.orderDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-orange-600 font-medium">{orderData.status}</span></p>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full bg-pink-500 text-white py-4 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    {paymentMethod === "online" ? "PAY WITH PAYTM" : "PLACE ORDER (COD)"}
                  </>
                )}
              </button>
              
              {/* Check Payment Status Button */}
              {paymentMethod === "online" && (
                <button
                  onClick={checkPaymentStatus}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Check Payment Status
                </button>
              )}
              
              {/* Verify Payment Button */}
              {/* {paymentMethod === "paytm" && (
                <button
                  onClick={verifyPayment}
                  disabled={loading}
                  className="w-full mt-3 bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
                >
                  Verify Payment & Complete Order
                </button>
              )} */}
              
              {/* Payment Security */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>100% Secure Payment Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <OrderSuccess
          orderData={modalOrderData}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
