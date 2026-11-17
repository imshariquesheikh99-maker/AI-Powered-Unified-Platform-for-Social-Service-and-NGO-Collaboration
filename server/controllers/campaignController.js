import Campaign from '../models/Campaign.js';
import NGOProfile from '../models/NGOProfile.js';
import ActivityLog from '../models/ActivityLog.js';

const CATEGORY_DEFAULT_IMAGES = {
  'Education': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  'Healthcare': 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
  'Environment': 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&q=80&w=800',
  'Women Empowerment': 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
  'Animal Care': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
  'Disaster Relief': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
  'Poverty Relief': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&q=80&w=800'
};

// @desc    Get all campaigns with filters & search
// @route   GET /api/campaigns
export const getCampaigns = async (req, res) => {
  try {
    const { search, category, location, status, ngoId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    if (category) {
      query.category = category;
    }

    if (ngoId) {
      query.ngo = ngoId;
    }

    if (location && location.trim()) {
      const escapedLoc = location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.location = new RegExp(escapedLoc, 'i');
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const escapedSearch = cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');

      // Also search through matching NGO profiles
      const matchingNgos = await NGOProfile.find({
        $or: [
          { ngoName: searchRegex },
          { category: searchRegex },
          { city: searchRegex }
        ]
      }).select('_id');
      const matchingNgoIds = matchingNgos.map(n => n._id);

      const orConditions = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex },
        { requiredSkills: searchRegex }
      ];

      if (matchingNgoIds.length > 0) {
        orConditions.push({ ngo: { $in: matchingNgoIds } });
      }

      query.$or = orConditions;
    }

    const campaigns = await Campaign.find(query)
      .populate('ngo', 'ngoName registrationNumber category logo verificationStatus city')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single campaign details
// @route   GET /api/campaigns/:id
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('ngo', 'ngoName registrationNumber category description logo bannerImage website phone address city verificationStatus');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new campaign (NGO only)
// @route   POST /api/campaigns
export const createCampaign = async (req, res) => {
  try {
    const ngo = await NGOProfile.findOne({ user: req.user.id });
    if (!ngo) {
      return res.status(400).json({ success: false, message: 'Only registered NGOs can create campaigns' });
    }

    if (ngo.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Your NGO account is pending Admin verification. You cannot launch active campaigns until verified.'
      });
    }

    const { title, description, category, targetAmount, endDate, requiredSkills, volunteersNeeded, imageUrl, location, isUrgent } = req.body;

    const parsedTarget = Number(targetAmount);
    if (!title || !description || isNaN(parsedTarget) || parsedTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid campaign title, description, and positive target amount are required'
      });
    }

    const defaultImg = CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES['Education'];
    const finalImageUrl = (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) ? imageUrl.trim() : defaultImg;

    const campaign = await Campaign.create({
      ngo: ngo._id,
      title: title.trim(),
      description: description.trim(),
      category: category || 'Education',
      targetAmount: parsedTarget,
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
      volunteersNeeded: Number(volunteersNeeded) || 5,
      imageUrl: finalImageUrl,
      location: (location && location.trim()) || ngo.city || 'New Delhi',
      isUrgent: Boolean(isUrgent)
    });

    ngo.impactMetrics.campaignsCompleted += 1;
    await ngo.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: 'ngo',
      action: 'CAMPAIGN_CREATED',
      details: `Launched new campaign: "${campaign.title}"`
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const fieldsToUpdate = ['title', 'description', 'category', 'targetAmount', 'status', 'requiredSkills', 'volunteersNeeded', 'imageUrl', 'location', 'isUrgent', 'endDate'];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) campaign[field] = req.body[field];
    });

    await campaign.save();

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
