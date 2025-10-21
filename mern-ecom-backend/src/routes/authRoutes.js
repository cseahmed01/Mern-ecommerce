// src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Register admin (only if no admin exists)
router.post('/register-admin', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists.' });
  }

  const user = new User({ name, email, password, role: 'admin' });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.status(201).json({
    message: 'Admin registered successfully.',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

// Register customer
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email.' });
  }

  const user = new User({ name, email, password, role: 'customer' });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.status(201).json({
    message: 'Customer registered successfully.',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.json({
    message: 'Login successful.',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}));

// Get current user profile
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  res.json({ user: req.user });
}));

module.exports = router;