import express from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getBestSellingProducts,
  searchProducts
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellingProducts);
router.get('/search', validateSearch, searchProducts);
router.get('/', validatePagination, optionalAuth, getProducts);
router.get('/:slug', optionalAuth, getProduct);

export default router;
