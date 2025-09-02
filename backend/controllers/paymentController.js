import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// @desc    Create demo payment order (for development)
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = catchAsync(async (req, res, next) => {
  // This is a demo implementation for development
  return next(new AppError('Razorpay integration disabled for development. Use COD instead.', 501));

  const { items, shippingAddress, totalAmount } = req.body;

  // Validate items and calculate total
  let calculatedTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return next(new AppError(`Product not found: ${item.product}`, 400));
    }

    const variant = product.variants.find(v => v.size === item.variant.size);
    if (!variant || !variant.isActive) {
      return next(new AppError(`Variant not found for product: ${product.name}`, 400));
    }

    if (variant.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name} - ${variant.size}`, 400));
    }

    const itemTotal = variant.price * item.quantity;
    calculatedTotal += itemTotal;

    orderItems.push({
      product: product._id,
      variant: {
        size: variant.size,
        sku: variant.sku,
        price: variant.price
      },
      quantity: item.quantity,
      unitPrice: variant.price,
      totalPrice: itemTotal
    });
  }

  // Create order in database first
  const order = await Order.create({
    customer: req.user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: req.body.billingAddress || shippingAddress,
    subtotal: calculatedTotal,
    shippingCost: req.body.shippingCost || 0,
    tax: req.body.tax || { totalTax: 0 },
    totalAmount: totalAmount,
    paymentInfo: {
      method: 'razorpay',
      status: 'pending'
    },
    status: 'pending'
  });

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // Amount in paise
    currency: 'INR',
    receipt: order.orderNumber,
    payment_capture: 1
  });

  // Update order with Razorpay order ID
  order.paymentInfo.razorpayOrderId = razorpayOrder.id;
  await order.save();

  logger.info('Razorpay order created', { 
    orderId: order._id, 
    razorpayOrderId: razorpayOrder.id,
    customerId: req.user.id 
  });

  res.status(201).json({
    success: true,
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      currency: 'INR'
    },
    razorpayOrder: {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    },
    keyId: process.env.RAZORPAY_KEY_ID
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-payment
// @access  Private
export const verifyRazorpayPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.customer.toString() !== req.user.id) {
    return next(new AppError('Unauthorized access to order', 403));
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    order.paymentInfo.status = 'failed';
    order.paymentInfo.failureReason = 'Invalid signature';
    await order.save();

    logger.error('Payment signature verification failed', { 
      orderId: order._id, 
      razorpayOrderId: razorpay_order_id 
    });

    return next(new AppError('Payment verification failed', 400));
  }

  // Update order with payment details
  order.paymentInfo.status = 'completed';
  order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
  order.paymentInfo.razorpaySignature = razorpay_signature;
  order.paymentInfo.paidAt = new Date();
  order.status = 'confirmed';

  // Update product stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(v => v.sku === item.variant.sku);
      if (variant) {
        variant.stock -= item.quantity;
        product.sold += item.quantity;
      }
      await product.save();
    }
  }

  await order.save();

  logger.info('Payment verified successfully', { 
    orderId: order._id, 
    paymentId: razorpay_payment_id,
    customerId: req.user.id 
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentInfo.status
    }
  });
});

// @desc    Handle Razorpay webhooks
// @route   POST /api/payments/webhook
// @access  Public (but verified)
export const handleRazorpayWebhook = catchAsync(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const webhookSignature = req.headers['x-razorpay-signature'];

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    logger.error('Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const { event, payload } = req.body;

  try {
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;
      default:
        logger.info('Unhandled webhook event', { event });
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Webhook processing error', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper function to handle payment captured
const handlePaymentCaptured = async (payment) => {
  const order = await Order.findOne({
    'paymentInfo.razorpayOrderId': payment.order_id
  });

  if (order && order.paymentInfo.status === 'pending') {
    order.paymentInfo.status = 'completed';
    order.paymentInfo.razorpayPaymentId = payment.id;
    order.paymentInfo.paidAt = new Date();
    order.status = 'confirmed';
    
    await order.save();

    logger.info('Payment captured via webhook', { 
      orderId: order._id, 
      paymentId: payment.id 
    });
  }
};

// Helper function to handle payment failed
const handlePaymentFailed = async (payment) => {
  const order = await Order.findOne({
    'paymentInfo.razorpayOrderId': payment.order_id
  });

  if (order && order.paymentInfo.status === 'pending') {
    order.paymentInfo.status = 'failed';
    order.paymentInfo.failureReason = payment.error_description || 'Payment failed';
    order.status = 'cancelled';
    
    await order.save();

    logger.info('Payment failed via webhook', { 
      orderId: order._id, 
      reason: payment.error_description 
    });
  }
};

// Helper function to handle order paid
const handleOrderPaid = async (razorpayOrder) => {
  const order = await Order.findOne({
    'paymentInfo.razorpayOrderId': razorpayOrder.id
  });

  if (order && order.paymentInfo.status !== 'completed') {
    order.paymentInfo.status = 'completed';
    order.status = 'confirmed';
    
    await order.save();

    logger.info('Order paid via webhook', { 
      orderId: order._id, 
      razorpayOrderId: razorpayOrder.id 
    });
  }
};

// @desc    Create COD order
// @route   POST /api/payments/cod-order
// @access  Private
export const createCODOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress, totalAmount } = req.body;

  // Validate items and calculate total (similar to Razorpay)
  let calculatedTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return next(new AppError(`Product not found: ${item.product}`, 400));
    }

    const variant = product.variants.find(v => v.size === item.variant.size);
    if (!variant || !variant.isActive) {
      return next(new AppError(`Variant not found for product: ${product.name}`, 400));
    }

    if (variant.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name} - ${variant.size}`, 400));
    }

    const itemTotal = variant.price * item.quantity;
    calculatedTotal += itemTotal;

    orderItems.push({
      product: product._id,
      variant: {
        size: variant.size,
        sku: variant.sku,
        price: variant.price
      },
      quantity: item.quantity,
      unitPrice: variant.price,
      totalPrice: itemTotal
    });
  }

  // Create COD order
  const order = await Order.create({
    customer: req.user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: req.body.billingAddress || shippingAddress,
    subtotal: calculatedTotal,
    shippingCost: req.body.shippingCost || 0,
    tax: req.body.tax || { totalTax: 0 },
    totalAmount: totalAmount,
    paymentInfo: {
      method: 'cod',
      status: 'pending'
    },
    status: 'confirmed'
  });

  // Update product stock for COD orders
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(v => v.sku === item.variant.sku);
      if (variant) {
        variant.stock -= item.quantity;
        product.sold += item.quantity;
      }
      await product.save();
    }
  }

  logger.info('COD order created', { 
    orderId: order._id, 
    customerId: req.user.id 
  });

  res.status(201).json({
    success: true,
    message: 'COD order placed successfully',
    order: {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: 'cod'
    }
  });
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
export const getPaymentMethods = catchAsync(async (req, res) => {
  const methods = [
    {
      id: 'razorpay',
      name: 'Online Payment',
      description: 'Pay securely with UPI, Card, Net Banking',
      isActive: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      isActive: true
    }
  ];

  res.status(200).json({
    success: true,
    methods
  });
});
