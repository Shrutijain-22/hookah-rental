import mongoose from 'mongoose';

const hookahSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Hookah title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rental rate is required'],
      min: 0,
    },
    minimumHours: {
      type: Number,
      default: 2,
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    hosesCount: {
      type: Number,
      required: true,
      min: 1,
    },
    heightCm: {
      type: Number,
      default: 70,
    },
    material: {
      type: String,
      default: 'Stainless Steel & Handcrafted Glass',
    },
    flavorOptions: {
      type: [String],
      default: ['Double Apple', 'Mint', 'Blueberry Ice', 'Peach Mango', 'Love 66'],
    },
    eventSuitability: {
      type: [String],
      default: ['House parties', 'Birthdays', 'Weddings', 'Private events', 'College events', 'Corporate events'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Hookah || mongoose.model('Hookah', hookahSchema);
