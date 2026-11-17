import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import NGOProfile from '../models/NGOProfile.js';
import ActivityLog from '../models/ActivityLog.js';
import { JWT_SECRET } from '../middleware/auth.js';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user (Admin, Volunteer, Donor, Beneficiary, or NGO)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, bio, skills, ngoName, registrationNumber, category, address, description } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'volunteer',
      phone: phone || '',
      location: location || 'New Delhi',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    let ngoProfile = null;
    if (role === 'ngo') {
      ngoProfile = await NGOProfile.create({
        user: user._id,
        ngoName: ngoName || `${name}'s Organization`,
        registrationNumber: registrationNumber || `REG-${Math.floor(100000 + Math.random() * 900000)}`,
        category: category || 'Poverty Relief',
        description: description || bio || 'Dedicated to social empowerment and community relief.',
        address: address || location || 'New Delhi',
        verificationStatus: 'pending'
      });
    }

    await ActivityLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTERED',
      details: `Registered as ${user.role}${role === 'ngo' ? ` (NGO: ${ngoProfile?.ngoName})` : ''}`
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        ngoProfileId: ngoProfile?._id || null,
        verificationStatus: ngoProfile?.verificationStatus || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let ngoProfile = null;
    if (user.role === 'ngo') {
      ngoProfile = await NGOProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    await ActivityLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      details: `Logged in successfully`
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        skills: user.skills,
        causePreferences: user.causePreferences,
        ngoProfileId: ngoProfile?._id || null,
        verificationStatus: ngoProfile?.verificationStatus || null,
        ngoName: ngoProfile?.ngoName || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let ngoProfile = null;
    if (user.role === 'ngo') {
      ngoProfile = await NGOProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        ngoProfileId: ngoProfile?._id || null,
        verificationStatus: ngoProfile?.verificationStatus || null,
        ngoName: ngoProfile?.ngoName || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
