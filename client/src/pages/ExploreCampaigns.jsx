import React, { useEffect, useState } from 'react';
import { Search, MapPin, Sparkles, Filter, Heart, Users, Target, HeartHandshake, X, CheckCircle, HandHeart } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CampaignImage } from '../components/CampaignImage';

export const ExploreCampaigns = ({ onDonate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedCampaigns, setAppliedCampaigns] = useState({});

  const CATEGORIES = ['All', 'Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Animal Care', 'Disaster Relief', 'Poverty Relief'];

  const fetchCampaigns = async (overrideSearch = search) => {
    setLoading(true);
    try {
      const res = await api.getCampaigns({
        search: overrideSearch,
        category: category === 'All' ? '' : category,
        status: 'active'
      });
      if (res.success) {
        setCampaigns(res.campaigns || []);
      }
    } catch (err) {
      console.error('Fetch campaigns error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchCampaigns('');
  };

  const handleApplyVolunteer = async (camp) => {
    if (!user) {
      alert('Please log in as a Volunteer to apply for this drive.');
      return;
    }
    setApplyingId(camp._id);
    try {
      const res = await api.applyVolunteer(
        camp._id,
        user.skills || ['General Support', 'Field Outreach'],
        'Interested in contributing to this drive.'
      );
      if (res.success) {
        setAppliedCampaigns(prev => ({ ...prev, [camp._id]: true }));
        alert(`Application submitted successfully to ${camp.ngo?.ngoName || 'the NGO'}!`);
      } else {
        alert(res.message || 'Application failed');
      }
    } catch (err) {
      alert('Failed to submit application');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="container space-y-10 py-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-ai px-5 py-1.5 text-xs"><HeartHandshake size={14} /> {t('campaigns.badge')}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] font-heading">{t('campaigns.title')}</h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          {t('campaigns.subtitle')}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-[var(--border-color)] rounded-3xl shadow-xl bg-[var(--bg-card)]">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={19} className="absolute left-4 top-3.5 text-[var(--text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('campaigns.searchPlaceholder')}
              className="input-field text-sm pl-11 pr-10 py-3 rounded-2xl w-full"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card-hover)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button type="submit" className="btn btn-primary px-8 text-sm font-bold shadow-xl rounded-2xl">
            {t('campaigns.searchButton')}
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-slate-200/80">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
            <Filter size={14} /> {t('common.sector')}:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = (category === cat) || (cat === 'All' && !category);
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`filter-pill ${isActive ? 'active' : ''}`}
              >
                {cat === 'All' ? t('common.all') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-500 text-sm">
          <Sparkles className="w-8 h-8 animate-pulse mx-auto mb-3 text-indigo-600" />
          {t('campaigns.fetching')}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-card p-14 text-center text-slate-500 text-sm rounded-3xl">
          {t('campaigns.noCampaignsFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
            const isApplied = appliedCampaigns[camp._id];

            return (
              <div key={camp._id} className="glass-card p-0 overflow-hidden flex flex-col justify-between group rounded-3xl border border-[var(--border-color)] hover:border-indigo-300 shadow-xl transition-all">
                
                {/* Image Overlay Header with Category Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-slate-50">
                  <CampaignImage
                    src={camp.imageUrl}
                    alt={camp.title}
                    category={camp.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute top-4 left-4 badge badge-verified bg-slate-50/90 backdrop-blur-md px-3.5 py-1 text-xs border border-emerald-200">
                    {camp.category}
                  </span>

                  {camp.isUrgent && (
                    <span className="absolute top-4 right-4 badge badge-urgent bg-rose-50 backdrop-blur-md px-3 py-1 text-xs border border-rose-500/40">
                      ⚡ Urgent Need
                    </span>
                  )}

                  {camp.location && !camp.isUrgent && (
                    <span className="absolute top-4 right-4 badge bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1 text-xs flex items-center gap-1 backdrop-blur-md">
                      <MapPin size={12} className="text-rose-600" /> {camp.location}
                    </span>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-7 flex-1 space-y-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-600 font-bold">{camp.ngo?.ngoName || 'Verified NGO Partner'}</span>
                      {camp.location && camp.isUrgent && (
                        <span className="text-[var(--text-muted)] flex items-center gap-1">
                          <MapPin size={11} className="text-rose-600" /> {camp.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] line-clamp-1 group-hover:text-indigo-600 transition-colors font-heading">{camp.title}</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{camp.description}</p>
                  </div>

                  {/* Skills tags */}
                  {camp.requiredSkills && camp.requiredSkills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Required Skills:</span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {camp.requiredSkills.map((sk, idx) => (
                          <span key={idx} className="bg-indigo-50/70 border border-indigo-200 text-indigo-600 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Funding Bar */}
                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{t('campaigns.raised')}: ₹{camp.raisedAmount.toLocaleString()}</span>
                      <span className="text-indigo-600 font-extrabold">{percent}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                      <span className="flex items-center gap-1"><Target size={12} /> {t('campaigns.target')}: ₹{camp.targetAmount.toLocaleString()}</span>
                      <span className="flex items-center gap-1 text-purple-600 font-semibold"><Users size={12} /> {camp.volunteersNeeded} {t('campaigns.volunteersNeeded')}</span>
                    </div>
                  </div>

                  {/* Supported Donation Modes Visual Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                      💳 80G Monetary
                    </span>
                    <span className="bg-amber-50 border border-amber-200 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      📦 In-Kind Goods
                    </span>
                    <span className="bg-purple-50 border border-purple-200 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                      🔄 Monthly SIP
                    </span>
                    <span className="bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                      ⚡ Web3 Crypto
                    </span>
                  </div>

                  {/* Dual Action Buttons: Donate & Volunteer */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => onDonate(camp)}
                      className="w-full btn btn-emerald py-3.5 text-xs font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                    >
                      <Heart size={15} /> {t('campaigns.donateNow')}
                    </button>

                    <button
                      onClick={() => handleApplyVolunteer(camp)}
                      disabled={applyingId === camp._id || isApplied}
                      className={`w-full py-2.5 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${
                        isApplied
                          ? 'bg-purple-50 border border-purple-500/40 text-purple-600 cursor-default'
                          : 'bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-purple-300 hover:bg-slate-100'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle size={14} className="text-purple-600" /> {t('campaigns.applied')}
                        </>
                      ) : applyingId === camp._id ? (
                        <>
                          <Sparkles size={14} className="animate-spin text-purple-600" /> {t('common.submitting')}
                        </>
                      ) : (
                        <>
                          <HandHeart size={14} className="text-purple-600" /> {t('campaigns.applyVolunteer')}
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
