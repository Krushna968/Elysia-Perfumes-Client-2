import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Orders endpoint - to be implemented',
    orders: []
  });
});

export default router;
