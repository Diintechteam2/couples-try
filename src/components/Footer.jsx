import { Truck, CreditCard, Shirt, Package, Mail, Phone, MessageCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer({ categories = [] }) {
  return (
    <footer className="w-full bg-white">
      {/* Top Row: Features as Cards */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">Features</h2>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 border-b border-gray-200 bg-[#fff] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="w-full sm:w-auto flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center rounded-xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 mx-auto" style={{ background: '#FFE4EC' }}>
            <Truck size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
            <span className="mt-2 font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center text-gray-800">Free Shipping on orders above ₹999</span>
          </div>
          <div className="w-full sm:w-auto flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center rounded-xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 mx-auto" style={{ background: '#E3F6FC' }}>
            <CreditCard size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
            <span className="mt-2 font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center text-gray-800">100% Secure Payments</span>
          </div>
          <div className="w-full sm:w-auto flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center rounded-xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 mx-auto" style={{ background: '#FFF9E3' }}>
            <Shirt size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
            <span className="mt-2 font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center text-gray-800">New Trendy<br />Styles</span>
          </div>
          <div className="w-full sm:w-auto flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center rounded-xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 mx-auto" style={{ background: '#E6F7F3' }}>
            <Package size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
            <span className="mt-2 font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-center text-gray-800">Hassle Free Returns<br />and Exchange</span>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="w-full bg-[#FFC1CC] pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20 pb-20 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          {/* Mobile & Tablet Layout */}
          <div className="block xl:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
              {/* Logo & Community */}
              <div className="col-span-1 sm:col-span-2 flex flex-col items-start">
                <div className="flex flex-col items-center sm:items-start flex-1 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl md:text-3xl font-serif text-[#b73963] font-bold tracking-tight">Couples Try</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-cursive font-semibold mb-2 sm:mb-3 md:mb-4">Join Our Community</h3>
                <p className="mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg">Stay up to date with the new collections, products and exclusive offers</p>
                <form className="flex w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <input type="email" placeholder="E-mail" className="flex-1 border border-gray-700 rounded-l px-3 sm:px-4 md:px-6 py-2 sm:py-3 outline-none text-sm sm:text-base" />
                  <button type="submit" className="bg-[#F48FB1] hover:bg-[#e62e6b] text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-r text-sm sm:text-base">JOIN</button>
                </form>
              </div>
              
              {/* Shop Links */}
              <div className="col-span-1">
                <h4 className="text-lg sm:text-xl md:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Shop</h4>
                <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg">
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat.id}>
                        <Link to={`category/${cat.name}`} className="hover:text-pink-600 transition-colors">
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>No categories</li>
                  )}
                </ul>
              </div>
              
              {/* Quick Links */}
              <div className="col-span-1">
                <h4 className="text-lg sm:text-xl md:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Quick Links</h4>
                <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg">
                  <li>About Us</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms & Conditions</li>
                  <li>FAQs</li>
                </ul>
              </div>
              
              {/* Contact */}
              <div className="col-span-1 sm:col-span-2">
                <h4 className="text-lg sm:text-xl md:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Contact</h4>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                  <Phone size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="text-sm sm:text-base md:text-lg">+91 9971909625</span>
                  <a 
                    href="https://wa.me/919971909625?text=Hello%2C%20i%20wants%20to%20by%20on%20couples%20try" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-all duration-300 animate-bounce"
                  >
                    <FaWhatsapp size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </a>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="text-sm sm:text-base md:text-lg">contact@couplestry.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden xl:grid xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {/* Logo & Community */}
            <div className="col-span-1 flex flex-col items-start">
              <div className="flex flex-col items-start flex-1 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-serif text-[#b73963] font-bold tracking-tight">Couples Try</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-cursive font-semibold mb-2 sm:mb-3 md:mb-4">Join Our Community</h3>
              <p className="mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">Stay up to date with the new collections, products and exclusive offers</p>
              <form className="flex w-full max-w-xs sm:max-w-sm md:max-w-md">
                <input type="email" placeholder="E-mail" className="flex-1 border border-gray-700 rounded-l px-3 sm:px-4 md:px-6 py-2 sm:py-3 outline-none text-sm sm:text-base" />
                <button type="submit" className="bg-[#F48FB1] hover:bg-[#e62e6b] text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-r text-sm sm:text-base">JOIN</button>
              </form>
            </div>
            
            {/* Shop Links */}
            <div className="col-span-1">
              <h4 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Shop</h4>
              <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link to={`category/${cat.name}`} className="hover:text-pink-600 transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>No categories</li>
                )}
              </ul>
            </div>
            
            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="col-span-1">
              <h4 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-cursive font-semibold mb-3 sm:mb-4 md:mb-6">Contact</h4>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                <Phone size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                <span className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">+91 9971909625</span>
                <a 
                  href="https://wa.me/919971909625?text=Hello%2C%20i%20wants%20to%20by%20on%20couples%20try" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-all duration-300 animate-bounce"
                >
                  <FaWhatsapp size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                </a>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                <span className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">contact@couplestry.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-6 sm:my-8 md:my-10 lg:my-12 xl:my-10 border-gray-300" />
        
        <div className="text-center text-sm sm:text-base md:text-lg lg:text-base xl:text-lg text-gray-700 pb-2">
          © Copyright 2025 Couples Try. All Right Reserved.
        </div>
      </div>
    </footer> 
  )
} 