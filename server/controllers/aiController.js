import Campaign from '../models/Campaign.js';
import NGOProfile from '../models/NGOProfile.js';
import AssistanceRequest from '../models/AssistanceRequest.js';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

// Helper for HTTP requests to Python FastAPI
const callFastAPI = async (endpoint, payload) => {
  try {
    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // FastAPI service unreachable - will fall back to Node.js AI engine
  }
  return null;
};

// @desc    AI Volunteer-NGO & Campaign Matching
// @route   POST /api/ai/match-volunteer
export const matchVolunteer = async (req, res) => {
  try {
    const { skills, interests, location } = req.body;
    const volunteerSkills = skills || req.user?.skills || [];
    const campaignId = req.body.campaignId;

    if (campaignId) {
      const campaign = await Campaign.findById(campaignId).populate('ngo');
      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      // Try FastAPI
      const fastApiResult = await callFastAPI('/ai/match-volunteer', {
        volunteer_skills: volunteerSkills,
        volunteer_location: location || req.user?.location || 'New Delhi',
        campaign_skills: campaign.requiredSkills,
        campaign_location: campaign.location,
        campaign_category: campaign.category
      });

      if (fastApiResult) {
        return res.json({ success: true, ...fastApiResult, source: 'fastapi' });
      }

      // Node Fallback
      const matches = volunteerSkills.filter(s =>
        campaign.requiredSkills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
      );
      const score = Math.min(98, 70 + matches.length * 10);

      return res.json({
        success: true,
        matchScore: score,
        matchLevel: score > 85 ? 'Excellent Match' : 'Good Match',
        matchReason: matches.length > 0
          ? `Direct skill alignment in: ${matches.join(', ')}`
          : `Aligned with NGO's ${campaign.category} cause in ${campaign.location}`,
        matchingSkills: matches,
        source: 'node_fallback'
      });
    }

    // Match across all campaigns
    const activeCampaigns = await Campaign.find({ status: 'active' }).populate('ngo');

    const matchedCampaigns = activeCampaigns.map(camp => {
      const matches = volunteerSkills.filter(s =>
        camp.requiredSkills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
      );
      const score = Math.min(99, Math.max(55, 65 + matches.length * 12));

      return {
        campaign: camp,
        matchScore: score,
        matchReason: matches.length > 0
          ? `Matching skills: ${matches.join(', ')}`
          : `Social interest match in ${camp.category}`
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, matches: matchedCampaigns, source: 'node_fallback' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Beneficiary Request Prioritization
// @route   POST /api/ai/prioritize-request
export const prioritizeRequest = async (req, res) => {
  try {
    const { title, description, category, affectedPeople } = req.body;

    const fastApiResult = await callFastAPI('/ai/prioritize-request', {
      title,
      description,
      category,
      affected_people: affectedPeople || 1
    });

    if (fastApiResult) {
      return res.json({ success: true, ...fastApiResult, source: 'fastapi' });
    }

    // Node Fallback NLP classifier
    const text = `${title} ${description}`.toLowerCase();
    let score = 50;

    const emergencyTerms = ['emergency', 'critical', 'starvation', 'disaster', 'flood', 'accident', 'icu', 'blood', 'eviction'];
    const highTerms = ['shelter', 'medicine', 'treatment', 'orphan', 'surgery', 'disabled'];

    emergencyTerms.forEach(t => { if (text.includes(t)) score += 15; });
    highTerms.forEach(t => { if (text.includes(t)) score += 10; });

    if (affectedPeople > 10) score += 15;

    score = Math.min(99, Math.max(20, score));

    let level = 'Medium';
    if (score >= 80) level = 'Urgent';
    else if (score >= 65) level = 'High';
    else if (score < 40) level = 'Low';

    res.json({
      success: true,
      urgencyScore: score,
      priorityLevel: level,
      reason: `AI analyzed description keywords and affected population (${affectedPeople || 1} people)`,
      source: 'node_fallback'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Campaign Recommendations for Donors/Volunteers
// @route   POST /api/ai/recommend-campaigns
export const recommendCampaigns = async (req, res) => {
  try {
    const { causePreferences, location } = req.body;
    const userCauses = causePreferences || req.user?.causePreferences || ['Education', 'Healthcare', 'Poverty Relief'];

    const campaigns = await Campaign.find({ status: 'active' }).populate('ngo');

    const recommended = campaigns.map(camp => {
      let score = 70;
      if (userCauses.includes(camp.category)) score += 20;
      if (camp.isUrgent) score += 10;

      return {
        ...camp.toObject(),
        recommendationScore: Math.min(99, score),
        recommendationReason: userCauses.includes(camp.category)
          ? `Matches your preferred cause: ${camp.category}`
          : 'High impact social campaign'
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.json({ success: true, recommendations: recommended });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Chatbot Query Handler
// @route   POST /api/ai/chatbot
export const handleChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const fastApiResult = await callFastAPI('/ai/chatbot', { message });
    if (fastApiResult) {
      return res.json({ success: true, ...fastApiResult, source: 'fastapi' });
    }

    // Conversational Fallback Engine
    const lower = message.toLowerCase();
    let reply = "";
    let action = null;
    let data = null;

    if (lower.includes('ngo') || lower.includes('organization') || lower.includes('find ngo')) {
      const ngos = await NGOProfile.find({ verificationStatus: 'verified' }).limit(3);
      reply = `Here are verified NGOs on Sahayak AI actively empowering communities:\n` +
        ngos.map(n => `• **${n.ngoName}** (${n.category}) - ${n.city}`).join('\n');
      action = 'SHOW_NGOS';
      data = ngos;
    } else if (lower.includes('campaign') || lower.includes('donate') || lower.includes('cause') || lower.includes('mode') || lower.includes('in-kind') || lower.includes('crypto') || lower.includes('sip')) {
      const campaigns = await Campaign.find({ status: 'active' }).limit(3).populate('ngo');
      reply = `Sahayak AI supports 6 donation channels:\n` +
        `1. 💳 **Online Monetary** (UPI QR, Card, NetBanking, 80G Tax Exemption)\n` +
        `2. 📦 **In-Kind Goods** (Food grains, medical supplies, books with doorstep pickup)\n` +
        `3. 🔄 **Monthly Social SIP** (Automated recurring child sponsorship)\n` +
        `4. ⚡ **Web3 Crypto** (Polygon MATIC, ETH with transparent on-chain ledger)\n` +
        `5. 🏢 **Corporate CSR** (1:1 and 2:1 corporate matching grants)\n` +
        `6. 🍱 **Direct Impact Kits** (Sponsor fresh meals, student backpacks)\n\n` +
        `Here are active campaigns you can support right now:\n` +
        campaigns.map(c => `• **${c.title}** by ${c.ngo?.ngoName} (Target: ₹${c.targetAmount.toLocaleString()})`).join('\n');
      action = 'SHOW_CAMPAIGNS';
      data = campaigns;
    } else if (lower.includes('volunteer') || lower.includes('apply') || lower.includes('help')) {
      reply = `You can join as a Sahayak Volunteer! We match your skills (like Teaching, Healthcare, Logistics) with campaigns in real-time. Head over to your Volunteer Dashboard to view AI matches.`;
      action = 'VOLUNTEER_INFO';
    } else if (lower.includes('beneficiary') || lower.includes('request') || lower.includes('food') || lower.includes('aid')) {
      reply = `Sahayak AI provides automated request prioritization for emergency aid, food relief, and healthcare. Beneficiaries can submit requests directly from their dashboard for instant NGO matching!`;
      action = 'BENEFICIARY_INFO';
    } else {
      reply = `Hello! I am **Sahayak AI Assistant**. How can I help you today? You can ask me to find NGOs, recommend social campaigns, match volunteer opportunities, or explain how beneficiary aid works.`;
    }

    res.json({
      success: true,
      reply,
      action,
      data,
      source: 'node_fallback'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Fraud Risk & Document Authenticity Scanner
// @route   POST /api/ai/detect-fraud
export const detectFraud = async (req, res) => {
  try {
    const { title, description, targetAmount, requesterRole, category } = req.body;

    const fastApiResult = await callFastAPI('/ai/detect-fraud', {
      title: title || 'NGO Verification Audit',
      description: description || '',
      target_amount: targetAmount || 0,
      requester_role: requesterRole || 'NGO',
      category: category || 'General'
    });

    if (fastApiResult) {
      return res.json({ success: true, ...fastApiResult, source: 'fastapi' });
    }

    // Node fallback
    const text = `${title} ${description}`.toLowerCase();
    let riskScore = 10;
    const riskFactors = [];

    if (text.includes('crypto') || text.includes('wire') || text.includes('guaranteed')) {
      riskScore += 40;
      riskFactors.push('Suspicious financial keyphrase detected');
    }
    if ((description || '').length < 20) {
      riskScore += 20;
      riskFactors.push('Description is unusually brief');
    }

    const trustScore = 100 - riskScore;
    const riskLevel = trustScore >= 85 ? 'Low Risk' : trustScore >= 60 ? 'Medium Risk' : 'High Risk';

    res.json({
      success: true,
      trustScore,
      riskScore,
      riskLevel,
      riskFactors: riskFactors.length ? riskFactors : ['No security anomalies detected.'],
      recommendation: trustScore >= 85 ? 'Fast-track verification recommended.' : 'Requires manual compliance audit.',
      source: 'node_fallback'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Executive Impact Summary Generator
// @route   POST /api/ai/generate-impact-summary
export const generateImpactSummary = async (req, res) => {
  try {
    const { ngoName, totalCampaigns, totalDonations, totalVolunteers, resolvedTickets } = req.body;

    const fastApiResult = await callFastAPI('/ai/generate-impact-summary', {
      ngo_name: ngoName || 'Sahayak AI Ecosystem',
      total_campaigns: totalCampaigns || 0,
      total_donations: totalDonations || 0,
      total_volunteers: totalVolunteers || 0,
      resolved_tickets: resolvedTickets || 0
    });

    if (fastApiResult) {
      return res.json({ success: true, ...fastApiResult, source: 'fastapi' });
    }

    // Node fallback
    const summary = `Executive Summary for ${ngoName || 'Sahayak Platform'}: Generated ₹${(totalDonations || 0).toLocaleString()} across ${totalCampaigns || 0} campaign projects, engaging ${totalVolunteers || 0} active volunteers and resolving ${resolvedTickets || 0} emergency aid requests.`;

    res.json({
      success: true,
      summary,
      highlights: [
        `₹${(totalDonations || 0).toLocaleString()} direct capital raised`,
        `${totalVolunteers || 0} verified skill matches`,
        `${resolvedTickets || 0} emergency aid cases fulfilled`
      ],
      generatedAt: 'Sahayak Node AI Fallback Analytics Engine',
      source: 'node_fallback'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

