import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import hookahRoutes from './routes/hookahRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', hookahRoutes);
app.use('/api', bookingRoutes);
app.use('/api', statsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: '🔥 Online',
    service: 'Velvet Smoke VIP Hookah Rental API',
    version: '1.0.0',
    endpoints: ['/api/hookahs', '/api/bookings', '/api/auth'],
    timestamp: new Date(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Velvet Smoke VIP Hookah Rental API',
    timestamp: new Date(),
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🔥 VELVET SMOKE LUXURY HOOKAH API SERVER RUNNING`);
  console.log(`🌐 PORT: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`=================================================\n`);
});
