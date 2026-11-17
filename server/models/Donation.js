import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGOProfile',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: 0
  },
  donationType: {
    type: String,
    enum: ['monetary', 'in_kind', 'recurring', 'crypto', 'corporate_csr', 'impact_kit'],
    default: 'monetary'
  },
  paymentMethod: {
    type: String,
    default: 'UPI'
  },
  // In-Kind relief goods details
  inKindDetails: {
    itemCategory: { type: String, default: 'General Relief' },
    itemName: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'units' }, // 'kg', 'kits', 'boxes', 'units', 'pieces'
    pickupAddress: { type: String, default: '' },
    pickupDate: { type: String, default: '' },
    estimatedValue: { type: Number, default: 0 },
    logisticsStatus: {
      type: String,
      enum: ['scheduled', 'in_transit', 'received_at_hub', 'distributed'],
      default: 'scheduled'
    }
  },
  // Recurring monthly pledge details
  recurringDetails: {
    frequency: { type: String, enum: ['monthly', 'quarterly', 'annually'], default: 'monthly' },
    durationMonths: { type: Number, default: 12 },
    nextBillingDate: { type: Date },
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    mandateId: { type: String }
  },
  // Web3 / Crypto details
  cryptoDetails: {
    network: { type: String, default: 'Polygon Mainnet' },
    cryptoCurrency: { type: String, default: 'MATIC' },
    cryptoAmount: { type: Number, default: 0 },
    walletAddress: { type: String, default: '' },
    blockNumber: { type: Number },
    txHash: { type: String },
    gasUsed: { type: String, default: '0.0021 MATIC' }
  },
  // Corporate CSR matching grant details
  corporateDetails: {
    companyName: { type: String, default: '' },
    cinGstin: { type: String, default: '' },
    csrRegistrationNo: { type: String, default: '' },
    matchingGrantMultiplier: { type: Number, default: 1 },
    totalEffectiveImpactAmount: { type: Number, default: 0 },
    contactPerson: { type: String, default: '' }
  },
  // Micro item kit sponsorship
  itemKit: {
    kitType: { type: String, default: '' },
    kitCount: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 }
  },
  blockchainTxHash: {
    type: String
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentStatus: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  receiptNumber: {
    type: String,
    required: true
  },
  donatedAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
