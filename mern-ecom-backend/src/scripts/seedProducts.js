// src/scripts/seedProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get existing categories
    const electronicsCategory = await Category.findOne({ slug: 'electronics' });
    const clothingCategory = await Category.findOne({ slug: 'clothing' });
    const booksCategory = await Category.findOne({ slug: 'books' });
    const homeGardenCategory = await Category.findOne({ slug: 'home-garden' });
    const sportsCategory = await Category.findOne({ slug: 'sports-outdoors' });

    const products = [
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone with advanced features',
        categoryId: electronicsCategory._id,
        brand: 'Apple',
        price: 999,
        discountPrice: 949,
        stock: 50,
        images: ['https://example.com/iphone15.jpg'],
        tags: ['smartphone', 'apple', 'premium'],
        isFeatured: true,
        status: true
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'High-performance Android smartphone',
        categoryId: electronicsCategory._id,
        brand: 'Samsung',
        price: 799,
        discountPrice: 749,
        stock: 75,
        images: ['https://example.com/galaxy-s24.jpg'],
        tags: ['smartphone', 'samsung', 'android'],
        isFeatured: true,
        status: true
      },
      {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Lightweight laptop with M3 chip',
        categoryId: electronicsCategory._id,
        brand: 'Apple',
        price: 1099,
        discountPrice: 1049,
        stock: 30,
        images: ['https://example.com/macbook-air.jpg'],
        tags: ['laptop', 'apple', 'm3'],
        isFeatured: true,
        status: true
      },
      {
        name: 'Nike Air Max',
        slug: 'nike-air-max',
        description: 'Comfortable running shoes',
        categoryId: sportsCategory._id,
        brand: 'Nike',
        price: 129,
        discountPrice: 99,
        stock: 100,
        images: ['https://example.com/nike-air-max.jpg'],
        tags: ['shoes', 'running', 'nike'],
        isFeatured: false,
        status: true
      },
      {
        name: 'Levi\'s 501 Jeans',
        slug: 'levis-501-jeans',
        description: 'Classic straight fit jeans',
        categoryId: clothingCategory._id,
        brand: 'Levi\'s',
        price: 79,
        discountPrice: 69,
        stock: 200,
        images: ['https://example.com/levis-501.jpg'],
        tags: ['jeans', 'denim', 'classic'],
        isFeatured: false,
        status: true
      },
      {
        name: 'The Great Gatsby',
        slug: 'the-great-gatsby',
        description: 'Classic American novel by F. Scott Fitzgerald',
        categoryId: booksCategory._id,
        brand: 'Scribner',
        price: 15,
        discountPrice: 12,
        stock: 150,
        images: ['https://example.com/great-gatsby.jpg'],
        tags: ['book', 'classic', 'fiction'],
        isFeatured: false,
        status: true
      },
      {
        name: 'Garden Hose 50ft',
        slug: 'garden-hose-50ft',
        description: 'Durable garden hose for outdoor use',
        categoryId: homeGardenCategory._id,
        brand: 'GreenThumb',
        price: 29,
        discountPrice: 24,
        stock: 80,
        images: ['https://example.com/garden-hose.jpg'],
        tags: ['garden', 'hose', 'outdoor'],
        isFeatured: false,
        status: true
      },
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        categoryId: electronicsCategory._id,
        brand: 'Sony',
        price: 199,
        discountPrice: 179,
        stock: 60,
        images: ['https://example.com/sony-headphones.jpg'],
        tags: ['headphones', 'bluetooth', 'noise-cancelling'],
        isFeatured: true,
        status: true
      },
      {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip yoga mat for exercise',
        categoryId: sportsCategory._id,
        brand: 'Manduka',
        price: 89,
        discountPrice: 79,
        stock: 120,
        images: ['https://example.com/yoga-mat.jpg'],
        tags: ['yoga', 'exercise', 'fitness'],
        isFeatured: false,
        status: true
      },
      {
        name: 'Coffee Maker',
        slug: 'coffee-maker',
        description: '12-cup programmable coffee maker',
        categoryId: homeGardenCategory._id,
        brand: 'Mr. Coffee',
        price: 49,
        discountPrice: 39,
        stock: 90,
        images: ['https://example.com/coffee-maker.jpg'],
        tags: ['coffee', 'kitchen', 'appliance'],
        isFeatured: false,
        status: true
      }
    ];

    for (const productData of products) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        console.log(`Product '${productData.name}' created successfully`);
      } else {
        console.log(`Product '${productData.name}' already exists`);
      }
    }

    console.log('Products seeding completed');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedProducts();