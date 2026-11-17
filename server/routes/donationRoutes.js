import express from 'express';
import {
  processDonation,
  getMyDonations,
  getNgoDonations,
  updateInKindStatus,
  updateRecurringStatus,
  getPublicLedger
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', protect, processDonation);
router.get('/my-donations', protect, getMyDonations);
router.get('/ngo-donations', protect, authorize('ngo', 'admin'), getNgoDonations);
router.put('/:id/in-kind-status', protect, authorize('ngo', 'admin'), updateInKindStatus);
router.put('/:id/recurring-status', protect, updateRecurringStatus);
router.get('/public-ledger', getPublicLedger);

export default router;
