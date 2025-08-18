import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import UserDashboard from "./components/dashboards/UserDashboard";
import Mycart from "./components/Mycart";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";

const User = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const usertoken = localStorage.getItem("usertoken");
      const userData = localStorage.getItem("userData");

      if (usertoken && userData) {
        try {
          const parseduserData = JSON.parse(userData);
          if (parseduserData.role === "user") {
            setIsAuthenticated(true);
            // Update user data if needed
            localStorage.setItem(
              "userData",
              JSON.stringify({
                ...parseduserData,
                name: parseduserData.name,
              })
            );
          } else {
            throw new Error("Invalid role");
          }
        } catch (error) {
          console.error("Error validating user token:", error);
          clearAuth();
        }
      } else {
        // No token or user data, user is not authenticated
        setIsAuthenticated(false);
      }
      
      console.log(usertoken);
      console.log(userData);

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const handleAuthSuccess = (userData) => {
    // Store admin token and user data
    localStorage.setItem("usertoken", userData.token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        role: userData.role,
        name: userData.name,
        email: userData.email,
      })
    );

    setIsAuthenticated(true);
    console.log("User authentication successful");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/login");
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
        <Route path="/" element={<AuthLayout onLogin={handleAuthSuccess} />} />
        {isAuthenticated ? (
          <>
            {/* <Route path='/dashboard' element={<UserDashboard onLogout={handleLogout}/>}/> */}
            <Route path="/cart" element={<Mycart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
          </>
        ) : (
          <Route
            path="*"
            element={<AuthLayout onLogin={handleAuthSuccess} />}
          />
        )}
      </Routes>
    </div>
  );
};

export default User;
