import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);
  
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  // Remove password from output
  user.password = undefined;
  
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message: statusCode === 201 ? 'Registration successful' : 'Login successful',
      token,
      user
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'customer'
  });
  
  logger.info('New user registered', { userId: user._id, email: user.email });
  
  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  // Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid credentials', 401));
  }
  
  logger.info('User logged in', { userId: user._id, email: user.email });
  
  sendTokenResponse(user, 200, res);
});

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return next(new AppError('Invalid admin credentials', 401));
  }
  
  // Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid admin credentials', 401));
  }
  
  logger.info('Admin logged in', { userId: user._id, email: user.email, role: user.role });
  
  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })
    .json({
      success: true,
      message: 'Logout successful'
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('wishlist', 'name slug images priceRange')
    .populate('cart.product', 'name slug images variants');
    
  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone
  };
  
  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );
  
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  
  logger.info('User profile updated', { userId: user._id });
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Current password is incorrect', 400));
  }
  
  user.password = newPassword;
  await user.save();
  
  logger.info('Password changed', { userId: user._id });
  
  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    return next(new AppError('No user found with this email address', 404));
  }
  
  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  
  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  
  // TODO: Send email with reset link
  // For now, we'll just return the token (remove this in production)
  
  logger.info('Password reset requested', { userId: user._id, email });
  
  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    // Remove this line in production:
    resetToken: resetToken
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }
  
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  logger.info('Password reset successful', { userId: user._id });
  
  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  
  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(new AppError('Invalid or expired verification token', 400));
  }
  
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();
  
  logger.info('Email verified', { userId: user._id });
  
  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendEmailVerification = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (user.emailVerified) {
    return next(new AppError('Email is already verified', 400));
  }
  
  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  await user.save({ validateBeforeSave: false });
  
  // TODO: Send verification email
  
  logger.info('Email verification resent', { userId: user._id });
  
  res.status(200).json({
    success: true,
    message: 'Verification email sent'
  });
});
