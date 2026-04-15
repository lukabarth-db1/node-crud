import 'dotenv/config';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Product from '../models/product.model';

const SEED_COUNT = 20;

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  let isConnected = false;

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const products = Array.from({ length: SEED_COUNT }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ min: 1, max: 1000, multipleOf: 0.01 }),
    }));

    await Product.insertMany(products);
    console.log(`Seeded ${SEED_COUNT} products successfully`);
  } finally {
    if (isConnected) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
