import { Search, Grid, Home, User, ShoppingBag } from "lucide-react"

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 z-10 md:hidden">
      <div className="flex flex-col items-center text-[10px] text-gray-700">
        <Search size={22} />
        <span>Search</span>
      </div>
      <div className="flex flex-col items-center text-[10px] text-gray-700">
        <Grid size={22} />
        <span>Category</span>
      </div>
      <div className="flex flex-col items-center text-[10px] text-gray-700">
        <Home size={22} />
        <span>Home</span>
      </div>
      <div className="flex flex-col items-center text-[10px] text-gray-700">
        <User size={22} />
        <span>Account</span>
      </div>
      <div className="flex flex-col items-center text-[10px] text-gray-700 relative">
        <ShoppingBag size={22} />
        <span>Cart</span>
        <span className="absolute -top-1 -right-2 bg-pink-200 text-pink-700 text-[10px] rounded-full px-1.5 py-0.5 font-bold">0</span>
      </div>
    </nav>
  )
} 