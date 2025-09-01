import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { closeCart, removeFromCart, updateQuantity } from '../store/cartSlice.jsx'

const CartSidebar = () => {
  const dispatch = useDispatch()
  const { isOpen, items, totalPrice } = useSelector(state => state.cart)

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
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
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-gray-800 shadow-xl z-50 flex flex-col border-l border-gray-700"
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-white">Shopping Cart</h2>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 mt-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg bg-gray-700/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-white">{item.name}</h3>
                        <p className="text-amber-400 font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-700">
                <div className="flex justify-between text-lg font-semibold mb-4 text-white">
                  <span>Total:</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
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
