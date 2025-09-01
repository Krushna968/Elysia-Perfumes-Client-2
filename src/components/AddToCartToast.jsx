import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toggleCart } from '../store/cartSlice.js'

const AddToCartToast = ({ product, onClose }) => {
  const dispatch = useDispatch()

  const handleViewCart = () => {
    dispatch(toggleCart())
    onClose()
  }

  return (
    <div className="flex items-center space-x-3 max-w-sm">
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-300">
          Added to cart
        </p>
      </div>
      <button
        onClick={handleViewCart}
        className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 flex-shrink-0"
      >
        <ShoppingBag size={12} />
        <span>View Cart</span>
      </button>
    </div>
  )
}

export default AddToCartToast
