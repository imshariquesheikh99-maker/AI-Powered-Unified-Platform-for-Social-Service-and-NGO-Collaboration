const API_BASE_URL = '/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('sahayak_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth API
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // NGOs API
  getNgos: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/ngos?${query}`);
    return res.json();
  },

  getNgoById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/ngos/${id}`);
    return res.json();
  },

  updateNgoProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/ngos/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyNgo: async (id, status, notes) => {
    const res = await fetch(`${API_BASE_URL}/ngos/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  // Campaigns API
  getCampaigns: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/campaigns?${query}`);
    return res.json();
  },

  getCampaignById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
    return res.json();
  },

  createCampaign: async (data) => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Volunteers API
  applyVolunteer: async (campaignId, skillsSubmitted, availabilityNotes) => {
    const res = await fetch(`${API_BASE_URL}/volunteers/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ campaignId, skillsSubmitted, availabilityNotes })
    });
    return res.json();
  },

  getMyVolunteerApps: async () => {
    const res = await fetch(`${API_BASE_URL}/volunteers/my-applications`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getNgoVolunteerApps: async () => {
    const res = await fetch(`${API_BASE_URL}/volunteers/ngo-applications`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateAppStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/volunteers/applications/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Donations API
  processDonation: async (donationData) => {
    const res = await fetch(`${API_BASE_URL}/donations/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donationData)
    });
    return res.json();
  },

  getMyDonations: async (type = '') => {
    const query = type ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE_URL}/donations/my-donations${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getNgoDonations: async () => {
    const res = await fetch(`${API_BASE_URL}/donations/ngo-donations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateInKindStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/donations/${id}/in-kind-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  updateRecurringStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/donations/${id}/recurring-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  getPublicLedger: async () => {
    const res = await fetch(`${API_BASE_URL}/donations/public-ledger`);
    return res.json();
  },

  // Assistance Requests API
  createAssistanceRequest: async (data) => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMyRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests/my-requests`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAllRequests: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/requests?${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateRequestStatus: async (id, status, assignToMe = false) => {
    const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, assignToMe })
    });
    return res.json();
  },

  // Admin API
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAllUsers: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getActivityLogs: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/activity-logs`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // AI API
  aiMatchVolunteer: async (skills, campaignId) => {
    const res = await fetch(`${API_BASE_URL}/ai/match-volunteer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ skills, campaignId })
    });
    return res.json();
  },

  aiPrioritizeRequest: async (data) => {
    const res = await fetch(`${API_BASE_URL}/ai/prioritize-request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  aiRecommendCampaigns: async (causePreferences) => {
    const res = await fetch(`${API_BASE_URL}/ai/recommend-campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ causePreferences })
    });
    return res.json();
  },

  aiChatbot: async (message) => {
    const res = await fetch(`${API_BASE_URL}/ai/chatbot`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  aiDetectFraud: async (data) => {
    const res = await fetch(`${API_BASE_URL}/ai/detect-fraud`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  aiGenerateImpactSummary: async (data) => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-impact-summary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

