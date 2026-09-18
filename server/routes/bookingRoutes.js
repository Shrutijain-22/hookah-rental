import express from 'express';
import { createBooking, getBookingByReference, getAdminBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/bookings', createBooking);
router.get('/bookings/reference/:reference', getBookingByReference);

// Admin protected routes
router.get('/admin/bookings', protectAdmin, getAdminBookings);
router.patch('/admin/bookings/:id/status', protectAdmin, updateBookingStatus);

export default router;
