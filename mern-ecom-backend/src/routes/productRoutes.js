// src/routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Create product (admin only)
router.post('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, description, categoryId, brand, price, discountPrice, stock, images, tags, isFeatured, status } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const product = new Product({
    name,
    slug,
    description,
    categoryId,
    brand,
    price,
    discountPrice,
    stock,
    images,
    tags,
    isFeatured,
    status
  });
  await product.save();

  res.status(201).json({ message: 'Product created successfully.', product });
}));

// Get all products
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({ status: true }).populate('categoryId', 'name');
  res.json({ products });
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('categoryId', 'name');
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json({ product });
}));

// Update product (admin only)
router.put('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, description, categoryId, brand, price, discountPrice, stock, images, tags, isFeatured, status } = req.body;
  const updateData = {};

  if (name) {
    updateData.name = name;
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  if (description !== undefined) updateData.description = description;
  if (categoryId) updateData.categoryId = categoryId;
  if (brand !== undefined) updateData.brand = brand;
  if (price !== undefined) updateData.price = price;
  if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
  if (stock !== undefined) updateData.stock = stock;
  if (images) updateData.images = images;
  if (tags) updateData.tags = tags;
  if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
  if (status !== undefined) updateData.status = status;

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('categoryId', 'name');
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ message: 'Product updated successfully.', product });
}));

// Delete product (admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ message: 'Product deleted successfully.' });
}));

module.exports = router;