import mongoose from 'mongoose';

const ngoProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  ngoName: {
    type: String,
    required: [true, 'NGO Name is required'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty Relief', 'Disaster Relief', 'Disaster Management', 'Women Empowerment', 'Animal Care', 'Animal Welfare'],
    default: 'Poverty Relief'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  website: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  city: {
    type: String,
    default: 'New Delhi'
  },
  logo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200'
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
  },
  documents: [{
    docName: String,
    docUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  impactMetrics: {
    livesImpacted: { type: Number, default: 0 },
    campaignsCompleted: { type: Number, default: 0 },
    volunteersEngaged: { type: Number, default: 0 },
    totalFundsRaised: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const NGOProfile = mongoose.model('NGOProfile', ngoProfileSchema);
export default NGOProfile;
