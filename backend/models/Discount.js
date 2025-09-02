import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Discount code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Discount code cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Discount name is required'],
    trim: true,
    maxlength: [100, 'Discount name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
    required: true
  },
  value: {
    type: Number,
    required: function() {
      return this.type !== 'free_shipping';
    },
    min: [0, 'Discount value cannot be negative']
  },
  maxDiscount: {
    type: Number,
    min: [0, 'Max discount cannot be negative']
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order value cannot be negative']
  },
  maxOrderValue: {
    type: Number,
    min: [0, 'Maximum order value cannot be negative']
  },
  
  // Usage limits
  usageLimit: {
    total: {
      type: Number,
      min: [1, 'Total usage limit must be at least 1']
    },
    perCustomer: {
      type: Number,
      default: 1,
      min: [1, 'Per customer usage limit must be at least 1']
    }
  },
  usageCount: {
    total: {
      type: Number,
      default: 0
    },
    byCustomer: [{
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      count: {
        type: Number,
        default: 0
      },
      lastUsed: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Validity period
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },

  // Conditions
  conditions: {
    // Product/Category specific
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    excludeProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    excludeCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    
    // Customer specific
    applicableCustomers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    excludeCustomers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    customerTiers: [{
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum']
    }],
    newCustomersOnly: {
      type: Boolean,
      default: false
    },
    
    // Geographic restrictions
    applicableStates: [{
      type: String
    }],
    excludeStates: [{
      type: String
    }],
    applicablePincodes: [{
      type: String
    }],
    excludePincodes: [{
      type: String
    }],
    
    // Time restrictions
    validDays: [{
      type: Number,
      min: 0,
      max: 6 // 0 = Sunday, 6 = Saturday
    }],
    validHours: {
      start: {
        type: Number,
        min: 0,
        max: 23
      },
      end: {
        type: Number,
        min: 0,
        max: 23
      }
    }
  },

  // Buy X Get Y specific fields
  buyXGetY: {
    buyQuantity: Number,
    getQuantity: Number,
    buyProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    getProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    getDiscount: {
      type: Number,
      min: 0,
      max: 100
    }
  },

  // Status and visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isAutoApply: {
    type: Boolean,
    default: false
  },
  
  // Priority for multiple discounts
  priority: {
    type: Number,
    default: 0
  },
  
  // Stackable with other discounts
  isStackable: {
    type: Boolean,
    default: false
  },
  
  // Marketing
  promoText: {
    type: String,
    maxlength: [200, 'Promo text cannot exceed 200 characters']
  },
  bannerImage: {
    public_id: String,
    url: String
  },
  
  // System fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Analytics
  analytics: {
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
discountSchema.index({ code: 1 });
discountSchema.index({ isActive: 1 });
discountSchema.index({ startDate: 1, endDate: 1 });
discountSchema.index({ type: 1 });
discountSchema.index({ 'usageCount.byCustomer.customer': 1 });

// Validate end date is after start date
discountSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Validate percentage discounts
discountSchema.pre('save', function(next) {
  if (this.type === 'percentage' && this.value > 100) {
    return next(new Error('Percentage discount cannot exceed 100%'));
  }
  next();
});

// Check if discount is currently valid
discountSchema.methods.isCurrentlyValid = function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (!this.usageLimit.total || this.usageCount.total < this.usageLimit.total);
};

// Check if customer can use this discount
discountSchema.methods.canCustomerUse = function(customerId) {
  if (!this.isCurrentlyValid()) return false;
  
  // Check customer-specific conditions
  if (this.conditions.applicableCustomers.length > 0 && 
      !this.conditions.applicableCustomers.includes(customerId)) {
    return false;
  }
  
  if (this.conditions.excludeCustomers.includes(customerId)) {
    return false;
  }
  
  // Check per-customer usage limit
  const customerUsage = this.usageCount.byCustomer.find(
    usage => usage.customer.toString() === customerId.toString()
  );
  
  if (customerUsage && customerUsage.count >= this.usageLimit.perCustomer) {
    return false;
  }
  
  return true;
};

// Calculate discount amount
discountSchema.methods.calculateDiscount = function(orderValue, items = []) {
  if (!this.isCurrentlyValid()) return 0;
  
  let discountAmount = 0;
  
  switch (this.type) {
    case 'percentage':
      discountAmount = (orderValue * this.value) / 100;
      if (this.maxDiscount && discountAmount > this.maxDiscount) {
        discountAmount = this.maxDiscount;
      }
      break;
      
    case 'fixed':
      discountAmount = Math.min(this.value, orderValue);
      break;
      
    case 'free_shipping':
      // This should be handled separately in shipping calculation
      discountAmount = 0;
      break;
      
    case 'buy_x_get_y':
      // Complex logic for buy X get Y offers
      // This would need the cart items to calculate properly
      discountAmount = 0;
      break;
  }
  
  return Math.max(0, discountAmount);
};

// Update usage count
discountSchema.methods.incrementUsage = function(customerId) {
  this.usageCount.total += 1;
  
  const customerUsage = this.usageCount.byCustomer.find(
    usage => usage.customer.toString() === customerId.toString()
  );
  
  if (customerUsage) {
    customerUsage.count += 1;
    customerUsage.lastUsed = new Date();
  } else {
    this.usageCount.byCustomer.push({
      customer: customerId,
      count: 1,
      lastUsed: new Date()
    });
  }
  
  return this.save();
};

// Virtual for is expired
discountSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

// Virtual for days remaining
discountSchema.virtual('daysRemaining').get(function() {
  if (this.isExpired) return 0;
  
  const now = new Date();
  const diffTime = this.endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure JSON output includes virtuals
discountSchema.set('toJSON', { virtuals: true });
discountSchema.set('toObject', { virtuals: true });

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
