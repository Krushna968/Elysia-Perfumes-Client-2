import express from 'express';
import {
  register,
  login,
  adminLogin,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification
} from '../controllers/authController.js';
import { protect, sensitiveOperationLimit } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateNewPassword
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, sensitiveOperationLimit(5), login);
router.post('/admin/login', validateLogin, sensitiveOperationLimit(3), adminLogin);
router.post('/forgot-password', validatePasswordReset, sensitiveOperationLimit(3), forgotPassword);
router.put('/reset-password/:resettoken', validateNewPassword, resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.post('/resend-verification', resendEmailVerification);

export default router;
