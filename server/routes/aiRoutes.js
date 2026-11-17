import express from 'express';
import { matchVolunteer, prioritizeRequest, recommendCampaigns, handleChatbot, detectFraud, generateImpactSummary } from '../controllers/aiController.js';

const router = express.Router();

router.post('/match-volunteer', matchVolunteer);
router.post('/prioritize-request', prioritizeRequest);
router.post('/recommend-campaigns', recommendCampaigns);
router.post('/detect-fraud', detectFraud);
router.post('/generate-impact-summary', generateImpactSummary);
router.post('/chatbot', handleChatbot);

export default router;

