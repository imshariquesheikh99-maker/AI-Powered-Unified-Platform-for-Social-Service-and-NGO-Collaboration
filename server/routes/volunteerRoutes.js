import express from 'express';
import { applyToCampaign, getMyApplications, getNgoApplications, updateApplicationStatus } from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', protect, authorize('volunteer', 'donor', 'beneficiary'), applyToCampaign);
router.get('/my-applications', protect, getMyApplications);
router.get('/ngo-applications', protect, authorize('ngo', 'admin'), getNgoApplications);
router.put('/applications/:id/status', protect, authorize('ngo', 'admin'), updateApplicationStatus);

export default router;
