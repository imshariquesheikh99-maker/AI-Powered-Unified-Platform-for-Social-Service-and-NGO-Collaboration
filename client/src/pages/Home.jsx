import React, { useEffect, useState, useMemo } from 'react';
import { 
  HeartHandshake, ArrowRight, Building, Wallet, Activity, 
  ShieldCheck, Award, Zap, Calculator, TrendingUp, 
  Check, Heart, MapPin, HandHeart
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CampaignImage } from '../components/CampaignImage';

export const Home = ({ onOpenAuth, onDonate, onExploreCampaigns, onExploreNGOs, setActiveTab }) => {
  const { loginAsDemoRole } = useAuth();
  const { t } = useLanguage();
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state for Stakeholder/Persona Explorer
  const [selectedPersonaTab, setSelectedPersonaTab] = useState('all');

  // Filter state for Featured Campaigns
  const [campaignCategoryFilter, setCampaignCategoryFilter] = useState('all');

  // Interactive 80G Tax Calculator state
  const [donationAmount, setDonationAmount] = useState(25000);
  const [taxSlab, setTaxSlab] = useState(null); // null = Auto-detect by default!

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campRes = await api.getCampaigns({ status: 'active' });
        if (campRes.success) {
          setFeaturedCampaigns(campRes.campaigns.slice(0, 6));
        }
      } catch (err) {
        console.error('Home page data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Section 80G Tax Savings Calculations with Automatic Slab Detection
  // Indian Tax Slab logic based on donation scale:
  // - Up to ₹10,000 => 10% Slab (Entry bracket)
  // - ₹10,001 to ₹40,000 => 20% Slab (Middle bracket)
  // - Above ₹40,000 => 30% Slab (High earner bracket)
  const autoDetectedSlab = useMemo(() => {
    const amt = Number(donationAmount) || 0;
    if (amt <= 10000) return 0.10;
    if (amt <= 40000) return 0.20;
    return 0.30;
  }, [donationAmount]);

  const activeSlab = taxSlab || autoDetectedSlab;

  const taxCalculation = useMemo(() => {
    const amount = Number(donationAmount) || 0;
    const deduction = amount * 0.50;
    const savings = deduction * activeSlab * 1.04;
    const effectiveCost = amount - savings;
    const effectiveSavingsPercent = amount > 0 ? ((savings / amount) * 100).toFixed(1) : '0';

    return {
      amount,
      deduction,
      savings: Math.round(savings),
      effectiveCost: Math.round(effectiveCost),
      effectiveSavingsPercent,
      slabRate: activeSlab
    };
  }, [donationAmount, activeSlab]);

  // Persona definition objects
  const PERSONAS = [
    {
      id: 'admin',
      category: 'governance',
      role: 'Super Admin',
      title: 'Admin Governance',
      email: 'admin@sahayak.ai',
      badge: 'Admin Desk',
      badgeClass: 'badge-ai',
      iconEmoji: '👑',
      tagline: 'Audit & Compliance',
      description: 'Audit NGO DARPAN credentials, inspect donation trails, enforce role-based access control, and monitor AI telemetry.',
      keyCapabilities: [
        'DARPAN & MCA Registry Verification',
        'Transparent Audit Trails',
        'Platform Telemetry'
      ],
      ctaText: 'Launch Admin Demo'
    },
    {
      id: 'ngo',
      category: 'ngo',
      role: 'Verified NGO',
      title: 'NGO Hub',
      email: 'ngo.asha@sahayak.ai',
      badge: 'Verified NGO',
      badgeClass: 'badge-verified',
      iconEmoji: '🏢',
      tagline: 'Fundraising & Logistics',
      description: 'Launch campaigns, match skilled volunteers using AI similarity, schedule doorstep donation pickups, and issue 80G receipts.',
      keyCapabilities: [
        'Campaign Deployment & Tracking',
        'AI Skill Matching for Volunteers',
        'Automated 80G Tax Receipts'
      ],
      ctaText: 'Launch NGO Demo'
    },
    {
      id: 'volunteer',
      category: 'volunteer',
      role: 'Volunteer',
      title: 'Volunteer Portal',
      email: 'volunteer.arjun@sahayak.ai',
      badge: 'AI Matcher',
      badgeClass: 'badge-ai',
      iconEmoji: '🤝',
      tagline: 'Community Service',
      description: 'Discover volunteer drives matched to your skill profile, apply with 1-click, log hours, and receive participation recognition.',
      keyCapabilities: [
        'Skill & Location Matching',
        '1-Click Drive Applications',
        'Verified Hours Tracking'
      ],
      ctaText: 'Launch Volunteer Demo'
    },
    {
      id: 'donor',
      category: 'donor',
      role: 'Donor (80G)',
      title: 'Donor Portal',
      email: 'donor.rohit@sahayak.ai',
      badge: '80G Tax Relief',
      badgeClass: 'badge-verified',
      iconEmoji: '💳',
      tagline: 'Transparent Giving',
      description: 'Contribute via UPI/Card, physical goods (food, clothes, blankets), monthly recurring pledges, crypto, or corporate CSR grants.',
      keyCapabilities: [
        '50% Deduction under Sec 80G',
        'Free Doorstep In-Kind Pickup',
        'Instant Computerized Receipts'
      ],
      ctaText: 'Launch Donor Demo'
    },
    {
      id: 'beneficiary',
      category: 'beneficiary',
      role: 'Beneficiary',
      title: 'Beneficiary Support',
      email: 'beneficiary.ramesh@sahayak.ai',
      badge: 'Direct Relief',
      badgeClass: 'badge-urgent',
      iconEmoji: '🤲',
      tagline: 'Emergency Aid',
      description: 'Submit urgent assistance requests evaluated by NLP urgency classification, and connect with nearby certified non-profits.',
      keyCapabilities: [
        'NLP Emergency Urgency Scoring',
        'Relief Kit Allocation Status',
        'Direct Connection to Nearby NGOs'
      ],
      ctaText: 'Launch Beneficiary Demo'
    }
  ];

  // Filtered personas
  const filteredPersonas = useMemo(() => {
    if (selectedPersonaTab === 'all') return PERSONAS;
    return PERSONAS.filter(p => p.category === selectedPersonaTab);
  }, [selectedPersonaTab]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    if (campaignCategoryFilter === 'all') return featuredCampaigns;
    return featuredCampaigns.filter(c => c.category?.toLowerCase() === campaignCategoryFilter.toLowerCase());
  }, [featuredCampaigns, campaignCategoryFilter]);

  return (
    <div className="space-y-16 pb-20 pt-6">
      
      {/* HERO SECTION - Clean & Focused with Attractive Backdrop */}
      <section className="container max-w-5xl mx-auto pt-4">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/60 p-8 sm:p-14 text-center space-y-6">
          
          {/* Subtle Community Background Watermark Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-[0.07] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600')` }}
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('home.heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              {t('home.heroTitle')} <span className="text-indigo-600">{t('home.heroHighlight')}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button 
                onClick={onExploreCampaigns}
                className="btn btn-primary px-6 py-2.5 text-sm font-semibold shadow-sm"
              >
                <span>{t('home.exploreCauses')}</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={onExploreNGOs}
                className="btn btn-secondary px-6 py-2.5 text-sm font-semibold bg-white shadow-sm"
              >
                <Building size={16} className="text-emerald-600" />
                <span>{t('nav.ngos')}</span>
              </button>
            </div>

            {/* Quick Demo Role Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-sm">
                <div className="text-xs font-semibold text-slate-500 mb-2 text-left px-1 flex items-center justify-between">
                  <span>⚡ Quick Demo Stakeholders:</span>
                  <span className="text-[11px] text-indigo-600 font-medium">1-Click Login</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={async () => {
                        await loginAsDemoRole(persona.email);
                        setActiveTab('dashboard');
                      }}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-all text-xs font-medium text-slate-700"
                    >
                      <span>{persona.iconEmoji}</span>
                      <span>{persona.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 pt-2 font-medium">
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <ShieldCheck size={15} className="text-emerald-600" /> NITI Aayog DARPAN Verified
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <Award size={15} className="text-indigo-600" /> Section 80G Tax Deduction
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <Activity size={15} className="text-purple-600" /> AI Skill & Need Matching
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* STATS BAR - Clean Grid */}
      <section className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="p-3">
            <div className="text-2xl font-bold text-[var(--text-main)] font-heading">15+</div>
            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{t('home.statNgos')}</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-[var(--text-main)] font-heading">₹13.5L+</div>
            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{t('home.statCapital')}</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-[var(--text-main)] font-heading">350+</div>
            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{t('home.statVolunteers')}</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-[var(--text-main)] font-heading">24+</div>
            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{t('home.statTickets')}</div>
          </div>
        </div>
      </section>

      {/* 5-ROLE WORKSPACES */}
      <section className="container space-y-6">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-heading">
            Dedicated Workspaces for Every Role
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Explore features tailored to non-profits, volunteers, donors, beneficiaries, and administrators.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pb-2">
          {[
            { id: 'all', label: 'All Workspaces' },
            { id: 'ngo', label: 'NGO Hub' },
            { id: 'volunteer', label: 'Volunteers' },
            { id: 'donor', label: 'Donors' },
            { id: 'beneficiary', label: 'Beneficiaries' },
            { id: 'governance', label: 'Admin' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPersonaTab(tab.id)}
              className={`filter-pill text-xs ${selectedPersonaTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clean Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPersonas.map((persona) => (
            <div
              key={persona.id}
              onClick={async () => {
                await loginAsDemoRole(persona.email);
                setActiveTab('dashboard');
              }}
              className="glass-card glass-card-hover p-5 space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{persona.iconEmoji}</span>
                  <span className={`badge ${persona.badgeClass}`}>
                    {persona.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] font-heading">
                    {persona.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {persona.description}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-[var(--border-color)]">
                  {persona.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Check size={13} className="text-emerald-600 dark:text-emerald-600 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-600">
                <span>{persona.ctaText}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 80G TAX CALCULATOR - Clean 2-column layout with background imagery */}
      <section className="container">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-emerald-50/40 border border-slate-200 shadow-sm p-6 sm:p-10">
          
          {/* Subtle Financial Transparency Watermark */}
          <div 
            className="absolute -right-10 -bottom-10 w-96 h-96 bg-cover bg-no-repeat opacity-[0.05] pointer-events-none rounded-full"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800')` }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-50 dark:text-emerald-600 text-xs font-medium border border-emerald-200 dark:border-emerald-800 mb-2">
                  <Calculator size={13} />
                  <span>Section 80G Tax Exemption</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-heading">
                  80G Tax Savings Calculator
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  Compute eligible tax deductions and net cost for charitable contributions.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)] flex justify-between">
                  <span>Annual Contribution:</span>
                  <span className="font-bold text-[var(--text-main)]">₹{taxCalculation.amount.toLocaleString()}</span>
                </label>

                <div className="grid grid-cols-5 gap-1.5">
                  {[5000, 10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDonationAmount(preset)}
                      className={`py-1.5 px-1 text-xs font-semibold rounded border transition-colors ${
                        donationAmount === preset
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-btn-secondary-hover)]'
                      }`}
                    >
                      ₹{(preset / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="100"
                  step="500"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
                  placeholder="Enter custom amount..."
                  className="input-field mt-1 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">
                    Tax Bracket (Auto-selected based on donation scale):
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Auto: {(taxCalculation.slabRate * 100).toFixed(0)}% Slab
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '10% Slab', rate: 0.10, desc: 'Donations ≤ ₹10k' },
                    { label: '20% Slab', rate: 0.20, desc: 'Donations ₹10k–40k' },
                    { label: '30% Slab', rate: 0.30, desc: 'Donations > ₹40k' }
                  ].map((slab) => {
                    const isSelected = activeSlab === slab.rate;
                    return (
                      <button
                        key={slab.rate}
                        type="button"
                        onClick={() => setTaxSlab(slab.rate)}
                        className={`p-2 rounded border text-center transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-sm'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-btn-secondary-hover)]'
                        }`}
                      >
                        <div className="text-xs font-semibold">{slab.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-[var(--text-dim)]'}`}>{slab.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 p-5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-main)] font-heading">Tax Summary</h3>
                <TrendingUp size={16} className="text-emerald-600" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Donation:</span>
                  <span className="font-semibold text-[var(--text-main)]">₹{taxCalculation.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Eligible Deduction (50%):</span>
                  <span className="font-semibold text-[var(--text-main)]">₹{taxCalculation.deduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded bg-emerald-50 dark:bg-emerald-50 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-600">Direct Tax Saved:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-600">₹{taxCalculation.savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--border-color)] text-sm font-bold text-[var(--text-main)]">
                  <span>Net Cost:</span>
                  <span>₹{taxCalculation.effectiveCost.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onDonate(null)}
                className="w-full btn btn-emerald py-2 text-xs font-semibold"
              >
                Donate & Claim 80G Receipt
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED CAMPAIGNS */}
      <section className="container space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-3 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] font-heading">
              Active Campaigns
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Support community causes or join as a volunteer</p>
          </div>
          
          <button 
            onClick={onExploreCampaigns} 
            className="btn btn-secondary text-xs px-3.5 py-1.5 font-medium flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'education', 'healthcare', 'environment', 'poverty relief'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCampaignCategoryFilter(cat)}
              className={`filter-pill text-xs capitalize ${campaignCategoryFilter === cat ? 'active' : ''}`}
            >
              {cat === 'all' ? 'All Drives' : cat}
            </button>
          ))}
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-12 text-[var(--text-muted)] text-sm">
            Loading Campaigns...
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] rounded-lg border border-[var(--border-color)]">
            No active campaigns found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredCampaigns.slice(0, 3).map((camp) => {
              const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
              return (
                <div 
                  key={camp._id} 
                  className="glass-card p-0 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-100">
                    <CampaignImage
                      src={camp.imageUrl}
                      alt={camp.title}
                      category={camp.category}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 badge badge-verified bg-white dark:bg-slate-50 shadow-sm text-xs">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-600 font-semibold mb-0.5">
                        {camp.ngo?.ngoName || 'Verified NGO Partner'}
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-1 font-heading">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                        {camp.description}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[var(--text-main)]">Raised: ₹{camp.raisedAmount.toLocaleString()}</span>
                        <span className="text-indigo-600 dark:text-indigo-600">{percent}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => onDonate(camp)}
                        className="w-full btn btn-emerald py-2 text-xs font-semibold"
                      >
                        Donate (80G Eligible)
                      </button>

                      <button
                        onClick={onExploreCampaigns}
                        className="w-full btn btn-secondary py-1.5 text-xs font-medium"
                      >
                        Volunteer Details
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BOTTOM CTA - Clean Banner with Impact Photo Background */}
      <section className="container">
        <div className="relative rounded-2xl overflow-hidden border border-indigo-200 shadow-sm p-8 sm:p-12 text-center space-y-4 bg-gradient-to-r from-indigo-900/90 via-indigo-950/90 to-purple-950/90 text-white">
          
          {/* High Impact Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600')` }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Join the Sahayak AI Social Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto leading-relaxed">
              Connect as an NGO partner, register as a volunteer, or support vetted initiatives with full 80G tax transparency.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onExploreCampaigns}
                className="btn btn-primary px-5 py-2.5 text-xs font-semibold bg-white text-indigo-900 border-white hover:bg-indigo-50"
              >
                Explore Campaigns
              </button>
              <button
                onClick={() => onDonate(null)}
                className="btn btn-emerald px-5 py-2.5 text-xs font-semibold shadow-sm"
              >
                Make a Donation
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
