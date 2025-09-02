import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Search, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart } from '../store/cartSlice.js'
import LoginModal from './LoginModal.jsx'

const Header = () => {
  const dispatch = useDispatch()
  const { totalItems } = useSelector(state => state.cart)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Banner - like BeMinimalist */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <span>Buy 2 products and get an exclusive bottle! </span>
        <span className="ml-4">Enjoy free shipping on every order!</span>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
            Minimalist Perfumes
          </Link>
          
          {/* Navigation - Hidden on mobile, visible on larger screens */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/products" className="text-gray-700 hover:text-black transition-colors font-medium">Shop All</Link>
            <Link to="/products?category=Men" className="text-gray-700 hover:text-black transition-colors font-medium">For Men</Link>
            <Link to="/products?category=Women" className="text-gray-700 hover:text-black transition-colors font-medium">For Women</Link>
            <Link to="/products?category=Daily Wear" className="text-gray-700 hover:text-black transition-colors font-medium">Daily Wear</Link>
            <Link to="/products?category=Evening Wear" className="text-gray-700 hover:text-black transition-colors font-medium">Evening</Link>
            {/* Developer Link */}
            <Link to="/api-test" className="text-blue-600 hover:text-blue-800 transition-colors text-xs font-mono bg-blue-50 px-2 py-1 rounded">API Test</Link>
          </nav>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-gray-700 hover:text-black transition-colors"
            >
              <User size={20} />
            </button>
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative text-gray-700 hover:text-black transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
    />
    </>
  )
}

export default Header
