import React, { useState } from 'react';
import { X, HeartHandshake, Building, CreditCard, HandHeart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
    phone: '',
    location: 'New Delhi',
    skills: '',
    ngoName: '',
    registrationNumber: '',
    category: 'Education',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          onClose();
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await register(formData);
        if (res.success) {
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative rounded-xl p-6 sm:p-8 space-y-5 border border-[var(--border-color)]">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-[var(--border-color)] mb-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {t('auth.signIn')}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {t('auth.createAccount')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div className="form-group">
              <label className="input-label">Select Stakeholder Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {[
                  { id: 'volunteer', label: 'Volunteer', icon: HeartHandshake },
                  { id: 'ngo', label: 'NGO Org', icon: Building },
                  { id: 'donor', label: 'Donor', icon: CreditCard },
                  { id: 'beneficiary', label: 'Beneficiary', icon: HandHeart },
                  { id: 'admin', label: 'Admin', icon: Shield }
                ].map(r => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-btn-secondary-hover)]'
                      }`}
                    >
                      <Icon size={15} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="input-field"
                required
              />
            </div>
          )}

          {/* Role specific register fields */}
          {mode === 'register' && formData.role === 'ngo' && (
            <>
              <div className="form-group">
                <label className="input-label">NGO Organization Name</label>
                <input
                  type="text"
                  name="ngoName"
                  value={formData.ngoName}
                  onChange={handleChange}
                  placeholder="Hope Foundation"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="input-label">Registration No.</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="REG-8890-DEL"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Primary Sector</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
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
              </div>
            </>
          )}

          {mode === 'register' && formData.role === 'volunteer' && (
            <div className="form-group">
              <label className="input-label">Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Teaching, Digital Literacy, Healthcare"
                className="input-field"
              />
            </div>
          )}

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-2.5 text-xs font-semibold rounded-lg mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

        </form>
      </div>
    </div>
  );
};
