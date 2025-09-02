import express from 'express';

const router = express.Router();

router.post('/newsletter/subscribe', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Newsletter subscription - to be implemented'
  });
});

export default router;
