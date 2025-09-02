import express from 'express';

const router = express.Router();

router.get('/privacy-policy', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Privacy policy - to be implemented'
  });
});

router.get('/terms-conditions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Terms and conditions - to be implemented'
  });
});

export default router;
