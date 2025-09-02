import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
export const getProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    subcategory,
    brand,
    gender,
    fragranceFamily,
    concentration,
    minPrice,
    maxPrice,
    search,
    sort = '-createdAt',
    featured,
    onSale
  } = req.query;

  // Build filter object
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (brand) filter.brand = new RegExp(brand, 'i');
  if (gender) filter.gender = gender;
  if (fragranceFamily) filter.fragranceFamily = fragranceFamily;
  if (concentration) filter.concentration = concentration;
  if (featured) filter.isFeatured = featured === 'true';
  if (onSale) filter.isOnSale = onSale === 'true';

  // Price range filter
  if (minPrice || maxPrice) {
    filter['variants.price'] = {};
    if (minPrice) filter['variants.price'].$gte = parseFloat(minPrice);
    if (maxPrice) filter['variants.price'].$lte = parseFloat(maxPrice);
  }

  // Search filter
  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'price_asc':
      sortObj = { 'variants.price': 1 };
      break;
    case 'price_desc':
      sortObj = { 'variants.price': -1 };
      break;
    case 'name_asc':
      sortObj = { name: 1 };
      break;
    case 'name_desc':
      sortObj = { name: -1 };
      break;
    case 'rating':
      sortObj = { averageRating: -1 };
      break;
    case 'popular':
      sortObj = { sold: -1 };
      break;
    case 'newest':
    default:
      sortObj = { createdAt: -1 };
      break;
  }

  // Pagination
  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  // Execute query
  const products = await Product.find(filter)
    .populate('category subcategory', 'name slug')
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .select('-createdBy -lastUpdatedBy');

  // Get total count for pagination
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages,
    currentPage: parseInt(page),
    products
  });
});

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ 
    slug: req.params.slug,
    isActive: true 
  })
  .populate('category subcategory', 'name slug')
  .select('-createdBy -lastUpdatedBy');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = catchAsync(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true 
  })
  .populate('category', 'name slug')
  .sort({ createdAt: -1 })
  .limit(parseInt(limit))
  .select('-createdBy -lastUpdatedBy');

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// @desc    Get best selling products
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestSellingProducts = catchAsync(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ 
    isActive: true,
    sold: { $gt: 0 }
  })
  .populate('category', 'name slug')
  .sort({ sold: -1 })
  .limit(parseInt(limit))
  .select('-createdBy -lastUpdatedBy');

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = catchAsync(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(200).json({
      success: true,
      count: 0,
      products: []
    });
  }

  const products = await Product.find({
    $text: { $search: q },
    isActive: true
  })
  .populate('category', 'name slug')
  .limit(parseInt(limit))
  .select('name slug brand images priceRange averageRating')
  .sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// Admin routes

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
export const getAdminProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    isActive,
    isFeatured,
    lowStock,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (lowStock === 'true') filter.totalStock = { $lte: { $expr: '$lowStockThreshold' } };
  
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { 'variants.sku': new RegExp(search, 'i') }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  const products = await Product.find(filter)
    .populate('category subcategory', 'name')
    .populate('createdBy lastUpdatedBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    totalPages,
    currentPage: parseInt(page),
    products
  });
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin)
export const createProduct = catchAsync(async (req, res, next) => {
  // Add created by user
  req.body.createdBy = req.user.id;

  // Validate category exists
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(new AppError('Category not found', 400));
  }

  const product = await Product.create(req.body);

  logger.info('Product created', { productId: product._id, adminId: req.user.id });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

// @desc    Get single product (admin)
// @route   GET /api/admin/products/:id
// @access  Private (Admin)
export const getAdminProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category subcategory', 'name slug')
    .populate('createdBy lastUpdatedBy', 'name email');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
export const updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Add last updated by user
  req.body.lastUpdatedBy = req.user.id;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  logger.info('Product updated', { productId: product._id, adminId: req.user.id });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Soft delete - just mark as inactive
  product.isActive = false;
  product.lastUpdatedBy = req.user.id;
  await product.save();

  logger.info('Product deleted', { productId: product._id, adminId: req.user.id });

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Update product stock
// @route   PUT /api/admin/products/:id/stock
// @access  Private (Admin)
export const updateProductStock = catchAsync(async (req, res, next) => {
  const { variantId, stock, operation = 'set' } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    return next(new AppError('Variant not found', 400));
  }

  // Update stock based on operation
  switch (operation) {
    case 'set':
      variant.stock = stock;
      break;
    case 'add':
      variant.stock += stock;
      break;
    case 'subtract':
      variant.stock = Math.max(0, variant.stock - stock);
      break;
    default:
      return next(new AppError('Invalid operation', 400));
  }

  product.lastUpdatedBy = req.user.id;
  await product.save();

  logger.info('Product stock updated', { 
    productId: product._id, 
    variantId, 
    newStock: variant.stock,
    adminId: req.user.id 
  });

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    variant
  });
});

// @desc    Bulk update products
// @route   PUT /api/admin/products/bulk-update
// @access  Private (Admin)
export const bulkUpdateProducts = catchAsync(async (req, res, next) => {
  const { productIds, updates } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return next(new AppError('Product IDs are required', 400));
  }

  updates.lastUpdatedBy = req.user.id;

  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    updates
  );

  logger.info('Bulk products update', { 
    count: result.modifiedCount, 
    adminId: req.user.id 
  });

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} products updated successfully`,
    modifiedCount: result.modifiedCount
  });
});
