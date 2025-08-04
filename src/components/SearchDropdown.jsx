import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config"
import axios from "axios"

export default function SearchDropdown({ 
  isOpen, 
  onClose, 
  position = "top", // "top" for navbar, "bottom" for bottomnav
  triggerRef = null 
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef(null)
  const searchDropdownRef = useRef(null)
  const navigate = useNavigate()

  // Focus search input when search modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Prevent closing on outside click or scroll and lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    
    // Lock body scroll to prevent background page scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    const stop = (e) => {
      if (searchDropdownRef.current && searchDropdownRef.current.contains(e.target)) return;
      // Do nothing (don't close)
    };
    document.addEventListener('mousedown', stop);
    document.addEventListener('touchstart', stop);
    window.addEventListener('scroll', stop, true);
    
    return () => {
      document.removeEventListener('mousedown', stop);
      document.removeEventListener('touchstart', stop);
      window.removeEventListener('scroll', stop, true);
      // Restore body scroll when search closes
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/dress/get`)
      if (response.data.success) {
        const allProducts = response.data.dresses
        const filtered = allProducts.filter(product => {
          const searchTerm = query.toLowerCase()
          return (
            product.type?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            product.subcategory?.toLowerCase().includes(searchTerm) ||
            product.price?.toString().includes(searchTerm)
          )
        })
        setSearchResults(filtered)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  const closeSearch = () => {
    onClose()
    setSearchQuery("")
    setSearchResults([])
  }

  // Calculate position based on trigger element
  const getPositionStyle = () => {
    if (position === "bottom") {
      return { bottom: '60px' }
    } else {
      // For top position (navbar)
      const topPosition = triggerRef?.current ? 
        triggerRef.current.getBoundingClientRect().bottom + window.scrollY : 120
      return { top: topPosition }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 w-full z-50" style={getPositionStyle()}>
      <div
        ref={searchDropdownRef}
        className={`mx-auto bg-white shadow-lg border-gray-200 rounded-xl ${
          position === "bottom" ? "border-t rounded-t-xl" : "border-b rounded-b-xl"
        }`}
        style={{
          width: '100%',
          maxWidth: window.innerWidth >= 768 ? (window.innerWidth >= 1024 ? 700 : 600) : '100%',
          minWidth: 0,
          position: 'relative',
          left: window.innerWidth >= 768 ? '0' : undefined,
          right: window.innerWidth >= 768 ? '0' : undefined,
        }}
      >
        {/* Search Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Search Products</h2>
          <button
            onClick={closeSearch}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by product name, brand, category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Search Results - Product Cards */}
        <div className="max-h-[45vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Searching...</p>
            </div>
          ) : searchQuery ? (
            searchResults.length > 0 ? (
              <div className="p-4">
                {/* Results Header */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    Found {searchResults.length} results for "{searchQuery}"
                  </h3>
                </div>
                {/* Product Cards Grid - responsive small cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                  {searchResults.slice(0, 8).map((product) => {
                    const discount = product.originalPrice ? 
                      Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
                    return (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/product/${product._id}`)
                          closeSearch()
                        }}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                          <img 
                            src={product.imageUrl} 
                            alt={product.type} 
                            className="w-full h-full object-fill" 
                          />
                          {discount && (
                            <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                              {discount}%
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="text-xs text-gray-500 mb-1 font-semibold">{product.brand}</div>
                          <h3 className="font-medium text-xs mb-1 line-clamp-2">{product.type}</h3>
                          {product.subcategory && (
                            <div className="text-xs text-blue-600 mb-1">{product.subcategory}</div>
                          )}
                          <div className="flex items-center gap-1 mb-1">
                            <span className="font-bold text-sm text-pink-700">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                          <div className="text-xs text-green-700 font-semibold">Free Delivery</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* No More Results Message */}
                {searchResults.length <= 8 && searchResults.length > 0 && (
                  <div className="text-center mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Showing all {searchResults.length} results</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">No products found</p>
                <p className="text-xs text-gray-500 mt-1">Try searching with different keywords</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-700">Start typing to search</p>
              <p className="text-xs text-gray-500 mt-1">Search by product name, brand, or category</p>
            </div>
          )}
        </div>
        
        {/* View All Products Button - Always visible at bottom */}
        {searchQuery && searchResults.length > 8 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <Link
              to="/all-products"
              onClick={closeSearch}
              className="block w-full text-center bg-[#d6668c] text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-[#FFB3C1] transition-all duration-200"
            >
              VIEW ALL PRODUCTS ({searchResults.length})
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 