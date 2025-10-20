// src/routes/categoryRoutes.js
const express = require('express');
const Category = require('../models/Category');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Create category (admin only)
router.post('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const category = new Category({ name, slug, description, image });
  await category.save();

  res.status(201).json({ message: 'Category created successfully.', category });
}));

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: true });
  res.json({ categories });
}));

// Get category by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.json({ category });
}));

// Update category (admin only)
router.put('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { name, description, image, status } = req.body;
  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;
  if (status !== undefined) updateData.status = status;

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  res.json({ message: 'Category updated successfully.', category });
}));

// Delete category (admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  res.json({ message: 'Category deleted successfully.' });
}));

module.exports = router;