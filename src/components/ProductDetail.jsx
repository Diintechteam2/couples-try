import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => { 
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/dress/get`)
        if (response.data.success) {
          const foundProduct = response.data.dresses.find(p => p._id === productId)
          if (foundProduct) {
            setProduct(foundProduct)
            // Set default selected size if available
            if (foundProduct.sizes && foundProduct.sizes.length > 0) {
              const availableSize = foundProduct.sizes.find(s => s.selected)
              if (availableSize) {
                setSelectedSize(availableSize.size)
              }
            }
          } else {
            setError('Product not found')
          }
        } else {
          setError('Failed to load product')
        }
      } catch (err) {
        setError('Failed to load product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    
    // Here you would typically add to cart logic
    console.log('Adding to cart:', {
      product: product._id,
      size: selectedSize,
      quantity: quantity
    })
    
    // For now, just show a success message
    alert('Product added to cart successfully!')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Here you would typically update wishlist
    console.log('Wishlist updated:', !isWishlisted)
  }

  const getDiscount = (price, originalPrice) => {
    if (!price || !originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const nextImage = () => {
    if (product?.imageUrl) {
      setCurrentImageIndex(0) // For now, just reset since we only have one image
    }
  }

  const prevImage = () => {
    if (product?.imageUrl) {
      setCurrentImageIndex(0) // For now, just reset since we only have one image
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const discount = getDiscount(product.price, product.originalPrice)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
              {product.type}
            </h1>
            <button 
              onClick={handleWishlist}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm lg:max-w-md lg:mx-auto">
              <img
                src={product.imageUrl}
                alt={product.type}
                className="w-full h-full object-cover"
              />
              {/* Navigation arrows for multiple images */}
              {/* {product.imageUrl && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )} */}
              {/* Discount badge */}
              {discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-2">{product.brand}</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.type}</h1>
              {product.subcategory && (
                <p className="text-sm text-blue-600 mb-2">{product.subcategory}</p>
              )}
            </div>

            {/* Product Details */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-semibold">{product.rating || '4.2'}</span>
              </div>
              <span className="text-gray-500 text-sm">({product.reviews || '1.2k'} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {discount && (
                  <span className="text-xs font-semibold text-green-600">{discount}% off</span>
                )}
              </div>
              <p className="text-xs text-green-600 font-semibold">Free Delivery</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3">Select Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={`p-2 border-2 rounded-lg text-xs font-medium transition-colors ${
                        selectedSize === size.size
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : size.selected
                          ? 'border-gray-300 hover:border-pink-300 text-gray-900'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!size.selected}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-base font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full lg:flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold text-base hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="w-full lg:flex-1 border-2 border-pink-500 text-pink-500 py-3 rounded-lg font-semibold text-base hover:bg-pink-50 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-green-600" />
                <span className="text-sm text-gray-600">Free delivery on orders above ₹499</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-blue-600" />
                <span className="text-sm text-gray-600">Secure payment</span>
              </div>  
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-orange-600" />
                <span className="text-sm text-gray-600">Easy returns & exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
