import express from 'express';
import { getAdminStats, getAllUsers, getActivityLogs } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/activity-logs', protect, authorize('admin'), getActivityLogs);

export default router;
