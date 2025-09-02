import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Discounts endpoint - to be implemented',
    discounts: []
  });
});

export default router;
