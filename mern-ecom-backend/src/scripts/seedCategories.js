// src/scripts/seedCategories.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://example.com/electronics.jpg',
        status: true
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        image: 'https://example.com/clothing.jpg',
        status: true
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
        image: 'https://example.com/books.jpg',
        status: true
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        image: 'https://example.com/home-garden.jpg',
        status: true
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        image: 'https://example.com/sports-outdoors.jpg',
        status: true
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ slug: categoryData.slug });
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`Category '${categoryData.name}' created successfully`);
      } else {
        console.log(`Category '${categoryData.name}' already exists`);
      }
    }

    console.log('Categories seeding completed');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedCategories();