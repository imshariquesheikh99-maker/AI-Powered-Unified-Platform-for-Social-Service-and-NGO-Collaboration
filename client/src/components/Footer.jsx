import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] pt-10 pb-8 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--border-color)]">
          
          {/* Brand Col */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white">
                <Heart size={14} fill="currentColor" />
              </div>
              <span className="text-base font-bold font-heading text-[var(--text-main)]">Sahayak<span className="text-indigo-600">.AI</span></span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* AI Microservices Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] mb-3 font-heading">{t('footer.aiCaps')}</h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>Vector Skill Matcher</li>
              <li>NLP Urgency Classification</li>
              <li>DARPAN Verification Engine</li>
              <li>Conversational Assistant</li>
            </ul>
          </div>

          {/* Supported Roles Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] mb-3 font-heading">{t('footer.roles')}</h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>Super Admin Governance</li>
              <li>Verified NGOs</li>
              <li>Community Volunteers</li>
              <li>Tax-Exempt Donors</li>
              <li>Aid Beneficiaries</li>
            </ul>
          </div>

          {/* Architecture Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] mb-3 font-heading">{t('footer.tech')}</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2.5">
              Built with React, Express REST, MongoDB, and Python FastAPI.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">React 18</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">Express</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">MongoDB</span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">FastAPI</span>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-3">
          <p>{t('footer.copyright')}</p>
          <p className="flex items-center gap-1">
            {t('footer.craftedWith')}
          </p>
        </div>
      </div>
    </footer>
  );
};
