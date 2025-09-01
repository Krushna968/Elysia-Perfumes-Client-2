// client/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../store/cartSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { totalItems } = useSelector(state => state.cart);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif text-gray-800 hover:text-amber-600 transition-colors">
            Elysia Perfumes
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors">All Perfumes</Link>
            <Link to="/products?category=For Him" className="text-gray-700 hover:text-amber-600 transition-colors">For Him</Link>
            <Link to="/products?category=For Her" className="text-gray-700 hover:text-amber-600 transition-colors">For Her</Link>
            <Link to="/products?category=Unisex" className="text-gray-700 hover:text-amber-600 transition-colors">Unisex</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-amber-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="text-gray-700 hover:text-amber-600 transition-colors">
              <User size={20} />
            </button>
            <motion.button
              onClick={() => dispatch(toggleCart())}
              className="relative text-gray-700 hover:text-amber-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;