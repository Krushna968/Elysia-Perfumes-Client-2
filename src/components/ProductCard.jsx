import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCart } from '../store/cartSlice.jsx'
import AddToCartToast from './AddToCartToast.jsx'

const ProductCard = ({ product, showAddToCart = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    toast.custom((t) => (
      <AddToCartToast 
        product={product} 
        onClose={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    })
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <AnimatePresence>
          {isHovered && showAddToCart && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              Add to Cart
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</span>
          <div className="flex items-center">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300 ml-1">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-serif text-lg text-white mb-1">{product.name}</h3>
        <p className="text-amber-400 font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  )
}

export default ProductCard
