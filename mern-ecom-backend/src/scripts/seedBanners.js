// src/scripts/seedBanners.js
const mongoose = require('mongoose');
const Banner = require('../models/Banner');
require('dotenv').config();

const seedBanners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const banners = [
      {
        title: 'Welcome to Our Store',
        image: 'https://example.com/banner1.jpg',
        link: '/categories',
        isActive: true
      },
      {
        title: 'New Arrivals - 50% Off',
        image: 'https://example.com/banner2.jpg',
        link: '/products',
        isActive: true
      },
      {
        title: 'Free Shipping on Orders Over $50',
        image: 'https://example.com/banner3.jpg',
        link: '/categories',
        isActive: true
      },
      {
        title: 'Limited Time Offer',
        image: 'https://example.com/banner4.jpg',
        link: '/products',
        isActive: true
      },
      {
        title: 'Shop Electronics',
        image: 'https://example.com/banner5.jpg',
        link: '/categories/electronics',
        isActive: true
      }
    ];

    for (const bannerData of banners) {
      const existingBanner = await Banner.findOne({ title: bannerData.title });
      if (!existingBanner) {
        const banner = new Banner(bannerData);
        await banner.save();
        console.log(`Banner '${bannerData.title}' created successfully`);
      } else {
        console.log(`Banner '${bannerData.title}' already exists`);
      }
    }

    console.log('Banners seeding completed');
  } catch (error) {
    console.error('Error seeding banners:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedBanners();