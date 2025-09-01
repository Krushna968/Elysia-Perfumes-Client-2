import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeCart, removeFromCart, updateQuantity } from '../store/cartSlice.js'

const CartSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isOpen, items, totalPrice } = useSelector(state => state.cart)

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleCheckout = () => {
    dispatch(closeCart())
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col border-l border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-gray-900">{item.name}</h3>
                        <p className="text-gray-900 font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-900 p-1 border border-gray-300 hover:border-gray-400"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-gray-900 min-w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-900 p-1 border border-gray-300 hover:border-gray-400"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold mb-4 text-gray-900">
                  <span>Total:</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3 hover:bg-gray-800 transition-all font-medium"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar
