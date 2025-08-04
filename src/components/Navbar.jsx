import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, Search, Heart, ShoppingBag, Package, Menu, X, ChevronRight } from "lucide-react"
import { API_BASE_URL } from "../config"
import axios from "axios"

const menuItems = [
  "BRA",
  "PANTIES",
  "LOUNGEWEAR",
  "ATHLEISURE",
  "CO-ORD SETS",
  "SILKY BLISS",
  "WINTERWEAR",
  "PB LUXE",
  "SALE",
  "FIND YOUR SIZE",
]

const icons = [
  { label: "User", icon: <User size={20} /> },
  { label: "Search", icon: <Search size={20} /> },
  { label: "Wishlist", icon: <Heart size={20} /> },
  { label: "Cart", icon: <ShoppingBag size={20} /> },
]

const categoryItems = [
  { name: "BDSM", image: "/categoryimage-1.jpg" },
  { name: "Women", image: "/women.webp" },
  { name: "Men", image: "/men.webp" },
  { name: "Erotic Lingerie", image: "/erotic.webp" },
  { name: "Costume", image: "/costume.webp" },
  { name: "Erotic Panty", image: "/eroticpanty.webp" },
  { name: "Furnitue", image: "/furniture.webp", special: true },
  { name: "Occasional", image: "/occasnial.webp", special: true },
]

