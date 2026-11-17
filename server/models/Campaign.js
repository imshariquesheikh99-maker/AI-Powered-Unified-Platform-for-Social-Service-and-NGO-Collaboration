import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGOProfile',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required']
  },
  category: {
    type: String,
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty Relief', 'Disaster Relief', 'Women Empowerment', 'Animal Care'],
    required: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target donation amount is required']
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  requiredSkills: [{
    type: String
  }],
  volunteersNeeded: {
    type: Number,
    default: 5
  },
  volunteersRegistered: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
  },
  location: {
    type: String,
    default: 'New Delhi'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  supportedDonationModes: {
    type: [String],
    default: ['monetary', 'in_kind', 'recurring', 'crypto', 'corporate_csr', 'impact_kit']
  },
  inKindItemsReceived: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
