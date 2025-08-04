import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from './config'

function App() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/dress/categories`)
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <Router> 
      <Navbar categories={categories} />
      <Routes>
        {/* Add your other routes here */}
        <Route path="/" index="/" element={<Home categories={categories} />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/all-products" element={<AllProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        {/* <Route path="/category/:categoryName/subcategory/:subcategoryName" element={<ProductList type="subcategory" />} /> */}
        <Route path="/category/:categoryName/subcategory/:subcategoryName/type/:typeName" element={<ProductList type="type" />} />
        <Route path="/category/:categoryName/type/:typeName" element={<ProductList type="type" />} />
      </Routes>
      <Footer categories={categories} />
    </Router>
  )
}

export default App