export default function Navbar({ categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  // New state for hover logic
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null)
  const [showSubDropdown, setShowSubDropdown] = useState(null)
  
  // Refs for hover delay
  const hoverTimeoutRef = useRef(null)
  const subHoverTimeoutRef = useRef(null)

  // 1. Add state for open mobile category
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (subHoverTimeoutRef.current) clearTimeout(subHoverTimeoutRef.current)
    }
  }, [])

  const handleCategoryMouseEnter = (catId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredCategory(catId)
    setShowDropdown(catId)
    setHoveredSubcategory(null)
    setShowSubDropdown(null)
  }

  const handleCategoryMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
      setShowDropdown(null)
      setHoveredSubcategory(null)
      setShowSubDropdown(null)
    }, 150) // 150ms delay
  }

  const handleSubcategoryMouseEnter = (subId) => {
    if (subHoverTimeoutRef.current) clearTimeout(subHoverTimeoutRef.current)
    setHoveredSubcategory(subId)
    setShowSubDropdown(subId)
  }

  const handleSubcategoryMouseLeave = () => {
    subHoverTimeoutRef.current = setTimeout(() => {
      setHoveredSubcategory(null)
      setShowSubDropdown(null)
    }, 150) // 150ms delay
  }

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
      setShowDropdown(null)
      setHoveredSubcategory(null)
      setShowSubDropdown(null)
    }, 150)
  }

  // Handle category click - navigate to category page
  const handleCategoryClick = (category) => {
    // Close dropdown when category is clicked
    setShowDropdown(null)
    setHoveredCategory(null)
    // Navigate to category page with all products and filters
    window.location.href = `/category/${category.name}`
  }

  return (
    <>
      {/* Top Bar (not fixed, always visible at top) */}
      <div className="w-full bg-[#FFC1CC] text-center flex justify-between items-center px-4 py-2 text-sm md:flex md:text-base md:py-2 md:px-4"
        style={{ display: menuOpen ? 'none' : undefined }}
      >
        <span className="flex-1 flex items-center justify-center text-[10px] md:text-sm leading-tight md:leading-normal md:font-bold">
          💟 Enjoy FREE shipping on all orders above ₹999! 💗 Shop now & save big!
        </span>
        <a href="#" className="text-black flex items-center gap-1 ml-2 whitespace-nowrap hidden md:flex">
          <Package size={16} />
          Track Order
        </a>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex">
          <div className="w-4/5 max-w-xs bg-white h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-4">
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={28} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {categories.map((item) => (
                  <li key={item.id} className="flex flex-col px-6 py-3 text-[#F48FB1] font-medium text-base">
                    <div className="flex items-center justify-between w-full">
                      <Link 
                        to={`/category/${item.name}`}
                        className="flex-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => setOpenMobileCategoryId(openMobileCategoryId === item.id ? null : item.id)}
                        className="ml-2"
                      >
                        <ChevronRight size={20} className={openMobileCategoryId === item.id ? 'rotate-90 transition-transform' : 'transition-transform'} />
                      </button>
                    </div>
                    {/* Show subcategories/types if open */}
                    {openMobileCategoryId === item.id && (
                      <div className="pl-2 pt-2">
                        {/* Subcategories */}
                        {item.subcategories && item.subcategories.length > 0 && (
                          <>
                            {item.subcategories.map((sub) => (
                              <div key={sub.id} className="mb-2">
                                <div className="font-bold text-[#b1005a] mb-1">{sub.name}</div>
                                <ul>
                                  {sub.types && sub.types.map((type) => (
                                    <li key={type.id} className="mb-1">
                                      <Link to={`category/${item.name}/subcategory/${sub.name}/type/${type.name}`} className="text-gray-700 hover:text-pink-600" onClick={() => setMenuOpen(false)}>
                                        {type.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </>
                        )}
                        {/* Types directly under category */}
                        {item.types && item.types.length > 0 && (!item.subcategories || item.subcategories.length === 0) && (
                          <ul>
                            {item.types.map((type) => (
                              <li key={type.id} className="mb-1">
                                <Link to={`category/${item.name}/type/${type.name}`} className="text-gray-700 hover:text-pink-600" onClick={() => setMenuOpen(false)}>
                                  {type.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-2 text-gray-700">
              <User size={22} />
              <span className="text-base font-medium">LOGIN</span>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Sticky Navbar (sticks to top after scrolling) */}
      <nav className="w-full bg-white px-4 py-3 md:py-6 shadow-sm sticky top-0 z-40">
        <div className="relative flex items-center justify-between md:mt-3">
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
          {/* Logo - Center */}
          <div className="flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src="/couplestrylogowith-2.png"
                alt="Couples Try Logo"
                className="h-14 w-14 md:h-24 md:w-24 md:-mr-4 -mr-2 md:mt-3 mt-2"
                style={{ borderRadius: "50%" }}
              />
              <span className="text-2xl md:text-5xl font-serif text-[#b73963] font-bold tracking-tight">
                Couples Try
              </span>
            </Link>
          </div>
          {/* Icons - Right */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            {/* User icon: only md+ */}
            <span className="cursor-pointer hidden md:inline-flex"><User size={20} /></span>
            {/* Search icon: always */}
            <span className="cursor-pointer"><Search size={20} /></span>
            {/* Heart icon: always */}
            <span className="cursor-pointer"><Heart size={20} /></span>
            {/* Cart icon: only md+ */}
            <span className="cursor-pointer hidden md:inline-flex"><ShoppingBag size={20} /></span>
          </div>
        </div>
        {/* Menu - Below Logo, only on md+ */}
        <div className="hidden md:flex justify-center mt-10 relative">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-black">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="cursor-pointer relative px-2"
                onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <div 
                  className="flex items-center"
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.name}
                </div>
                {/* Mega-menu style dropdown for subcategories */}
                {showDropdown === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-lg z-50 border border-gray-100 min-w-[900px] px-8 py-6 flex gap-8"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id} className="min-w-[180px]">
                        <div className="font-bold text-[#b1005a] mb-2">{sub.name}</div>
                        <ul>
                          {sub.types && sub.types.map((type) => (
                            <li key={type.id} className="mb-2">
                              <Link to={`category/${cat.name}/subcategory/${sub.name}/type/${type.name}`} className="text-gray-700 hover:text-pink-600">
                                {type.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {/* Types directly under category (if any) */}
                {showDropdown === cat.id && cat.types && cat.types.length > 0 && (!cat.subcategories || cat.subcategories.length === 0) && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white shadow-lg rounded-lg min-w-[220px] z-50 border border-gray-100 px-6 py-4"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <ul>
                      {cat.types.map((type) => (
                        <li key={type.id} className="mb-2">
                          <Link to={`category/${cat.name}/type/${type.name}`} className="text-gray-700 hover:text-pink-600">
                            {type.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Product Categories Section */}
      <div className="w-full bg-[#FFC1CC] px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="flex justify-start xl:justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2 pl-2 sm:pl-4 md:pl-6 lg:pl-6 xl:pl-0">
          {categoryItems.map((category) => (
            <Link 
              key={category.name} 
              to={`/category/${category.name}`}
              className="flex flex-col items-center flex-shrink-0 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[120px] max-w-[80px] sm:max-w-[90px] md:max-w-[100px] lg:max-w-[120px] cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden mb-1 sm:mb-1.5 md:mb-2 shadow-sm ${category.special ? "bg-[#FF6B6B]" : "bg-white"}`}
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-sm lg:text-base font-medium text-gray-800 text-center leading-tight">{category.name}</span>
            </Link>
          ))}
        </div>
      </div> 
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}
