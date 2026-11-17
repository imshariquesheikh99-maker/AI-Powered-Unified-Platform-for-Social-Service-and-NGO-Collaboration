import express from 'express';
import { getCampaigns, getCampaignById, createCampaign, updateCampaign } from '../controllers/campaignController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, authorize('ngo', 'admin'), createCampaign);
router.put('/:id', protect, authorize('ngo', 'admin'), updateCampaign);

export default router;
