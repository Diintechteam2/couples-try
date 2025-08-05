import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "../config"

export default function CategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageTitle, setPageTitle] = useState("Category Products")
  const [brandOptions, setBrandOptions] = useState([])
  const [subcategoryOptions, setSubcategoryOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])
  const [discountOptions, setDiscountOptions] = useState([])
  const [priceOptions, setPriceOptions] = useState([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Filter state
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    brand: [],
    discount: [],
    subcategory: [],
    type: [],
  })
  const [sort, setSort] = useState("relevance")

  const getDiscount = (price, originalPrice) => {
    if (!price || !originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  useEffect(() => {
    // Fetch all products from the category
    const url = `${API_BASE_URL}/clients/CLI746136Q0EY/dress/get?category=${categoryName}`
    setPageTitle(categoryName)
    setLoading(true)
    setError(null)
    
    axios.get(url)
    .then(res => {
      const dresses = res.data.dresses || []
      setProducts(dresses)
    
      // Extract unique filter options
      const brands = [...new Set(dresses.map(d => d.brand))].map(b => ({ label: b, value: b }))
      const subcategories = [...new Set(dresses.map(d => d.subcategory))].filter(Boolean).map(s => ({ label: s, value: s }))
      const types = [...new Set(dresses.map(d => d.type))].map(t => ({ label: t, value: t }))
    
      // Static options for price and discount
      const priceOptions = [
        { label: "Under ₹250", value: "under-250" },
        { label: "₹250 to ₹500", value: "250-500" },
        { label: "₹500 to ₹1000", value: "500-1000" },
        { label: "Above ₹1000", value: "above-1000" },
      ]
      const discountOptions = [
        { label: "10% or more", value: "10" },
        { label: "20% or more", value: "20" },
        { label: "30% or more", value: "30" },
        { label: "50% or more", value: "50" },
      ]
    
      setBrandOptions(brands)
      setSubcategoryOptions(subcategories)
      setTypeOptions(types)
      setDiscountOptions(discountOptions)
      setPriceOptions(priceOptions)
      setLoading(false)
    })
    .catch(err => {
      setError("Failed to load products.")
      setLoading(false)
    })
  }, [categoryName])

  // Prevent body scrolling when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showMobileFilters])

  // Filter handler
  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const values = prev[filterKey].includes(value)
        ? prev[filterKey].filter((v) => v !== value)
        : [...prev[filterKey], value]
      return { ...prev, [filterKey]: values }
    })
  }

  // Sort handler
  const handleSortChange = (e) => {
    setSort(e.target.value)
  }

  // Filtered products logic
  const filteredProducts = products.filter(product => {
    // Price filter
    let priceMatch = true;
    if (selectedFilters.price.length > 0) {
      priceMatch = selectedFilters.price.some(range => {
        if (range === "under-250") return product.price < 250;
        if (range === "250-500") return product.price >= 250 && product.price <= 500;
        if (range === "500-1000") return product.price > 500 && product.price <= 1000;
        if (range === "above-1000") return product.price > 1000;
        return true;
      });
    }
    // Brand filter
    let brandMatch = true;
    if (selectedFilters.brand.length > 0) {
      brandMatch = selectedFilters.brand.includes(product.brand);
    }
    // Subcategory filter
    let subcategoryMatch = true;
    if (selectedFilters.subcategory.length > 0) {
      subcategoryMatch = selectedFilters.subcategory.includes(product.subcategory);
    }
    // Type filter
    let typeMatch = true;
    if (selectedFilters.type.length > 0) {
      typeMatch = selectedFilters.type.includes(product.type);
    }
    // Discount filter
    let discountMatch = true;
    if (selectedFilters.discount.length > 0 && product.originalPrice) {
      const discountPercent = Math.round(100 * (product.originalPrice - product.price) / product.originalPrice);
      discountMatch = selectedFilters.discount.some(d => discountPercent >= parseInt(d));
    }
    return priceMatch && brandMatch && subcategoryMatch && typeMatch && discountMatch;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") {
      return a.price - b.price;
    }
    if (sort === "price-high") {
      return b.price - a.price;
    }
    if (sort === "discount") {
      return getDiscount(b.price, b.originalPrice) - getDiscount(a.price, a.originalPrice);
    }
    // Default: relevance (no sorting or original order)
    return 0;
  });

  if (loading) return <div className="p-8 text-center">Loading products...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!products.length) return <div className="p-8 text-center">No products found in this category.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-lg"
          >
            <Filter size={16} />
            Filters
            {showMobileFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FiltersSection 
                  subcategoryOptions={subcategoryOptions}
                  typeOptions={typeOptions}
                  priceOptions={priceOptions}
                  brandOptions={brandOptions}
                  discountOptions={discountOptions}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Filters</h2>
          <FiltersSection 
            subcategoryOptions={subcategoryOptions}
            typeOptions={typeOptions}
            priceOptions={priceOptions}
            brandOptions={brandOptions}
            discountOptions={discountOptions}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-sm text-gray-600">Home / {categoryName}</h1>
            <h1 className="text-2xl font-bold mb-1">{pageTitle}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-600">Showing {filteredProducts.length} of {products.length} products</p>
              <select 
                value={sort} 
                onChange={handleSortChange} 
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => {
              const discount = getDiscount(product.price, product.originalPrice);
              return (
                <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="relative aspect-[9/10] sm:aspect-[9/10] overflow-hidden rounded-t-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.description} 
                      className="w-full h-full object-fill" 
                    />
                    {discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div> 
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1 font-semibold">{product.brand}</div>
                    <div className="font-medium text-sm mb-2 line-clamp-2">{product.description}</div>
                    {product.subcategory && (
                      <div className="text-xs text-blue-600 mb-2">{product.subcategory}</div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg text-pink-700">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-xs text-green-700 font-semibold">Free Delivery</div>
                    <div className="flex items-center gap-1 text-xs mt-2">
                      <span className="bg-green-500 text-white rounded px-1.5 py-0.5 font-bold">{product.rating || '3.9'}</span>
                      <span className="text-gray-500">{product.reviews || '1000'} Reviews</span>
                    </div>
                    {product.sizes && product.sizes.filter(s => s.selected).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.sizes.filter(s => s.selected).map(s => (
                          <span key={s.size} className="border border-pink-300 rounded px-2 py-0.5 text-xs">{s.size}</span>
                        ))}
                      </div>
                    )}
                    {product.stockStatus && (
                      <div className="text-xs text-orange-600 font-semibold mt-2">{product.stockStatus}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Separate Filters Component
function FiltersSection({ 
  subcategoryOptions, 
  typeOptions, 
  priceOptions, 
  brandOptions, 
  discountOptions, 
  selectedFilters, 
  handleFilterChange 
}) {
  return (
    <div className="space-y-6">
      {/* Subcategory Filter */}
      {subcategoryOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Subcategory</h3>
          <div className="space-y-2">
            {subcategoryOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.subcategory.includes(opt.value)}
                  onChange={() => handleFilterChange('subcategory', opt.value)}
                  className="mr-2"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Type Filter */}
      {typeOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Type</h3>
          <div className="space-y-2">
            {typeOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.type.includes(opt.value)}
                  onChange={() => handleFilterChange('type', opt.value)}
                  className="mr-2"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <div className="space-y-2">
          {priceOptions.map(opt => (
            <label key={opt.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.price.includes(opt.value)}
                onChange={() => handleFilterChange('price', opt.value)}
                className="mr-2"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {brandOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brand</h3>
          <div className="space-y-2">
            {brandOptions.map(opt => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.brand.includes(opt.value)}
                  onChange={() => handleFilterChange('brand', opt.value)}
                  className="mr-2"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Discount Filter */}
      <div>
        <h3 className="font-semibold mb-3">Discount</h3>
        <div className="space-y-2">
          {discountOptions.map(opt => (
            <label key={opt.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.discount.includes(opt.value)}
                onChange={() => handleFilterChange('discount', opt.value)}
                className="mr-2"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 