import express from 'express';
import { getNgos, getNgoById, updateNgoProfile, verifyNgo } from '../controllers/ngoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNgos);
router.get('/:id', getNgoById);
router.put('/profile', protect, authorize('ngo'), updateNgoProfile);
router.put('/:id/verify', protect, authorize('admin'), verifyNgo);

export default router;
