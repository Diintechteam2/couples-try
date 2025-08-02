import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config"

export default function ProductList({ type }) {
  const { typeName, categoryName, subcategoryName } = useParams()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageTitle, setPageTitle] = useState("Products")
  const [brandOptions, setBrandOptions] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [typeOptions, setTypeOptions] = useState([])
  const [discountOptions, setDiscountOptions] = useState([])
  const [priceOptions, setPriceOptions] = useState([])
  const [sortOptions, setSortOptions] = useState([])
  
  // Filter state
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    brand: [],
    discount: [],
    category: [],
    type: [],
  })
  const [sort, setSort] = useState("relevance")

  // // Example static filter options
  // const priceOptions = [
  //   { label: "Under ₹250", value: "under-250" },
  //   { label: "₹250 to ₹500", value: "250-500" },
  //   { label: "₹500 to ₹1000", value: "500-1000" },
  //   { label: "Above ₹1000", value: "above-1000" },
  // ]
  // const brandOptions = [
  //   { label: "Brand A", value: "brand-a" },
  //   { label: "Brand B", value: "brand-b" },
  // ]
  // const discountOptions = [
  //   { label: "10% or more", value: "10" },
  //   { label: "20% or more", value: "20" },
  //   { label: "30% or more", value: "30" },
  //   { label: "50% or more", value: "50" },
  // ]
  // const categoryOptions = [
  //   { label: "Sarees", value: "Sarees" },
  //   { label: "Kurtis", value: "Kurtis" },
  // ]
  // const typeOptions = [
  //   { label: "Cotton", value: "Cotton" },
  //   { label: "Silk", value: "Silk" },
  // ]
  const getDiscount = (price, originalPrice) => {
    if (!price || !originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };
  useEffect(() => {
    let url = ""
    // if (type === "category") {
    //   url = `${API_BASE_URL}/clients/CLI746136Q0EY/dress?category=${categoryName}`
    //   setPageTitle("Category Products")
    // } 
    if (subcategoryName) {
      url = `${API_BASE_URL}/clients/CLI746136Q0EY/dress/get?category=${categoryName}&subcategory=${subcategoryName}&type=${typeName}`
      setPageTitle(typeName)
    } 
    else {
      url = `${API_BASE_URL}/clients/CLI746136Q0EY/dress/get?category=${categoryName}&type=${typeName}`
      setPageTitle(typeName)
    }
    setLoading(true)
    setError(null)
    
    axios.get(url)
    .then(res => {
      const dresses = res.data.dresses || []
      setProducts(dresses)
    
      // Extract unique filter options
      const brands = [...new Set(dresses.map(d => d.brand))].map(b => ({ label: b, value: b }))
      const categories = [...new Set(dresses.map(d => d.category))].map(c => ({ label: c, value: c }))
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
      setCategoryOptions(categories)
      setTypeOptions(types)
      setDiscountOptions(discountOptions)
      setPriceOptions(priceOptions)
      setLoading(false)
    })
      .catch(err => {
        setError("Failed to load products.")
        setLoading(false)
      })
  }, [typeName, type, categoryName, subcategoryName])


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
  const handleSortChange = (e) => {console.log(e.target.value); setSort(e.target.value)}

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
    // Category filter
    let categoryMatch = true;
    if (selectedFilters.category.length > 0) {
      categoryMatch = selectedFilters.category.includes(product.category);
    }
    // Type filter
    let typeMatch = true;
    if (selectedFilters.type.length > 0) {
      typeMatch = selectedFilters.type.includes(product.type);
    }
    // Discount filter (assume discount is calculated from originalPrice)
    let discountMatch = true;
    if (selectedFilters.discount.length > 0 && product.originalPrice) {
      const discountPercent = Math.round(100 * (product.originalPrice - product.price) / product.originalPrice);
      discountMatch = selectedFilters.discount.some(d => discountPercent >= parseInt(d));
    }
    return priceMatch && brandMatch && categoryMatch && typeMatch && discountMatch;
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
    return getDiscount(b.price, b.originalPrice) - getDiscount(a.price, a.originalPrice) ;
  }
  // Default: relevance (no sorting or original order)
  return 0;
});

  if (loading) return <div className="p-8 text-center">Loading products...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!products.length) return <div className="p-8 text-center">No products found.</div>

  return (
    <div className="flex flex-col md:flex-row gap-6 px-2 md:px-8 py-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4 mb-4 md:mb-0">
        <h3 className="font-bold text-lg mb-4">FILTERS</h3>
        <div className="mb-4">
          <div className="font-semibold mb-2">Category</div>
          {categoryOptions.map(opt => (
            <label key={opt.value} className="flex items-center mb-1">
              <input type="checkbox" checked={selectedFilters.category.includes(opt.value)} onChange={() => handleFilterChange('category', opt.value)} className="mr-2" />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Price</div>
          {priceOptions.map(opt => (
            <label key={opt.value} className="flex items-center mb-1">
              <input type="checkbox" checked={selectedFilters.price.includes(opt.value)} onChange={() => handleFilterChange('price', opt.value)} className="mr-2" />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Brand</div>
          {brandOptions.map(opt => (
            <label key={opt.value} className="flex items-center mb-1">
              <input type="checkbox" checked={selectedFilters.brand.includes(opt.value)} onChange={() => handleFilterChange('brand', opt.value)} className="mr-2" />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Discount</div>
          {discountOptions.map(opt => (
            <label key={opt.value} className="flex items-center mb-1">
              <input type="checkbox" checked={selectedFilters.discount.includes(opt.value)} onChange={() => handleFilterChange('discount', opt.value)} className="mr-2" />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Type</div>
          {typeOptions.map(opt => (
            <label key={opt.value} className="flex items-center mb-1">
              <input type="checkbox" checked={selectedFilters.type.includes(opt.value)} onChange={() => handleFilterChange('type', opt.value)} className="mr-2" />
              {opt.label}
            </label>
          ))}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Heading and Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h1 className="text-sm text-gray-600">Home/{categoryName}/{subcategoryName ? subcategoryName : ""}/{pageTitle}</h1>
            <h1 className="text-2xl font-bold mb-1">{pageTitle}</h1>
            <div className="text-sm text-gray-600">Showing {products.length} products</div>
          </div>
          <div>
            <select value={sort} onChange={handleSortChange} className="border rounded px-3 py-2 text-sm">
              <option value="relevance">Sort by : Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>

            </select>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product) => {
            const discount = getDiscount(product.price, product.originalPrice);
            return(
            <div key={product._id} className="bg-white rounded-lg shadow p-2 flex flex-col">
              <div className="relative w-full aspect-[3/4] mb-2 overflow-hidden rounded-lg">
                <img src={product.imageUrl} alt={product.description} className="w-full h-full object-contain" />
                {discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      {discount}% OFF
                    </span>
                  )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-xs text-gray-500 mb-1 font-semibold">{product.brand}</div>
                <div className="font-medium text-sm mb-1 line-clamp-2">{product.description}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-2xl text-pink-700">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="text-xs text-green-700 font-semibold mb-1">Free Delivery</div>
                <div className="flex items-center gap-1 text-xs mb-1">
                  <span className="bg-green-500 text-white rounded px-1.5 py-0.5 font-bold">{product.rating || '3.9'}</span>
                  <span className="text-gray-500">{product.reviews || '1000'} Reviews</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {product.sizes && product.sizes.filter(s => s.selected).map(s => (
                    <span key={s.size} className="border border-pink-300 rounded px-2 py-0.5 text-xs">{s.size}</span>
                  ))}
                </div>
                {product.stockStatus && (
                  <div className="text-xs text-orange-600 font-semibold">{product.stockStatus}</div>
                )}
              </div>
            </div>
            )}
          )}
        </div>
      </main>
    </div>
  )
} 