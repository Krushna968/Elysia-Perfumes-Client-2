import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Truck, Award } from 'lucide-react'
import { mockPerfumes } from '../mockData'
import ProductCard from '../components/ProductCard.jsx'

const Homepage = () => {
  const bestsellers = mockPerfumes.filter(p => p.isBestseller)
  const newProducts = mockPerfumes.filter(p => p.isNew)
  const featuredProducts = mockPerfumes.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Screen with Elegant Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient and perfume bottle image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&h=1200&fit=crop&crop=center&auto=format&q=80')`
            }}
          ></div>
        </div>
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/30"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Pure, Authentic &amp; 
              <br />
              <span className="text-gray-100">Premium Essence</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light">
              Discover fragrances that capture your essence. Crafted with premium ingredients for the modern soul.
            </p>
            <Link to="/products">
              <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore Collection
              </button>
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white opacity-70"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Daily Wear', count: '6 products' },
              { name: 'Evening Wear', count: '4 products' },
              { name: 'For Men', count: '5 products' },
              { name: 'For Women', count: '7 products' }
            ].map((category) => (
              <Link key={category.name} to={`/products?category=${category.name}`}>
                <div className="bg-white border border-gray-200 p-4 text-center hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <Link to="/products" className="text-black hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Launches</h2>
            <Link to="/products?filter=new" className="text-black hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4 text-green-500" />
              <h3 className="font-bold text-lg mb-2">Authentic Products</h3>
              <p className="text-gray-600">100% genuine fragrances with quality guarantee</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on all orders across India</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 mb-4 text-purple-500" />
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Long-lasting fragrances made with finest ingredients</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
