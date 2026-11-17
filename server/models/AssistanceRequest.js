import mongoose from 'mongoose';

const assistanceRequestSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGOProfile',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Request title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Request description is required']
  },
  category: {
    type: String,
    enum: ['Food Relief', 'Healthcare & Medicine', 'Educational Support', 'Emergency Shelter', 'Financial Aid', 'Disability Assistance'],
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  affectedPeople: {
    type: Number,
    default: 1
  },
  aiUrgencyScore: {
    type: Number,
    default: 50
  },
  priorityLevel: {
    type: String,
    enum: ['Urgent', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  priorityReason: {
    type: String,
    default: 'Standard processing'
  },
  status: {
    type: String,
    enum: ['submitted', 'in_review', 'approved', 'in_progress', 'fulfilled', 'rejected'],
    default: 'submitted'
  },
  contactNumber: {
    type: String,
    default: ''
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const AssistanceRequest = mongoose.model('AssistanceRequest', assistanceRequestSchema);
export default AssistanceRequest;
