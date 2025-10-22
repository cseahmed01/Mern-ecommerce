// src/routes/bannerRoutes.js
const express = require('express');
const Banner = require('../models/Banner');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for banner image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/banners');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 5MB limit
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

// Create banner (admin only)
router.post('/', authenticate, authorize('admin'), upload.single('image'), asyncHandler(async (req, res) => {
  const { title, link, isActive } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  const imagePath = `/uploads/banners/${req.file.filename}`;

  const banner = new Banner({
    title,
    image: imagePath,
    link,
    isActive: isActive === 'true' || isActive === true
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
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), asyncHandler(async (req, res) => {
  const { title, link, isActive } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (link !== undefined) updateData.link = link;
  if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

  // Handle image upload
  if (req.file) {
    updateData.image = `/uploads/banners/${req.file.filename}`;

    // Delete old image if exists
    const existingBanner = await Banner.findById(req.params.id);
    if (existingBanner && existingBanner.image) {
      const oldImagePath = path.join(__dirname, '../../', existingBanner.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found.' });
  }

  res.json({ message: 'Banner updated successfully.', banner });
}));

// Delete banner (admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found.' });
  }

  // Delete associated image file
  if (banner.image) {
    const imagePath = path.join(__dirname, '../../', banner.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Banner deleted successfully.' });
}));

module.exports = router;
