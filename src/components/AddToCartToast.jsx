import React from 'react'
import { Check } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toggleCart } from '../store/cartSlice.js'

const AddToCartToast = ({ product, onClose }) => {
  const dispatch = useDispatch()

  const handleViewCart = () => {
    dispatch(toggleCart())
    if (onClose) onClose()
  }

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 min-w-[400px] max-w-[500px]">
      <div className="flex items-center space-x-4">
        {/* Success Icon */}
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={16} className="text-white" />
        </div>
        
        {/* Product Image */}
        <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </p>
          <p className="text-sm text-gray-600">
            Added to cart
          </p>
        </div>
        
        {/* Go to Cart Button */}
        <button
          onClick={handleViewCart}
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium flex-shrink-0"
        >
          Go to Cart
        </button>
      </div>
    </div>
  )
}

export default AddToCartToast
