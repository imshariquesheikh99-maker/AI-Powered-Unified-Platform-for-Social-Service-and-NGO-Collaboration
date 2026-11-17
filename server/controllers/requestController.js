import AssistanceRequest from '../models/AssistanceRequest.js';
import NGOProfile from '../models/NGOProfile.js';
import ActivityLog from '../models/ActivityLog.js';

// Internal NLP keyword urgency scoring helper (fallbacks if FastAPI is starting)
const calculateUrgencyScore = (title, description, affectedPeople) => {
  const text = `${title} ${description}`.toLowerCase();
  let score = 40;

  const urgentKeywords = ['critical', 'emergency', 'life-threatening', 'flood', 'earthquake', 'disaster', 'starving', 'icu', 'blood', 'cancer', 'orphan', 'urgent'];
  const highKeywords = ['hospital', 'medicine', 'shelter', 'eviction', 'malnutrition', 'treatment', 'surgery', 'disabled', 'winter shelter'];
  const mediumKeywords = ['books', 'uniform', 'education', 'food kit', 'ration', 'laptop', 'school fees'];

  urgentKeywords.forEach(word => {
    if (text.includes(word)) score += 15;
  });

  highKeywords.forEach(word => {
    if (text.includes(word)) score += 10;
  });

  mediumKeywords.forEach(word => {
    if (text.includes(word)) score += 5;
  });

  if (affectedPeople > 20) score += 15;
  else if (affectedPeople > 5) score += 8;

  score = Math.min(99, Math.max(25, score));

  let level = 'Medium';
  let reason = 'Standard community assistance evaluation';

  if (score >= 80) {
    level = 'Urgent';
    reason = 'AI detected emergency keywords & high impact capacity requiring immediate intervention';
  } else if (score >= 65) {
    level = 'High';
    reason = 'Essential healthcare or shelter needs prioritized';
  } else if (score < 45) {
    level = 'Low';
    reason = 'General long-term support request';
  }

  return { score, level, reason };
};

// @desc    Submit assistance request (Beneficiary)
// @route   POST /api/requests
export const createAssistanceRequest = async (req, res) => {
  try {
    const { title, description, category, location, affectedPeople, contactNumber } = req.body;

    const { score, level, reason } = calculateUrgencyScore(title, description, affectedPeople || 1);

    const requestItem = await AssistanceRequest.create({
      beneficiary: req.user.id,
      title,
      description,
      category,
      location: location || req.user.location || 'New Delhi',
      affectedPeople: affectedPeople || 1,
      aiUrgencyScore: score,
      priorityLevel: level,
      priorityReason: reason,
      contactNumber: contactNumber || req.user.phone || ''
    });

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: 'beneficiary',
      action: 'ASSISTANCE_REQUEST_SUBMITTED',
      details: `Submitted ticket "${title}" - AI Priority: ${level} (${score}/100)`
    });

    res.status(201).json({ success: true, request: requestItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get beneficiary's own requests
// @route   GET /api/requests/my-requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await AssistanceRequest.find({ beneficiary: req.user.id })
      .populate('assignedNGO', 'ngoName logo phone city')
      .sort({ requestedAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all assistance requests (for NGOs and Admins)
// @route   GET /api/requests
export const getAllRequests = async (req, res) => {
  try {
    const { priority, status, category } = req.query;
    let query = {};

    if (priority) query.priorityLevel = priority;
    if (status) query.status = status;
    if (category) query.category = category;

    const requests = await AssistanceRequest.find(query)
      .populate('beneficiary', 'name email phone avatar location')
      .populate('assignedNGO', 'ngoName logo city')
      .sort({ aiUrgencyScore: -1, requestedAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update request status or adopt request (NGO or Admin)
// @route   PUT /api/requests/:id/status
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, assignToMe } = req.body;
    const requestItem = await AssistanceRequest.findById(req.params.id);

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Assistance request not found' });
    }

    if (status) requestItem.status = status;

    if (assignToMe && req.user.role === 'ngo') {
      const ngo = await NGOProfile.findOne({ user: req.user.id });
      if (ngo) {
        requestItem.assignedNGO = ngo._id;
        if (requestItem.status === 'submitted') {
          requestItem.status = 'in_review';
        }
      }
    }

    requestItem.updatedAt = Date.now();
    await requestItem.save();

    await ActivityLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ASSISTANCE_REQUEST_UPDATED',
      details: `Updated request "${requestItem.title}" to status ${requestItem.status}`
    });

    res.json({ success: true, request: requestItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
