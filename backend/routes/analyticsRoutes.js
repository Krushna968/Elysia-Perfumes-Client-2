import express from 'express';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Analytics dashboard - to be implemented',
    analytics: {}
  });
});

export default router;
