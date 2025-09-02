import express from 'express';
import {
  getAdminProducts,
  createProduct,
  getAdminProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkUpdateProducts
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateProduct, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Product management routes
router.route('/products')
  .get(getAdminProducts)
  .post(validateProduct, createProduct);

router.put('/products/bulk-update', bulkUpdateProducts);

router.route('/products/:id')
  .get(validateObjectId('id'), getAdminProduct)
  .put(validateObjectId('id'), updateProduct)
  .delete(validateObjectId('id'), deleteProduct);

router.put('/products/:id/stock', validateObjectId('id'), updateProductStock);

// Dashboard endpoint
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin dashboard - to be implemented',
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalCustomers: 0
    }
  });
});

export default router;
