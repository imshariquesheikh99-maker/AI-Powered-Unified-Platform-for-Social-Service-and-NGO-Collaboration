import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SahayakAIChatbot } from './components/SahayakAIChatbot';
import { MockPaymentModal } from './components/MockPaymentModal';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { BeneficiaryDashboard } from './pages/BeneficiaryDashboard';
import { ExploreCampaigns } from './pages/ExploreCampaigns';
import { ExploreNGOs } from './pages/ExploreNGOs';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sahayak_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sahayak_theme', theme);
  }, [theme]);
  
  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPaymentCampaign, setSelectedPaymentCampaign] = useState(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const handleOpenDonate = (campaign) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPaymentCampaign(campaign || true);
  };

  // Render role dashboard depending on user role
  const renderDashboardByRole = () => {
    if (!user) return <Home onOpenAuth={() => setShowAuthModal(true)} onDonate={handleOpenDonate} onExploreCampaigns={() => setActiveTab('campaigns')} onExploreNGOs={() => setActiveTab('ngos')} />;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'ngo':
        return <NGODashboard />;
      case 'volunteer':
        return <VolunteerDashboard onExploreCampaigns={() => setActiveTab('campaigns')} />;
      case 'donor':
        return <DonorDashboard onDonate={handleOpenDonate} />;
      case 'beneficiary':
        return <BeneficiaryDashboard />;
      default:
        return <Home onOpenAuth={() => setShowAuthModal(true)} onDonate={handleOpenDonate} onExploreCampaigns={() => setActiveTab('campaigns')} onExploreNGOs={() => setActiveTab('ngos')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAuth={() => setShowAuthModal(true)}
        onDonate={() => handleOpenDonate(null)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home 
            onOpenAuth={() => setShowAuthModal(true)}
            onDonate={handleOpenDonate}
            onExploreCampaigns={() => setActiveTab('campaigns')}
            onExploreNGOs={() => setActiveTab('ngos')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && renderDashboardByRole()}

        {activeTab === 'campaigns' && (
          <ExploreCampaigns onDonate={handleOpenDonate} />
        )}

        {activeTab === 'ngos' && (
          <ExploreNGOs />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chatbot Widget */}
      <SahayakAIChatbot />

      {/* Payment Gateway Modal */}
      {selectedPaymentCampaign && (
        <MockPaymentModal 
          campaign={typeof selectedPaymentCampaign === 'object' ? selectedPaymentCampaign : null}
          onClose={() => setSelectedPaymentCampaign(null)}
          onSuccess={() => {
            // refresh data
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
