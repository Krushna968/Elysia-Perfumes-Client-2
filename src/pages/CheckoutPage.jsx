import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, Truck, ArrowLeft, Check } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import PaymentGateway from '../components/PaymentGateway.jsx'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const { items, totalPrice } = useSelector(state => state.cart)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [orderPlaced, setOrderPlaced] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePlaceOrder = () => {
    console.log('Order placed:', { shippingInfo, paymentInfo, items, totalPrice })
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white border border-gray-200 p-8 text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed successfully and you'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 p-4 mb-6">
            <p className="text-sm text-gray-600">Order Total</p>
            <p className="text-2xl font-bold">₹{totalPrice}</p>
          </div>
          <Link to="/">
            <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="flex items-center text-gray-600 hover:text-black mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6">
              {/* Step Indicator */}
              <div className="flex items-center mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    <span className={`ml-2 text-sm ${currentStep >= step ? 'text-black font-medium' : 'text-gray-600'}`}>
                      {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
                    </span>
                    {step < 3 && <div className="w-12 h-px bg-gray-200 mx-4" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  {/* Payment Options */}
                  <div className="space-y-4 mb-6">
                    <div 
                      className={`border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center">
                        <CreditCard size={20} className="mr-3" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'upi' ? 'border-black bg-gray-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-blue-600 rounded mr-3"></div>
                        <span className="font-medium">UPI Payment</span>
                      </div>
                    </div>

                    <div 
                      className={`border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-center">
                        <Truck size={20} className="mr-3" />
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={paymentInfo.cardholderName}
                          onChange={handlePaymentChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        type="text"
                        placeholder="username@paytm"
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border border-gray-300 py-3 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="text-gray-600">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-gray-600 capitalize">{paymentMethod.replace('_', ' ')}</p>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center text-green-600 bg-green-50 p-3 rounded">
                      <Shield size={20} className="mr-2" />
                      <span className="text-sm">Your payment information is secured with 256-bit SSL encryption</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 border border-gray-300 py-3 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium"
                    >
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-gray-50"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
