import NGOProfile from '../models/NGOProfile.js';
import Campaign from '../models/Campaign.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all NGOs with search and filters
// @route   GET /api/ngos
export const getNgos = async (req, res) => {
  try {
    const { search, category, city, status } = req.query;
    let query = {};

    if (status) {
      query.verificationStatus = status;
    } else {
      // By default public sees verified NGOs, admins see all
      query.verificationStatus = 'verified';
    }

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { ngoName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { registrationNumber: new RegExp(search, 'i') }
      ];
    }

    const ngos = await NGOProfile.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: ngos.length, ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single NGO profile with campaign details
// @route   GET /api/ngos/:id
export const getNgoById = async (req, res) => {
  try {
    const ngo = await NGOProfile.findById(req.params.id).populate('user', 'name email phone avatar location');
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    const campaigns = await Campaign.find({ ngo: ngo._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      ngo,
      campaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update NGO Profile
// @route   PUT /api/ngos/profile
export const updateNgoProfile = async (req, res) => {
  try {
    let ngo = await NGOProfile.findOne({ user: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO Profile not found' });
    }

    const fieldsToUpdate = ['ngoName', 'registrationNumber', 'category', 'description', 'website', 'phone', 'address', 'city', 'logo', 'bannerImage'];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) ngo[field] = req.body[field];
    });

    await ngo.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: 'ngo',
      action: 'NGO_PROFILE_UPDATED',
      details: `Updated NGO details for ${ngo.ngoName}`
    });

    res.json({ success: true, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Verify or Reject NGO
// @route   PUT /api/ngos/:id/verify
export const verifyNgo = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const ngo = await NGOProfile.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    ngo.verificationStatus = status;
    ngo.verificationNotes = notes || '';
    await ngo.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: 'admin',
      action: 'NGO_VERIFICATION_STATUS_CHANGED',
      details: `Set ${ngo.ngoName} status to ${status.toUpperCase()}`
    });

    res.json({ success: true, message: `NGO ${status} successfully`, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
