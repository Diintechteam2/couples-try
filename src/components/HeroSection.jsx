import { useEffect, useRef, useState } from "react"
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const desktopImages = [
  "/heroimage.jpg",
  "/heroimage-1.jpg",
  "/heroimage-2.jpg",
]
const mobileImages = [
  "/heroimage.jpg",
  "/heroimage-1.jpg", 
  "/heroimage-2.jpg",
]

export default function HeroSection() {
  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const images = isMobile ? mobileImages : desktopImages
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearTimeout(timeoutRef.current)
  }, [index, images.length])

  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length)
  const next = () => setIndex((prev) => (prev + 1) % images.length)

  const handleShopNow = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate('/all-products')
  }

  return (
    <section className="relative w-full h-[60vw] min-h-[420px] max-h-[700px] md:min-h-[350px] md:max-h-[650px] flex items-center justify-center overflow-hidden">
      {/* Carousel Images (fade effect) */}
      <div className="absolute inset-0 w-full h-full flex">
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt="Hero Slide"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in z-0 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            draggable="false"
            style={{ transitionProperty: 'opacity' }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none" />
      </div>
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
        <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold text-center leading-tight mb-8 drop-shadow-lg">
          India's #1 Online Store for Men's, xdresser, BDSM & Erotic Lingerie
        </h1>
        <button 
          onClick={handleShopNow}
          className="flex items-center gap-2 bg-[#FF3576] hover:bg-[#e62e6b] text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg transition"
        >
          SHOP NOW <ShoppingCart size={22} />
        </button>
      </div>
    </section>
  )
} 