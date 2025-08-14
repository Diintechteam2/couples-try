import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import HeroSection from './components/HeroSection'
import CategoryGrid from './components/CategoryGrid'
import ProductSection from './components/ProductSection'
import Footer from './components/Footer'
import ProductList from './components/ProductList'
import CategoryPage from './components/CategoryPage'
import AllProductsPage from './components/AllProductsPage'
import ProductDetail from './components/ProductDetail'
import Home from './components/Home'
import ScrollToTop from './components/ScrollToTop'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from './config'
import Admin from './Admin'
import User from './User'
import Mycart from './components/Mycart'
import Checkout from './components/Checkout'
import Payment from './components/Payment'
import OrderSuccess from './components/OrderSuccess'

function AppContent() {
  const [categories, setCategories] = useState([])
  const location = useLocation()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/clients/CLI746136Q0EY/dress/categories`
        )
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [])

  // Check if current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isUserRoute = location.pathname.startsWith('/auth')


  return (isAdminRoute) ? (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  ): (isUserRoute) ?
  (<Routes>
    <Route path="/auth/*" element={<User />} />
  </Routes>): (
    <>
      <Navbar categories={categories} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home categories={categories} />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/all-products" element={<AllProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Mycart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess/>} />

        <Route
          path="/category/:categoryName/subcategory/:subcategoryName/type/:typeName"
          element={<ProductList type="type" />}
        />
        <Route
          path="/category/:categoryName/type/:typeName"
          element={<ProductList type="type" />}
        />
      </Routes>
      <Footer categories={categories} />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
