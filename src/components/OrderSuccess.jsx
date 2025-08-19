import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, Truck, Home, List, X } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function OrderSuccess(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const providedOrderData = props?.orderData || location.state?.orderData || null;
  const [fetchedOrderData, setFetchedOrderData] = useState(null);

  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderIdFromQuery = urlParams.get('orderId');
  const amountFromQuery = urlParams.get('amount');
  const statusFromQuery = urlParams.get('status');

  useEffect(() => {
    if (providedOrderData) return;
    if (!orderIdFromQuery) return;

    let isActive = true;
    const token = localStorage.getItem("usertoken");

    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/${orderIdFromQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!isActive) return;
        if (res.data?.success && res.data?.order) {
          setFetchedOrderData({
            orderId: orderIdFromQuery,
            totalAmount: res.data.order.totalAmount ?? (amountFromQuery ? Number(amountFromQuery) : 0),
            paymentMethod: 'online',
          });
        } else {
          setFetchedOrderData({
            orderId: orderIdFromQuery,
            totalAmount: amountFromQuery ? Number(amountFromQuery) : 0,
            paymentMethod: 'online',
          });
        }
      } catch (err) {
        setFetchedOrderData({
          orderId: orderIdFromQuery,
          totalAmount: amountFromQuery ? Number(amountFromQuery) : 0,
          paymentMethod: 'online',
        });
      }
    })();

    return () => { isActive = false; };
  }, [providedOrderData, orderIdFromQuery, amountFromQuery]);

  const orderData = providedOrderData || fetchedOrderData;
  console.log(orderData)
  const handleClose = () => {
    if (props?.onClose) return props.onClose();
    // Fallback: go to home if we are on a dedicated route
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[100vh] overflow-y-auto text-center my-auto">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-9 h-9 bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <X size={18} />
        </button>
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order! We're excited to fulfill it for you.
        </p>

        {/* Order Details Card */}
        {orderData && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Order Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-mono font-medium text-gray-900">{orderData.orderId}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-green-600">₹{orderData.totalAmount?.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">{orderData.paymentMethod}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Truck size={20} />
            What Happens Next?
          </h3>
          <div className="text-left space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>We'll confirm your order and start processing it immediately</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>You'll receive order confirmation via email and SMS</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>We'll ship your order within 24-48 hours</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Track your order status in real-time</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/auth/cart")}
            className="bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          >
            <List size={18} />
            Back to Cart
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Home size={18} />
            Continue Shopping
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
          >
            <Package size={18} />
            Print Receipt
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>📧 support@couplestry.com</span>
            <span>📞 +91 98765 43210</span>
          </div>
        </div>
      </div>
    </div>
  );
}
