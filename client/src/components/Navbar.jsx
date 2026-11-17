import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Heart, ChevronDown, ShieldCheck, Layers, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, theme, toggleTheme, onOpenAuth, onDonate }) => {
  const { user, logout, loginAsDemoRole } = useAuth();
  const { t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowRoleDropdown(false);
        setShowUserDropdown(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="badge badge-ai"><ShieldCheck size={12} /> {t('nav.admin')}</span>;
      case 'ngo': return <span className="badge badge-verified">{t('nav.ngo')}</span>;
      case 'volunteer': return <span className="badge badge-ai">{t('nav.volunteer')}</span>;
      case 'donor': return <span className="badge badge-verified">{t('nav.donor')}</span>;
      case 'beneficiary': return <span className="badge badge-urgent">{t('nav.beneficiary')}</span>;
      default: return null;
    }
  };

  return (
    <header className="glass-nav sticky top-0 z-50 py-3 border-b border-[var(--border-color)]">
      <div className="container flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-main)] font-heading">
                Sahayak<span className="text-indigo-600">.AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`btn text-xs px-3.5 py-1.5 font-medium transition-colors ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('nav.home')}
          </button>
          <button 
            onClick={() => setActiveTab('campaigns')}
            className={`btn text-xs px-3.5 py-1.5 font-medium transition-colors ${activeTab === 'campaigns' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('nav.campaigns')}
          </button>
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`btn text-xs px-3.5 py-1.5 font-medium transition-colors ${activeTab === 'ngos' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t('nav.ngos')}
          </button>
          
          {user && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`btn text-xs px-3.5 py-1.5 font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'dashboard' ? 'btn-emerald' : 'btn-secondary'}`}
            >
              <Layers size={13} /> {t('nav.dashboard')}
            </button>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Donate Button */}
          <button
            onClick={onDonate}
            className="btn btn-emerald text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5"
          >
            <Heart size={13} className="fill-current text-white" />
            <span>{t('nav.donate')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Theme Switcher Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] hover:bg-[var(--bg-btn-secondary-hover)] transition-colors flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button 
              onClick={() => { setShowRoleDropdown(!showRoleDropdown); setShowUserDropdown(false); }}
              className="btn btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5 font-medium"
            >
              <span>{t('nav.switchRole')}</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showRoleDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/20" 
                  onClick={() => setShowRoleDropdown(false)} 
                />

                <div className="absolute right-0 mt-2 w-72 glass-card p-2 z-50 text-xs shadow-lg rounded-xl space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-color)]">
                    {t('nav.selectRole')}
                  </div>

                  <div className="py-1 space-y-1">
                    {DEMO_USERS.map((demo) => {
                      const isActive = user?.email === demo.email;
                      return (
                        <button
                          key={demo.email}
                          onClick={async () => {
                            await loginAsDemoRole(demo.email);
                            setShowRoleDropdown(false);
                            setActiveTab('dashboard');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                            isActive 
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold' 
                              : 'hover:bg-[var(--bg-btn-secondary)] text-[var(--text-main)]'
                          }`}
                        >
                          <div>
                            <div className="text-xs">{demo.label}</div>
                            <div className="text-[10px] text-[var(--text-dim)]">{demo.email}</div>
                          </div>
                          {isActive && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded">{t('nav.active')}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => { setShowUserDropdown(!showUserDropdown); setShowRoleDropdown(false); }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--bg-btn-secondary)] transition-colors"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full object-cover border border-[var(--border-color)]"
                />
              </button>

              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserDropdown(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 glass-card p-3 z-50 text-xs shadow-lg rounded-xl space-y-2">
                    <div className="border-b border-[var(--border-color)] pb-2">
                      <div className="font-semibold text-[var(--text-main)] truncate">{user.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</div>
                      <div className="mt-1">{getRoleBadge(user.role)}</div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                        setActiveTab('home');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium flex items-center gap-2"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn btn-primary text-xs px-3.5 py-1.5 font-medium"
            >
              {t('nav.signIn')}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-main)]"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 space-y-2">
          <button 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[var(--bg-btn-secondary)]"
          >
            {t('nav.home')}
          </button>
          <button 
            onClick={() => { setActiveTab('campaigns'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[var(--bg-btn-secondary)]"
          >
            {t('nav.campaigns')}
          </button>
          <button 
            onClick={() => { setActiveTab('ngos'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[var(--bg-btn-secondary)]"
          >
            {t('nav.ngos')}
          </button>
          {user && (
            <button 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {t('nav.dashboard')}
            </button>
          )}
          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-medium">{t('nav.language')}:</span>
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
};
