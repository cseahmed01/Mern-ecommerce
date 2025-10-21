// src/routes/bannerRoutes.js
const express = require('express');
const Banner = require('../models/Banner');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

// Create banner (admin only)
router.post('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { title, image, link, isActive } = req.body;

  const banner = new Banner({
    title,
    image,
    link,
    isActive
  });
  await banner.save();

  res.status(201).json({ message: 'Banner created successfully.', banner });
}));

// Get all banners
router.get('/', asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json({ banners: banners });
}));

// Get banner by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found.' });
  }
  res.json({ banner });
}));

// Update banner (admin only)
router.put('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { title, image, link, isActive } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (image !== undefined) updateData.image = image;
  if (link !== undefined) updateData.link = link;
  if (isActive !== undefined) updateData.isActive = isActive;

  const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found.' });
  }

  res.json({ message: 'Banner updated successfully.', banner });
}));

// Delete banner (admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found.' });
  }

  res.json({ message: 'Banner deleted successfully.' });
}));

module.exports = router;
