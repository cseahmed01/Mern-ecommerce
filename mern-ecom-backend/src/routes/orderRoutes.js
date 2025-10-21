// src/routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Create order from cart (customer only)
router.post('/', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty.' });
  }

  // Validate stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.productId._id);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product?.name || 'product'}.`
      });
    }
  }

  // Calculate total amount
  const totalAmount = cart.items.reduce((total, item) => {
    const price = item.productId.discountPrice || item.productId.price;
    return total + (price * item.quantity);
  }, 0);

  // Create order
  const order = new Order({
    userId: req.user._id,
    items: cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.discountPrice || item.productId.price
    })),
    shippingAddress,
    paymentMethod,
    totalAmount
  });

  await order.save();

  // Update product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear cart
  await Cart.findOneAndDelete({ userId: req.user._id });

  await order.populate('userId', 'name email');

  res.status(201).json({
    message: 'Order placed successfully.',
    order
  });
}));

// Get user's orders (customer only)
router.get('/', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');

  res.json({ orders });
}));

// Get order by ID (customer only - own orders, admin - all orders)
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  let query = { _id: req.params.id };

  // If not admin, only allow viewing own orders
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  const order = await Order.findOne(query).populate('userId', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json({ order });
}));

// Update order status (admin only)
router.put('/:id/status', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      ...(orderStatus && { orderStatus }),
      ...(paymentStatus && { paymentStatus })
    },
    { new: true }
  ).populate('userId', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json({
    message: 'Order status updated successfully.',
    order
  });
}));

// Get all orders (admin only)
router.get('/admin/all', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus } = req.query;

  let query = {};
  if (status) query.orderStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'name email');

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

module.exports = router;