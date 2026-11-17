import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, MapPin, Phone, Sparkles, Building2, Filter, Mail, Award, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ExploreNGOs = () => {
  const { t } = useLanguage();
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const SECTORS = ['All', 'Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Animal Care', 'Disaster Relief', 'Poverty Relief'];

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const res = await api.getNgos({ search, category: category === 'All' ? '' : category, status: 'verified' });
      if (res.success) {
        setNgos(res.ngos || []);
      }
    } catch (err) {
      console.error('Fetch NGOs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNgos();
  };

  return (
    <div className="container space-y-10 py-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge badge-verified px-5 py-1.5 text-xs"><Building2 size={14} /> {t('ngos.badge')}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] font-heading">{t('ngos.title')}</h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          {t('ngos.subtitle')}
        </p>
      </div>

      {/* Filter & Search Box */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-[var(--border-color)] rounded-3xl shadow-xl bg-[var(--bg-card)]">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={19} className="absolute left-4 top-3.5 text-[var(--text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ngos.searchPlaceholder')}
              className="input-field text-sm pl-11 pr-10 py-3 rounded-2xl w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchNgos(); }}
                className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full hover:bg-[var(--bg-card-hover)]"
              >
                ✕
              </button>
            )}
          </div>

          <button type="submit" className="btn btn-primary px-8 text-sm font-bold shadow-xl rounded-2xl">
            {t('ngos.searchButton')}
          </button>
        </form>

        {/* Sector Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-[var(--border-color)]">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
            <Filter size={14} /> {t('common.sector')}:
          </span>
          {SECTORS.map((sec) => {
            const isActive = (category === sec) || (sec === 'All' && !category);
            return (
              <button
                key={sec}
                onClick={() => setCategory(sec === 'All' ? '' : sec)}
                className={`filter-pill ${isActive ? 'active' : ''}`}
              >
                {sec === 'All' ? t('common.all') : sec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="text-center py-24 text-[var(--text-muted)] text-sm">
          <Sparkles className="w-8 h-8 animate-pulse mx-auto mb-3 text-indigo-600" />
          {t('common.loading')}
        </div>
      ) : ngos.length === 0 ? (
        <div className="glass-card p-14 text-center text-[var(--text-muted)] text-sm rounded-3xl">
          {t('ngos.noNgosFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ngos.map(ngo => (
            <div key={ngo._id} className="glass-card glass-card-hover p-7 flex flex-col sm:flex-row items-start gap-6 border border-[var(--border-color)] hover:border-indigo-300 rounded-3xl shadow-xl transition-all">
              <img 
                src={ngo.logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200'} 
                alt={ngo.ngoName} 
                className="w-24 h-24 rounded-2xl object-cover border border-[var(--border-color)] shrink-0 shadow-lg" 
              />
              <div className="space-y-4 flex-1 w-full">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2 font-heading">
                      {ngo.ngoName}
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    </h3>
                    <div className="text-xs font-mono text-indigo-600 mt-1">DARPAN Reg: {ngo.registrationNumber}</div>
                  </div>
                  <span className="badge badge-verified text-[10px] px-3 py-1">{ngo.category}</span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{ngo.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-rose-600" /> {ngo.city || ngo.address}</span>
                  {ngo.phone && <span className="flex items-center gap-1.5 font-medium"><Phone size={14} className="text-blue-600" /> {ngo.phone}</span>}
                  <span className="flex items-center gap-1.5 font-medium text-emerald-500"><Award size={14} /> 80G Compliant</span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
