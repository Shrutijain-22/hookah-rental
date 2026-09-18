import Hookah from '../models/Hookah.js';
import { initialHookahs } from '../utils/initialData.js';
import { isMemoryFallback } from '../config/db.js';

let memoryHookahs = [...initialHookahs];

// @desc    Get all active hookahs with filtering
// @route   GET /api/hookahs
// @access  Public
export const getHookahs = async (req, res, next) => {
  try {
    const { eventType, hoses, featured, search } = req.query;

    if (isMemoryFallback) {
      let list = [...memoryHookahs];
      if (featured === 'true') {
        list = list.filter((h) => h.isFeatured);
      }
      if (hoses) {
        list = list.filter((h) => h.hosesCount === Number(hoses));
      }
      if (eventType) {
        list = list.filter((h) => h.eventSuitability.includes(eventType));
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((h) => h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
      }
      return res.json({ success: true, count: list.length, data: list });
    }

    const query = { isAvailable: true };

    if (featured === 'true') query.isFeatured = true;
    if (hoses) query.hosesCount = Number(hoses);
    if (eventType) query.eventSuitability = { $in: [eventType] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const hookahs = await Hookah.find(query).sort({ isFeatured: -1, createdAt: -1 });

    // If database is empty, return initial fallback set
    if (hookahs.length === 0) {
      return res.json({ success: true, count: initialHookahs.length, data: initialHookahs });
    }

    res.json({ success: true, count: hookahs.length, data: hookahs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hookah by ID or slug
// @route   GET /api/hookahs/:id
// @access  Public
export const getHookahById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMemoryFallback) {
      const hookah = memoryHookahs.find((h) => h._id === id || h.slug === id);
      if (!hookah) {
        return res.status(404).json({ success: false, message: 'Hookah not found' });
      }
      return res.json({ success: true, data: hookah });
    }

    let hookah;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hookah = await Hookah.findById(id);
    }
    if (!hookah) {
      hookah = await Hookah.findOne({ slug: id });
    }

    if (!hookah) {
      const fallback = initialHookahs.find((h) => h._id === id || h.slug === id);
      if (fallback) return res.json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Hookah not found' });
    }

    res.json({ success: true, data: hookah });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Hookah listing
// @route   POST /api/admin/hookahs
// @access  Private Admin
export const createHookah = async (req, res, next) => {
  try {
    const { title, description, hourlyRate, hosesCount, images, tagline, videoUrl, heightCm, material, flavorOptions, eventSuitability } = req.body;

    if (!title || !description || !hourlyRate || !hosesCount) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newHookahData = {
      title,
      slug,
      tagline: tagline || '',
      description,
      hourlyRate: Number(hourlyRate),
      hosesCount: Number(hosesCount),
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80'],
      videoUrl: videoUrl || '',
      heightCm: Number(heightCm) || 70,
      material: material || 'Stainless Steel & Bohemian Glass',
      flavorOptions: Array.isArray(flavorOptions) ? flavorOptions : ['Double Apple', 'Mint', 'Blueberry Ice'],
      eventSuitability: Array.isArray(eventSuitability) ? eventSuitability : ['House parties', 'Weddings', 'Birthdays'],
      isFeatured: Boolean(req.body.isFeatured),
      isAvailable: true,
    };

    if (isMemoryFallback) {
      const created = { _id: `mem_h_${Date.now()}`, ...newHookahData, createdAt: new Date() };
      memoryHookahs.unshift(created);
      return res.status(201).json({ success: true, data: created });
    }

    const hookah = await Hookah.create(newHookahData);
    res.status(201).json({ success: true, data: hookah });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Hookah listing
// @route   PUT /api/admin/hookahs/:id
// @access  Private Admin
export const updateHookah = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMemoryFallback) {
      const index = memoryHookahs.findIndex((h) => h._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Hookah not found' });

      memoryHookahs[index] = { ...memoryHookahs[index], ...req.body, updatedAt: new Date() };
      return res.json({ success: true, data: memoryHookahs[index] });
    }

    const hookah = await Hookah.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!hookah) {
      return res.status(404).json({ success: false, message: 'Hookah not found' });
    }
    res.json({ success: true, data: hookah });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Hookah listing
// @route   DELETE /api/admin/hookahs/:id
// @access  Private Admin
export const deleteHookah = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMemoryFallback) {
      memoryHookahs = memoryHookahs.filter((h) => h._id !== id);
      return res.json({ success: true, message: 'Hookah removed' });
    }

    const hookah = await Hookah.findByIdAndDelete(id);
    if (!hookah) {
      return res.status(404).json({ success: false, message: 'Hookah not found' });
    }
    res.json({ success: true, message: 'Hookah removed' });
  } catch (error) {
    next(error);
  }
};
