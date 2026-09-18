import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Hookah from '../models/Hookah.js';
import Booking from '../models/Booking.js';
import { initialHookahs, initialBookings } from './initialData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hookah_rental';
    console.log(`Attempting MongoDB connection at: ${mongoUri}`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Hookah.deleteMany({});
    await Booking.deleteMany({});

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123password', salt);
    const adminUser = await User.create({
      name: 'Velvet Smoke Admin',
      email: 'admin@velvetsmoke.com',
      passwordHash: hash,
      role: 'admin',
    });
    console.log(`✓ Admin User created: ${adminUser.email} (Password: admin123password)`);

    // Insert Luxury Hookahs
    const cleanHookahs = initialHookahs.map(({ _id, ...rest }) => rest);
    const createdHookahs = await Hookah.insertMany(cleanHookahs);
    console.log(`✓ Seeded ${createdHookahs.length} Luxury Hookahs`);

    // Insert Initial Bookings
    const cleanBookings = initialBookings.map(({ _id, items, ...rest }) => ({
      ...rest,
      items: items.map((item, idx) => ({
        ...item,
        hookahId: createdHookahs[idx % createdHookahs.length]._id,
      })),
    }));
    const createdBookings = await Booking.insertMany(cleanBookings);
    console.log(`✓ Seeded ${createdBookings.length} Sample Bookings`);

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.warn(`MongoDB not available: ${error.message}`);
    console.warn('The Express server has built-in in-memory fallback data so the app runs smoothly out-of-the-box!');
    process.exit(0);
  }
};

seedDatabase();
