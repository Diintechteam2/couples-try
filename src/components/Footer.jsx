import { Truck, CreditCard, Shirt, Package, Mail, Phone, MessageCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer({ categories = [] }) {
  return (
    <footer className="w-full bg-white mt-">
      {/* Top Row: Features as Cards */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full text-center md:mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Features</h2>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 py-8 border-b border-gray-200 bg-[#fff]">
          <div className="w-64 md:flex-1 flex flex-col items-center rounded-xl shadow-md p-6 md:min-w-[220px] md:max-w-xs mx-auto" style={{ background: '#FFE4EC' }}>
            <Truck size={36} />
            <span className="mt-2 font-medium text-lg text-center text-gray-800">Free Shipping on orders above ₹999</span>
          </div>
          <div className="w-64 md:flex-1 flex flex-col items-center rounded-xl shadow-md p-6 md:min-w-[220px] md:max-w-xs mx-auto" style={{ background: '#E3F6FC' }}>
            <CreditCard size={36} />
            <span className="mt-2 font-medium text-lg text-center text-gray-800">100% Secure Payments</span>
          </div>
          <div className="w-64 md:flex-1 flex flex-col items-center rounded-xl shadow-md p-6 md:min-w-[220px] md:max-w-xs mx-auto" style={{ background: '#FFF9E3' }}>
            <Shirt size={36} />
            <span className="mt-2 font-medium text-lg text-center text-gray-800">New Trendy<br />Styles</span>
          </div>
          <div className="w-64 md:flex-1 flex flex-col items-center rounded-xl shadow-md p-6 md:min-w-[220px] md:max-w-xs mx-auto" style={{ background: '#E6F7F3' }}>
            <Package size={36} />
            <span className="mt-2 font-medium text-lg text-center text-gray-800">Hassle Free Returns<br />and Exchange</span>
          </div>
        </div>
      </div>
      {/* Main Footer */}
      <div className="w-full bg-[#FFC1CC] pt-10 pb-20 md:pb-4 px-4 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Community */}
          <div className="col-span-1 flex flex-col items-start">
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl md:text-4xl font-serif text-[#b73963] font-bold tracking-tight">Couples Try</span>
            </div>
            <h3 className="text-xl font-cursive font-semibold mb-2">Join Our Community</h3>
            <p className="mb-3 text-base">Stay up to date with the new collections, products and exclusive offers</p>
            <form className="flex w-full max-w-xs">
              <input type="email" placeholder="E-mail" className="flex-1 border border-gray-700 rounded-l px-4 py-2 outline-none" />
              <button type="submit" className="bg-[#F48FB1] hover:bg-[#e62e6b] text-white font-semibold px-6 py-2 rounded-r">JOIN</button>
            </form>
          </div>
          {/* Shop Links */}
          <div className="col-span-1">
            <h4 className="text-xl font-cursive font-semibold mb-3">Shop</h4>
            <ul className="space-y-1 text-base">
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
            <h4 className="text-xl font-cursive font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1 text-base">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>FAQs</li>
            </ul>
          </div>
          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-xl font-cursive font-semibold mb-3">Contact</h4>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={20} />
              <span>+91 9971909625</span>
              <a 
                href="https://wa.me/919971909625?text=Hello%2C%20i%20wants%20to%20by%20on%20couples%20try" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-all duration-300 animate-bounce"
              >
                <FaWhatsapp size={28} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={20} />
              <span>contact@couplestry.com</span>
            </div>
          </div>
        </div>
        <hr className="my-8 border-gray-300" />
        <div className="text-center text-base text-gray-700 pb-2">
          © Copyright 2025 Couples Try. All Right Reserved.
        </div>
      </div>
    </footer>
  )
} 