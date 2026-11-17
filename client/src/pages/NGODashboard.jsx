import React, { useEffect, useState } from 'react';
import { 
  Building, Plus, CheckCircle2, Clock, Users, Wallet, HandHeart, AlertTriangle, 
  Layers, X, Sparkles, Megaphone, FileText, Package, Repeat, Cpu, Briefcase, Gift, Truck,
  MapPin, Target, Image as ImageIcon, ShieldCheck, TrendingUp, Activity
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CampaignImage, CATEGORY_FALLBACK_IMAGES } from '../components/CampaignImage';

export const NGODashboard = () => {
  const { user } = useAuth();
  const [ngoProfile, setNgoProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [assistanceRequests, setAssistanceRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donationFilter, setDonationFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State for New Campaign
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: 'Education',
    targetAmount: 100000,
    requiredSkills: 'Teaching, Digital Literacy',
    volunteersNeeded: 5,
    location: 'New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
  });

  const [impactReport, setImpactReport] = useState(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user?.ngoProfileId) {
        const ngoRes = await api.getNgoById(user.ngoProfileId);
        if (ngoRes.success) {
          setNgoProfile(ngoRes.ngo);
          setCampaigns(ngoRes.campaigns || []);
        }
      }

      const appsRes = await api.getNgoVolunteerApps();
      if (appsRes.success) setVolunteerApps(appsRes.applications);

      const reqRes = await api.getAllRequests();
      if (reqRes.success) setAssistanceRequests(reqRes.requests);

      const donRes = await api.getNgoDonations();
      if (donRes.success) setDonations(donRes.donations);
    } catch (err) {
      console.error('NGO Dash error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImpactReport = async () => {
    setGeneratingSummary(true);
    try {
      const res = await api.aiGenerateImpactSummary({
        ngoName: ngoProfile?.ngoName || user?.ngoName || 'NGO Platform',
        totalCampaigns: campaigns.length,
        totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
        totalVolunteers: volunteerApps.length,
        resolvedTickets: assistanceRequests.filter(r => r.status === 'completed').length
      });
      if (res.success) {
        setImpactReport(res);
      }
    } catch (error) {
      console.error('Impact report error:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);


  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCampaign(newCampaign);
      if (res.success) {
        alert('Campaign launched successfully!');
        setShowCreateModal(false);
        loadData();
      } else {
        alert(res.message || 'Failed to create campaign');
      }
    } catch (error) {
      alert('Failed to launch campaign');
    }
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      const res = await api.updateAppStatus(appId, status);
      if (res.success) {
        loadData();
      }
    } catch (error) {
      alert('Status update failed');
    }
  };

  const handleAdoptRequest = async (requestId) => {
    try {
      const res = await api.updateRequestStatus(requestId, 'in_progress', true);
      if (res.success) {
        alert('Beneficiary request adopted by your NGO!');
        loadData();
      }
    } catch (error) {
      alert('Failed to update request');
    }
  };

  const handleUpdateInKindStatus = async (donationId, status) => {
    try {
      const res = await api.updateInKindStatus(donationId, status);
      if (res.success) {
        alert(`In-kind shipment status updated to ${status.toUpperCase()}!`);
        loadData();
      } else {
        alert(res.message || 'Status update failed');
      }
    } catch (error) {
      alert('Failed to update shipment status');
    }
  };

  const totalFunds = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const inKindCount = donations.filter(d => d.donationType === 'in_kind').length;
  const recurringCount = donations.filter(d => d.donationType === 'recurring').length;

  if (loading) return <div className="container py-24 text-center text-slate-500">Loading NGO Portal Workspace...</div>;

  return (
    <div className="container space-y-12 py-10">
      
      {/* Header Banner */}
      <div className="glass-card p-8 sm:p-10 border-emerald-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xl shrink-0">
            <Building size={40} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="badge badge-verified text-xs px-3.5 py-1"><Building size={14} /> Verified NGO Portal</span>
              {user?.verificationStatus === 'verified' ? (
                <span className="badge badge-verified text-xs bg-emerald-50 px-3 py-1"><CheckCircle2 size={13} /> Admin Approved</span>
              ) : (
                <span className="badge badge-pending text-xs bg-amber-50 px-3 py-1"><Clock size={13} /> Verification Pending</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">{ngoProfile?.ngoName || user?.ngoName || 'NGO Workspace'}</h1>
            <p className="text-xs sm:text-sm text-slate-500">Campaign Management, AI Volunteer Matching & Beneficiary Support Operations</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={handleGenerateImpactReport}
            disabled={generatingSummary}
            className="btn btn-ai text-sm font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl"
          >
            <Sparkles size={18} className="text-cyan-300" />
            <span>{generatingSummary ? 'Generating AI Impact Report...' : 'AI Impact Report'}</span>
          </button>
          <button
            onClick={() => {
              if (user?.verificationStatus !== 'verified') {
                alert('Your NGO account is pending Admin verification. You cannot create campaigns until approved by Admin.');
                return;
              }
              setShowCreateModal(true);
            }}
            className="btn btn-emerald text-sm font-bold px-7 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl"
          >
            <Plus size={20} /> Launch New Campaign
          </button>
        </div>
      </div>

      {/* AI Impact Summary Card */}
      {impactReport && (
        <div className="p-8 rounded-3xl bg-indigo-50/50 border border-indigo-200 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Sparkles size={22} className="text-cyan-400" /> Sahayak AI Executive Impact Summary Report
            </h3>
            <span className="text-xs font-mono text-indigo-600 bg-indigo-900/60 px-3.5 py-1 rounded-full border border-indigo-200">
              {impactReport.generatedAt}
            </span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-sans">{impactReport.summary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {impactReport.highlights.map((h, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-emerald-600 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Warning Banner if pending */}
      {user?.verificationStatus !== 'verified' && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-300 text-xs sm:text-sm flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-900/60 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm sm:text-base">Admin Verification Pending</div>
            <div className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">Your NGO registration documents are currently under review by platform administrators. (Tip: Switch to Admin demo role in top bar to approve!)</div>
          </div>
        </div>
      )}

      {/* KPI Stats Counter Cards Across All Donation & Operation Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* KPI 1 */}
        <div className="glass-card p-6 rounded-3xl border-indigo-500/20 hover:border-indigo-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0 shadow-lg">
            <Megaphone size={26} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Campaigns</div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{campaigns.length}</div>
            <div className="text-[10px] text-indigo-600 font-semibold">Active Drives</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-6 rounded-3xl border-purple-500/20 hover:border-purple-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shrink-0 shadow-lg">
            <Users size={26} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Volunteers</div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{volunteerApps.length}</div>
            <div className="text-[10px] text-purple-600 font-semibold">AI Skill Matched</div>
          </div>
        </div>

        {/* KPI 3: In-Kind Goods */}
        <div className="glass-card p-6 rounded-3xl border-amber-500/20 hover:border-amber-500/50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 shadow-lg">
            <Package size={26} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">In-Kind Goods</div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{inKindCount}</div>
            <div className="text-[10px] text-amber-300 font-semibold">Relief Shipments</div>
          </div>
        </div>

        {/* KPI 4: Recurring Patrons */}
        <div className="glass-card p-6 rounded-3xl border-purple-500/20 hover:border-purple-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shrink-0 shadow-lg">
            <Repeat size={26} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Monthly SIPs</div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{recurringCount}</div>
            <div className="text-[10px] text-purple-600 font-semibold">Recurring Donors</div>
          </div>
        </div>

        {/* KPI 5: Capital Raised */}
        <div className="glass-card p-6 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 shadow-lg">
            <Wallet size={26} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Raised</div>
            <div className="text-2xl font-extrabold text-white font-heading mt-0.5">₹{totalFunds.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">All Donation Modes</div>
          </div>
        </div>

      </div>

      {/* NGO Operational Health & Compliance Intelligence Card */}
      <div className="glass-card p-8 rounded-3xl border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">NGO Operational Health & Regulatory Compliance</h3>
              <p className="text-xs text-slate-500">NITI Aayog Darpan & 12A/80G status, deployment efficiency & SLA ratings</p>
            </div>
          </div>
          <span className="badge badge-verified text-[10px] self-start sm:self-auto">Darpan Verified: DL/2021/0294</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Field Fund Ratio</span>
              <span className="font-extrabold text-emerald-600 font-mono">92.4%</span>
            </div>
            <div className="progress-bar-bg h-1.5">
              <div className="progress-bar-fill bg-emerald-500" style={{ width: '92.4%' }}></div>
            </div>
            <div className="text-[10px] text-slate-500">Only 7.6% logistics & admin overhead</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Volunteer Attendance</span>
              <span className="font-extrabold text-indigo-600 font-mono">96.8%</span>
            </div>
            <div className="progress-bar-bg h-1.5">
              <div className="progress-bar-fill bg-indigo-500" style={{ width: '96.8%' }}></div>
            </div>
            <div className="text-[10px] text-slate-500">Active volunteer retention score</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Ticket Resolution SLA</span>
              <span className="font-extrabold text-purple-600 font-mono">2.1 Hours</span>
            </div>
            <div className="progress-bar-bg h-1.5">
              <div className="progress-bar-fill bg-purple-500" style={{ width: '85%' }}></div>
            </div>
            <div className="text-[10px] text-slate-500">Beneficiary triage response speed</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Polygon Ledger Sync</span>
              <span className="font-extrabold text-cyan-500 font-mono">100% Synced</span>
            </div>
            <div className="progress-bar-bg h-1.5">
              <div className="progress-bar-fill bg-cyan-500" style={{ width: '100%' }}></div>
            </div>
            <div className="text-[10px] text-slate-500">Zero cryptographic discrepancies</div>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Campaign Manager Container */}
        <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Layers size={22} className="text-indigo-600" /> Active Campaigns ({campaigns.length})
            </h3>
            <span className="badge badge-ai text-[10px]">Managed Drives</span>
          </div>

          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">No campaigns launched yet.</p>
            ) : (
              campaigns.map(c => {
                const percent = Math.min(100, Math.round(((c.raisedAmount || 0) / (c.targetAmount || 1)) * 100));
                return (
                  <div key={c._id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-indigo-200 transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300 relative">
                        <CampaignImage
                          src={c.imageUrl}
                          alt={c.title}
                          category={c.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-verified text-[10px] px-2.5 py-0.5">{c.category}</span>
                          {c.location && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin size={11} className="text-rose-600" /> {c.location}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white truncate">{c.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar & Amounts */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">Target: ₹{c.targetAmount?.toLocaleString()}</span>
                        <span className="text-emerald-600 font-bold">Raised: ₹{c.raisedAmount?.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="progress-bar-bg h-1.5">
                        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Volunteer Applications Inbox Container */}
        <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Users size={22} className="text-purple-600" /> Volunteer Inbox ({volunteerApps.length})
            </h3>
            <span className="badge badge-ai text-[10px]">Vector AI Match</span>
          </div>

          <div className="space-y-4">
            {volunteerApps.map(app => (
              <div key={app._id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3.5 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300">
                      <CampaignImage
                        src={app.campaign?.imageUrl}
                        alt={app.campaign?.title}
                        category={app.campaign?.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-2.5">
                        {app.volunteer?.name}
                        <span className="badge badge-ai text-[10px] px-2.5 py-0.5">{app.aiMatchScore}% AI Match</span>
                      </div>
                      <div className="text-xs text-indigo-600 mt-0.5 font-medium">{app.campaign?.title}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-600 leading-relaxed">
                  ⚡ <strong>AI Match Reasoning:</strong> {app.aiMatchReason}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <span className="text-xs text-slate-500 font-mono">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    {app.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                          className="btn btn-emerald text-xs font-bold py-2 px-5 rounded-xl shadow-md"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                          className="btn btn-secondary text-rose-600 text-xs font-bold py-2 px-5 rounded-xl"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`badge px-3.5 py-1 ${app.status === 'accepted' ? 'badge-verified' : 'badge-urgent'}`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Beneficiary Requests Inbox Container */}
      <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <HandHeart size={22} className="text-rose-600" /> Beneficiary Emergency Aid Queue
          </h3>
          <span className="badge badge-urgent text-[10px]">Python NLP Triage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {assistanceRequests.map(req => (
            <div key={req._id} className="p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="badge badge-verified text-[10px] mb-1.5">{req.category}</span>
                  <h4 className="text-lg font-bold text-white">{req.title}</h4>
                </div>
                <span className={`badge px-3.5 py-1 shrink-0 ${req.priorityLevel === 'Urgent' ? 'badge-urgent' : 'badge-pending'}`}>
                  {req.priorityLevel} ({req.aiUrgencyScore}/100)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{req.description}</p>
              <div className="text-xs text-slate-500 flex justify-between pt-3 border-t border-slate-200/80 font-medium">
                <span>Location: {req.location}</span>
                <span>Affected: {req.affectedPeople} People</span>
              </div>
              {req.status === 'submitted' ? (
                <button 
                  onClick={() => handleAdoptRequest(req._id)}
                  className="w-full btn btn-emerald py-3.5 text-xs font-bold rounded-2xl mt-2 shadow-lg"
                >
                  Adopt Ticket & Assign NGO Aid
                </button>
              ) : (
                <div className="text-xs text-emerald-600 font-semibold text-center pt-3 border-t border-emerald-500/20">
                  ✓ NGO Support Assigned ({req.status})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Received Multi-Mode Contributions & Relief Logistics Hub */}
      <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Package size={22} className="text-amber-600" /> Contributions & Relief Supplies Logistics Desk ({donations.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1">Manage physical in-kind shipments, monthly recurring patrons, and corporate grants</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'in_kind', label: 'In-Kind Supplies' },
              { id: 'recurring', label: 'Monthly SIPs' },
              { id: 'crypto', label: 'Web3 Crypto' },
              { id: 'corporate_csr', label: 'Corporate CSR' },
              { id: 'monetary', label: 'Online Monetary' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setDonationFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  donationFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {donations.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-8 text-center">No contributions received yet for your NGO campaigns.</p>
        ) : (
          <div className="space-y-4">
            {donations
              .filter(d => donationFilter === 'all' || d.donationType === donationFilter)
              .map(d => (
                <div key={d._id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-2.5">
                        {d.isAnonymous ? 'Anonymous Philanthropist' : (d.donor?.name || 'Verified Contributor')}
                        <span className="badge badge-ai text-[10px] capitalize">
                          {d.donationType?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Campaign: <span className="text-indigo-600 font-medium">{d.campaign?.title}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-600">₹{d.amount?.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{d.receiptNumber}</div>
                    </div>
                  </div>

                  {/* Mode-Specific Details Card */}
                  {d.donationType === 'in_kind' && d.inKindDetails && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-200 space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span className="flex items-center gap-1.5"><Truck size={15} /> Relief Material Shipment:</span>
                        <span className="badge badge-warning text-[10px] uppercase font-bold">{d.inKindDetails.logisticsStatus}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                        <div>Items: <strong className="text-white">{d.inKindDetails.quantity} {d.inKindDetails.unit} of {d.inKindDetails.itemName}</strong></div>
                        <div>Pickup/Delivery: <strong className="text-white">{d.inKindDetails.pickupAddress}</strong></div>
                        <div>Preferred Date: <strong className="text-white">{d.inKindDetails.pickupDate}</strong></div>
                        <div>Declared Value: <strong className="text-emerald-600">₹{d.inKindDetails.estimatedValue?.toLocaleString()}</strong></div>
                      </div>

                      {/* Logistics Workflow Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-500/20">
                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Update Shipment Status:</span>
                        {d.inKindDetails.logisticsStatus === 'scheduled' && (
                          <button
                            onClick={() => handleUpdateInKindStatus(d._id, 'in_transit')}
                            className="btn btn-sm btn-secondary text-amber-300 text-[11px] font-bold py-1 px-3 rounded-lg"
                          >
                            Mark In Transit
                          </button>
                        )}
                        {d.inKindDetails.logisticsStatus === 'in_transit' && (
                          <button
                            onClick={() => handleUpdateInKindStatus(d._id, 'received_at_hub')}
                            className="btn btn-sm btn-primary text-[11px] font-bold py-1 px-3 rounded-lg"
                          >
                            Confirm Received at Hub
                          </button>
                        )}
                        {d.inKindDetails.logisticsStatus === 'received_at_hub' && (
                          <button
                            onClick={() => handleUpdateInKindStatus(d._id, 'distributed')}
                            className="btn btn-sm btn-emerald text-[11px] font-bold py-1 px-3 rounded-lg"
                          >
                            Mark Distributed to Beneficiaries
                          </button>
                        )}
                        {d.inKindDetails.logisticsStatus === 'distributed' && (
                          <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 size={13} /> Verified Distributed
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {d.donationType === 'recurring' && d.recurringDetails && (
                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Repeat size={15} />
                        <span>Monthly Patron SIP: ₹{d.amount.toLocaleString()} / {d.recurringDetails.frequency} for {d.recurringDetails.durationMonths} months</span>
                      </div>
                      <span className="badge badge-verified text-[10px]">{d.recurringDetails.status}</span>
                    </div>
                  )}

                  {d.donationType === 'crypto' && d.cryptoDetails && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2 font-sans font-semibold">
                        <Cpu size={15} /> On-Chain Web3 Deposit ({d.cryptoDetails.network})
                      </div>
                      <div className="text-[11px]">
                        Tx: <span className="text-cyan-400">{d.blockchainTxHash?.slice(0, 16)}...</span>
                      </div>
                    </div>
                  )}

                  {d.donationType === 'corporate_csr' && d.corporateDetails && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Briefcase size={15} />
                        <span>Corporate Grant by <strong>{d.corporateDetails.companyName}</strong> (CIN: {d.corporateDetails.cinGstin})</span>
                      </div>
                      <span className="badge badge-verified text-[10px]">{d.corporateDetails.matchingGrantMultiplier}x Match Grant</span>
                    </div>
                  )}

                  {d.donationType === 'impact_kit' && d.itemKit && (
                    <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-xs text-pink-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Gift size={15} />
                        <span>Sponsored {d.itemKit.kitCount}x "{d.itemKit.kitType}" for community distribution</span>
                      </div>
                      <span className="badge badge-ai text-[10px]">Direct Kit</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                    <span className="font-mono">{new Date(d.donatedAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => window.print()}
                      className="btn btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                    >
                      <Download size={13} /> Print Certificate
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content relative bg-slate-50 border-indigo-200 rounded-3xl p-8 sm:p-10 space-y-6">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-900"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-lg shrink-0">
                <Megaphone size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Launch Social Campaign</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Publish campaign details to attract donors & AI-matched volunteers</p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-5">
              <div className="form-group">
                <label className="input-label">Campaign Title</label>
                <input
                  type="text"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g. Free Winter Blanket & Ration Drive"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Explain campaign impact and goals..."
                  className="input-field h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="form-group">
                  <label className="input-label">Target Funds (₹)</label>
                  <input
                    type="number"
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: Number(e.target.value) || '' })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Category</label>
                  <select
                    value={newCampaign.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const presetImg = CATEGORY_FALLBACK_IMAGES[newCat] || CATEGORY_FALLBACK_IMAGES['General'];
                      setNewCampaign({
                        ...newCampaign,
                        category: newCat,
                        imageUrl: presetImg
                      });
                    }}
                    className="select-field"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Animal Care">Animal Care</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Poverty Relief">Poverty Relief</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="input-label">Volunteers Needed</label>
                  <input
                    type="number"
                    value={newCampaign.volunteersNeeded}
                    onChange={(e) => setNewCampaign({ ...newCampaign, volunteersNeeded: Number(e.target.value) || 1 })}
                    className="input-field"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="input-label">Drive Location (City)</label>
                  <input
                    type="text"
                    value={newCampaign.location}
                    onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                    placeholder="e.g. New Delhi, Bengaluru"
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Required Volunteer Skills</label>
                  <input
                    type="text"
                    value={newCampaign.requiredSkills}
                    onChange={(e) => setNewCampaign({ ...newCampaign, requiredSkills: e.target.value })}
                    placeholder="Teaching, First Aid, Logistics"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Campaign Thumbnail Image Selector & Preview */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="input-label mb-0 flex items-center gap-2 text-indigo-600">
                    <ImageIcon size={16} /> Campaign Thumbnail Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const preset = CATEGORY_FALLBACK_IMAGES[newCampaign.category] || CATEGORY_FALLBACK_IMAGES['General'];
                      setNewCampaign({ ...newCampaign, imageUrl: preset });
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-600 font-semibold underline"
                  >
                    Use Category Preset
                  </button>
                </div>
                <input
                  type="url"
                  value={newCampaign.imageUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field text-xs font-mono"
                />

                {/* Live Thumbnail Preview */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Thumbnail Preview:</div>
                  <div className="flex gap-4 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-300">
                      <CampaignImage
                        src={newCampaign.imageUrl}
                        alt="Preview"
                        category={newCampaign.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{newCampaign.title || 'Your Campaign Title'}</div>
                      <div className="text-[11px] text-indigo-600">{newCampaign.category} • {newCampaign.location || 'Location'}</div>
                      <div className="text-[10px] text-slate-500">Target: ₹{(newCampaign.targetAmount || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary px-6 py-3 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold text-xs shadow-xl">
                  Publish Active Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

