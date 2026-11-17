const BASE_URL = 'http://localhost:5001/api';

const runTests = async () => {
  console.log('🧪 Starting Sahayak AI REST API Integration Test Suite...\n');
  let passed = 0;
  let total = 0;

  const testEndpoint = async (name, fn) => {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  };

  // 1. Health Check
  await testEndpoint('GET /health (Server Health & DB State)', async () => {
    const res = await fetch('http://localhost:5001/health');
    const data = await res.json();
    if (!data.dbConnected) throw new Error('DB not connected');
  });

  // 2. Auth Login (Admin)
  let adminToken = '';
  await testEndpoint('POST /api/auth/login (Admin Credentials)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sahayak.ai', password: 'password123' })
    });
    const data = await res.json();
    if (!data.token) throw new Error('Token not returned');
    adminToken = data.token;
  });

  // 3. Auth Login (Volunteer)
  let volToken = '';
  await testEndpoint('POST /api/auth/login (Volunteer Credentials)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'volunteer.arjun@sahayak.ai', password: 'password123' })
    });
    const data = await res.json();
    if (!data.token) throw new Error('Token not returned');
    volToken = data.token;
  });

  // 4. Get Verified NGOs
  await testEndpoint('GET /api/ngos (Public Verified NGO Directory)', async () => {
    const res = await fetch(`${BASE_URL}/ngos`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.ngos)) throw new Error('Failed to fetch NGOs');
  });

  // 5. Get Campaigns
  let campaignId = '';
  await testEndpoint('GET /api/campaigns (Active Social Campaigns)', async () => {
    const res = await fetch(`${BASE_URL}/campaigns`);
    const data = await res.json();
    if (!data.success || data.campaigns.length === 0) throw new Error('No campaigns found');
    campaignId = data.campaigns[0]._id;
  });

  // 6. AI Chatbot API
  await testEndpoint('POST /api/ai/chatbot (Python FastAPI Proxying)', async () => {
    const res = await fetch(`${BASE_URL}/ai/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Find education campaigns' })
    });
    const data = await res.json();
    if (!data.success || !data.reply) throw new Error('AI Chatbot response invalid');
  });

  // 7. AI Volunteer Matcher
  await testEndpoint('POST /api/ai/match-volunteer (Skill Vector Similarity)', async () => {
    const res = await fetch(`${BASE_URL}/ai/match-volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: ['Teaching', 'Mathematics'], campaignId })
    });
    const data = await res.json();
    if (!data.matchScore) throw new Error('Match score missing');
  });

  // 8. AI Request Urgency Scoring
  await testEndpoint('POST /api/ai/prioritize-request (NLP Emergency Classification)', async () => {
    const res = await fetch(`${BASE_URL}/ai/prioritize-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Emergency Medical & Ration Kit Needed',
        description: 'Critical flood evacuation victim needing hospital medical supplies',
        category: 'Healthcare',
        affectedPeople: 5
      })
    });
    const data = await res.json();
    if (data.priorityLevel !== 'Urgent' && data.priorityLevel !== 'High') {
      throw new Error(`Unexpected priority level: ${data.priorityLevel}`);
    }
  });

  // 9. Admin Stats API
  await testEndpoint('GET /api/admin/stats (Admin Analytics Desk)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.stats) throw new Error('Failed to retrieve admin stats');
  });

  // 10. Donor Login & Donation Modes Suite
  let donorToken = '';
  await testEndpoint('POST /api/auth/login (Donor Credentials)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'donor.rohit@sahayak.ai', password: 'password123' })
    });
    const data = await res.json();
    if (!data.token) throw new Error('Donor token not returned');
    donorToken = data.token;
  });

  // 11. In-Kind Goods Donation Mode
  await testEndpoint('POST /api/donations/process (In-Kind Relief Goods Mode)', async () => {
    const res = await fetch(`${BASE_URL}/donations/process`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${donorToken}`
      },
      body: JSON.stringify({
        campaignId,
        donationType: 'in_kind',
        amount: 3500,
        paymentMethod: 'InKind_Pickup',
        inKindDetails: {
          itemCategory: 'Medical & Healthcare',
          itemName: '5x First Aid & Diagnostic Triage Kits',
          quantity: 5,
          unit: 'kits',
          pickupAddress: 'Vasant Kunj, New Delhi',
          pickupDate: '2026-10-25',
          estimatedValue: 3500
        }
      })
    });
    const data = await res.json();
    if (!data.success || data.donation.donationType !== 'in_kind') throw new Error('In-Kind donation failed');
  });

  // 12. Monthly Social SIP Recurring Pledge Mode
  await testEndpoint('POST /api/donations/process (Monthly Recurring Social SIP Mode)', async () => {
    const res = await fetch(`${BASE_URL}/donations/process`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${donorToken}`
      },
      body: JSON.stringify({
        campaignId,
        donationType: 'recurring',
        amount: 1500,
        paymentMethod: 'UPI_Autopay',
        recurringDetails: {
          frequency: 'monthly',
          durationMonths: 12
        }
      })
    });
    const data = await res.json();
    if (!data.success || data.donation.donationType !== 'recurring') throw new Error('Recurring donation failed');
  });

  // 13. Web3 Crypto Blockchain Mode
  await testEndpoint('POST /api/donations/process (Web3 & Crypto Blockchain Mode)', async () => {
    const res = await fetch(`${BASE_URL}/donations/process`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${donorToken}`
      },
      body: JSON.stringify({
        campaignId,
        donationType: 'crypto',
        amount: 5200,
        paymentMethod: 'Crypto_MATIC',
        cryptoDetails: {
          network: 'Polygon Mainnet (PoS)',
          cryptoCurrency: 'MATIC',
          cryptoAmount: 100,
          walletAddress: '0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a'
        }
      })
    });
    const data = await res.json();
    if (!data.success || !data.donation.blockchainTxHash) throw new Error('Web3 Crypto donation failed');
  });

  // 14. Corporate CSR 2x Matching Grant Mode
  await testEndpoint('POST /api/donations/process (Corporate CSR 2x Matching Grant Mode)', async () => {
    const res = await fetch(`${BASE_URL}/donations/process`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${donorToken}`
      },
      body: JSON.stringify({
        campaignId,
        donationType: 'corporate_csr',
        amount: 50000,
        paymentMethod: 'Corporate_CSR_NEFT',
        corporateDetails: {
          companyName: 'TechVision Corporate CSR Trust',
          cinGstin: '07AABCT2345M1Z2',
          csrRegistrationNo: 'CSR00091823',
          matchingGrantMultiplier: 2,
          contactPerson: 'Aditi Verma'
        }
      })
    });
    const data = await res.json();
    if (!data.success || data.donation.amount !== 100000) throw new Error('Corporate matching grant failed');
  });

  // 15. Public Transparency Blockchain Ledger
  await testEndpoint('GET /api/donations/public-ledger (Public Blockchain Transparency Ledger)', async () => {
    const res = await fetch(`${BASE_URL}/donations/public-ledger`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.ledger)) throw new Error('Public ledger fetch failed');
  });

  console.log(`\n📊 Test Suite Complete: ${passed}/${total} Tests Passed Successfully! ✨`);
};

runTests();
