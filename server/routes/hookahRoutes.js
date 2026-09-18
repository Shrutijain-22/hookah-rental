import express from 'express';
import { getHookahs, getHookahById, createHookah, updateHookah, deleteHookah } from '../controllers/hookahController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/hookahs', getHookahs);
router.get('/hookahs/:id', getHookahById);

// Admin protected routes
router.post('/admin/hookahs', protectAdmin, createHookah);
router.put('/admin/hookahs/:id', protectAdmin, updateHookah);
router.delete('/admin/hookahs/:id', protectAdmin, deleteHookah);

export default router;
