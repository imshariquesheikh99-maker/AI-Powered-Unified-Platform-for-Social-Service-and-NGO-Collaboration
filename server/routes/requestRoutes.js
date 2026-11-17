import express from 'express';
import { createAssistanceRequest, getMyRequests, getAllRequests, updateRequestStatus } from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createAssistanceRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/', protect, authorize('ngo', 'admin'), getAllRequests);
router.put('/:id/status', protect, authorize('ngo', 'admin'), updateRequestStatus);

export default router;
