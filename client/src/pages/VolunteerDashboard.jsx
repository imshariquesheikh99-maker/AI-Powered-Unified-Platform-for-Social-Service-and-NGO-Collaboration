import React, { useEffect, useState } from 'react';
import { HeartHandshake, Sparkles, CheckCircle2, Clock, MapPin, Zap, Layers, Award, Target, Calendar, Star, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CampaignImage } from '../components/CampaignImage';

export const VolunteerDashboard = ({ onExploreCampaigns }) => {
  const { user } = useAuth();
  const [matchedCampaigns, setMatchedCampaigns] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const matchRes = await api.aiMatchVolunteer(user?.skills || ['Teaching', 'Digital Literacy']);
      if (matchRes.success) {
        setMatchedCampaigns(matchRes.matches || []);
      }

      const appsRes = await api.getMyVolunteerApps();
      if (appsRes.success) {
        setMyApps(appsRes.applications || []);
      }
    } catch (err) {
      console.error('Volunteer Dash Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleApply = async (campaignId) => {
    try {
      const res = await api.applyVolunteer(campaignId, user?.skills || ['General Volunteering'], 'Available as scheduled');
      if (res.success) {
        alert('Application submitted successfully!');
        loadData();
      } else {
        alert(res.message || 'Application failed');
      }
    } catch (error) {
      alert('Application failed');
    }
  };

  if (loading) return <div className="container py-24 text-center text-slate-500 font-semibold">Computing AI Volunteer Matches...</div>;

  return (
    <div className="container space-y-12 py-10">
      
      {/* Volunteer Workspace Banner */}
      <div className="glass-card p-8 sm:p-10 border-purple-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-500/40 shadow-2xl shrink-0">
            <HeartHandshake size={40} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="badge badge-ai text-xs px-3.5 py-1"><HeartHandshake size={14} /> Volunteer Workspace</span>
              <span className="badge badge-verified text-xs bg-indigo-50 px-3 py-1">Vector Cosine Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">Welcome, {user?.name || 'Volunteer'}!</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Registered Skills: <span className="text-purple-600 font-semibold">{user?.skills?.join(', ') || 'Teaching, Digital Literacy, Healthcare'}</span>
            </p>
          </div>
        </div>

        <button onClick={onExploreCampaigns} className="btn btn-primary text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl shadow-xl shrink-0">
          Browse All Opportunities
        </button>
      </div>

      {/* Big Icon KPI Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* KPI 1 */}
        <div className="glass-card p-7 rounded-3xl border-purple-500/20 hover:border-purple-300 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shrink-0 shadow-lg">
            <Sparkles size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Skill Matches</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{matchedCampaigns.length}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">High Vector Similarity</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-7 rounded-3xl border-blue-500/20 hover:border-blue-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0 shadow-lg">
            <Clock size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">My Applications</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">{myApps.length}</div>
            <div className="text-[11px] text-blue-300 font-semibold mt-1">Tracked in Real-Time</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-7 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0 shadow-lg">
            <Award size={30} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Impact Certificate</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">Level 2</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Community Recognized</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: AI Skill Matcher Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles size={24} className="text-purple-600" /> AI Skill-Matched Opportunities
            </h3>
            <span className="badge badge-ai text-xs px-3.5 py-1">Python Vector Engine</span>
          </div>

          <div className="space-y-8">
            {matchedCampaigns.length === 0 ? (
              <div className="glass-card p-14 text-center text-slate-500 text-sm rounded-3xl">
                No active campaign matches found at the moment. Check back soon!
              </div>
            ) : (
              matchedCampaigns.map(({ campaign, matchScore, matchReason }) => (
                <div key={campaign._id} className="glass-card p-0 overflow-hidden border-indigo-500/20 rounded-3xl flex flex-col justify-between shadow-xl group">
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-50">
                    <CampaignImage
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      category={campaign.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-4 left-4 badge badge-verified bg-slate-50/90 backdrop-blur-md px-3 py-1 text-xs border border-emerald-200">
                      {campaign.category}
                    </span>

                    <span className="absolute top-4 right-4 badge badge-ai text-xs font-bold py-1.5 px-3.5 shrink-0 bg-indigo-50 border border-indigo-200 backdrop-blur-md">
                      <Sparkles size={13} className="inline mr-1 text-purple-600" /> {matchScore}% AI Match
                    </span>
                  </div>

                  <div className="p-7 space-y-5">
                    <div>
                      <div className="text-xs text-indigo-600 font-bold">{campaign.ngo?.ngoName || 'Verified NGO'}</div>
                      <h4 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-600 transition-colors">{campaign.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 mt-2 leading-relaxed">{campaign.description}</p>
                    </div>

                    {campaign.requiredSkills && campaign.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {campaign.requiredSkills.map((sk, idx) => (
                          <span key={idx} className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-200 flex items-center gap-3 leading-relaxed">
                      <Zap size={16} className="text-amber-600 shrink-0" />
                      <span><strong>AI Match Reason:</strong> {matchReason}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 text-xs sm:text-sm">
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <MapPin size={15} className="text-rose-600" /> {campaign.location}
                      </span>
                      <button
                        onClick={() => handleApply(campaign._id)}
                        className="btn btn-emerald text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform"
                      >
                        1-Click Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Applications, Badges, Calendar & AI Vector Profile */}
        <div className="space-y-8">
          
          {/* Application Status Tracker */}
          <div className="glass-card p-7 space-y-6 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Clock size={22} className="text-blue-600" /> My Tracker ({myApps.length})
              </h3>
              <span className="badge badge-verified text-[10px]">Applications</span>
            </div>

            <div className="space-y-4">
              {myApps.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">You haven't applied for any campaigns yet.</p>
              ) : (
                myApps.map(app => (
                  <div key={app._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300">
                        <CampaignImage
                          src={app.campaign?.imageUrl}
                          alt={app.campaign?.title}
                          category={app.campaign?.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="font-bold text-white text-sm truncate">{app.campaign?.title}</div>
                        <div className="text-xs text-indigo-600 truncate">{app.campaign?.ngo?.ngoName}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/80">
                      <span className="text-xs text-slate-500 font-mono">{new Date(app.appliedAt).toLocaleDateString()}</span>
                      <span className={`badge px-3 py-0.5 text-[10px] ${
                        app.status === 'accepted' ? 'badge-verified' : (app.status === 'rejected' ? 'badge-urgent' : 'badge-pending')
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Volunteer Badges & Verified Service Milestones */}
          <div className="glass-card p-7 space-y-5 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Award size={22} className="text-emerald-600" /> Badges & Service Hours
              </h3>
              <span className="badge badge-ai text-[10px] bg-emerald-50 text-emerald-600 border-emerald-300">Level 2 Verified</span>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Hours</div>
                <div className="text-xl font-extrabold text-white mt-0.5">48 hrs</div>
                <div className="text-[9px] text-emerald-600 font-semibold">Verified</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Attendance</div>
                <div className="text-xl font-extrabold text-indigo-600 mt-0.5">100%</div>
                <div className="text-[9px] text-indigo-500 font-semibold">Reliability</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Rating</div>
                <div className="text-xl font-extrabold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                  4.9 <Star size={13} className="fill-amber-500 text-amber-500" />
                </div>
                <div className="text-[9px] text-amber-600 font-semibold">Top 5%</div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Earned Credentials</div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-purple-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">STEM Mentor</div>
                    <div className="text-[10px] text-purple-600">32 Students</div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-rose-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <Flame size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">Rapid Responder</div>
                    <div className="text-[10px] text-rose-600">Flood Relief</div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-emerald-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">Zero Hunger</div>
                    <div className="text-[10px] text-emerald-600">Food Rationing</div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-blue-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">Clean Earth</div>
                    <div className="text-[10px] text-blue-600">Eco Volunteer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Field Drives & Shifts */}
          <div className="glass-card p-7 space-y-4 rounded-3xl border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Calendar size={22} className="text-indigo-600" /> Upcoming Community Drives
              </h3>
              <span className="badge badge-verified text-[10px]">NCR Region</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">Mobile Medical Camp @ Seelampur</span>
                  <span className="badge badge-verified text-[9px] px-2 py-0.5">Confirmed</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Clock size={12} className="text-blue-500" /> Saturday, Nov 8 • 9:00 AM - 1:00 PM
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <MapPin size={12} className="text-rose-500" /> Community Hall, Seelampur, Delhi
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">Weekend Slum Teaching Drive</span>
                  <span className="badge badge-pending text-[9px] px-2 py-0.5">Briefing Sent</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Clock size={12} className="text-blue-500" /> Sunday, Nov 9 • 10:00 AM - 2:00 PM
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <MapPin size={12} className="text-rose-500" /> Sangam Vihar Primary Center, Delhi
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">Clean Yamuna Riverfront Drive</span>
                  <span className="badge badge-ai text-[9px] px-2 py-0.5">Open Shift</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <Clock size={12} className="text-blue-500" /> Saturday, Nov 15 • 7:00 AM - 11:00 AM
                </div>
                <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                  <MapPin size={12} className="text-rose-500" /> Yamuna Ghat 21, Kashmere Gate
                </div>
              </div>
            </div>
          </div>

          {/* AI Skill Profile & Endorsements */}
          <div className="glass-card p-7 space-y-4 rounded-3xl border-purple-200 shadow-xl bg-purple-50/30">
            <div className="flex items-center justify-between border-b border-purple-200/80 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" /> AI Vector Profile
              </h3>
              <span className="badge badge-ai text-[10px]">94.8% Match Rate</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your verified skills, Sahayak's FastAPI embedding model recommends high-impact opportunities in Education & Healthcare.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {['Teaching & Mentoring', 'First Aid Response', 'Food Logistics', 'Python Analytics', 'Crowd Management'].map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-white text-indigo-700 border border-indigo-200 text-[11px] font-semibold shadow-xs">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

