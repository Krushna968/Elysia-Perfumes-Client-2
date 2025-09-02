import express from 'express';

const router = express.Router();

router.get('/calculate', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shipping calculation - to be implemented',
    shippingCost: 99
  });
});

export default router;
