import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Import Models
import User from './models/User.js';
import NGOProfile from './models/NGOProfile.js';
import Campaign from './models/Campaign.js';
import VolunteerApplication from './models/VolunteerApplication.js';
import Donation from './models/Donation.js';
import AssistanceRequest from './models/AssistanceRequest.js';
import ActivityLog from './models/ActivityLog.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahayak_ai';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Sahayak AI Express Server',
    timestamp: new Date(),
    dbConnected: mongoose.connection.readyState === 1
  });
});

// API Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Auto Seed Function if database is empty
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('🌱 Empty database detected. Auto-seeding initial Sahayak AI dataset...');
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // 1. Admin
    const adminUser = await User.create({
      name: 'Sahayak Super Admin',
      email: 'admin@sahayak.ai',
      password: commonPassword,
      role: 'admin',
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi, India',
      bio: 'Platform Overseer for Sahayak AI.'
    });

    // 2. NGO 1
    const ngoUser1 = await User.create({
      name: 'Asha Children Foundation',
      email: 'ngo.asha@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 11111',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200',
      location: 'New Delhi',
      bio: 'Empowering youth through free education.'
    });

    const ngoProfile1 = await NGOProfile.create({
      user: ngoUser1._id,
      ngoName: 'Asha Children Foundation',
      registrationNumber: 'NGO-DEL-2021-8849',
      category: 'Education',
      verificationStatus: 'verified',
      description: 'Dedicated to elementary education and digital literacy.',
      phone: '+91 98765 11111',
      address: 'Connaught Place, New Delhi',
      city: 'New Delhi',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200'
    });

    // 3. NGO 2 (Verified - Environment)
    const ngoUser2 = await User.create({
      name: 'GreenEarth Environmental Trust',
      email: 'ngo.green@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 22222',
      location: 'Bengaluru'
    });

    const ngoProfile2 = await NGOProfile.create({
      user: ngoUser2._id,
      ngoName: 'GreenEarth Environmental Trust',
      registrationNumber: 'NGO-KA-2020-3391',
      category: 'Environment',
      verificationStatus: 'verified',
      description: 'Pioneering urban afforestation, lake rejuvenation, and waste management campaigns.',
      phone: '+91 98765 22222',
      address: 'Indiranagar, Bengaluru',
      city: 'Bengaluru',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200'
    });

    // 4. NGO 3 (Verified - Women Empowerment)
    const ngoUser3 = await User.create({
      name: 'Nari Shakti Foundation',
      email: 'ngo.nari@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 44444',
      location: 'Jaipur'
    });

    const ngoProfile3 = await NGOProfile.create({
      user: ngoUser3._id,
      ngoName: 'Nari Shakti Foundation',
      registrationNumber: 'NGO-RJ-2022-4412',
      category: 'Women Empowerment',
      verificationStatus: 'verified',
      description: 'Empowering rural women through vocational skill centers, self-help groups, and micro-entrepreneurship.',
      phone: '+91 98765 44444',
      address: 'MI Road, Jaipur',
      city: 'Jaipur',
      logo: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=200'
    });

    // 5. NGO 4 (Verified - Animal Care)
    const ngoUser4 = await User.create({
      name: 'Paws & Tails Welfare Trust',
      email: 'ngo.paws@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 55555',
      location: 'Bengaluru'
    });

    const ngoProfile4 = await NGOProfile.create({
      user: ngoUser4._id,
      ngoName: 'Paws & Tails Welfare Trust',
      registrationNumber: 'NGO-KA-2021-7721',
      category: 'Animal Care',
      verificationStatus: 'verified',
      description: 'Operating mobile animal medical vans, stray rescue shelters, and rabies vaccination drives.',
      phone: '+91 98765 55555',
      address: 'Koramangala, Bengaluru',
      city: 'Bengaluru',
      logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=200'
    });

    // 6. NGO 5 (Verified - Disaster Relief)
    const ngoUser5 = await User.create({
      name: 'Sahana Relief Force',
      email: 'ngo.sahana@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 66666',
      location: 'Bhubaneswar'
    });

    const ngoProfile5 = await NGOProfile.create({
      user: ngoUser5._id,
      ngoName: 'Sahana Relief Force',
      registrationNumber: 'NGO-OR-2019-1102',
      category: 'Disaster Relief',
      verificationStatus: 'verified',
      description: 'Rapid emergency responder network delivering clean water, temporary shelters, and medical relief in disaster zones.',
      phone: '+91 98765 66666',
      address: 'Janpath, Bhubaneswar',
      city: 'Bhubaneswar',
      logo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=200'
    });

    // 7. NGO 6 (Pending - Poverty Relief)
    const ngoUser6 = await User.create({
      name: 'Seva Food & Health Alliance',
      email: 'ngo.food@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 33333',
      location: 'Mumbai'
    });

    const ngoProfile6 = await NGOProfile.create({
      user: ngoUser6._id,
      ngoName: 'Seva Food & Health Alliance',
      registrationNumber: 'NGO-MH-2023-9021',
      category: 'Poverty Relief',
      verificationStatus: 'pending',
      description: 'Community kitchens and free primary health camps.',
      address: 'Dharavi, Mumbai',
      city: 'Mumbai',
      logo: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=200'
    });

    // 8. NGO 7 (Verified - Healthcare / Vision)
    const ngoUser7 = await User.create({
      name: 'Drishti Eye & Health Care Mission',
      email: 'ngo.drishti@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 77777',
      location: 'Hyderabad',
      bio: 'Providing free eye cataract surgeries, pediatric vision care, and medical camps in rural Telangana.'
    });

    const ngoProfile7 = await NGOProfile.create({
      user: ngoUser7._id,
      ngoName: 'Drishti Eye & Health Care Mission',
      registrationNumber: 'NGO-TS-2020-5519',
      category: 'Healthcare',
      verificationStatus: 'verified',
      description: 'Dedicated to preventing avoidable blindness through free rural cataract surgeries and subsidized eyewear.',
      phone: '+91 98765 77777',
      address: 'Banjara Hills, Road No. 12',
      city: 'Hyderabad',
      logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=200'
    });

    // 9. NGO 8 (Verified - Education / Tech for Rural Youth)
    const ngoUser8 = await User.create({
      name: 'Akshara Rural Education Trust',
      email: 'ngo.akshara@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 88888',
      location: 'Pune',
      bio: 'Digital classrooms, solar smart schools, and scholarships for tribal children in Maharashtra.'
    });

    const ngoProfile8 = await NGOProfile.create({
      user: ngoUser8._id,
      ngoName: 'Akshara Rural Education Trust',
      registrationNumber: 'NGO-MH-2021-1204',
      category: 'Education',
      verificationStatus: 'verified',
      description: 'Setting up solar-powered computer labs and providing digital STEM education in 60+ rural government schools.',
      phone: '+91 98765 88888',
      address: 'FC Road, Shivajinagar',
      city: 'Pune',
      logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=200'
    });

    // 10. NGO 9 (Verified - Poverty & Hunger Relief)
    const ngoUser9 = await User.create({
      name: 'Roti Bank & Food Rescue Initiative',
      email: 'ngo.roti@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 99999',
      location: 'Kolkata',
      bio: 'Rescuing surplus food from hotels & banquets to serve 3,000+ hot nutritious meals daily.'
    });

    const ngoProfile9 = await NGOProfile.create({
      user: ngoUser9._id,
      ngoName: 'Roti Bank & Food Rescue Initiative',
      registrationNumber: 'NGO-WB-2022-7811',
      category: 'Poverty Relief',
      verificationStatus: 'verified',
      description: 'Zero food wastage mission collecting fresh surplus meals to feed pavement dwellers and daily-wage laborers.',
      phone: '+91 98765 99999',
      address: 'Park Street, Kolkata',
      city: 'Kolkata',
      logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=200'
    });

    // 11. NGO 10 (Verified - Environment & Water Conservation)
    const ngoUser10 = await User.create({
      name: 'Jal Shakti Water & Sanitation Foundation',
      email: 'ngo.jal@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00010',
      location: 'Chennai',
      bio: 'Rejuvenating dry water reservoirs, building rainwater harvesting pits, and installing solar RO purifiers.'
    });

    const ngoProfile10 = await NGOProfile.create({
      user: ngoUser10._id,
      ngoName: 'Jal Shakti Water & Sanitation Foundation',
      registrationNumber: 'NGO-TN-2019-6632',
      category: 'Environment',
      verificationStatus: 'verified',
      description: 'Reviving traditional temple tanks, village lakes, and delivering clean, fluoride-free drinking water to drought-hit communities.',
      phone: '+91 98765 00010',
      address: 'T. Nagar, Chennai',
      city: 'Chennai',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=200'
    });

    // 12. NGO 11 (Verified - Child Care & Orphan Welfare)
    const ngoUser11 = await User.create({
      name: 'Vatsalya Child Care & Orphan Welfare',
      email: 'ngo.vatsalya@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00011',
      location: 'Ahmedabad',
      bio: 'Providing shelter, nutritional support, and loving foster care to abandoned and destitute children.'
    });

    const ngoProfile11 = await NGOProfile.create({
      user: ngoUser11._id,
      ngoName: 'Vatsalya Child Care & Orphan Welfare',
      registrationNumber: 'NGO-GJ-2021-9943',
      category: 'Education',
      verificationStatus: 'verified',
      description: 'Nurturing shelter homes providing comprehensive foster care, schooling, healthcare, and psychological support for orphans.',
      phone: '+91 98765 00011',
      address: 'SG Highway, Ahmedabad',
      city: 'Ahmedabad',
      logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200'
    });

    // 13. NGO 12 (Verified - Elderly & Senior Citizens Care)
    const ngoUser12 = await User.create({
      name: 'Prerna Senior Care & Old Age Home Foundation',
      email: 'ngo.prerna@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00012',
      location: 'Lucknow',
      bio: 'Dignified shelter, assisted living, and free geriatric healthcare for abandoned elderly citizens.'
    });

    const ngoProfile12 = await NGOProfile.create({
      user: ngoUser12._id,
      ngoName: 'Prerna Senior Care & Old Age Home Foundation',
      registrationNumber: 'NGO-UP-2020-4108',
      category: 'Healthcare',
      verificationStatus: 'verified',
      description: 'Operating community elder homes with round-the-clock nursing assistance, nutritious warm meals, and recreational therapy.',
      phone: '+91 98765 00012',
      address: 'Gomti Nagar, Lucknow',
      city: 'Lucknow',
      logo: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=200'
    });

    // 14. NGO 13 (Verified - Disability Empowerment & Accessible Living)
    const ngoUser13 = await User.create({
      name: 'Samarth Disability Rehabilitation & Inclusion Mission',
      email: 'ngo.samarth@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00013',
      location: 'Chandigarh',
      bio: 'Prosthetic limb camps, wheelchair distribution, and assistive tech training for differently-abled individuals.'
    });

    const ngoProfile13 = await NGOProfile.create({
      user: ngoUser13._id,
      ngoName: 'Samarth Disability Rehabilitation & Inclusion Mission',
      registrationNumber: 'NGO-PB-2022-3855',
      category: 'Healthcare',
      verificationStatus: 'verified',
      description: 'Empowering persons with physical disabilities through motorized wheelchairs, speech devices, and adaptive career skills.',
      phone: '+91 98765 00013',
      address: 'Sector 17, Chandigarh',
      city: 'Chandigarh',
      logo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=200'
    });

    // 15. NGO 14 (Verified - Wildlife & Himalayan Biodiversity)
    const ngoUser14 = await User.create({
      name: 'Himalayan Wildlife & Forest Conservation Alliance',
      email: 'ngo.himalaya@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00014',
      location: 'Dehradun',
      bio: 'Protecting endangered Himalayan species, high-altitude reforestation, and preventing forest fires.'
    });

    const ngoProfile14 = await NGOProfile.create({
      user: ngoUser14._id,
      ngoName: 'Himalayan Wildlife & Forest Conservation Alliance',
      registrationNumber: 'NGO-UK-2018-7201',
      category: 'Animal Care',
      verificationStatus: 'verified',
      description: 'Rescuing injured mountain wildlife, establishing protected corridors, and engaging local hill youth in eco-patrols.',
      phone: '+91 98765 00014',
      address: 'Rajpur Road, Dehradun',
      city: 'Dehradun',
      logo: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=200'
    });

    // 16. NGO 15 (Verified - Rural Skill Development & Youth Livelihoods)
    const ngoUser15 = await User.create({
      name: 'Kaushal Rural Livelihoods & Artisan Guild',
      email: 'ngo.kaushal@sahayak.ai',
      password: commonPassword,
      role: 'ngo',
      phone: '+91 98765 00015',
      location: 'Bhopal',
      bio: 'Reviving traditional handicrafts, pottery, handloom weaving, and providing direct market linkages for rural artisans.'
    });

    const ngoProfile15 = await NGOProfile.create({
      user: ngoUser15._id,
      ngoName: 'Kaushal Rural Livelihoods & Artisan Guild',
      registrationNumber: 'NGO-MP-2021-6540',
      category: 'Women Empowerment',
      verificationStatus: 'verified',
      description: 'Training rural youth in solar technician trades, pottery, organic farming, and e-commerce selling skills.',
      phone: '+91 98765 00015',
      address: 'Arera Colony, Bhopal',
      city: 'Bhopal',
      logo: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=200'
    });

    // Volunteer
    const volunteer1 = await User.create({
      name: 'Sharique Raza',
      email: 'volunteer.arjun@sahayak.ai',
      password: commonPassword,
      role: 'volunteer',
      phone: '+91 98111 44444',
      location: 'New Delhi',
      skills: ['Teaching', 'Mathematics', 'Digital Literacy', 'Vocational Training'],
      bio: 'Software engineer passionate about teaching kids and skill development.'
    });

    // Donor
    const donor1 = await User.create({
      name: 'Rohit Mehta',
      email: 'donor.rohit@sahayak.ai',
      password: commonPassword,
      role: 'donor',
      location: 'Mumbai',
      causePreferences: ['Education', 'Healthcare', 'Women Empowerment', 'Animal Care'],
      totalDonated: 15000
    });

    // Beneficiary
    const beneficiary1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'beneficiary.ramesh@sahayak.ai',
      password: commonPassword,
      role: 'beneficiary',
      phone: '+91 96333 88888',
      location: 'New Delhi'
    });

    // CAMPAIGNS ACROSS MULTIPLE DOMAINS

    // Campaign 1: Education
    const campaign1 = await Campaign.create({
      ngo: ngoProfile1._id,
      title: 'Digital Literacy Kits for 200 Slum Children',
      description: 'Providing refurbished laptops, internet dongles, and interactive learning textbooks to kids in Delhi slum schools.',
      category: 'Education',
      targetAmount: 250000,
      raisedAmount: 165000,
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Teaching', 'Digital Literacy'],
      volunteersNeeded: 10,
      volunteersRegistered: 6,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      location: 'New Delhi'
    });

    // Campaign 2: Environment
    const campaign2 = await Campaign.create({
      ngo: ngoProfile2._id,
      title: '10,000 Urban Trees Planting Drive Bengaluru',
      description: 'Restoring green canopy in Bengaluru to combat urban heat island effects and rejuvenate groundwater retention.',
      category: 'Environment',
      targetAmount: 180000,
      raisedAmount: 140000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Event Management', 'Logistics', 'Public Speaking'],
      volunteersNeeded: 25,
      volunteersRegistered: 18,
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&q=80&w=800',
      location: 'Bengaluru'
    });

    // Campaign 3: Women Empowerment
    const campaign3 = await Campaign.create({
      ngo: ngoProfile3._id,
      title: 'Women Micro-Entrepreneurship & Digital Sewing Workshop',
      description: 'Providing heavy-duty sewing machines, solar workshops, and digital commerce training to 150 underprivileged women artisans.',
      category: 'Women Empowerment',
      targetAmount: 350000,
      raisedAmount: 210000,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Vocational Training', 'Financial Literacy', 'Digital Marketing'],
      volunteersNeeded: 12,
      volunteersRegistered: 8,
      imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
      location: 'Jaipur'
    });

    // Campaign 4: Animal Care
    const campaign4 = await Campaign.create({
      ngo: ngoProfile4._id,
      title: 'Stray Animal Emergency Mobile Clinic & Rescue Drive',
      description: 'Funding mobile veterinary ambulances, trauma surgery supplies, and anti-rabies vaccination for 1,000 street animals.',
      category: 'Animal Care',
      targetAmount: 220000,
      raisedAmount: 165000,
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Veterinary Assistance', 'Animal Care', 'First Aid'],
      volunteersNeeded: 15,
      volunteersRegistered: 11,
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
      location: 'Bengaluru'
    });

    // Campaign 5: Disaster Relief
    const campaign5 = await Campaign.create({
      ngo: ngoProfile5._id,
      title: 'Coastal Cyclone Emergency Survival & Water Kits',
      description: 'Deploying high-capacity water purifiers, solar lanterns, dry ration kits, and emergency shelters to cyclone-affected coastal families.',
      category: 'Disaster Relief',
      targetAmount: 450000,
      raisedAmount: 380000,
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      isUrgent: true,
      requiredSkills: ['Disaster Management', 'Logistics', 'First Aid'],
      volunteersNeeded: 20,
      volunteersRegistered: 14,
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
      location: 'Bhubaneswar'
    });

    // Campaign 6: Healthcare
    const campaign6 = await Campaign.create({
      ngo: ngoProfile1._id,
      title: 'Mobile Child Health Diagnostic & Malnutrition Screening',
      description: 'Deploying pediatric health specialists to slum clusters to test for anemia, malnutrition, and administer vitamin supplements.',
      category: 'Healthcare',
      targetAmount: 280000,
      raisedAmount: 195000,
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Healthcare', 'First Aid', 'Community Outreach'],
      volunteersNeeded: 10,
      volunteersRegistered: 7,
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
      location: 'New Delhi'
    });

    // Campaign 7: Food & Hunger Relief
    const campaign7 = await Campaign.create({
      ngo: ngoProfile1._id,
      title: 'Annapurna Hunger Relief: Daily Meals & Dry Ration Kits',
      description: 'Distributing dry food grains (rice, wheat, pulses), cooking oil, and cooked hot mid-day meals to slum dwellers, daily wagers, and impoverished children.',
      category: 'Poverty Relief',
      targetAmount: 300000,
      raisedAmount: 185000,
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      isUrgent: true,
      requiredSkills: ['Food Preparation', 'Logistics', 'Community Outreach'],
      volunteersNeeded: 18,
      volunteersRegistered: 12,
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
      location: 'New Delhi'
    });

    // Campaign 8: Clothes & Household Goods Relief
    const campaign8 = await Campaign.create({
      ngo: ngoProfile3._id,
      title: 'Vastra & Griha: Clothes, Blankets & Household Goods Drive',
      description: 'Collecting and distributing wearable clothing, winter warm blankets, kitchen cookware/utensils, bedsheets, and household appliances to vulnerable families.',
      category: 'Disaster Relief',
      targetAmount: 260000,
      raisedAmount: 140000,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Inventory Sorting', 'Logistics', 'Distribution'],
      volunteersNeeded: 15,
      volunteersRegistered: 9,
      imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&q=80&w=800',
      location: 'Jaipur'
    });

    // Campaign 9: Free Cataract & Eye Surgeries for Rural Elders (Drishti NGO)
    const campaign9 = await Campaign.create({
      ngo: ngoProfile7._id,
      title: 'Vision for All: 500 Free Cataract Surgeries in Rural Telangana',
      description: 'Funding intraocular lenses, surgical consumables, and post-op care to restore vision for destitute rural seniors.',
      category: 'Healthcare',
      targetAmount: 400000,
      raisedAmount: 275000,
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Healthcare', 'Patient Care', 'Logistics'],
      volunteersNeeded: 12,
      volunteersRegistered: 8,
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
      location: 'Hyderabad'
    });

    // Campaign 10: Solar Smart Classrooms in 20 Tribal Schools (Akshara NGO)
    const campaign10 = await Campaign.create({
      ngo: ngoProfile8._id,
      title: 'Solar Smart Classrooms & Coding Labs for Tribal Schools',
      description: 'Installing solar panels, interactive smart boards, and 100 tablets across 20 remote tribal schools in Maharashtra.',
      category: 'Education',
      targetAmount: 500000,
      raisedAmount: 340000,
      endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Teaching', 'Digital Literacy', 'STEM Mentorship'],
      volunteersNeeded: 16,
      volunteersRegistered: 11,
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
      location: 'Pune'
    });

    // Campaign 11: Food Rescue & Daily Slum Kitchens (Roti Bank NGO)
    const campaign11 = await Campaign.create({
      ngo: ngoProfile9._id,
      title: 'City Food Rescue: 50,000 Hot Meals for Pavement Dwellers',
      description: 'Daily collection of hygienic excess food from weddings and commercial caterers to feed hungry children and homeless families.',
      category: 'Poverty Relief',
      targetAmount: 320000,
      raisedAmount: 215000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      isUrgent: true,
      requiredSkills: ['Food Preparation', 'Logistics', 'Driving'],
      volunteersNeeded: 20,
      volunteersRegistered: 14,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      location: 'Kolkata'
    });

    // Campaign 12: Rainwater Harvesting & Clean Drinking Wells (Jal Shakti NGO)
    const campaign12 = await Campaign.create({
      ngo: ngoProfile10._id,
      title: 'Reviving 15 Drought-Hit Village Ponds & Rainwater Wells',
      description: 'Desilting ancient percolation ponds, installing community biosand water filters, and delivering water security to 8,000 villagers.',
      category: 'Environment',
      targetAmount: 380000,
      raisedAmount: 260000,
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Civil Engineering', 'Community Outreach', 'Logistics'],
      volunteersNeeded: 15,
      volunteersRegistered: 9,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800',
      location: 'Chennai'
    });

    // Campaign 13: Full Year Foster Support & Education for 50 Orphans (Vatsalya NGO)
    const campaign13 = await Campaign.create({
      ngo: ngoProfile11._id,
      title: 'Foster Care, Nutrition & Quality Schooling for 50 Orphaned Children',
      description: 'Providing loving shelter, school tuition, uniforms, books, and three balanced meals daily to orphaned youngsters.',
      category: 'Education',
      targetAmount: 450000,
      raisedAmount: 310000,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Teaching', 'Mentorship', 'Child Care'],
      volunteersNeeded: 14,
      volunteersRegistered: 10,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      location: 'Ahmedabad'
    });

    // Campaign 14: Dignified Care & Geriatric Medical Assistance for 100 Elders (Prerna NGO)
    const campaign14 = await Campaign.create({
      ngo: ngoProfile12._id,
      title: 'Golden Years: Dignified Shelter & 24/7 Nursing Care for 100 Abandoned Elders',
      description: 'Providing clean living quarters, daily doctor visits, arthritis physiotherapy, and warm meals for destitute seniors.',
      category: 'Healthcare',
      targetAmount: 350000,
      raisedAmount: 245000,
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Nursing Assistance', 'Elderly Care', 'First Aid'],
      volunteersNeeded: 10,
      volunteersRegistered: 7,
      imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=800',
      location: 'Lucknow'
    });

    // Campaign 15: Motorized Wheelchairs & Mobility Devices for 80 Individuals (Samarth NGO)
    const campaign15 = await Campaign.create({
      ngo: ngoProfile13._id,
      title: 'Mobility & Freedom: Motorized Wheelchairs for 80 Differently-Abled Youth',
      description: 'Custom-fitted lightweight motorized wheelchairs and mobility aids empowering college students with paraplegia.',
      category: 'Healthcare',
      targetAmount: 480000,
      raisedAmount: 360000,
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: 'active',
      isUrgent: true,
      requiredSkills: ['Biomedical Support', 'Counseling', 'Event Logistics'],
      volunteersNeeded: 12,
      volunteersRegistered: 9,
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
      location: 'Chandigarh'
    });

    // Campaign 16: Himalayan Alpine Forest Planting & Snow Leopard Habitat (Himalayan NGO)
    const campaign16 = await Campaign.create({
      ngo: ngoProfile14._id,
      title: 'High-Altitude Oak Reforestation & Snow Leopard Corridor Protection',
      description: 'Planting 25,000 indigenous broadleaf oak saplings in fragile Uttarakhand alpine corridors and monitoring wildlife tracks.',
      category: 'Animal Care',
      targetAmount: 420000,
      raisedAmount: 290000,
      endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Forestry', 'Trekking', 'Wildlife Photography'],
      volunteersNeeded: 20,
      volunteersRegistered: 15,
      imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=800',
      location: 'Dehradun'
    });

    // Campaign 17: Solar Charkha & Handloom Weaving Cluster for 120 Women (Kaushal NGO)
    const campaign17 = await Campaign.create({
      ngo: ngoProfile15._id,
      title: 'Solar Charkha & Organic Handloom Guild for 120 Rural Women Artisans',
      description: 'Distributing solar-powered spinning wheels, organic cotton yarn, and opening direct e-commerce pop-ups for rural weavers.',
      category: 'Women Empowerment',
      targetAmount: 370000,
      raisedAmount: 275000,
      endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      status: 'active',
      requiredSkills: ['Textile Design', 'Marketing', 'Financial Training'],
      volunteersNeeded: 10,
      volunteersRegistered: 8,
      imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800',
      location: 'Bhopal'
    });

    // 8. Assistance Request
    await AssistanceRequest.create({
      beneficiary: beneficiary1._id,
      assignedNGO: ngoProfile1._id,
      title: 'School Fees and Textbook Assistance for 2 Children',
      description: 'Seeking school textbooks and fee coverage for grade 4 and grade 6 kids.',
      category: 'Educational Support',
      location: 'Delhi',
      affectedPeople: 4,
      aiUrgencyScore: 78,
      priorityLevel: 'High',
      priorityReason: 'Educational continuity risk identified by AI.',
      status: 'approved'
    });

    // Seed Initial Multi-Mode Donations
    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 10000,
      donationType: 'monetary',
      paymentMethod: 'UPI',
      transactionId: 'TXN-SAHAYAK-881001',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-80G-881001'
    });

    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 4500,
      donationType: 'in_kind',
      paymentMethod: 'InKind_Pickup',
      inKindDetails: {
        itemCategory: 'Food & Grains',
        itemName: '40kg Wheat Flour & 20kg Lentils',
        quantity: 60,
        unit: 'kg',
        pickupAddress: 'Sector 14, Rohini, New Delhi',
        pickupDate: '2026-10-22',
        estimatedValue: 4500,
        logisticsStatus: 'in_transit'
      },
      transactionId: 'TXN-SAHAYAK-881002',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-INKIND-881002'
    });

    await Donation.create({
      donor: donor1._id,
      campaign: campaign1._id,
      ngo: ngoProfile1._id,
      amount: 1200,
      donationType: 'recurring',
      paymentMethod: 'UPI_Autopay',
      recurringDetails: {
        frequency: 'monthly',
        durationMonths: 12,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        mandateId: 'MANDATE-SIP-881003'
      },
      transactionId: 'TXN-SAHAYAK-881003',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-SIP-881003'
    });

    await Donation.create({
      donor: donor1._id,
      campaign: campaign5._id,
      ngo: ngoProfile5._id,
      amount: 5200,
      donationType: 'crypto',
      paymentMethod: 'Crypto_MATIC',
      cryptoDetails: {
        network: 'Polygon Mainnet (PoS)',
        cryptoCurrency: 'MATIC',
        cryptoAmount: 100,
        walletAddress: '0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a',
        blockNumber: 58942100,
        txHash: '0x8f2d91a3b5c7e9f1a2b4c6e8d0a2f4c6e8b0d2a4f6c8e0b2d4a6f8c0e2b4d6a8',
        gasUsed: '0.0019 MATIC'
      },
      blockchainTxHash: '0x8f2d91a3b5c7e9f1a2b4c6e8d0a2f4c6e8b0d2a4f6c8e0b2d4a6f8c0e2b4d6a8',
      transactionId: 'TXN-SAHAYAK-881004',
      paymentStatus: 'success',
      receiptNumber: 'RCPT-WEB3-881004'
    });

    // 9. Activity Log
    await ActivityLog.create({
      user: adminUser._id,
      userName: adminUser.name,
      userRole: 'admin',
      action: 'AUTO_SEEDED',
      details: 'Auto-populated initial demo dataset on server startup.'
    });

    console.log('✅ Auto-seeding completed!');
  } catch (err) {
    console.error('Auto seed error:', err.message);
  }
};

// Connect to MongoDB & Start Server
const startServer = async () => {
  let uri = MONGODB_URI;

  try {
    console.log(`📡 Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.log('⚠️ Local MongoDB daemon not running on port 27017. Launching automatic MongoMemoryServer instance...');
    try {
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ Connected to MongoMemoryServer at ${uri}`);
    } catch (memErr) {
      console.error('❌ Failed to start MongoMemoryServer:', memErr.message);
    }
  }

  await autoSeedIfEmpty();

  app.listen(PORT, () => {
    console.log(`🚀 Sahayak AI REST API Server running on port ${PORT}`);
  });
};

startServer();
