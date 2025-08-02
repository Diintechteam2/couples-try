import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

// Different images for each category card (5 different images for 5 categories)
const categoryImages = [
  "/category-1.webp",
  "/catagoryimage-3.webp", 
  "/categoryimage-2.jpg",
  "/categoryimage-4.jpeg",
  "/categoryimage-5.jpg"
]

export default function CategoryGrid({ categories = [] }) {
  // Swiper state for mobile
  const [active, setActive] = useState(0)
  const scrollRef = useRef(null)
  const isInitialLoad = useRef(true)
  const userInteracted = useRef(false)

  // Take only first 5 categories from API
  const displayCategories = categories.slice(0, 5)

  // Only scroll to active card when user clicks dots (not on initial load)
  useEffect(() => {
    if (!userInteracted.current) return
    
    if (scrollRef.current && window.innerWidth < 768) {
      const card = scrollRef.current.children[active]
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [active])

  // Update active dot based on scroll position (but not on initial load)
  function handleScroll() {
    if (isInitialLoad.current) return
    
    if (!scrollRef.current) return
    const container = scrollRef.current
    const children = Array.from(container.children)
    const containerRect = container.getBoundingClientRect()
    let minDiff = Infinity
    let closest = 0
    children.forEach((child, i) => {
      const rect = child.getBoundingClientRect()
      // Center of card relative to container center
      const diff = Math.abs((rect.left + rect.right) / 2 - (containerRect.left + containerRect.right) / 2)
      if (diff < minDiff) {
        minDiff = diff
        closest = i
      }
    })
    setActive(closest)
  }

  // Mark initial load as complete after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoad.current = false
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle dot click
  const handleDotClick = (index) => {
    userInteracted.current = true
    setActive(index)
  }

  // Don't render if no categories
  if (!displayCategories.length) {
    return null
  }

  return (
    <section className="w-full py-8 px-2 md:px-8 lg:px-24 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-cursive font-semibold mb-6 text-center">Shop By Category</h2>
      
      {/* Mobile Swiper */}
      <div className="w-full md:hidden">
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {displayCategories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.name}`}
              className={`relative rounded-xl overflow-hidden shadow-md min-w-[80vw] max-w-[80vw] h-[240px] flex flex-col justify-end snap-center transition-all duration-500 ${i === active ? 'scale-100' : 'scale-95 opacity-80'}`}
            >
              <img 
                src={categoryImages[i] || "/catagoryimage-1.webp"} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-fill z-0" 
                draggable="false" 
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-30 py-3">
                <span className="text-white text-lg font-cursive font-semibold text-center drop-shadow-lg block">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {displayCategories.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2.5 h-2.5 rounded-full border-2 ${i === active ? 'bg-pink-400 border-pink-400' : 'bg-transparent border-pink-200'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop/Tablet Grid */}
      <div className="hidden md:grid w-full max-w-full mx-auto gap-6 grid-cols-3 grid-rows-2">
        {/* Top row: 2 cards, each col-span-3 sm:col-span-1, one big, one small */}
        <div className="col-span-2 row-span-1 flex flex-col">
          <Link 
            to={`/category/${displayCategories[0]?.name}`} 
            className="relative rounded-xl overflow-hidden shadow-md flex-1 min-h-[400px] hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={categoryImages[0] || "/catagoryimage-1.webp"} 
              alt={displayCategories[0]?.name} 
              className="absolute inset-0 w-full h-full object-fill z-0" 
              draggable="false" 
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-30 py-4">
              <span className="text-white text-2xl font-cursive font-semibold text-center drop-shadow-lg block">
                {displayCategories[0]?.name}
              </span>
            </div>
          </Link>
        </div>
        <div className="col-span-1 row-span-1 flex flex-col">
          <Link 
            to={`/category/${displayCategories[1]?.name}`} 
            className="relative rounded-xl overflow-hidden shadow-md flex-1 min-h-[400px] hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={categoryImages[1] || "/catagoryimage-2.webp"} 
              alt={displayCategories[1]?.name} 
              className="absolute inset-0 w-full h-full object-fill z-0" 
              draggable="false" 
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-30 py-4">
              <span className="text-white text-2xl font-cursive font-semibold text-center drop-shadow-lg block">
                {displayCategories[1]?.name}
              </span>
            </div>
          </Link>
        </div>
        
        {/* Bottom row: 3 cards with different images */}
        {displayCategories.slice(2).map((cat, index) => (
          <div key={cat.id} className="col-span-1 row-span-1 flex flex-col">
            <Link 
              to={`/category/${cat.name}`} 
              className="relative rounded-xl overflow-hidden shadow-md flex-1 min-h-[400px] hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={categoryImages[index + 2] || "/catagoryimage-3.webp"} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-fill z-0" 
                draggable="false" 
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-30 py-3">
                <span className="text-white text-xl font-cursive font-semibold text-center drop-shadow-lg block">
                  {cat.name}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
} 