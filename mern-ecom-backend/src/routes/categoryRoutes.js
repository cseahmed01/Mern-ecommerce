// src/routes/categoryRoutes.js
const express = require('express');
const Category = require('../models/Category');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for category image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/categories');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create category (admin only)
router.post('/', authenticate, authorize('admin'), upload.single('image'), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/categories/${req.file.filename}`;
  }

  const category = new Category({ name, slug, description, image: imagePath });
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
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;
  const updateData = {};

  if (name) {
    updateData.name = name;
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;

  // Handle image upload
  if (req.file) {
    updateData.image = `/uploads/categories/${req.file.filename}`;

    // Delete old image if exists
    const existingCategory = await Category.findById(req.params.id);
    if (existingCategory && existingCategory.image) {
      const oldImagePath = path.join(__dirname, '../../', existingCategory.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  res.json({ message: 'Category updated successfully.', category });
}));

// Delete category (admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  // Delete associated image file
  if (category.image) {
    const imagePath = path.join(__dirname, '../../', category.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted successfully.' });
}));

module.exports = router;