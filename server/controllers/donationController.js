import crypto from 'crypto';
import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import NGOProfile from '../models/NGOProfile.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper to generate realistic crypto transaction hash
const generateCryptoTxHash = () => `0x${crypto.randomBytes(32).toString('hex')}`;
const generateRandomBlockNumber = () => Math.floor(58000000 + Math.random() * 999999);

// Conversion rates to INR for crypto donations
const CRYPTO_RATES = {
  MATIC: 52,
  ETH: 265000,
  USDT: 86.5,
  USDC: 86.5,
  BTC: 5800000
};

// @desc    Process donation across multiple modes (Monetary, In-Kind, Crypto, Recurring, Corporate CSR, Impact Kit)
// @route   POST /api/donations/process
export const processDonation = async (req, res) => {
  try {
    const {
      campaignId,
      donationType = 'monetary',
      amount = 0,
      paymentMethod = 'UPI',
      isAnonymous = false,
      inKindDetails,
      recurringDetails,
      cryptoDetails,
      corporateDetails,
      itemKit
    } = req.body;

    const campaign = await Campaign.findById(campaignId).populate('ngo');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    let calculatedAmount = Number(amount) || 0;
    let blockchainTxHash = generateCryptoTxHash();
    let finalCryptoDetails = null;
    let finalInKindDetails = null;
    let finalRecurringDetails = null;
    let finalCorporateDetails = null;
    let finalItemKit = null;
    let taxExemptionText = 'Eligible for 50% Tax Exemption under Section 80G of Income Tax Act.';
    let impactSummaryText = '';

    // Handle Donation Types
    if (donationType === 'crypto') {
      const currency = cryptoDetails?.cryptoCurrency || 'MATIC';
      const cryptoAmt = Number(cryptoDetails?.cryptoAmount) || (calculatedAmount > 0 ? calculatedAmount / (CRYPTO_RATES[currency] || 50) : 10);
      const inrValue = Math.round(cryptoAmt * (CRYPTO_RATES[currency] || 50));
      calculatedAmount = inrValue;

      blockchainTxHash = cryptoDetails?.txHash || generateCryptoTxHash();
      finalCryptoDetails = {
        network: cryptoDetails?.network || 'Polygon Mainnet (PoS)',
        cryptoCurrency: currency,
        cryptoAmount: Number(cryptoAmt.toFixed(4)),
        walletAddress: cryptoDetails?.walletAddress || '0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a',
        blockNumber: cryptoDetails?.blockNumber || generateRandomBlockNumber(),
        txHash: blockchainTxHash,
        gasUsed: '0.0019 MATIC'
      };
      impactSummaryText = `Web3 Blockchain Donation: ${finalCryptoDetails.cryptoAmount} ${currency} (₹${calculatedAmount.toLocaleString()}) verified on ${finalCryptoDetails.network}`;
      taxExemptionText = 'On-Chain Web3 Philanthropy Proof-of-Donation NFT Receipt with Section 80G eligibility.';

    } else if (donationType === 'in_kind') {
      const estValue = Number(inKindDetails?.estimatedValue) || Number(amount) || 2500;
      calculatedAmount = estValue;
      const qty = Number(inKindDetails?.quantity) || 1;

      finalInKindDetails = {
        itemCategory: inKindDetails?.itemCategory || 'Relief Supplies',
        itemName: inKindDetails?.itemName || 'Essential Relief Kit',
        quantity: qty,
        unit: inKindDetails?.unit || 'kits',
        pickupAddress: inKindDetails?.pickupAddress || req.user?.location || 'New Delhi',
        pickupDate: inKindDetails?.pickupDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedValue: estValue,
        logisticsStatus: 'scheduled'
      };

      campaign.inKindItemsReceived = (campaign.inKindItemsReceived || 0) + qty;
      impactSummaryText = `In-Kind Material Contribution: ${qty} ${finalInKindDetails.unit} of "${finalInKindDetails.itemName}" (Est. Value: ₹${estValue.toLocaleString()})`;
      taxExemptionText = 'Material Goods Acknowledgment Certificate & Section 80G In-Kind Registry.';

    } else if (donationType === 'recurring') {
      const freq = recurringDetails?.frequency || 'monthly';
      const months = Number(recurringDetails?.durationMonths) || 12;
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);

      finalRecurringDetails = {
        frequency: freq,
        durationMonths: months,
        nextBillingDate: nextDate,
        status: 'active',
        mandateId: `MANDATE-SIP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
      };
      impactSummaryText = `Monthly Social SIP Pledge: ₹${calculatedAmount.toLocaleString()}/${freq === 'monthly' ? 'mo' : freq} committed for ${months} months`;
      taxExemptionText = 'Monthly Recurring Patron Section 80G Tax Exemption Certificate.';

    } else if (donationType === 'corporate_csr') {
      const multiplier = Number(corporateDetails?.matchingGrantMultiplier) || 1;
      const effectiveTotal = calculatedAmount * multiplier;

      finalCorporateDetails = {
        companyName: corporateDetails?.companyName || 'Corporate Partner',
        cinGstin: corporateDetails?.cinGstin || 'U72900DL2021PTC123456',
        csrRegistrationNo: corporateDetails?.csrRegistrationNo || `CSR-${Math.floor(100000 + Math.random() * 900000)}`,
        matchingGrantMultiplier: multiplier,
        totalEffectiveImpactAmount: effectiveTotal,
        contactPerson: corporateDetails?.contactPerson || req.user?.name
      };
      calculatedAmount = effectiveTotal;
      impactSummaryText = `Corporate CSR Grant: ₹${calculatedAmount.toLocaleString()} (${multiplier}x Matching Pledge) by ${finalCorporateDetails.companyName}`;
      taxExemptionText = 'MCA CSR Form-1 Compliant Section 80G Certificate for Corporate Social Responsibility.';

    } else if (donationType === 'impact_kit') {
      const kitCount = Number(itemKit?.kitCount) || 1;
      const unitPrice = Number(itemKit?.unitPrice) || calculatedAmount;
      calculatedAmount = kitCount * unitPrice;

      finalItemKit = {
        kitType: itemKit?.kitType || 'Essential Nutrition Relief Pack',
        kitCount,
        unitPrice
      };
      impactSummaryText = `Direct Impact Kit: Sponsored ${kitCount}x "${finalItemKit.kitType}" (₹${calculatedAmount.toLocaleString()})`;
    } else {
      impactSummaryText = `Monetary Contribution: ₹${calculatedAmount.toLocaleString()} via ${paymentMethod}`;
    }

    const transactionId = `TXN-SAHAYAK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `RCPT-80G-${Math.floor(100000 + Math.random() * 900000)}`;

    const donation = await Donation.create({
      donor: req.user.id,
      campaign: campaign._id,
      ngo: campaign.ngo._id,
      amount: calculatedAmount,
      donationType,
      paymentMethod,
      inKindDetails: finalInKindDetails,
      recurringDetails: finalRecurringDetails,
      cryptoDetails: finalCryptoDetails,
      corporateDetails: finalCorporateDetails,
      itemKit: finalItemKit,
      blockchainTxHash,
      transactionId,
      paymentStatus: 'success',
      isAnonymous: Boolean(isAnonymous),
      receiptNumber
    });

    // Update Campaign raised amount
    campaign.raisedAmount += calculatedAmount;
    if (campaign.raisedAmount >= campaign.targetAmount) {
      campaign.status = 'completed';
    }
    await campaign.save();

    // Update NGO total funds raised
    const ngo = await NGOProfile.findById(campaign.ngo._id);
    if (ngo) {
      ngo.impactMetrics.totalFundsRaised += calculatedAmount;
      if (donationType === 'in_kind') {
        ngo.impactMetrics.inKindDonationsReceived = (ngo.impactMetrics.inKindDonationsReceived || 0) + 1;
      }
      if (donationType === 'recurring') {
        ngo.impactMetrics.activeRecurringDonors = (ngo.impactMetrics.activeRecurringDonors || 0) + 1;
      }
      await ngo.save();
    }

    // Update Donor user total donated
    const donorUser = await User.findById(req.user.id);
    if (donorUser) {
      donorUser.totalDonated = (donorUser.totalDonated || 0) + calculatedAmount;
      await donorUser.save();
    }

    // Log Platform Activity
    await ActivityLog.create({
      user: req.user.id,
      userName: isAnonymous ? 'Anonymous Philanthropist' : req.user.name,
      userRole: req.user.role,
      action: 'DONATION_COMPLETED',
      details: `${impactSummaryText} to "${campaign.title}"`
    });

    res.status(201).json({
      success: true,
      message: 'Donation processed and registered successfully!',
      donation,
      receipt: {
        receiptNumber,
        transactionId,
        donationType,
        paymentMethod,
        donorName: isAnonymous ? 'Anonymous Philanthropist' : req.user.name,
        ngoName: campaign.ngo.ngoName,
        campaignTitle: campaign.title,
        amount: calculatedAmount,
        date: donation.donatedAt,
        blockchainTxHash,
        taxExemptionText,
        inKindDetails: finalInKindDetails,
        recurringDetails: finalRecurringDetails,
        cryptoDetails: finalCryptoDetails,
        corporateDetails: finalCorporateDetails,
        itemKit: finalItemKit,
        impactSummaryText
      }
    });
  } catch (error) {
    console.error('Process donation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's donation history with all modes
// @route   GET /api/donations/my-donations
export const getMyDonations = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { donor: req.user.id };
    if (type && type !== 'all') {
      filter.donationType = type;
    }

    const donations = await Donation.find(filter)
      .populate('campaign', 'title category imageUrl location')
      .populate('ngo', 'ngoName logo registrationNumber city')
      .sort({ donatedAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donations received by an NGO
// @route   GET /api/donations/ngo-donations
export const getNgoDonations = async (req, res) => {
  try {
    const ngo = await NGOProfile.findOne({ user: req.user.id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO Profile not found' });
    }

    const donations = await Donation.find({ ngo: ngo._id })
      .populate('donor', 'name email avatar phone')
      .populate('campaign', 'title category')
      .sort({ donatedAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update in-kind donation logistics status
// @route   PUT /api/donations/:id/in-kind-status
export const updateInKindStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (!donation.inKindDetails) {
      donation.inKindDetails = {};
    }
    donation.inKindDetails.logisticsStatus = status;
    await donation.save();

    res.json({
      success: true,
      message: `In-kind shipment status updated to ${status}`,
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update recurring subscription status (active, paused, cancelled)
// @route   PUT /api/donations/:id/recurring-status
export const updateRecurringStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify pledge' });
    }

    if (donation.recurringDetails) {
      donation.recurringDetails.status = status;
      await donation.save();
    }

    res.json({
      success: true,
      message: `Recurring pledge ${status}`,
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public on-chain and financial transparency ledger
// @route   GET /api/donations/public-ledger
export const getPublicLedger = async (req, res) => {
  try {
    const donations = await Donation.find({ paymentStatus: 'success' })
      .populate('campaign', 'title category')
      .populate('ngo', 'ngoName registrationNumber')
      .populate('donor', 'name')
      .select('amount donationType paymentMethod blockchainTxHash transactionId receiptNumber donatedAt isAnonymous cryptoDetails inKindDetails corporateDetails itemKit')
      .sort({ donatedAt: -1 })
      .limit(50);

    const publicRecords = donations.map(d => ({
      _id: d._id,
      donorName: d.isAnonymous ? 'Anonymous Donor' : (d.donor?.name || 'Verified Contributor'),
      campaignTitle: d.campaign?.title || 'Social Impact Project',
      ngoName: d.ngo?.ngoName || 'Verified NGO',
      amount: d.amount,
      donationType: d.donationType,
      paymentMethod: d.paymentMethod,
      blockchainTxHash: d.blockchainTxHash || d.cryptoDetails?.txHash || generateCryptoTxHash(),
      blockNumber: d.cryptoDetails?.blockNumber || 58900000 + (Math.floor(d.amount) % 100000),
      network: d.cryptoDetails?.network || 'Polygon PoS Transparent Ledger',
      donatedAt: d.donatedAt,
      inKindSummary: d.inKindDetails ? `${d.inKindDetails.quantity} ${d.inKindDetails.unit} of ${d.inKindDetails.itemName}` : null,
      corporateCompany: d.corporateDetails?.companyName || null
    }));

    res.json({ success: true, count: publicRecords.length, ledger: publicRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
