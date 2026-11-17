import React, { useEffect, useState } from 'react';
import { 
  HandHeart, Plus, AlertCircle, Clock, CheckCircle2, Phone, MapPin, Sparkles, 
  X, Activity, ShieldAlert, Building, HelpCircle, Truck, HeartHandshake, ShieldCheck, 
  ChevronRight, ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const BeneficiaryDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  // New Request Form
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'Healthcare & Medicine',
    location: user?.location || 'New Delhi',
    affectedPeople: 1,
    contactNumber: user?.phone || ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getMyRequests();
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      console.error('Beneficiary Dash Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAssistanceRequest(newRequest);
      if (res.success) {
        alert(`Assistance Ticket Created! AI Priority Score: ${res.request.priorityLevel} (${res.request.aiUrgencyScore}/100)`);
        setShowWizard(false);
        loadData();
      } else {
        alert(res.message || 'Failed to submit request');
      }
    } catch (error) {
      alert('Request submission failed');
    }
  };

  const urgentCount = requests.filter(r => r.priorityLevel === 'Urgent').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;

  if (loading) return <div className="container py-24 text-center text-slate-500 font-semibold">Loading Beneficiary Support Desk...</div>;

  return (
    <div className="container space-y-12 py-10">
      
      {/* Beneficiary Header Banner */}
      <div className="glass-card p-8 sm:p-10 border-rose-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-500/40 shadow-2xl shrink-0">
            <HandHeart size={40} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="badge badge-urgent text-xs px-3.5 py-1"><HandHeart size={14} /> Beneficiary Support Center</span>
              <span className="badge badge-ai text-xs bg-indigo-50 px-3 py-1"><Sparkles size={13} /> NLP Urgency Scoring Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">Social Aid & Emergency Assistance</h1>
            <p className="text-xs sm:text-sm text-slate-500">Submit emergency tickets for ration, medical care, shelter, or education</p>
          </div>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="btn btn-emerald text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl shrink-0"
        >
          <Plus size={20} /> Submit New Aid Request
        </button>
      </div>

      {/* Big Icon KPI Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* KPI 1 */}
        <div className="glass-card p-7 rounded-3xl border-rose-500/20 hover:border-rose-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0 shadow-lg">
            <ShieldAlert size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Aid Tickets</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{requests.length}</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">{urgentCount} Classified Urgent</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-7 rounded-3xl border-indigo-500/20 hover:border-indigo-300 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0 shadow-lg">
            <Sparkles size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Priority Model</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">NLP Active</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">Real-time Triage</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-7 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 shadow-lg">
            <CheckCircle2 size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fulfilled Tickets</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{fulfilledCount}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">NGO Aid Delivered</div>
          </div>
        </div>

      </div>

      {/* Main Workspace Layout: 2 Cols for Tickets & Workflow, 1 Col for Helplines & Nearby Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tickets Queue & How It Works */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Requests Timeline Queue Container */}
          <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Clock size={24} className="text-indigo-600" /> My Assistance Tickets & Live Tracking ({requests.length})
              </h3>
              <span className="badge badge-verified text-[10px]">Active Tracking</span>
            </div>

            {requests.length === 0 ? (
              <div className="p-14 text-center text-slate-500 text-sm space-y-4">
                <div className="w-18 h-18 rounded-3xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200 shadow-lg">
                  <HandHeart size={36} />
                </div>
                <h3 className="text-xl font-bold text-white">No Aid Requests Submitted Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Click "Submit New Aid Request" above to request food, medical, or education support.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {requests.map(req => (
                  <div key={req._id} className="glass-card p-7 space-y-5 border-indigo-500/20 rounded-3xl shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge badge-verified text-[10px] px-3.5 py-1">{req.category}</span>
                          <span className={`badge px-3.5 py-1 ${req.priorityLevel === 'Urgent' ? 'badge-urgent' : 'badge-pending'}`}>
                            AI Urgency: {req.priorityLevel} ({req.aiUrgencyScore}/100)
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white">{req.title}</h4>
                      </div>

                      <span className="badge badge-ai uppercase text-xs py-2 px-4 font-bold">
                        Status: {req.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{req.description}</p>

                    {/* AI Reason */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-indigo-600 flex items-center gap-3.5 leading-relaxed">
                      <Sparkles size={20} className="text-purple-600 shrink-0" />
                      <span><strong>AI NLP Priority Evaluation:</strong> {req.priorityReason}</span>
                    </div>

                    {/* Assigned NGO Info */}
                    {req.assignedNGO && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                          <span>Assigned Verified NGO: <strong className="text-white font-bold">{req.assignedNGO.ngoName}</strong></span>
                        </div>
                        {req.assignedNGO.phone && (
                          <span className="flex items-center gap-2 text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                            <Phone size={14} className="text-blue-600" /> {req.assignedNGO.phone}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status Timeline Workflow */}
                    <div className="pt-4 border-t border-slate-200/80 flex flex-wrap justify-between gap-2 text-xs sm:text-sm text-slate-500">
                      <div className={`font-semibold ${['submitted', 'in_review', 'approved', 'in_progress', 'fulfilled'].includes(req.status) ? 'text-indigo-600' : ''}`}>
                        1. Submitted
                      </div>
                      <div className={`font-semibold ${['in_review', 'approved', 'in_progress', 'fulfilled'].includes(req.status) ? 'text-indigo-600' : ''}`}>
                        2. NGO Review
                      </div>
                      <div className={`font-semibold ${['approved', 'in_progress', 'fulfilled'].includes(req.status) ? 'text-indigo-600' : ''}`}>
                        3. Approved
                      </div>
                      <div className={`font-semibold ${['in_progress', 'fulfilled'].includes(req.status) ? 'text-indigo-600' : ''}`}>
                        4. In Progress
                      </div>
                      <div className={`font-semibold ${req.status === 'fulfilled' ? 'text-emerald-600 font-bold' : ''}`}>
                        5. Fulfilled
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How Sahayak Aid Processing Works (4-Step Guarantee) */}
          <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">How Sahayak Aid Processing Works</h3>
                  <p className="text-xs text-slate-500">Transparent 4-step verified workflow for rapid relief delivery</p>
                </div>
              </div>
              <span className="badge badge-ai text-[10px]">100% Free Aid</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
                  AI NLP Urgency Scoring
                </div>
                <p className="text-slate-600 leading-relaxed">
                  FastAPI NLP pipeline analyzes ticket descriptions within 50ms, identifying critical medical, food, and shelter flags.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs">2</span>
                  Proximity NGO Dispatch
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Requests are instantly routed to the nearest verified NGO hub in your district holding appropriate relief inventory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">3</span>
                  Supply Pack & Transport
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Volunteers and logistics partners prepare emergency rations, medical supplies, or shelter kits with live status updates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">4</span>
                  Doorstep OTP Handover
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Supplies are handed over directly to the beneficiary family with digital OTP confirmation for full transparency.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: 24x7 Helplines & Nearby NGO Relief Hubs */}
        <div className="space-y-8">
          
          {/* 24x7 Emergency Helplines & Rapid SOS */}
          <div className="glass-card p-7 space-y-5 rounded-3xl border-rose-200 shadow-xl bg-rose-50/20">
            <div className="flex items-center justify-between border-b border-rose-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">24x7 National Crisis Helplines</h3>
                  <p className="text-[11px] text-slate-500">Toll-free immediate government aid</p>
                </div>
              </div>
              <span className="badge badge-urgent text-[9px]">Toll-Free</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-rose-200/80 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Disaster Management (NDRF)</div>
                  <div className="text-[10px] text-slate-500">Floods, earthquakes, evacuations</div>
                </div>
                <a href="tel:1078" className="font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  1078
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Childline India Helpline</div>
                  <div className="text-[10px] text-slate-500">Child safety, nutrition & rescue</div>
                </div>
                <a href="tel:1098" className="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                  1098
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">National Ambulance / Medical</div>
                  <div className="text-[10px] text-slate-500">Emergency medical transport</div>
                </div>
                <a href="tel:108" className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  108 / 102
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Senior Citizen National Helpline</div>
                  <div className="text-[10px] text-slate-500">Elder care, shelter & elder support</div>
                </div>
                <a href="tel:14567" className="font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  14567
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-slate-800">Women Helpline (Domestic/Crisis)</div>
                  <div className="text-[10px] text-slate-500">24x7 Women emergency response</div>
                </div>
                <a href="tel:1091" className="font-mono font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                  1091 / 181
                </a>
              </div>
            </div>
          </div>

          {/* Nearby Verified NGO Relief Hubs & Ration Depots */}
          <div className="glass-card p-7 space-y-4 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Building size={18} className="text-indigo-600" />
                <h3 className="text-base font-bold text-white">Nearby Relief Centers & Kitchens</h3>
              </div>
              <span className="badge badge-verified text-[9px]">NCR Hubs</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-white">Goonj Resource Collection Center</div>
                <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <MapPin size={11} className="text-rose-500" /> Madanpur Khadar, Sarita Vihar, New Delhi
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">Open: 10:00 AM - 5:30 PM • Clothes & Rations</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-white">Akshaya Patra Community Kitchen</div>
                <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <MapPin size={11} className="text-rose-500" /> Sector 62, Industrial Area, Noida
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">Midday Meal Dispatch • 30,000 Meals Daily</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-white">Robin Hood Army Relief Distribution</div>
                <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <MapPin size={11} className="text-rose-500" /> Outer Circle, Connaught Place, New Delhi
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">Every Evening: 7:30 PM - 9:30 PM • Fresh Food</div>
              </div>
            </div>
          </div>

          {/* Beneficiary Aid FAQ */}
          <div className="glass-card p-7 space-y-4 rounded-3xl border-slate-200 shadow-xl bg-slate-50/50">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <HelpCircle size={18} className="text-purple-600" />
              <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="space-y-1">
                <div className="font-bold text-white">Is there any fee or charge for receiving aid?</div>
                <p className="text-[11px] leading-relaxed">No. Every rupee of assistance and every relief kit is 100% free and sponsored by platform donors.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200/60">
                <div className="font-bold text-white">What if I do not have identity cards?</div>
                <p className="text-[11px] leading-relaxed">Emergency food, medicine, and rescue are provided unconditionally. Verification can happen post-stabilization.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200/60">
                <div className="font-bold text-white">How fast will someone respond?</div>
                <p className="text-[11px] leading-relaxed">Tickets tagged as "Urgent" by the AI NLP triage are reviewed by partner NGOs within 2 to 4 hours.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* New Request Modal */}
      {showWizard && (
        <div className="modal-overlay">
          <div className="modal-content relative bg-slate-50 border-indigo-200 rounded-3xl p-8 sm:p-10 space-y-6">
            <button 
              onClick={() => setShowWizard(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-900"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-500/40 shadow-lg shrink-0">
                <HandHeart size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Submit Aid Ticket</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Python FastAPI NLP engine calculates request urgency and matches local NGOs</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div className="form-group">
                <label className="input-label">Request Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder="e.g. Urgent Ration Kit and Medicine for Flood Victim"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Detailed Situation Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Describe your situation, affected family members, and exact aid needed..."
                  className="input-field h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="input-label">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                    className="select-field"
                  >
                    <option value="Food Relief">Food Relief</option>
                    <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                    <option value="Educational Support">Educational Support</option>
                    <option value="Emergency Shelter">Emergency Shelter</option>
                    <option value="Financial Aid">Financial Aid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="input-label">Affected People Count</label>
                  <input
                    type="number"
                    value={newRequest.affectedPeople}
                    onChange={(e) => setNewRequest({ ...newRequest, affectedPeople: e.target.value })}
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="input-label">Location / Area</label>
                  <input
                    type="text"
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Contact Phone</label>
                  <input
                    type="text"
                    value={newRequest.contactNumber}
                    onChange={(e) => setNewRequest({ ...newRequest, contactNumber: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="btn btn-secondary px-6 py-3 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald px-8 py-3.5 rounded-xl font-bold text-xs shadow-xl">
                  Submit & Run AI Urgency Scoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

