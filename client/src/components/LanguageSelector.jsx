import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = ({ compact = false, className = '' }) => {
  const { language, currentLanguageObj, availableLanguages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = availableLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 px-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] hover:bg-[var(--bg-btn-secondary-hover)] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm`}
        title="Change Language / भाषा बदलें"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="hidden sm:inline-block font-semibold">
          {currentLanguageObj.nativeName}
        </span>
        <span className="sm:hidden font-semibold uppercase text-[11px]">
          {currentLanguageObj.code}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 text-[var(--text-muted)] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 md:hidden" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-72 glass-card p-2.5 z-50 text-xs shadow-xl rounded-2xl border border-[var(--border-color)] space-y-2 animate-fadeIn bg-[var(--bg-card)]">
            
            {/* Header & Search */}
            <div className="pb-1.5 border-b border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-[11px] text-[var(--text-main)] flex items-center gap-1.5">
                  <Globe size={13} className="text-indigo-600" />
                  Select Language / भाषा चुनें
                </span>
                <span className="text-[10px] text-[var(--text-dim)] font-mono">
                  {availableLanguages.length} Languages
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-[var(--text-dim)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language..."
                  className="w-full text-xs pl-7 pr-3 py-1.5 rounded-lg bg-[var(--bg-btn-secondary)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Language Options List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredLanguages.length === 0 ? (
                <div className="text-center py-4 text-[var(--text-dim)] text-xs">
                  No matching language found
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'hover:bg-[var(--bg-btn-secondary)] text-[var(--text-main)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div>
                          <div className={`text-xs ${isSelected ? 'text-white' : 'text-[var(--text-main)]'}`}>
                            {lang.nativeName}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-[var(--text-dim)]'}`}>
                            {lang.name} {lang.dir === 'rtl' ? '• RTL' : ''}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check size={14} className="text-white shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

