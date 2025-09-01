import React, { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'

const PaymentGateway = ({ orderTotal, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Mock payment processing - In real implementation, integrate with Razorpay
  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success response
      const paymentResult = {
        success: true,
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        amount: orderTotal,
        method: paymentMethod,
        timestamp: new Date().toISOString()
      }
      
      onPaymentSuccess(paymentResult)
    } catch (error) {
      onPaymentError(error.message || 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Real Razorpay integration would look like this:
  const handleRazorpayPayment = () => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay key
      amount: orderTotal * 100, // Amount in paise
      currency: 'INR',
      name: 'Minimalist Perfumes',
      description: 'Order Payment',
      handler: function (response) {
        onPaymentSuccess({
          success: true,
          transactionId: response.razorpay_payment_id,
          amount: orderTotal,
          method: 'razorpay',
          timestamp: new Date().toISOString()
        })
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#000000'
      }
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        onPaymentError(response.error.description)
      })
      rzp.open()
    } else {
      // Fallback to mock payment if Razorpay is not loaded
      handlePayment()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Lock className="mr-2" size={20} />
        Secure Payment
      </h3>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Payment Method
        </label>
        
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <CreditCard className="mr-2" size={16} />
            <span className="text-sm font-medium">Credit/Debit Card</span>
          </label>
          
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <span className="text-sm font-medium">UPI Payment</span>
          </label>
          
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="netbanking"
              checked={paymentMethod === 'netbanking'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <span className="text-sm font-medium">Net Banking</span>
          </label>
          
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <span className="text-sm font-medium">Cash on Delivery</span>
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Order Total:</span>
          <span className="text-lg font-bold text-gray-900">₹{orderTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={paymentMethod === 'cod' ? handlePayment : handleRazorpayPayment}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : paymentMethod === 'cod' ? (
          'Confirm Order (COD)'
        ) : (
          `Pay ₹${orderTotal.toLocaleString('en-IN')}`
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <Lock size={12} className="mr-1" />
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  )
}

export default PaymentGateway
