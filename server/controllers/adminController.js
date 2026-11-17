import User from '../models/User.js';
import NGOProfile from '../models/NGOProfile.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import AssistanceRequest from '../models/AssistanceRequest.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get admin analytics overview
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const roleCounts = {
      admin: await User.countDocuments({ role: 'admin' }),
      ngo: await User.countDocuments({ role: 'ngo' }),
      volunteer: await User.countDocuments({ role: 'volunteer' }),
      donor: await User.countDocuments({ role: 'donor' }),
      beneficiary: await User.countDocuments({ role: 'beneficiary' })
    };

    const ngoStats = {
      total: await NGOProfile.countDocuments(),
      verified: await NGOProfile.countDocuments({ verificationStatus: 'verified' }),
      pending: await NGOProfile.countDocuments({ verificationStatus: 'pending' }),
      rejected: await NGOProfile.countDocuments({ verificationStatus: 'rejected' })
    };

    const campaignStats = {
      total: await Campaign.countDocuments(),
      active: await Campaign.countDocuments({ status: 'active' }),
      completed: await Campaign.countDocuments({ status: 'completed' })
    };

    const donationAggregate = await Donation.aggregate([
      { $match: { paymentStatus: 'success' } },
      { $group: { _id: null, totalFunds: { $sum: '$amount' }, totalCount: { $sum: 1 } } }
    ]);

    const totalDonations = donationAggregate[0]?.totalFunds || 0;
    const donationCount = donationAggregate[0]?.totalCount || 0;

    const volunteerAppsCount = await VolunteerApplication.countDocuments();
    const requestStats = {
      total: await AssistanceRequest.countDocuments(),
      urgent: await AssistanceRequest.countDocuments({ priorityLevel: 'Urgent' }),
      fulfilled: await AssistanceRequest.countDocuments({ status: 'fulfilled' })
    };

    const recentActivities = await ActivityLog.find().sort({ timestamp: -1 }).limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        roleCounts,
        ngoStats,
        campaignStats,
        financials: {
          totalDonations,
          donationCount
        },
        volunteerAppsCount,
        requestStats
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of all platform users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system activity logs
// @route   GET /api/admin/activity-logs
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
