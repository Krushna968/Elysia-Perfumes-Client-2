import apiService from './api.js';

export class PaymentService {
  // Get available payment methods
  async getPaymentMethods() {
    try {
      const response = await apiService.get('/payments/methods');
      return response;
    } catch (error) {
      console.error('Get payment methods error:', error);
      // Return default payment methods if API fails
      return {
        success: true,
        methods: [
          {
            id: 'cod',
            name: 'Cash on Delivery',
            description: 'Pay when your order is delivered',
            isActive: true
          }
        ]
      };
    }
  }

  // Create COD order
  async createCODOrder(orderData) {
    try {
      const response = await apiService.post('/payments/cod-order', orderData);
      return response;
    } catch (error) {
      console.error('Create COD order error:', error);
      throw error;
    }
  }

  // Create Razorpay order (for online payment)
  async createRazorpayOrder(orderData) {
    try {
      const response = await apiService.post('/payments/create-order', orderData);
      return response;
    } catch (error) {
      console.error('Create Razorpay order error:', error);
      // If Razorpay is not available, suggest COD
      throw new Error('Online payment is currently unavailable. Please use Cash on Delivery.');
    }
  }

  // Verify Razorpay payment
  async verifyRazorpayPayment(paymentData) {
    try {
      const response = await apiService.post('/payments/verify-payment', paymentData);
      return response;
    } catch (error) {
      console.error('Verify Razorpay payment error:', error);
      throw error;
    }
  }

  // Calculate shipping cost
  async calculateShipping(shippingData) {
    try {
      const response = await apiService.get('/shipping/calculate', shippingData);
      return response;
    } catch (error) {
      console.error('Calculate shipping error:', error);
      // Return default shipping cost if API fails
      return {
        success: true,
        shippingCost: 99,
        message: 'Standard shipping charges applied'
      };
    }
  }

  // Get shipping rates for different locations
  async getShippingRates(address) {
    try {
      const response = await apiService.post('/shipping/rates', address);
      return response;
    } catch (error) {
      console.error('Get shipping rates error:', error);
      // Return default rates
      return {
        success: true,
        rates: [
          {
            id: 'standard',
            name: 'Standard Delivery',
            cost: 99,
            estimatedDays: '5-7 days',
            description: 'Standard delivery within 5-7 business days'
          },
          {
            id: 'express',
            name: 'Express Delivery',
            cost: 199,
            estimatedDays: '2-3 days',
            description: 'Express delivery within 2-3 business days'
          }
        ]
      };
    }
  }

  // Apply discount code
  async applyDiscountCode(code, orderValue) {
    try {
      const response = await apiService.post('/discounts/apply', {
        code: code,
        orderValue: orderValue
      });
      return response;
    } catch (error) {
      console.error('Apply discount code error:', error);
      throw error;
    }
  }

  // Get available discounts
  async getAvailableDiscounts() {
    try {
      const response = await apiService.get('/discounts');
      return response;
    } catch (error) {
      console.error('Get available discounts error:', error);
      return {
        success: true,
        discounts: []
      };
    }
  }

  // Calculate order totals
  calculateOrderTotals(items, shippingCost = 0, discount = 0, taxRate = 0.18) {
    const subtotal = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const discountAmount = typeof discount === 'object' ? discount.amount : discount;
    const taxableAmount = subtotal + shippingCost - discountAmount;
    const taxAmount = taxableAmount * taxRate;
    const total = subtotal + shippingCost + taxAmount - discountAmount;

    return {
      subtotal: Math.round(subtotal),
      shippingCost: Math.round(shippingCost),
      discount: Math.round(discountAmount),
      tax: Math.round(taxAmount),
      total: Math.round(total)
    };
  }

  // Format currency for Indian Rupees
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Validate order data
  validateOrderData(orderData) {
    const errors = [];

    // Check required fields
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (!orderData.shippingAddress) {
      errors.push('Shipping address is required');
    }

    // Validate shipping address
    if (orderData.shippingAddress) {
      const address = orderData.shippingAddress;
      if (!address.name) errors.push('Recipient name is required');
      if (!address.phone) errors.push('Phone number is required');
      if (!address.addressLine1) errors.push('Address line 1 is required');
      if (!address.city) errors.push('City is required');
      if (!address.state) errors.push('State is required');
      if (!address.pincode) errors.push('Pincode is required');
    }

    // Validate items
    if (orderData.items) {
      orderData.items.forEach((item, index) => {
        if (!item.product) errors.push(`Item ${index + 1}: Product ID is required`);
        if (!item.quantity || item.quantity < 1) errors.push(`Item ${index + 1}: Valid quantity is required`);
        if (!item.variant || !item.variant.size) errors.push(`Item ${index + 1}: Variant selection is required`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Process order based on payment method
  async processOrder(orderData, paymentMethod = 'cod') {
    // Validate order data first
    const validation = this.validateOrderData(orderData);
    if (!validation.isValid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      if (paymentMethod === 'cod') {
        return await this.createCODOrder(orderData);
      } else if (paymentMethod === 'razorpay') {
        return await this.createRazorpayOrder(orderData);
      } else {
        throw new Error('Invalid payment method selected');
      }
    } catch (error) {
      console.error('Process order error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
