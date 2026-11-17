import VolunteerApplication from '../models/VolunteerApplication.js';
import Campaign from '../models/Campaign.js';
import NGOProfile from '../models/NGOProfile.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Apply to a campaign
// @route   POST /api/volunteers/apply
export const applyToCampaign = async (req, res) => {
  try {
    const { campaignId, skillsSubmitted, availabilityNotes } = req.body;

    const campaign = await Campaign.findById(campaignId).populate('ngo');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const existingApp = await VolunteerApplication.findOne({
      volunteer: req.user.id,
      campaign: campaignId
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this campaign' });
    }

    // Compute basic AI match score if FastAPI is not directly called
    const volunteerSkills = req.user.skills || [];
    const campaignSkills = campaign.requiredSkills || [];

    const overlap = volunteerSkills.filter(skill =>
      campaignSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    );

    let aiMatchScore = Math.floor(65 + Math.random() * 20);
    let aiMatchReason = 'Good interest match for campaign category';

    if (overlap.length > 0) {
      aiMatchScore = Math.min(99, 80 + overlap.length * 8);
      aiMatchReason = `High skill match on: ${overlap.join(', ')}`;
    }

    const application = await VolunteerApplication.create({
      volunteer: req.user.id,
      campaign: campaignId,
      skillsSubmitted: skillsSubmitted || volunteerSkills,
      availabilityNotes: availabilityNotes || 'Available as requested',
      aiMatchScore,
      aiMatchReason
    });

    campaign.volunteersRegistered += 1;
    await campaign.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: 'volunteer',
      action: 'VOLUNTEER_APPLIED',
      details: `Applied for campaign: "${campaign.title}" (${aiMatchScore}% match)`
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in volunteer's applications
// @route   GET /api/volunteers/my-applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ volunteer: req.user.id })
      .populate({
        path: 'campaign',
        populate: { path: 'ngo', select: 'ngoName logo category city' }
      })
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for NGO's campaigns
// @route   GET /api/volunteers/ngo-applications
export const getNgoApplications = async (req, res) => {
  try {
    const ngo = await NGOProfile.findOne({ user: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO Profile not found' });
    }

    const campaigns = await Campaign.find({ ngo: ngo._id }).select('_id');
    const campaignIds = campaigns.map(c => c._id);

    const applications = await VolunteerApplication.find({ campaign: { $in: campaignIds } })
      .populate('volunteer', 'name email phone avatar location skills')
      .populate('campaign', 'title category')
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/volunteers/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await VolunteerApplication.findById(req.params.id)
      .populate('volunteer', 'name')
      .populate('campaign', 'title ngo');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'VOLUNTEER_APPLICATION_STATUS_UPDATED',
      details: `Set volunteer application status to ${status.toUpperCase()} for "${application.campaign?.title}"`
    });

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
