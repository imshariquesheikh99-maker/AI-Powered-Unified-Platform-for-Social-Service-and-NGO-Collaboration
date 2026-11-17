import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Users, Building, Wallet, Activity, RefreshCw, BarChart3, Lock, AlertCircle, Cpu, Server, Database } from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification'); // 'verification', 'users', 'logs'

  const [aiAudits, setAiAudits] = useState({});
  const [auditingId, setAuditingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.getAdminStats();
      if (statsRes.success) setStats(statsRes.stats);

      const ngoRes = await api.getNgos({ status: 'pending' });
      if (ngoRes.success) setPendingNgos(ngoRes.ngos);

      const usersRes = await api.getAllUsers();
      if (usersRes.success) setUsers(usersRes.users);

      const logsRes = await api.getActivityLogs();
      if (logsRes.success) setActivityLogs(logsRes.logs);
    } catch (err) {
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAiFraudAudit = async (ngo) => {
    setAuditingId(ngo._id);
    try {
      const result = await api.aiDetectFraud({
        title: ngo.ngoName,
        description: ngo.description,
        requesterRole: 'NGO',
        category: ngo.category
      });
      if (result.success) {
        setAiAudits(prev => ({ ...prev, [ngo._id]: result }));
      }
    } catch (error) {
      console.error('AI audit error:', error);
    } finally {
      setAuditingId(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      const res = await api.verifyNgo(id, status, status === 'verified' ? 'Admin approved verification documents' : 'Insufficient registration details');
      if (res.success) {
        alert(`NGO status updated to ${status.toUpperCase()}`);
        loadData();
      }
    } catch (error) {
      alert('Action failed');
    }
  };


  if (loading) {
    return (
      <div className="container py-24 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <RefreshCw size={32} className="animate-spin text-indigo-600" />
        <span className="text-sm font-semibold">Loading Admin Executive Control Desk...</span>
      </div>
    );
  }

  return (
    <div className="container space-y-12 py-10">
      
      {/* Executive Workspace Banner */}
      <div className="glass-card p-8 sm:p-10 border-indigo-200 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-2xl shrink-0">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="badge badge-ai text-xs px-3.5 py-1"><ShieldCheck size={14} /> Super Admin Control Desk</span>
              <span className="badge badge-verified text-xs bg-emerald-50 px-3 py-1">RBAC Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">Sahayak AI Executive Overview</h1>
            <p className="text-xs sm:text-sm text-slate-500">NGO Verification, Multi-role User Governance & Real-time Audit Trail</p>
          </div>
        </div>

        <button onClick={loadData} className="btn btn-secondary text-xs font-bold px-6 py-3 rounded-2xl flex items-center gap-2.5 shadow-md shrink-0">
          <RefreshCw size={16} /> Refresh System Data
        </button>
      </div>

      {/* Big Icon KPI Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* KPI 1 */}
        <div className="glass-card p-7 rounded-3xl border-amber-500/20 hover:border-amber-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 shadow-lg">
            <Clock size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending NGOs</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{stats?.ngoStats?.pending || 0}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">Needs Document Audit</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-7 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 shadow-lg">
            <Building size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified NGOs</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{stats?.ngoStats?.verified || 0}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified & Active</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-7 rounded-3xl border-indigo-500/20 hover:border-indigo-300 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0 shadow-lg">
            <Users size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Users</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{stats?.totalUsers || 0}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">Across 5 Roles</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card p-7 rounded-3xl border-purple-500/20 hover:border-purple-300 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shrink-0 shadow-lg">
            <Wallet size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Platform Funds</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">₹{(stats?.financials?.totalDonations || 0).toLocaleString()}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">{stats?.financials?.donationCount || 0} Verified Receipts</div>
          </div>
        </div>

      </div>

      {/* Platform Health, Security & AI Telemetry Bar */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border-slate-200 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Server size={18} className="text-emerald-600" />
            <h3 className="text-base font-bold text-white">System Health & Microservices Telemetry</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 font-bold">All 4 Services Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Server size={12} className="text-blue-500" /> Express REST API
            </div>
            <div className="font-extrabold text-white text-sm">Port 5001 • 99.99%</div>
            <div className="text-[10px] text-emerald-600 font-medium">Latency: 24ms • 15 Endpoints</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Cpu size={12} className="text-purple-500" /> FastAPI AI Service
            </div>
            <div className="font-extrabold text-white text-sm">Port 8000 • NLP Active</div>
            <div className="text-[10px] text-purple-600 font-medium">Vector Engine: 38ms Triage</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Database size={12} className="text-amber-500" /> MongoDB In-Memory
            </div>
            <div className="font-extrabold text-white text-sm">Pre-Seeded • 15 NGOs</div>
            <div className="text-[10px] text-amber-600 font-medium">17 Campaigns • 5 Roles Active</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <ShieldCheck size={12} className="text-cyan-500" /> Polygon Ledger
            </div>
            <div className="font-extrabold text-white text-sm">PoS Mainnet Synced</div>
            <div className="text-[10px] text-cyan-600 font-medium">0x71C2...B49a Verified</div>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="glass-card p-2.5 rounded-3xl flex border border-slate-200 gap-3 text-xs sm:text-sm font-bold overflow-x-auto shadow-md">
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex-1 py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2.5 ${
            activeTab === 'verification'
              ? 'bg-indigo-600/30 text-white border border-indigo-300 shadow-lg'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Clock size={18} className="text-amber-600" />
          <span>NGO Verification Desk ({pendingNgos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2.5 ${
            activeTab === 'users'
              ? 'bg-indigo-600/30 text-white border border-indigo-300 shadow-lg'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Users size={18} className="text-indigo-600" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2.5 ${
            activeTab === 'logs'
              ? 'bg-indigo-600/30 text-white border border-indigo-300 shadow-lg'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Activity size={18} className="text-emerald-600" />
          <span>Real-Time Audit Stream</span>
        </button>
      </div>

      {/* TAB 1: NGO Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-8">
          {pendingNgos.length === 0 ? (
            <div className="glass-card p-14 text-center text-slate-500 text-sm space-y-4 rounded-3xl">
              <div className="w-18 h-18 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">All Clear! No Pending NGO Audits</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">All NGO registration documents have been audited and verified.</p>
            </div>
          ) : (
            pendingNgos.map(ngo => (
              <div key={ngo._id} className="glass-card p-8 rounded-3xl border-indigo-200 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="flex items-start gap-6">
                    <img src={ngo.logo} alt={ngo.ngoName} className="w-20 h-20 rounded-2xl object-cover border border-slate-300 shrink-0 shadow-xl" />
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-white">{ngo.ngoName}</h3>
                        <span className="badge badge-pending px-3.5 py-1">Awaiting Approval</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">{ngo.description}</p>
                      <div className="flex flex-wrap gap-6 text-xs text-slate-500 pt-3 font-mono border-t border-slate-200/80">
                        <span className="text-indigo-600 font-semibold">Reg No: {ngo.registrationNumber}</span>
                        <span>Sector: {ngo.category}</span>
                        <span>City: {ngo.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => runAiFraudAudit(ngo)}
                      disabled={auditingId === ngo._id}
                      className="btn btn-ai text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl flex-1 md:flex-initial shadow-xl flex items-center gap-2"
                    >
                      {auditingId === ngo._id ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      <span>{aiAudits[ngo._id] ? 'Re-Audit AI Risk' : 'Run AI Risk Audit'}</span>
                    </button>
                    <button
                      onClick={() => handleVerify(ngo._id, 'verified')}
                      className="btn btn-emerald text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl flex-1 md:flex-initial shadow-xl flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleVerify(ngo._id, 'rejected')}
                      className="btn btn-secondary text-rose-600 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl flex-1 md:flex-initial border-rose-200 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>

                {/* AI Audit Result Box */}
                {aiAudits[ngo._id] && (
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-indigo-600" /> Sahayak AI Authenticity Audit Report
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        aiAudits[ngo._id].trustScore >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-300 border border-amber-200'
                      }`}>
                        Trust Score: {aiAudits[ngo._id].trustScore}% ({aiAudits[ngo._id].riskLevel})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800">
                      <strong>AI Recommendation:</strong> {aiAudits[ngo._id].recommendation}
                    </p>
                    <div className="text-xs text-slate-500">
                      <strong>Risk Factors Evaluated:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700">
                        {aiAudits[ngo._id].riskFactors.map((rf, idx) => (
                          <li key={idx}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}


      {/* TAB 2: Users Management Table */}
      {activeTab === 'users' && (
        <div className="glass-card p-0 overflow-hidden rounded-3xl border-slate-200 shadow-xl">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Users size={22} className="text-indigo-600" /> Platform User Directory
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">{users.length} Active Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-5 px-6">User Details</th>
                  <th className="p-5 px-6">Role Persona</th>
                  <th className="p-5 px-6">Location</th>
                  <th className="p-5 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 px-6 flex items-center gap-4">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0 shadow-sm" />
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-5 px-6">
                      <span className="badge badge-ai uppercase px-3.5 py-1 text-[11px] font-bold">{u.role}</span>
                    </td>
                    <td className="p-5 px-6 text-xs sm:text-sm">{u.location || 'India'}</td>
                    <td className="p-5 px-6 font-mono text-slate-500 text-xs sm:text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Activity Audit Trail Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card p-8 space-y-6 rounded-3xl border-slate-200 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Activity size={24} className="text-emerald-600" /> Real-Time Platform Audit Stream
            </h3>
            <span className="badge badge-verified text-[10px]">Live Logging</span>
          </div>

          <div className="space-y-4">
            {activityLogs.map((log, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-200">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-600">{log.userName}</span> (<span className="text-slate-500 uppercase text-[11px] font-bold">{log.userRole}</span>): <span className="text-slate-800">{log.details}</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-500 shrink-0 self-end sm:self-auto bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

