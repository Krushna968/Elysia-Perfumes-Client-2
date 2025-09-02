import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(`Validation Error: ${errorMessages.join(', ')}`, 400));
  }
  
  next();
};

// User registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
    
  handleValidationErrors
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Password reset validation
export const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  handleValidationErrors
];

// New password validation
export const validateNewPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  handleValidationErrors
];

// Address validation
export const validateAddress = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
    
  body('addressLine1')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address line 1 must be between 5 and 200 characters'),
    
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
    
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
    
  body('pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
    
  handleValidationErrors
];

// Product validation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
    
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
    
  body('brand')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be between 2 and 50 characters'),
    
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
    
  body('fragranceFamily')
    .isIn(['Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Fruity', 'Spicy', 'Aquatic', 'Gourmand'])
    .withMessage('Please select a valid fragrance family'),
    
  body('concentration')
    .isIn(['Parfum', 'EDP', 'EDT', 'EDC', 'Attar'])
    .withMessage('Please select a valid concentration'),
    
  body('gender')
    .isIn(['Men', 'Women', 'Unisex'])
    .withMessage('Please select a valid gender category'),
    
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least one variant is required'),
    
  body('variants.*.size')
    .trim()
    .notEmpty()
    .withMessage('Variant size is required'),
    
  body('variants.*.price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Variant price must be a positive number'),
    
  body('variants.*.stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
    
  body('variants.*.sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required for each variant'),
    
  handleValidationErrors
];

// Category validation
export const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid parent category ID'),
    
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
    
  body('items.*.product')
    .isMongoId()
    .withMessage('Please provide a valid product ID'),
    
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
    
  body('items.*.variant.size')
    .trim()
    .notEmpty()
    .withMessage('Variant size is required'),
    
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
    
  body('paymentInfo.method')
    .isIn(['razorpay', 'cod'])
    .withMessage('Please select a valid payment method'),
    
  handleValidationErrors
];

// Discount validation
export const validateDiscount = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .isAlphanumeric()
    .withMessage('Discount code must be 3-20 alphanumeric characters'),
    
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Discount name must be between 3 and 100 characters'),
    
  body('type')
    .isIn(['percentage', 'fixed', 'free_shipping'])
    .withMessage('Please select a valid discount type'),
    
  body('value')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
    
  body('minOrderValue')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Minimum order value must be a positive number'),
    
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
    
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date'),
    
  handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Please provide a valid ${field}`),
    
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

// Search validation
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
    
  handleValidationErrors
];

// Email validation
export const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  handleValidationErrors
];
