import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { mockPerfumes, testimonials } from '../mockData'
import ProductCard from '../components/ProductCard.jsx'

const Homepage = () => {
  const bestsellers = mockPerfumes.filter(p => p.isBestseller)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-amber-900/30" />
        
        <motion.div
          className="relative text-center text-white z-10 px-6 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-serif mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Elysia Perfumes
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-100 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Crafted Scents, Defining Moments
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Link to="/products">
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-xl text-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-2xl border border-amber-400/30"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute -top-10 -left-10 w-20 h-20 bg-amber-400/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </motion.div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif text-white mb-4">Bestsellers</h2>
            <p className="text-gray-300">Discover our most beloved fragrances</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif text-white mb-4">Shop by Category</h2>
            <p className="text-gray-300">Find your perfect scent</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['For Him', 'For Her', 'Unisex'].map((category, index) => {
              const images = [
                'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=400&fit=crop'
              ]
              return (
                <motion.div
                  key={category}
                  className="relative h-64 rounded-xl overflow-hidden cursor-pointer group border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={images[index]}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-amber-900/40 flex items-center justify-center">
                    <Link to={`/products?category=${encodeURIComponent(category)}`}>
                      <h3 className="text-2xl font-serif text-white">{category}</h3>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Ingredient */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif text-white mb-6">Featured Ingredient</h2>
              <h3 className="text-2xl text-amber-400 mb-4">Sandalwood</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Sourced from the ancient forests of India, our premium sandalwood brings warm,
                creamy, and meditative qualities to our fragrances. This precious wood has been
                treasured for centuries for its ability to ground the spirit while creating an
                aura of sophisticated elegance.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Each drop carries the essence of time and tradition, making every fragrance
                that contains sandalwood a journey into luxury and mindfulness.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-xl overflow-hidden border border-gray-700"
            >
              <img
                src="https://images.unsplash.com/photo-1571875257727-256c39b1de42?w=600&h=400&fit=crop"
                alt="Sandalwood"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-serif text-white mb-4">What Our Customers Say</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center bg-gray-700/50 p-8 rounded-xl border border-gray-600"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-200 mb-4 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-medium text-white">
                  {testimonials[currentTestimonial].name}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
