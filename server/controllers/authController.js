import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isMemoryFallback } from '../config/db.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: 'admin' },
    process.env.JWT_SECRET || 'luxury_hookah_secret_key_2026_vip_access',
    { expiresIn: '30d' }
  );
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const defaultAdminEmail = 'admin@velvetsmoke.com';
    const defaultPassword = 'admin123password';

    // In memory fallback check
    if (isMemoryFallback) {
      if (email.toLowerCase() === defaultAdminEmail && password === defaultPassword) {
        const token = generateToken({ _id: 'admin_mem_id', email: defaultAdminEmail });
        return res.json({
          success: true,
          token,
          user: { id: 'admin_mem_id', name: 'Velvet Smoke Admin', email: defaultAdminEmail, role: 'admin' },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // MongoDB Check
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user && email.toLowerCase() === defaultAdminEmail && password === defaultPassword) {
      // Auto-create default admin if not existing
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPassword, salt);
      user = await User.create({
        name: 'Velvet Smoke Admin',
        email: defaultAdminEmail,
        passwordHash: hash,
        role: 'admin',
      });
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private Admin
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
