import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      size: {
        type: String,
        required: true
      },
      sku: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  
  // Pricing breakdown
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    }
  },
  tax: {
    cgst: {
      rate: Number,
      amount: Number
    },
    sgst: {
      rate: Number,
      amount: Number
    },
    igst: {
      rate: Number,
      amount: Number
    },
    totalTax: {
      type: Number,
      default: 0
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },

  // Address information
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },
  billingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: String
  },

  // Order status and tracking
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Payment information
  paymentInfo: {
    method: {
      type: String,
      enum: ['razorpay', 'cod', 'wallet', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    failureReason: String
  },

  // Shipping information
  shippingInfo: {
    provider: {
      type: String,
      enum: ['shiprocket', 'bluedart', 'delhivery', 'dtdc', 'fedex'],
      default: 'shiprocket'
    },
    trackingNumber: String,
    shippingOrderId: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },

  // Customer communication
  notes: {
    customer: String,
    admin: String,
    internal: String
  },

  // Invoice details
  invoice: {
    number: String,
    generatedAt: Date,
    url: String
  },

  // Return/Refund information
  returnInfo: {
    requested: {
      type: Boolean,
      default: false
    },
    requestedAt: Date,
    reason: String,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked_up', 'received', 'processed'],
    },
    refundAmount: Number,
    refundedAt: Date,
    pickupScheduled: Date
  },

  // Marketing and analytics
  source: {
    type: String,
    default: 'website'
  },
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,

  // System fields
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  specialInstructions: String,
  
  // Timestamps
  expectedDelivery: Date,
  actualDelivery: Date,
  
  // Customer service
  supportTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket'
  }]
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'paymentInfo.razorpayOrderId': 1 });
orderSchema.index({ 'shippingInfo.trackingNumber': 1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ELY${timestamp}${random}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calculate total amount
  this.totalAmount = this.subtotal + this.shippingCost - this.discount.amount + this.tax.totalTax;
  
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for can cancel
orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can return
orderSchema.virtual('canReturn').get(function() {
  if (this.status !== 'delivered') return false;
  
  const deliveredDate = this.actualDelivery || this.deliveredAt;
  if (!deliveredDate) return false;
  
  const daysSinceDelivery = Math.ceil((new Date() - deliveredDate) / (1000 * 60 * 60 * 24));
  return daysSinceDelivery <= 7; // 7 days return policy
});

// Virtual for is paid
orderSchema.virtual('isPaid').get(function() {
  return this.paymentInfo.status === 'completed';
});

// Populate customer and product details
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'customer',
    select: 'name email phone'
  }).populate({
    path: 'items.product',
    select: 'name slug images brand'
  });
  next();
});

// Ensure JSON output includes virtuals
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
