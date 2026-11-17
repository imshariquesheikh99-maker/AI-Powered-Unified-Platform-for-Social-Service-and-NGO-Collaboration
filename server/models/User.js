import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'ngo', 'volunteer', 'donor', 'beneficiary'],
    default: 'volunteer'
  },
  phone: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  },
  location: {
    type: String,
    default: 'New Delhi, India'
  },
  bio: {
    type: String,
    default: ''
  },
  // Volunteer specific fields
  skills: [{
    type: String
  }],
  availability: {
    type: String,
    default: 'Weekends'
  },
  // Donor specific fields
  causePreferences: [{
    type: String
  }],
  totalDonated: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
