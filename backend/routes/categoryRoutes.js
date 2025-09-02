import express from 'express';

const router = express.Router();

// Public routes - to be implemented
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Categories endpoint - to be implemented',
    categories: []
  });
});

export default router;
