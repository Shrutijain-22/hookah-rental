import mongoose from 'mongoose';

export let isMemoryFallback = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn('Fallback mode activated for testing/in-memory data.');
    isMemoryFallback = true;
  }
};
