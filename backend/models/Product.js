import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    altText: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    size: {
      type: String,
      required: true // e.g., "50ml", "100ml", "Travel Size"
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    weight: {
      type: Number, // in grams
      required: true
    },
    dimensions: {
      length: Number, // in cm
      width: Number,
      height: Number
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // Perfume specific fields
  fragranceFamily: {
    type: String,
    enum: ['Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Fruity', 'Spicy', 'Aquatic', 'Gourmand'],
    required: true
  },
  concentration: {
    type: String,
    enum: ['Parfum', 'EDP', 'EDT', 'EDC', 'Attar'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: true
  },
  topNotes: [{
    type: String,
    trim: true
  }],
  middleNotes: [{
    type: String,
    trim: true
  }],
  baseNotes: [{
    type: String,
    trim: true
  }],
  longevity: {
    type: String,
    enum: ['Poor', 'Weak', 'Moderate', 'Long Lasting', 'Very Long Lasting']
  },
  sillage: {
    type: String,
    enum: ['Intimate', 'Moderate', 'Strong', 'Enormous']
  },
  launchYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  perfumer: {
    type: String,
    trim: true
  },
  // Business fields
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  totalStock: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // SEO fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  metaKeywords: [{
    type: String
  }],
  // Shipping
  shippingClass: {
    type: String,
    enum: ['standard', 'fragile', 'liquid'],
    default: 'liquid'
  },
  shippingRestrictions: [{
    type: String // e.g., "No Air Shipping", "Domestic Only"
  }],
  // Inventory tracking
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ fragranceFamily: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'variants.price': 1 });
productSchema.index({ 'variants.sku': 1 });

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate total stock from variants
productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((total, variant) => {
      return total + (variant.isActive ? variant.stock : 0);
    }, 0);
  }
  next();
});

// Ensure only one main image
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const mainImages = this.images.filter(img => img.isMain);
    if (mainImages.length > 1) {
      // Keep only the first main image
      this.images.forEach((img, index) => {
        if (index > 0) img.isMain = false;
      });
    } else if (mainImages.length === 0) {
      // If no main image, make the first one main
      this.images[0].isMain = true;
    }
  }
  next();
});

// Virtual for price range
productSchema.virtual('priceRange').get(function() {
  if (!this.variants || this.variants.length === 0) return null;
  
  const activePrices = this.variants
    .filter(v => v.isActive)
    .map(v => v.price);
    
  if (activePrices.length === 0) return null;
  
  const min = Math.min(...activePrices);
  const max = Math.max(...activePrices);
  
  return {
    min,
    max,
    formatted: min === max ? `₹${min}` : `₹${min} - ₹${max}`
  };
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find(img => img.isMain) || this.images[0];
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.totalStock > 0;
});

// Virtual for low stock warning
productSchema.virtual('isLowStock').get(function() {
  return this.totalStock <= this.lowStockThreshold && this.totalStock > 0;
});

// Populate category and subcategory
productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'category subcategory',
    select: 'name slug'
  });
  next();
});

// Ensure JSON output includes virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
