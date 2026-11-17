import React, { useEffect, useState } from 'react';
import { 
  CreditCard, Sparkles, Download, ShieldCheck, Heart, ArrowRight, Wallet, Receipt, 
  Award, Package, Repeat, Cpu, Briefcase, Gift, Truck, CheckCircle2, Clock, 
  ExternalLink, PauseCircle, PlayCircle, Eye, Filter, FileText, TrendingUp, PieChart
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CampaignImage } from '../components/CampaignImage';

export const DonorDashboard = ({ onDonate }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, monetary, in_kind, recurring, crypto, corporate_csr, impact_kit
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [publicLedger, setPublicLedger] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const recRes = await api.aiRecommendCampaigns(user?.causePreferences || ['Education', 'Healthcare', 'Environment']);
      if (recRes.success) {
        setRecommendations(recRes.recommendations || []);
      }

      const donRes = await api.getMyDonations();
      if (donRes.success) {
        setDonations(donRes.donations || []);
      }
    } catch (err) {
      console.error('Donor Dash error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLedger = async () => {
    setLoadingLedger(true);
    try {
      const res = await api.getPublicLedger();
      if (res.success) {
        setPublicLedger(res.ledger || []);
      }
    } catch (err) {
      console.error('Ledger error:', err);
    } finally {
      setLoadingLedger(false);
    }
  };

  const handleOpenLedger = () => {
    setShowLedgerModal(true);
    loadLedger();
  };

  const handleToggleRecurring = async (donationId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
      const res = await api.updateRecurringStatus(donationId, nextStatus);
      if (res.success) {
        alert(`Recurring pledge ${nextStatus === 'active' ? 'resumed' : 'paused'}!`);
        loadData();
      }
    } catch (err) {
      alert('Failed to update pledge status');
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const estimatedTaxSavings = Math.round(totalDonated * 0.5);
  const inKindCount = donations.filter(d => d.donationType === 'in_kind').length;
  const recurringActiveCount = donations.filter(d => d.donationType === 'recurring' && d.recurringDetails?.status === 'active').length;

  const filteredDonations = activeFilter === 'all' 
    ? donations 
    : donations.filter(d => d.donationType === activeFilter);

  const getModeBadge = (type) => {
    switch (type) {
      case 'in_kind':
        return <span className="badge badge-warning text-[10px] px-2.5 py-0.5"><Package size={11} /> In-Kind Supplies</span>;
      case 'recurring':
        return <span className="badge badge-ai text-[10px] px-2.5 py-0.5"><Repeat size={11} /> Monthly SIP</span>;
      case 'crypto':
        return <span className="badge badge-ai bg-cyan-950/80 text-cyan-300 border-cyan-500/40 text-[10px] px-2.5 py-0.5"><Cpu size={11} /> Web3 Blockchain</span>;
      case 'corporate_csr':
        return <span className="badge badge-verified text-[10px] px-2.5 py-0.5"><Briefcase size={11} /> Corporate CSR</span>;
      case 'impact_kit':
        return <span className="badge badge-ai bg-pink-950/80 text-pink-300 border-pink-500/40 text-[10px] px-2.5 py-0.5"><Gift size={11} /> Impact Kit</span>;
      default:
        return <span className="badge badge-verified text-[10px] px-2.5 py-0.5"><CreditCard size={11} /> Monetary Online</span>;
    }
  };

  if (loading) return <div className="container py-24 text-center text-slate-500 font-semibold">Fetching Philanthropic Contributions & AI Causes...</div>;

  return (
    <div className="container space-y-12 py-10">
      
      {/* Donor Workspace Header */}
      <div className="glass-card p-8 sm:p-10 border-blue-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-500/40 shadow-2xl shrink-0">
            <CreditCard size={40} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="badge badge-verified text-xs px-3.5 py-1"><CreditCard size={14} /> Contributor Portal</span>
              <span className="badge badge-ai text-xs bg-emerald-50 px-3 py-1"><ShieldCheck size={13} /> 6 Modes Active</span>
              <span className="badge badge-ai text-xs bg-cyan-950/80 text-cyan-300 border-cyan-500/40 px-3 py-1"><Cpu size={13} /> Polygon Verified</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">Philanthropic Dashboard - {user?.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Monetary 80G, In-Kind Goods Delivery, Monthly Social SIP, Polygon Web3 Crypto & Corporate CSR
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onDonate && onDonate()}
            className="btn btn-emerald px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Heart size={16} /> Donate Goods or Money
          </button>
          <button
            onClick={handleOpenLedger}
            className="btn btn-secondary px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
          >
            <Cpu size={16} /> Blockchain Transparency Ledger
          </button>
        </div>
      </div>

      {/* KPI Cards Across Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* KPI 1 */}
        <div className="glass-card p-7 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 shadow-lg">
            <Wallet size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Impact Value</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">₹{totalDonated.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Monetary + In-Kind + Crypto</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-7 rounded-3xl border-amber-500/20 hover:border-amber-500/50 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 shadow-lg">
            <Package size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">In-Kind Supplies</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">{inKindCount} Shipments</div>
            <div className="text-[11px] text-amber-300 font-semibold mt-1">Doorstep Pickup Tracked</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-7 rounded-3xl border-purple-500/20 hover:border-purple-300 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shrink-0 shadow-lg">
            <Repeat size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Monthly Social SIPs</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">{recurringActiveCount} Active</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">Automated Impact Mandates</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-7 rounded-3xl border-indigo-500/20 hover:border-indigo-300 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0 shadow-lg">
            <Receipt size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">80G Tax Deductible</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">₹{estimatedTaxSavings.toLocaleString()}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">50% Exemption Value</div>
          </div>
        </div>

      </div>

      {/* Active Monthly Giving / Social SIP Cards */}
      {donations.filter(d => d.donationType === 'recurring').length > 0 && (
        <div className="glass-card p-8 rounded-3xl border-purple-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-500/40">
                <Repeat size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Your Active Monthly Social SIPs</h3>
                <p className="text-xs text-slate-500">Regular automated sponsorships for education and nutrition</p>
              </div>
            </div>
            <span className="badge badge-ai text-[10px]">Auto-Debited Monthly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donations.filter(d => d.donationType === 'recurring').map(rec => {
              const isActive = rec.recurringDetails?.status === 'active';
              return (
                <div key={rec._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-white">{rec.campaign?.title}</div>
                      <div className="text-xs text-purple-600 mt-0.5">{rec.ngo?.ngoName}</div>
                    </div>
                    <span className={`badge text-[10px] ${isActive ? 'badge-verified' : 'badge-urgent'}`}>
                      {isActive ? 'Active Pledge' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <div>
                      <span>Pledge: </span>
                      <span className="font-extrabold text-white text-sm">₹{rec.amount.toLocaleString()}</span>
                      <span className="text-[11px]"> / {rec.recurringDetails?.frequency || 'month'}</span>
                    </div>
                    <div className="font-mono text-[11px]">Mandate: {rec.recurringDetails?.mandateId || 'MANDATE-SIP'}</div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-slate-500">
                      Duration: {rec.recurringDetails?.durationMonths || 12} Months
                    </span>
                    <button
                      onClick={() => handleToggleRecurring(rec._id, rec.recurringDetails?.status)}
                      className={`btn btn-sm px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
                        isActive ? 'btn-secondary text-amber-300' : 'btn-primary'
                      }`}
                    >
                      {isActive ? <><PauseCircle size={14} /> Pause Pledge</> : <><PlayCircle size={14} /> Resume Pledge</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Impact Portfolio Distribution & 80G Tax Vault Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cause Distribution & Field Deployments */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <PieChart size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Impact Allocation & Causes Breakdown</h3>
                <p className="text-xs text-slate-500">Real-time allocation across verified partner foundations</p>
              </div>
            </div>
            <span className="badge badge-verified text-[10px] self-start sm:self-auto">184 Direct Beneficiaries</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Education & STEM Mentorship
                </span>
                <span className="text-indigo-600 font-mono">35% • ₹7,000</span>
              </div>
              <div className="progress-bar-bg h-2">
                <div className="progress-bar-fill bg-indigo-500" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthcare & Critical Surgeries
                </span>
                <span className="text-emerald-600 font-mono">30% • ₹6,000</span>
              </div>
              <div className="progress-bar-bg h-2">
                <div className="progress-bar-fill bg-emerald-500" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Food Security & Zero Hunger
                </span>
                <span className="text-amber-500 font-mono">20% • ₹4,000</span>
              </div>
              <div className="progress-bar-bg h-2">
                <div className="progress-bar-fill bg-amber-500" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Clean Yamuna & Eco Stewardship
                </span>
                <span className="text-cyan-500 font-mono">15% • ₹3,000</span>
              </div>
              <div className="progress-bar-bg h-2">
                <div className="progress-bar-fill bg-cyan-500" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Transparency</div>
              <div className="text-lg font-extrabold text-emerald-600 mt-0.5">100%</div>
              <div className="text-[9px] text-slate-500">On-Chain Proof</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Partner NGOs</div>
              <div className="text-lg font-extrabold text-indigo-600 mt-0.5">15 NGOs</div>
              <div className="text-[9px] text-slate-500">Verified Network</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Impact ROI</div>
              <div className="text-lg font-extrabold text-purple-600 mt-0.5">4.8x</div>
              <div className="text-[9px] text-slate-500">Social Yield</div>
            </div>
          </div>
        </div>

        {/* 80G Tax Exemption Year-to-Date Vault */}
        <div className="glass-card p-8 rounded-3xl border-slate-200 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">80G Tax Exemption Vault</h3>
                  <p className="text-xs text-slate-500">CBDT Form 10BE Ready</p>
                </div>
              </div>
              <span className="badge badge-ai bg-emerald-50 text-emerald-600 text-[10px]">FY 2024-25</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="text-xs text-slate-600 font-medium">Total Deductible Contributions</div>
              <div className="text-3xl font-extrabold text-white font-heading">₹{totalDonated.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> ₹{estimatedTaxSavings.toLocaleString()} Direct Tax Exemption (50% bracket)
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span>IT Act Section:</span>
                <span className="font-bold text-white">Section 80G(5)(vi)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span>CBDT Compliance:</span>
                <span className="text-emerald-600 font-bold">100% Certified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span>Receipt Format:</span>
                <span className="font-bold text-white">Digital Signed PDF + Hash</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Consolidated Form 10BE Certificate generated for ${user?.name || 'Contributor'}!\nEligible 80G deduction: ₹${totalDonated.toLocaleString()}\nUnique 10BE Ref: CBDT-10BE-2024-884920`)}
            className="w-full btn btn-emerald py-3 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Download size={15} /> Download Consolidated 10BE
          </button>
        </div>

      </div>

      {/* Quick Impact Kits Sponsorship Cards */}
      <div className="glass-card p-8 rounded-3xl border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Gift size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Quick Impact Kits — Sponsor in 1-Click</h3>
              <p className="text-xs text-slate-500">Pre-packaged, tangible relief kits directly delivered to verified on-ground families</p>
            </div>
          </div>
          <span className="badge badge-verified text-[10px] self-start sm:self-auto">Zero Intermediary Loss</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="badge badge-ai bg-amber-50 text-amber-700 text-[10px]">Zero Hunger</span>
                <span className="text-base font-extrabold text-white">₹3,000</span>
              </div>
              <h4 className="text-sm font-bold text-white">100 Hot Midday Meals Kit</h4>
              <p className="text-xs text-slate-600">Freshly prepared, hygienic dal-chawal & vegetables distributed to homeless children.</p>
            </div>
            <button
              onClick={() => onDonate && onDonate()}
              className="w-full btn btn-secondary text-xs font-bold py-2 rounded-xl text-amber-700 border-amber-300 hover:bg-amber-100/60"
            >
              Sponsor 100 Meals Now
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="badge badge-ai bg-indigo-50 text-indigo-700 text-[10px]">Education</span>
                <span className="text-base font-extrabold text-white">₹1,500</span>
              </div>
              <h4 className="text-sm font-bold text-white">Slum Child STEM School Bag</h4>
              <p className="text-xs text-slate-600">Contains school bag, notebooks, geometry kit, dictionary and 6 months stationery.</p>
            </div>
            <button
              onClick={() => onDonate && onDonate()}
              className="w-full btn btn-secondary text-xs font-bold py-2 rounded-xl text-indigo-700 border-indigo-300 hover:bg-indigo-100/60"
            >
              Sponsor School Kit
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="badge badge-ai bg-emerald-50 text-emerald-700 text-[10px]">Elder Care</span>
                <span className="text-base font-extrabold text-white">₹2,000</span>
              </div>
              <h4 className="text-sm font-bold text-white">Elderly Winter Blanket & Care Pack</h4>
              <p className="text-xs text-slate-600">Thermal blanket, essential multivitamins, woollen shawl and first-aid supplies for seniors.</p>
            </div>
            <button
              onClick={() => onDonate && onDonate()}
              className="w-full btn btn-secondary text-xs font-bold py-2 rounded-xl text-emerald-700 border-emerald-300 hover:bg-emerald-100/60"
            >
              Sponsor Winter Pack
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles size={24} className="text-purple-600" /> AI Recommended Causes for You
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Personalized based on preferred causes: {user?.causePreferences?.join(', ') || 'Education, Environment, Healthcare'}
            </p>
          </div>
          <span className="badge badge-ai text-xs self-start sm:self-auto px-3.5 py-1">FastAPI Recommendation Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.slice(0, 3).map((camp) => (
            <div key={camp._id} className="glass-card p-0 overflow-hidden border-indigo-500/20 rounded-3xl flex flex-col justify-between group shadow-xl">
              <div className="relative h-44 overflow-hidden bg-slate-50">
                <CampaignImage
                  src={camp.imageUrl}
                  alt={camp.title}
                  category={camp.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 badge badge-verified bg-slate-50/90 backdrop-blur-md text-[10px] px-3 py-1 border border-emerald-200">
                  {camp.category}
                </span>
                <span className="absolute top-4 right-4 badge badge-ai bg-indigo-50 backdrop-blur-md text-[10px] px-3 py-1 border border-indigo-200">
                  <Sparkles size={11} className="inline mr-1 text-purple-600" /> {camp.recommendationScore}% AI Match
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-600 transition-colors">{camp.title}</h4>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{camp.description}</p>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-200 leading-relaxed">
                    ✓ <strong>AI Reason:</strong> {camp.recommendationReason}
                  </div>
                </div>

                <button
                  onClick={() => onDonate(camp)}
                  className="w-full btn btn-emerald py-3 text-xs font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  Contribute Across 6 Modes <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation History Table Container with Multi-Mode Filters */}
      <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <CreditCard size={24} className="text-emerald-600" /> Multi-Mode Contribution Ledger ({donations.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1">Instant 80G Receipts, In-Kind Delivery Trackers & Polygon Block Proofs</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'monetary', label: 'Monetary' },
              { id: 'in_kind', label: 'In-Kind' },
              { id: 'recurring', label: 'Monthly SIP' },
              { id: 'crypto', label: 'Web3 Crypto' },
              { id: 'corporate_csr', label: 'CSR' },
              { id: 'impact_kit', label: 'Kits' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-12 text-center">
            No contributions found under the selected mode filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 px-5">Campaign & Partner NGO</th>
                  <th className="p-4 px-5">Mode & Channel</th>
                  <th className="p-4 px-5">Impact Valuation</th>
                  <th className="p-4 px-5">Details / Tracking</th>
                  <th className="p-4 px-5">Receipt Ref</th>
                  <th className="p-4 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDonations.map(d => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300">
                          <CampaignImage
                            src={d.campaign?.imageUrl}
                            alt={d.campaign?.title}
                            category={d.campaign?.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-white text-sm truncate max-w-[200px]">{d.campaign?.title || 'Community Impact Drive'}</div>
                          <div className="text-xs text-indigo-600 mt-0.5">{d.ngo?.ngoName || 'Verified Partner NGO'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 px-5">
                      <div className="space-y-1">
                        {getModeBadge(d.donationType)}
                        <div className="text-[11px] text-slate-500 font-mono">{d.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="p-4 px-5 font-extrabold text-emerald-600 text-base">
                      ₹{d.amount.toLocaleString()}
                    </td>
                    <td className="p-4 px-5">
                      {d.donationType === 'in_kind' && d.inKindDetails && (
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-amber-300">
                            {d.inKindDetails.quantity} {d.inKindDetails.unit} of {d.inKindDetails.itemName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Pickup: {d.inKindDetails.pickupDate || 'Scheduled'} • <span className="text-emerald-600 font-semibold">{d.inKindDetails.logisticsStatus}</span>
                          </div>
                        </div>
                      )}

                      {d.donationType === 'crypto' && d.cryptoDetails && (
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="text-cyan-300 font-bold">{d.cryptoDetails.cryptoAmount} {d.cryptoDetails.cryptoCurrency}</div>
                          <div className="text-slate-500 truncate max-w-[150px]">Tx: {d.blockchainTxHash || d.cryptoDetails.txHash}</div>
                        </div>
                      )}

                      {d.donationType === 'recurring' && d.recurringDetails && (
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-purple-600 font-bold">{d.recurringDetails.frequency} SIP ({d.recurringDetails.durationMonths} mo)</div>
                          <div className="text-slate-500">Status: <span className="text-emerald-600 font-semibold">{d.recurringDetails.status}</span></div>
                        </div>
                      )}

                      {d.donationType === 'corporate_csr' && d.corporateDetails && (
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-white font-bold">{d.corporateDetails.companyName}</div>
                          <div className="text-emerald-600">{d.corporateDetails.matchingGrantMultiplier}x Matching Grant</div>
                        </div>
                      )}

                      {d.donationType === 'impact_kit' && d.itemKit && (
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-pink-300 font-bold">{d.itemKit.kitCount}x {d.itemKit.kitType}</div>
                          <div className="text-slate-500">Direct Beneficiary Kits</div>
                        </div>
                      )}

                      {d.donationType === 'monetary' && (
                        <div className="text-xs text-slate-500">Instant Online Contribution</div>
                      )}
                    </td>
                    <td className="p-4 px-5 font-mono text-slate-500 text-xs">
                      {d.receiptNumber}
                    </td>
                    <td className="p-4 px-5">
                      <button 
                        onClick={() => window.print()}
                        className="btn btn-secondary text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 hover:bg-slate-100 shadow-sm"
                      >
                        <Download size={14} /> Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* PUBLIC BLOCKCHAIN & FINANCIAL TRANSPARENCY LEDGER MODAL           */}
      {/* ================================================================= */}
      {showLedgerModal && (
        <div className="modal-overlay">
          <div className="modal-content relative bg-slate-50 border-cyan-500/40 rounded-3xl p-6 sm:p-10 space-y-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowLedgerModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shadow-lg">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">Sahayak On-Chain Transparency Explorer</h3>
                <p className="text-xs sm:text-sm text-slate-500">Polygon PoS Public Ledger & Cryptographic Proof-of-Donation</p>
              </div>
            </div>

            {loadingLedger ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                Fetching cryptographic block entries from ledger...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">Network</div>
                    <div className="text-base font-extrabold text-white mt-1">Polygon Mainnet (PoS)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">Smart Contract Vault</div>
                    <div className="text-base font-extrabold text-cyan-400 mt-1 font-mono truncate">0x71C2...B49a</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 uppercase font-bold">Total Ledger Records</div>
                    <div className="text-base font-extrabold text-emerald-600 mt-1">{publicLedger.length} Verified Entries</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 px-4">Tx Hash</th>
                        <th className="p-3.5 px-4">Block</th>
                        <th className="p-3.5 px-4">Contributor</th>
                        <th className="p-3.5 px-4">NGO Partner</th>
                        <th className="p-3.5 px-4">Mode</th>
                        <th className="p-3.5 px-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {publicLedger.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-850 transition-colors">
                          <td className="p-3.5 px-4 text-cyan-400 truncate max-w-[140px]">
                            {item.blockchainTxHash}
                          </td>
                          <td className="p-3.5 px-4 text-slate-500">#{item.blockNumber}</td>
                          <td className="p-3.5 px-4 font-sans font-semibold text-white">{item.donorName}</td>
                          <td className="p-3.5 px-4 font-sans text-indigo-600">{item.ngoName}</td>
                          <td className="p-3.5 px-4 font-sans">
                            <span className="badge badge-ai text-[10px] py-0.5">{item.donationType}</span>
                          </td>
                          <td className="p-3.5 px-4 font-extrabold text-emerald-600 font-sans">
                            ₹{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLedgerModal(false)}
                className="btn btn-secondary px-6 py-2.5 text-xs font-bold rounded-xl"
              >
                Close Explorer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
