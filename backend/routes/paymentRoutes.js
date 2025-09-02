import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  createCODOrder,
  getPaymentMethods
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/methods', getPaymentMethods);
router.post('/webhook', handleRazorpayWebhook);

// Protected routes
router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);
router.post('/cod-order', createCODOrder);

export default router;
