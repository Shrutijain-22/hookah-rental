import Booking from '../models/Booking.js';
import Hookah from '../models/Hookah.js';
import { initialBookings, initialHookahs } from '../utils/initialData.js';
import { isMemoryFallback } from '../config/db.js';
import { sendNewBookingAlertToOwner, sendBookingReceiptToCustomer, sendStatusUpdateToCustomer } from '../services/emailService.js';

let memoryBookings = [...initialBookings];

// Helper to generate human-readable reference code
const generateBookingRef = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `HKH-${new Date().getFullYear()}-${randomDigits}`;
};

// @desc    Submit new booking request
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const { customer, eventDetails, items } = req.body;

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Customer contact details are incomplete' });
    }

    if (!eventDetails?.eventType || !eventDetails?.eventDate || !eventDetails?.startTime || !eventDetails?.durationHours || !eventDetails?.venueAddress) {
      return res.status(400).json({ success: false, message: 'Event details are incomplete' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one hookah for rental' });
    }

    // Calculate hourly subtotal and estimated total
    let hourlySubtotal = 0;
    const validatedItems = items.map((item) => {
      const rate = Number(item.hourlyRate) || 50;
      const qty = Number(item.quantity) || 1;
      hourlySubtotal += rate * qty;
      return {
        hookahId: item.hookahId || item._id,
        title: item.title,
        hourlyRate: rate,
        quantity: qty,
      };
    });

    const duration = Number(eventDetails.durationHours) || 2;
    const estimatedTotal = hourlySubtotal * duration;

    const bookingReference = generateBookingRef();

    const newBookingPayload = {
      bookingReference,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      eventDetails: {
        eventType: eventDetails.eventType,
        eventDate: new Date(eventDetails.eventDate),
        startTime: eventDetails.startTime,
        durationHours: duration,
        venueAddress: eventDetails.venueAddress,
        guestCount: Number(eventDetails.guestCount) || 10,
        specialNotes: eventDetails.specialNotes || '',
      },
      items: validatedItems,
      pricing: {
        hourlySubtotal,
        estimatedTotal,
      },
      status: 'Pending',
      adminNotes: '',
    };

    let savedBooking;

    if (isMemoryFallback) {
      savedBooking = { _id: `mem_b_${Date.now()}`, ...newBookingPayload, createdAt: new Date() };
      memoryBookings.unshift(savedBooking);
    } else {
      savedBooking = await Booking.create(newBookingPayload);
    }

    // Trigger Email Alerts asynchronously
    sendNewBookingAlertToOwner(savedBooking).catch((err) => console.error('Owner email error:', err));
    sendBookingReceiptToCustomer(savedBooking).catch((err) => console.error('Customer email error:', err));

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! A confirmation email has been dispatched.',
      data: savedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by reference code (Public lookup)
// @route   GET /api/bookings/reference/:reference
// @access  Public
export const getBookingByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;

    if (isMemoryFallback) {
      const booking = memoryBookings.find((b) => b.bookingReference.toLowerCase() === reference.toLowerCase());
      if (!booking) return res.status(404).json({ success: false, message: 'Booking reference not found' });
      return res.json({ success: true, data: booking });
    }

    const booking = await Booking.findOne({ bookingReference: new RegExp(`^${reference}$`, 'i') });

    if (!booking) {
      const fallback = memoryBookings.find((b) => b.bookingReference.toLowerCase() === reference.toLowerCase());
      if (fallback) return res.json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Booking reference not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for Admin Management
// @route   GET /api/admin/bookings
// @access  Private Admin
export const getAdminBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    if (isMemoryFallback) {
      let list = [...memoryBookings];
      if (status) list = list.filter((b) => b.status === status);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (b) =>
            b.bookingReference.toLowerCase().includes(q) ||
            b.customer.fullName.toLowerCase().includes(q) ||
            b.customer.email.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, count: list.length, data: list });
    }

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    if (bookings.length === 0 && !status && !search) {
      return res.json({ success: true, count: memoryBookings.length, data: memoryBookings });
    }

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Confirm, Cancel, Complete)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    let updatedBooking;

    if (isMemoryFallback) {
      const index = memoryBookings.findIndex((b) => b._id === id || b.bookingReference === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

      memoryBookings[index].status = status;
      if (adminNotes !== undefined) memoryBookings[index].adminNotes = adminNotes;
      memoryBookings[index].updatedAt = new Date();
      updatedBooking = memoryBookings[index];
    } else {
      updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status, ...(adminNotes !== undefined && { adminNotes }) },
        { new: true }
      );
    }

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Trigger email update notification to customer
    sendStatusUpdateToCustomer(updatedBooking).catch((err) => console.error('Status email error:', err));

    res.json({
      success: true,
      message: `Booking #${updatedBooking.bookingReference} status updated to ${status}`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
