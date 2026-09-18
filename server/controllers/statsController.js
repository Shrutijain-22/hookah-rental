import Booking from '../models/Booking.js';
import Hookah from '../models/Hookah.js';
import { initialBookings, initialHookahs } from '../utils/initialData.js';
import { isMemoryFallback } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    if (isMemoryFallback) {
      const totalBookings = initialBookings.length;
      const pendingCount = initialBookings.filter((b) => b.status === 'Pending').length;
      const confirmedCount = initialBookings.filter((b) => b.status === 'Confirmed').length;
      const revenue = initialBookings.reduce((sum, b) => sum + (b.pricing?.estimatedTotal || 0), 0);
      const fleetCount = initialHookahs.length;

      return res.json({
        success: true,
        stats: {
          totalBookings,
          pendingBookings: pendingCount,
          confirmedBookings: confirmedCount,
          estimatedRevenue: revenue,
          totalFleetCount: fleetCount,
        },
      });
    }

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const totalFleetCount = await Hookah.countDocuments();

    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed', 'Pending'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.estimatedTotal' } } },
    ]);

    const estimatedRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        estimatedRevenue,
        totalFleetCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
