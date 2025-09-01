import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Plus } from 'lucide-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCart } from '../store/cartSlice.js'
import AddToCartToast from './AddToCartToast.jsx'

const ProductCard = ({ product, showAddToCart = true }) => {
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
    <div className="bg-white border border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer group">
      {/* Product Image */}
      <div 
        className="relative bg-gray-50 aspect-[3/4] overflow-hidden"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 font-medium">
            {product.discount}% OFF
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 font-medium">
            NEW
          </div>
        )}
        
        {/* Add to Cart Button on Hover */}
        <AnimatePresence>
          {isHovered && showAddToCart && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Info */}
      <div className="p-4" onClick={handleCardClick}>
        <h3 className="font-medium text-gray-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.shortDescription}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        
        {/* Pricing */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
