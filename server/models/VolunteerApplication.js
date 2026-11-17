import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  skillsSubmitted: [{
    type: String
  }],
  availabilityNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  aiMatchScore: {
    type: Number,
    default: 85
  },
  aiMatchReason: {
    type: String,
    default: 'Strong skill alignment and location proximity'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
export default VolunteerApplication;
