import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import NGOProfile from '../models/NGOProfile.js';
import Campaign from '../models/Campaign.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import Donation from '../models/Donation.js';
import AssistanceRequest from '../models/AssistanceRequest.js';
import ActivityLog from '../models/ActivityLog.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahayak_ai';

const seedDatabase = async () => {
  try {
    let uri = MONGODB_URI;
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('🌱 Connected to MongoDB at', uri);
    } catch (err) {
      console.log('⚠️ Local MongoDB not found on port 27017. Starting MongoMemoryServer for seed...');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('🌱 Connected to MongoMemoryServer at', uri);
    }

    // Clear existing collections
    await User.deleteMany({});
    await NGOProfile.deleteMany({});
    await Campaign.deleteMany({});
    await VolunteerApplication.deleteMany({});
    await Donation.deleteMany({});
    await AssistanceRequest.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('🧹 Cleared existing database records.');

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'Sahayak Super Admin',
      email: 'admin@sahayak.ai',
      password: commonPassword,
      role: 'admin',
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi, India',
      bio: 'Platform Overseer & Strategic Operations Lead for Sahayak AI.'
    });

    // 2. Create NGO Users & Profiles
    const ngoUser1 = await User.create({
      name: 'Asha Children Foundation',
      email: 'ngo.asha@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 11111',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi, India',
      bio: 'Empowering underprivileged youth through free quality education, literacy programs, and nutritional support.'
    });

    const ngoProfile1 = await NGOProfile.create({
      user: ngoUser1._id,
      ngoName: 'Asha Children Foundation',
      registrationNumber: 'NGO-DEL-2021-8849',
      category: 'Education',
      verificationStatus: 'verified',
      description: 'Dedicated to providing elementary education, digital literacy, and school supplies to over 5,000 children across slum clusters.',
      website: 'https://ashachildren.org',
      phone: '+91 98765 11111',
      address: '14, Barakhamba Road, Connaught Place',
      city: 'New Delhi',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200',
      bannerImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 4500, campaignsCompleted: 12, volunteersEngaged: 150, totalFundsRaised: 650000 }
    });

    const ngoUser2 = await User.create({
      name: 'GreenEarth Environmental Trust',
      email: 'ngo.green@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 22222',
      avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200',
      location: 'Bengaluru, Karnataka',
      bio: 'Pioneering urban afforestation, lake rejuvenation, and waste management campaigns.'
    });

    const ngoProfile2 = await NGOProfile.create({
      user: ngoUser2._id,
      ngoName: 'GreenEarth Environmental Trust',
      registrationNumber: 'NGO-KA-2020-3391',
      category: 'Environment',
      verificationStatus: 'verified',
      description: 'Mobilizing community tree plantation drives, plastic cleanups, and eco-friendly sustainability workshops.',
      website: 'https://greenearthtrust.org',
      phone: '+91 98765 22222',
      address: '42, MG Road, Indiranagar',
      city: 'Bengaluru',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      bannerImage: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 12000, campaignsCompleted: 8, volunteersEngaged: 420, totalFundsRaised: 420000 }
    });

    const ngoUser3 = await User.create({
      name: 'Nari Shakti Foundation',
      email: 'ngo.nari@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 44444',
      avatar: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=200',
      location: 'Jaipur, Rajasthan',
      bio: 'Empowering rural women through vocational skill centers, self-help groups, and micro-entrepreneurship.'
    });

    const ngoProfile3 = await NGOProfile.create({
      user: ngoUser3._id,
      ngoName: 'Nari Shakti Foundation',
      registrationNumber: 'NGO-RJ-2022-4412',
      category: 'Women Empowerment',
      verificationStatus: 'verified',
      description: 'Providing heavy-duty sewing machines, solar workshops, and digital commerce training to underprivileged women artisans.',
      website: 'https://narishaktitrust.org',
      phone: '+91 98765 44444',
      address: '22, MI Road',
      city: 'Jaipur',
      logo: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
      bannerImage: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 3500, campaignsCompleted: 6, volunteersEngaged: 180, totalFundsRaised: 520000 }
    });

    const ngoUser4 = await User.create({
      name: 'Paws & Tails Welfare Trust',
      email: 'ngo.paws@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 55555',
      avatar: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=200',
      location: 'Bengaluru, Karnataka',
      bio: 'Operating mobile animal medical vans, stray rescue shelters, and rabies vaccination campaigns.'
    });

    const ngoProfile4 = await NGOProfile.create({
      user: ngoUser4._id,
      ngoName: 'Paws & Tails Welfare Trust',
      registrationNumber: 'NGO-KA-2021-7721',
      category: 'Animal Care',
      verificationStatus: 'verified',
      description: 'Funding mobile veterinary ambulances, trauma surgery units, and rabies anti-body vaccination for street animals.',
      website: 'https://pawstails.org',
      phone: '+91 98765 55555',
      address: '88, 5th Block, Koramangala',
      city: 'Bengaluru',
      logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
      bannerImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 6200, campaignsCompleted: 9, volunteersEngaged: 210, totalFundsRaised: 390000 }
    });

    const ngoUser5 = await User.create({
      name: 'Sahana Relief Force',
      email: 'ngo.sahana@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 66666',
      avatar: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=200',
      location: 'Bhubaneswar, Odisha',
      bio: 'Rapid emergency responder network delivering clean water, temporary shelters, and medical relief in disaster zones.'
    });

    const ngoProfile5 = await NGOProfile.create({
      user: ngoUser5._id,
      ngoName: 'Sahana Relief Force',
      registrationNumber: 'NGO-OR-2019-1102',
      category: 'Disaster Relief',
      verificationStatus: 'verified',
      description: 'Deploying high-capacity water purifiers, solar lanterns, dry ration kits, and emergency shelters to disaster families.',
      website: 'https://sahanarelief.org',
      phone: '+91 98765 66666',
      address: '15, Janpath Road',
      city: 'Bhubaneswar',
      logo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
      bannerImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 15400, campaignsCompleted: 14, volunteersEngaged: 580, totalFundsRaised: 890000 }
    });

    const ngoUser6 = await User.create({
      name: 'Seva Food & Health Alliance',
      email: 'ngo.food@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 33333',
      avatar: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=200',
      location: 'Mumbai, Maharashtra',
      bio: 'Eradicating hunger and deploying mobile health clinics for daily wage earners.'
    });

    const ngoProfile6 = await NGOProfile.create({
      user: ngoUser6._id,
      ngoName: 'Seva Food & Health Alliance',
      registrationNumber: 'NGO-MH-2023-9021',
      category: 'Poverty Relief',
      verificationStatus: 'pending',
      description: 'Operating community kitchens and free primary health diagnostic camps across urban slums.',
      website: 'https://sevafood.org',
      phone: '+91 98765 33333',
      address: '108, Dharavi Main Road',
      city: 'Mumbai',
      logo: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=200',
      bannerImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
      impactMetrics: { livesImpacted: 8900, campaignsCompleted: 5, volunteersEngaged: 90, totalFundsRaised: 280000 }
    });

    // 3. Create Volunteers
    const volunteer1 = await User.create({
      name: 'Sharique Raza',
      email: 'volunteer.arjun@sahayak.ai',
      password: commonPassword,
      role: 'volunteer',
      phone: '+91 98111 44444',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi',
      skills: ['Teaching', 'Mathematics', 'Digital Literacy', 'Public Speaking'],
      availability: 'Weekends (Sat-Sun 10 AM - 4 PM)',
      bio: 'Software engineer passionate about teaching underprivileged kids basic computer skills.'
    });

    const volunteer2 = await User.create({
      name: 'Priya Sharma',
      email: 'volunteer.priya@sahayak.ai',
      password: commonPassword,
      role: 'volunteer',
      phone: '+91 98111 55555',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      location: 'Bengaluru',
      skills: ['Healthcare', 'First Aid', 'Event Management', 'Social Media'],
      availability: 'Flexible Evenings',
      bio: 'Medical student willing to assist in health screening camps and emergency relief distribution.'
    });

    // 4. Create Donors
    const donor1 = await User.create({
      name: 'Rohit Mehta',
      email: 'donor.rohit@sahayak.ai',
      password: commonPassword,
      role: 'donor',
      phone: '+91 97222 66666',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      location: 'Mumbai',
      causePreferences: ['Education', 'Healthcare', 'Disaster Relief'],
      totalDonated: 15000,
      bio: 'Active philanthropist supporting education and healthcare initiatives for women and children.'
    });

    const donor2 = await User.create({
      name: 'Ananya Roy',
      email: 'donor.ananya@sahayak.ai',
      password: commonPassword,
      role: 'donor',
      phone: '+91 97222 77777',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      location: 'Bengaluru',
      causePreferences: ['Environment', 'Poverty Relief'],
      totalDonated: 25000,
      bio: 'Eco-conscious Tech Lead donating monthly to reforestation and clean water projects.'
    });

    // 5. Create Beneficiaries
    const beneficiary1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'beneficiary.ramesh@sahayak.ai',
      password: commonPassword,
      role: 'beneficiary',
      phone: '+91 96333 88888',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi (Yamuna Pushta)',
      bio: 'Daily wage worker seeking educational support for two children.'
    });

    const beneficiary2 = await User.create({
      name: 'Sunita Devi',
      email: 'beneficiary.sunita@sahayak.ai',
      password: commonPassword,
      role: 'beneficiary',
      phone: '+91 96333 99999',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      location: 'Mumbai (Dharavi)',
      bio: 'Widowed mother requiring urgent medical aid and monthly ration kits.'
    });

    // 6. Create Campaigns Across Multiple Domains
    const campaign1 = await Campaign.create({
      ngo: ngoProfile1._id,
      title: 'Digital Literacy Kits for 200 Slum Children',
      description: 'Providing refurbished laptops, internet dongles, and interactive learning textbooks to kids in Delhi slum schools.',
      category: 'Education',
      targetAmount: 250000,
      raisedAmount: 165000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Teaching', 'Digital Literacy', 'Mathematics'],
      volunteersNeeded: 10,
      volunteersRegistered: 6,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      location: 'New Delhi',
      isUrgent: false
    });

    const campaign2 = await Campaign.create({
      ngo: ngoProfile2._id,
      title: '10,000 Urban Trees Planting Drive Bengaluru',
      description: 'Restoring green canopy in Bengaluru to combat heat island effect and rejuvenate soil water retention.',
      category: 'Environment',
      targetAmount: 180000,
      raisedAmount: 140000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Event Management', 'Logistics', 'Public Speaking'],
      volunteersNeeded: 25,
      volunteersRegistered: 18,
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&q=80&w=800',
      location: 'Bengaluru',
      isUrgent: false
    });

    const campaign3 = await Campaign.create({
      ngo: ngoProfile3._id,
      title: 'Women Micro-Entrepreneurship & Digital Sewing Workshop',
      description: 'Providing heavy-duty sewing machines, solar workshops, and digital commerce training to 150 underprivileged women artisans.',
      category: 'Women Empowerment',
      targetAmount: 350000,
      raisedAmount: 210000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Vocational Training', 'Financial Literacy', 'Digital Marketing'],
      volunteersNeeded: 12,
      volunteersRegistered: 8,
      imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
      location: 'Jaipur',
      isUrgent: false
    });

    const campaign4 = await Campaign.create({
      ngo: ngoProfile4._id,
      title: 'Stray Animal Emergency Mobile Clinic & Rescue Drive',
      description: 'Funding mobile veterinary ambulances, trauma surgery supplies, and anti-rabies vaccination for 1,000 street animals.',
      category: 'Animal Care',
      targetAmount: 220000,
      raisedAmount: 165000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Veterinary Assistance', 'Animal Care', 'First Aid'],
      volunteersNeeded: 15,
      volunteersRegistered: 11,
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
      location: 'Bengaluru',
      isUrgent: false
    });

    const campaign5 = await Campaign.create({
      ngo: ngoProfile5._id,
      title: 'Coastal Cyclone Emergency Survival & Water Kits',
      description: 'Deploying high-capacity water purifiers, solar lanterns, dry ration kits, and emergency shelters to cyclone-affected coastal families.',
      category: 'Disaster Relief',
      targetAmount: 450000,
      raisedAmount: 380000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Disaster Management', 'Logistics', 'First Aid'],
      volunteersNeeded: 20,
      volunteersRegistered: 14,
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
      location: 'Bhubaneswar',
      isUrgent: true
    });

    const campaign6 = await Campaign.create({
      ngo: ngoProfile1._id,
      title: 'Emergency Mobile Health & Nutrition Clinic',
      description: 'Deploying mobile health vans with doctors, essential diagnostic tools, and free ration bags for flood-affected families.',
      category: 'Healthcare',
      targetAmount: 300000,
      raisedAmount: 210000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Healthcare', 'First Aid', 'Logistics'],
      volunteersNeeded: 8,
      volunteersRegistered: 5,
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
      location: 'Mumbai',
      isUrgent: true
    });

    // 7. Create Volunteer Applications
    await VolunteerApplication.create({
      volunteer: volunteer1._id,
      campaign: campaign1._id,
      skillsSubmitted: ['Teaching', 'Digital Literacy'],
      availabilityNotes: 'Available Saturday mornings',
      status: 'accepted',
      aiMatchScore: 94,
      aiMatchReason: 'Exact match on Teaching & Digital Literacy skills with location match in Delhi.'
    });

    await VolunteerApplication.create({
      volunteer: volunteer2._id,
      campaign: campaign3._id,
      skillsSubmitted: ['Healthcare', 'First Aid'],
      availabilityNotes: 'Available for evening triage assistance',
      status: 'pending',
      aiMatchScore: 91,
      aiMatchReason: 'Strong alignment with Medical student profile and First Aid skills.'
    });

    // 8. Create Donations Across All 6 Modes
    // Mode 1: Monetary Online (UPI)
    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 10000,
      donationType: 'monetary',
      paymentMethod: 'UPI',
      transactionId: 'TXN-SAHAYAK-992011',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-80G-102938'
    });

    // Mode 2: Monetary Online (Card)
    await Donation.create({
      donor: donor2._id,
      campaign: campaign2._id,
      ngo: ngoProfile2._id,
      amount: 25000,
      donationType: 'monetary',
      paymentMethod: 'Card',
      transactionId: 'TXN-SAHAYAK-992012',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-80G-102939'
    });

    // Mode 3: In-Kind Physical Relief Supplies
    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 5500,
      donationType: 'in_kind',
      paymentMethod: 'InKind_Pickup',
      inKindDetails: {
        itemCategory: 'Food & Grains',
        itemName: '50kg Whole Wheat Atta & 20kg Toor Dal Bags',
        quantity: 70,
        unit: 'kg',
        pickupAddress: 'Sector 14, Rohini, New Delhi',
        pickupDate: '2026-10-22',
        estimatedValue: 5500,
        logisticsStatus: 'in_transit'
      },
      transactionId: 'TXN-SAHAYAK-992013',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-INKIND-203941'
    });

    // Mode 4: Monthly Recurring Social SIP
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 1500,
      donationType: 'recurring',
      paymentMethod: 'UPI_Autopay',
      recurringDetails: {
        frequency: 'monthly',
        durationMonths: 12,
        nextBillingDate: nextMonth,
        status: 'active',
        mandateId: 'MANDATE-SIP-2026-8841'
      },
      transactionId: 'TXN-SAHAYAK-992014',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-SIP-304912'
    });

    // Mode 5: Web3 / Polygon Crypto Donation
    await Donation.create({
      donor: donor2._id,
      campaign: campaign2._id,
      ngo: ngoProfile2._id,
      amount: 7800,
      donationType: 'crypto',
      paymentMethod: 'Crypto_MATIC',
      cryptoDetails: {
        network: 'Polygon Mainnet (PoS)',
        cryptoCurrency: 'MATIC',
        cryptoAmount: 150,
        walletAddress: '0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a',
        blockNumber: 58941022,
        txHash: '0x9a4f78e2d3c1b9a8f4c2e6d1a5b8f2c7e4d9a3b6f8c1e5d7a2b9f4c8e1d6a3b7',
        gasUsed: '0.0021 MATIC'
      },
      blockchainTxHash: '0x9a4f78e2d3c1b9a8f4c2e6d1a5b8f2c7e4d9a3b6f8c1e5d7a2b9f4c8e1d6a3b7',
      transactionId: 'TXN-SAHAYAK-992015',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-WEB3-405923'
    });

    // Mode 6: Corporate CSR Matching Grant
    await Donation.create({
      donor: donor1._id,
      campaign: campaign5._id,
      ngo: ngoProfile5._id,
      amount: 50000,
      donationType: 'corporate_csr',
      paymentMethod: 'Corporate_CSR_NEFT',
      corporateDetails: {
        companyName: 'Infosys Social Impact Foundation',
        cinGstin: '07AABCI1234F1Z8',
        csrRegistrationNo: 'CSR00019283',
        matchingGrantMultiplier: 2,
        totalEffectiveImpactAmount: 100000,
        contactPerson: 'Deepak Rao (CSR Lead)'
      },
      transactionId: 'TXN-SAHAYAK-992016',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-CSR-506934'
    });

    // 9. Create Assistance Requests
    await AssistanceRequest.create({
      beneficiary: beneficiary1._id,
      assignedNGO: ngoProfile1._id,
      title: 'School Fees and Textbook Assistance for 2 Children',
      description: 'Lost construction contract during heavy rains. Seeking elementary school textbooks and fee coverage for grade 4 and grade 6 kids.',
      category: 'Educational Support',
      location: 'Yamuna Pushta, Delhi',
      affectedPeople: 4,
      aiUrgencyScore: 78,
      priorityLevel: 'High',
      priorityReason: 'Educational continuity risk for minors identified by AI.',
      status: 'approved',
      contactNumber: '+91 96333 88888'
    });

    await AssistanceRequest.create({
      beneficiary: beneficiary2._id,
      assignedNGO: ngoProfile3._id,
      title: 'Urgent Insulin Supply and Ration Kit for Elderly Mother',
      description: 'Critical need for monthly diabetes medication and food grain supply following local clinic closure.',
      category: 'Healthcare & Medicine',
      location: 'Dharavi, Mumbai',
      affectedPeople: 2,
      aiUrgencyScore: 92,
      priorityLevel: 'Urgent',
      priorityReason: 'AI flagged emergency medical terms (Insulin, Critical) requiring priority delivery.',
      status: 'in_progress',
      contactNumber: '+91 96333 99999'
    });

    // 10. Activity Logs
    await ActivityLog.create({
      user: adminUser._id,
      userName: adminUser.name,
      userRole: 'admin',
      action: 'SYSTEM_SEEDED',
      details: 'Initialized Sahayak AI platform database with demo accounts, verified NGOs, campaigns, donations, and AI models.'
    });

    console.log('✅ Sahayak AI Database Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔐 Demo Account Credentials (Password for all: password123):');
    console.log('👑 Admin:       admin@sahayak.ai');
    console.log('🏢 NGO 1:       ngo.asha@sahayak.ai (Verified)');
    console.log('🏢 NGO 2:       ngo.green@sahayak.ai (Verified)');
    console.log('🏢 NGO 3:       ngo.food@sahayak.ai (Pending Admin Verification)');
    console.log('🤝 Volunteer:   volunteer.arjun@sahayak.ai');
    console.log('💳 Donor:       donor.rohit@sahayak.ai');
    console.log('🤲 Beneficiary: beneficiary.ramesh@sahayak.ai');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
