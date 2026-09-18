import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    eventDetails: {
      eventType: {
        type: String,
        required: true,
        enum: ['House party', 'Birthday', 'Wedding', 'Private event', 'College event', 'Corporate event', 'Other'],
      },
      eventDate: { type: Date, required: true },
      startTime: { type: String, required: true },
      durationHours: { type: Number, required: true, min: 1 },
      venueAddress: { type: String, required: true, trim: true },
      guestCount: { type: Number, default: 10 },
      specialNotes: { type: String, default: '' },
    },
    items: [
      {
        hookahId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hookah' },
        title: { type: String, required: true },
        hourlyRate: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    pricing: {
      hourlySubtotal: { type: Number, required: true },
      estimatedTotal: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
