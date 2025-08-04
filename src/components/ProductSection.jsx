import { useState, useRef, useEffect } from "react"
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { API_BASE_URL } from "../config"
import axios from "axios"

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("hot-sellers")
  const [dresses, setDresses] = useState([])
  const scrollContainerRef = useRef(null)

  const fetchDresses = async () => {
    const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/dress/get`)
    console.log(response.data)
    if(response.data.success){
      setDresses(response.data.dresses)
    }
  }
  
  useEffect(()=>{
    fetchDresses()
  },[])

  const filteredProducts = dresses.filter(product => product.category)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 // w-80 = 320px
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 // w-80 = 320px
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
    }
  }

  return (
    <section className="w-full bg-white py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex bg-gray-100 rounded-lg lg:rounded-xl p-1 md:p-2">
            <button
              onClick={() => setActiveTab("hot-sellers")}
              className={`px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 md:py-3 lg:py-4 rounded-md lg:rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-medium lg:font-semibold transition-all duration-200 ${
                activeTab === "hot-sellers"
                  ? "bg-[#d6668c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              Hot Sellers
            </button>
            <button
              onClick={() => setActiveTab("just-arrived")}
              className={`px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 md:py-3 lg:py-4 rounded-md lg:rounded-lg text-xs sm:text-sm md:text-base lg:text-lg font-medium lg:font-semibold transition-all duration-200 ${
                activeTab === "just-arrived"
                  ? "bg-[#d6668c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              Just Arrived
            </button>
          </div>
        </div>

        {/* Product Cards - Mobile & Tablet Grid */}
        <div className="block lg:hidden bg-[#e6f7f3] rounded-2xl p-2 pt-4">
          {/* First Row */}
          <div className="mb-4">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
              {filteredProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="flex-shrink-0 w-[calc(50vw-24px)] sm:w-[calc(50vw-20px)] md:w-[calc(25vw-25px)] bg-white rounded-xl shadow p-2 flex flex-col items-start">
                  <div className="w-full h-32 sm:h-28 md:h-32 mb-2 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate mb-1">{product.type.length > 20 ? product.type.slice(0, 20) + '...' : product.type}</div>
                    <div className="text-[11px] sm:text-[13px] font-bold text-black mt-1">
                      ₹{product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
              {filteredProducts.slice(4, 8).map((product) => (
                <div key={product._id} className="flex-shrink-0 w-[calc(50vw-24px)] sm:w-[calc(50vw-20px)] md:w-[calc(25vw-25px)] bg-white rounded-xl shadow p-2 flex flex-col items-start">
                  <div className="w-full h-32 sm:h-28 md:h-32 mb-2 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate mb-1">{product.type.length > 20 ? product.type.slice(0, 20) + '...' : product.type}</div>
                    <div className="text-[11px] sm:text-[13px] font-bold text-black mt-1">
                      ₹{product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid with Scroll Buttons - Desktop Only */}
        <div className="relative group hidden lg:block">
          {/* Left Scroll Button */}
          <button 
            onClick={scrollLeft}
            className="absolute -left-6 xl:-left-8 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 lg:p-4 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          {/* Right Scroll Button */}
          <button 
            onClick={scrollRight}
            className="absolute -right-6 xl:-right-8 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 lg:p-4 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>

          {/* Product Grid - Responsive width */}
          <div className="w-full overflow-x-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 lg:gap-6 xl:gap-8 overflow-x-auto scrollbar-hide pb-6 px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {filteredProducts.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-72 lg:w-80 xl:w-96 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card" style={{ scrollSnapAlign: 'start' }}>
                  {/* Product Image Container */}
                  <div className="relative group/image">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-80 lg:h-96 xl:h-[400px] object-cover rounded-t-xl"
                    />
                    {/* Heart Icon and Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 lg:gap-3 z-20">
                      <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                      <div className="bg-white rounded-full px-2 lg:px-3 py-2 shadow-md flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-xs lg:text-sm font-semibold text-gray-700">{product.brand}</span>
                      </div>
                    </div>
                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-30 transition-all duration-300 rounded-t-xl flex items-end justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none">
                      <button className="mb-4 bg-white text-gray-800 px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 pointer-events-auto text-sm lg:text-base">
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="p-4 lg:p-6">
                    <h3 className="text-sm lg:text-base font-medium text-gray-800 mb-2 lg:mb-3 line-clamp-2 leading-relaxed">
                      {product.type}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">₹{product.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
          <Link to="/all-products" className="bg-[#d6668c] text-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-lg lg:rounded-xl font-medium lg:font-semibold text-sm sm:text-base md:text-lg lg:text-xl hover:bg-[#FFB3C1] transition-all duration-200 shadow-md lg:shadow-lg hover:shadow-lg lg:hover:shadow-xl">
            VIEW ALL
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
} 