// src/routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Get user's cart
router.get('/', authenticate, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: 'items.productId',
    select: 'name images price discountPrice stock'
  });

  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
    await cart.save();
  }

  // Format cart items for frontend
  const formattedItems = cart.items.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    image: item.productId.images?.[0],
    price: item.productId.discountPrice || item.productId.price,
    quantity: item.quantity
  }));

  res.json({
    cart: {
      items: formattedItems,
      totalAmount: cart.totalAmount
    }
  });
}));

// Add item to cart
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;

  // Validate product exists and is in stock
  const product = await Product.findById(productId);
  if (!product || !product.status) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock.' });
  }

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [], totalAmount: 0 });
  }

  // Check if item already exists in cart
  const existingItem = cart.items.find(item => item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price });
  }

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  await cart.save();
  await cart.populate({
    path: 'items.productId',
    select: 'name images price discountPrice stock'
  });

  // Format response
  const formattedItems = cart.items.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    image: item.productId.images?.[0],
    price: item.price,
    quantity: item.quantity
  }));

  res.json({
    message: 'Item added to cart successfully.',
    cart: {
      items: formattedItems,
      totalAmount: cart.totalAmount
    }
  });
}));

// Update cart item quantity
router.put('/', authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' });
  }

  const item = cart.items.find(item => item.productId.toString() === productId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart.' });
  }

  // Check stock
  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock.' });
  }

  item.quantity = quantity;

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  await cart.save();
  await cart.populate({
    path: 'items.productId',
    select: 'name images price discountPrice stock'
  });

  const formattedItems = cart.items.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    image: item.productId.images?.[0],
    price: item.price,
    quantity: item.quantity
  }));

  res.json({
    message: 'Cart updated successfully.',
    cart: {
      items: formattedItems,
      totalAmount: cart.totalAmount
    }
  });
}));

// Remove item from cart
router.delete('/:productId', authenticate, asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' });
  }

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  await cart.save();
  await cart.populate({
    path: 'items.productId',
    select: 'name images price discountPrice stock'
  });

  const formattedItems = cart.items.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    image: item.productId.images?.[0],
    price: item.price,
    quantity: item.quantity
  }));

  res.json({
    message: 'Item removed from cart successfully.',
    cart: {
      items: formattedItems,
      totalAmount: cart.totalAmount
    }
  });
}));

module.exports = router;