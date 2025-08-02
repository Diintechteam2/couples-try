import { useState, useRef, useEffect } from "react"
import { Heart, Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { API_BASE_URL } from "../config"
import axios from "axios"



const products = [
  {
    id: 1,
    name: "X-Frame Cotton Comfort Seamless Bra",
    price: 699,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 2,
    name: "Lace Section Cups Comfort Bra",
    price: 449,
    rating: 0.0,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 3,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 4,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 5,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 6,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 7,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 8,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 9,
    name: "Perfect fit comfort non padded bra",
    price: 799,
    rating: 3.5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&q=80",
    category: "hot-sellers"
  },
  {
    id: 10,
    name: "Silky Comfort Lounge Bra",
    price: 599,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&q=80",
    category: "just-arrived"
  },
  {
    id: 11,
    name: "Co-ord Comfort Set",
    price: 899,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&q=80",
    category: "just-arrived"
  },
  {
    id: 12,
    name: "Winter Comfort Bra",
    price: 649,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&q=80",
    category: "just-arrived"
  },
  {
    id: 13,
    name: "Winter Comfort Bra",
    price: 649,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&q=80",
    category: "just-arrived"
  },
  {
    id: 14,
    name: "Winter Comfort Bra",
    price: 649,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&q=80",
    category: "just-arrived"
  }
]

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
    <section className="w-full bg-white md:bg-white py-8 md:py-12 px-2 md:px-4">
      <div className="max-w-6xl md:max-w-[1400px] mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex bg-gray-100 rounded-lg md:rounded-xl p-1 md:p-2">
            <button
              onClick={() => setActiveTab("hot-sellers")}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-md md:rounded-lg text-sm md:text-base font-medium md:font-semibold transition-all duration-200 ${
                activeTab === "hot-sellers"
                  ? "bg-[#d6668c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              Hot Sellers
            </button>
            <button
              onClick={() => setActiveTab("just-arrived")}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-md md:rounded-lg text-sm md:text-base font-medium md:font-semibold transition-all duration-200 ${
                activeTab === "just-arrived"
                  ? "bg-[#d6668c] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              Just Arrived
            </button>
          </div>
        </div>

        {/* Product Cards - Mobile Grid */}
        <div className="block md:hidden bg-[#e6f7f3] rounded-2xl p-2 pt-4">
          {/* First Row */}
          <div className="mb-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {filteredProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="flex-shrink-0 w-[calc(50vw-24px)] bg-white rounded-xl shadow p-2 flex flex-col items-start">
                  <div className="w-full h-32 mb-2 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-sm font-semibold text-gray-900 truncate mb-1">{product.type.length > 20 ? product.type.slice(0, 20) + '...' : product.type}</div>
                    <div className="text-[13px] font-bold text-black mt-1">
                      ₹{product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {filteredProducts.slice(4, 8).map((product) => (
                <div key={product._id} className="flex-shrink-0 w-[calc(50vw-24px)] bg-white rounded-xl shadow p-2 flex flex-col items-start">
                  <div className="w-full h-32 mb-2 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-sm font-semibold text-gray-900 truncate mb-1">{product.type.length > 20 ? product.type.slice(0, 20) + '...' : product.type}</div>
                    <div className="text-[13px] font-bold text-black mt-1">
                      ₹{product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid with Scroll Buttons - Desktop/Tablet Only */}
        <div className="relative group hidden md:block">
          {/* Left Scroll Button - Desktop Only */}
          <button 
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          {/* Right Scroll Button - Desktop Only */}
          <button 
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>

          {/* Product Grid - Only 4 full cards visible */}
          <div className="w-[1352px] mx-auto overflow-x-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-0"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {filteredProducts.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card" style={{ scrollSnapAlign: 'start' }}>
                  {/* Product Image Container */}
                  <div className="relative group/image">
                    <img
                      src={product.imageUrl}
                      alt={product.type}
                      className="w-full h-96 object-cover rounded-t-xl"
                    />
                    {/* Heart Icon and Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
                      <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                      <div className="bg-white rounded-full px-3 py-2 shadow-md flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{product.brand}</span>
                      </div>
                    </div>
                    {/* Add to Cart Overlay - Desktop Only */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-30 transition-all duration-300 rounded-t-xl flex items-end justify-center opacity-0 group-hover/image:opacity-100 hidden md:flex pointer-events-none">
                      <button className="mb-4 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 pointer-events-auto">
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-base font-medium text-gray-800 mb-3 line-clamp-2 leading-relaxed">
                      {product.type}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8 md:mt-10">
          <Link to="/all-products" className="bg-[#d6668c] text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-medium md:font-semibold text-base md:text-lg hover:bg-[#FFB3C1] transition-all duration-200 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl">
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