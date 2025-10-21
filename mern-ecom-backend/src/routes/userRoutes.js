// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ user });
}));

// Update current user profile
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  // Check if email is already taken by another user
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken.' });
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (address) updateData.address = address;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');

  res.json({
    message: 'Profile updated successfully.',
    user
  });
}));

// Change password
router.put('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully.' });
}));

// Add to wishlist
router.post('/wishlist', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }

  res.json({
    message: 'Product added to wishlist.',
    wishlist: user.wishlist
  });
}));

// Remove from wishlist
router.delete('/wishlist/:productId', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();

  res.json({
    message: 'Product removed from wishlist.',
    wishlist: user.wishlist
  });
}));

// Get wishlist
router.get('/wishlist', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice');
  res.json({ wishlist: user.wishlist });
}));

// Get all customers (admin only)
router.get('/customers', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  let query = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const customers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    customers,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// Get customer by ID (admin only)
router.get('/customers/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-password');
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' });
  }
  res.json({ customer });
}));

// Update customer (admin only)
router.put('/customers/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (address) updateData.address = address;

  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'customer' },
    updateData,
    { new: true }
  ).select('-password');

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' });
  }

  res.json({
    message: 'Customer updated successfully.',
    customer
  });
}));

// Delete customer (admin only)
router.delete('/customers/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const customer = await User.findOneAndDelete({ _id: req.params.id, role: 'customer' });
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' });
  }

  res.json({ message: 'Customer deleted successfully.' });
}));

module.exports = router;