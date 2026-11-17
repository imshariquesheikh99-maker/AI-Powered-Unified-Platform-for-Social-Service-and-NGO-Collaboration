import React, { useState, useEffect } from 'react';
import { 
  CreditCard, QrCode, Building2, ShieldCheck, CheckCircle2, Download, X, Lock, 
  Package, Repeat, Cpu, Briefcase, Gift, Truck, Copy, ExternalLink, Sparkles, 
  Clock, ArrowRight, Wallet, AlertCircle, Layers, Utensils, Shirt, Bed, ShoppingBag,
  Soup, Home, Zap, Heart, BookOpen, Stethoscope, Phone, Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CampaignImage } from './CampaignImage';

// Categories for In-Kind donations
const IN_KIND_CATEGORIES = [
  { 
    id: 'Food & Groceries', 
    label: 'Food, Rations & Meals', 
    icon: Soup, 
    desc: 'Rice, wheat flour, pulses, cooking oil, cooked meals, baby food & milk' 
  },
  { 
    id: 'Clothes & Footwear', 
    label: 'Clothes, Woolens & Footwear', 
    icon: Shirt, 
    desc: 'Daily wear clothes, kids wear, winter sweaters, blankets, quilts, shoes' 
  },
  { 
    id: 'Household Goods & Utensils', 
    label: 'Household Goods & Kitchen Utensils', 
    icon: Home, 
    desc: 'Cookware sets, pressure cookers, mattresses, bedsheets, water filters, fans, heaters, solar lamps' 
  },
  { 
    id: 'Books & Education', 
    label: 'Books & Educational Kits', 
    icon: BookOpen, 
    desc: 'School bags, textbooks, notebooks, geometry kits, stationery hampers' 
  },
  { 
    id: 'Medical & Healthcare', 
    label: 'Medical & Healthcare Supplies', 
    icon: Stethoscope, 
    desc: 'First aid kits, wheelchairs, crutches, OTC medicines, health monitors' 
  },
  { 
    id: 'Tech & Electronics', 
    label: 'Digital Gadgets & Solar Devices', 
    icon: Zap, 
    desc: 'Refurbished laptops, tablets, study lights, rechargeable torches' 
  }
];

// One-click quick presets for popular in-kind donations
const IN_KIND_PRESETS = [
  {
    chip: '🍲 50kg Dry Food Ration',
    category: 'Food & Groceries',
    item: '50kg Dry Ration Kit (Basmati Rice, Wheat Flour, Dal Pulses, Cooking Oil)',
    qty: 50,
    unit: 'kg',
    estValue: 2500,
    badge: 'Popular Food'
  },
  {
    chip: '🍱 100 Hot Cooked Meals',
    category: 'Food & Groceries',
    item: '100 Fresh Hot Nutritious Mid-Day Community Meals for Slum Children',
    qty: 100,
    unit: 'units',
    estValue: 3000,
    badge: 'Zero Hunger'
  },
  {
    chip: '🧥 25 Warm Blankets & Quilts',
    category: 'Clothes & Footwear',
    item: '25 Heavy Winter Warm Blankets & Thermal Quilts for Vulnerable Families',
    qty: 25,
    unit: 'units',
    estValue: 4000,
    badge: 'Winter Care'
  },
  {
    chip: '👕 30 Kids Clothing Sets',
    category: 'Clothes & Footwear',
    item: '30 Daily Wear Cotton Clothes Sets for Underprivileged Children',
    qty: 30,
    unit: 'pairs',
    estValue: 4500,
    badge: 'Apparel'
  },
  {
    chip: '🍳 Family Kitchen Utensils Set',
    category: 'Household Goods & Utensils',
    item: 'Complete Stainless Steel Kitchen Cookware Set (Pressure Cooker, Kadai, Plates, Bowls & Spoons)',
    qty: 2,
    unit: 'sets',
    estValue: 2400,
    badge: 'Household'
  },
  {
    chip: '🛏️ Mattress & Bedding Pack',
    category: 'Household Goods & Utensils',
    item: 'Cotton Bed Mattresses, Double Bedsheets, Pillows & Mosquito Nets',
    qty: 3,
    unit: 'sets',
    estValue: 3000,
    badge: 'Shelter Relief'
  },
  {
    chip: '🧼 Household Hygiene & Cleaning Pack',
    category: 'Household Goods & Utensils',
    item: 'Family Sanitation Pack (Detergents, Antiseptic Dettol, Soaps, Toothpaste, Sanitary Napkins)',
    qty: 5,
    unit: 'kits',
    estValue: 1500,
    badge: 'Sanitation'
  },
  {
    chip: '⚡ 4 Emergency Solar Lanterns',
    category: 'Household Goods & Utensils',
    item: 'Portable Rechargeable Solar Home Lanterns & Study Lights',
    qty: 4,
    unit: 'units',
    estValue: 2800,
    badge: 'Power Relief'
  },
  {
    chip: '🎒 15 Student School Bags & Books',
    category: 'Books & Education',
    item: '15 Waterproof School Backpacks with Notebooks, Pencil Boxes & Water Bottles',
    qty: 15,
    unit: 'kits',
    estValue: 3500,
    badge: 'Education'
  }
];

export const MockPaymentModal = ({ campaign, onClose, onSuccess }) => {
  const { t } = useLanguage();
  // Campaign selection state (in case launched globally without a specific card)
  const [selectedCampaign, setSelectedCampaign] = useState(
    campaign && typeof campaign === 'object' && campaign._id ? campaign : null
  );
  const [allCampaigns, setAllCampaigns] = useState([]);

  // Mode selection: 'monetary', 'in_kind', 'impact_kit', 'recurring', 'crypto', 'corporate_csr'
  const [donationType, setDonationType] = useState('monetary');

  // Monetary state
  const [amount, setAmount] = useState(1000);
  const [monetaryMethod, setMonetaryMethod] = useState('UPI'); // UPI, Card, NetBanking, DigitalWallet, PayPal_Forex
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showQrCode, setShowQrCode] = useState(true);

  // In-Kind state (Food, Clothes, Household Goods, etc.)
  const [inKindCategory, setInKindCategory] = useState('Food & Groceries');
  const [inKindItemName, setInKindItemName] = useState('50kg Dry Food Ration Pack (Rice, Dal, Flour & Oil)');
  const [inKindQty, setInKindQty] = useState(50);
  const [inKindUnit, setInKindUnit] = useState('kg');
  const [pickupMode, setPickupMode] = useState('InKind_Pickup'); // 'InKind_Pickup' or 'InKind_Dropoff'
  const [pickupAddress, setPickupAddress] = useState('Flat 402, Green Avenue, Vasant Kunj, New Delhi');
  const [pickupPhone, setPickupPhone] = useState('+91 98765 43210');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [inKindEstValue, setInKindEstValue] = useState(2500);

  // Recurring state
  const [recurringPlan, setRecurringPlan] = useState(1000);
  const [recurringFreq, setRecurringFreq] = useState('monthly');
  const [recurringDuration, setRecurringDuration] = useState(12);

  // Crypto state
  const [cryptoCurrency, setCryptoCurrency] = useState('MATIC');
  const [cryptoAmount, setCryptoAmount] = useState('50');
  const [cryptoNetwork, setCryptoNetwork] = useState('Polygon Mainnet (PoS)');
  const [walletConnected, setWalletConnected] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Corporate CSR state
  const [companyName, setCompanyName] = useState('TechVision Global Pvt Ltd');
  const [cinGstin, setCinGstin] = useState('07AABCT2345M1Z2');
  const [csrRegistrationNo, setCsrRegistrationNo] = useState('CSR00084920');
  const [matchingMultiplier, setMatchingMultiplier] = useState(2); // 1x or 2x
  const [corporateAmount, setCorporateAmount] = useState(50000);

  // Impact Kit state
  const [selectedKit, setSelectedKit] = useState({
    kitType: '10 Hot Mid-Day Meals',
    unitPrice: 500,
    count: 2
  });

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Fetch campaigns if not provided or to populate campaign selector
  useEffect(() => {
    const fetchCampaignList = async () => {
      try {
        const res = await api.getCampaigns({ status: 'active' });
        if (res.success && res.campaigns?.length > 0) {
          setAllCampaigns(res.campaigns);
          if (!selectedCampaign) {
            setSelectedCampaign(res.campaigns[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      }
    };
    fetchCampaignList();
  }, []);

  // Crypto conversion rate table
  const CRYPTO_RATES = {
    MATIC: 52,
    ETH: 265000,
    USDT: 86.5,
    BTC: 5800000
  };

  const calculateCryptoInr = () => {
    const rate = CRYPTO_RATES[cryptoCurrency] || 50;
    return Math.round((parseFloat(cryptoAmount) || 0) * rate);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText('0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Quick preset selector click
  const handleSelectPreset = (preset) => {
    setInKindCategory(preset.category);
    setInKindItemName(preset.item);
    setInKindQty(preset.qty);
    setInKindUnit(preset.unit);
    setInKindEstValue(preset.estValue);
  };

  const currentCamp = selectedCampaign || campaign || {};

  const handlePay = async (e) => {
    e.preventDefault();
    if (!currentCamp._id) {
      alert('Please select a campaign to support');
      return;
    }
    setLoading(true);

    try {
      let payload = {
        campaignId: currentCamp._id,
        donationType,
        isAnonymous
      };

      if (donationType === 'monetary') {
        payload.amount = Number(amount);
        payload.paymentMethod = monetaryMethod;
      } else if (donationType === 'in_kind') {
        payload.amount = Number(inKindEstValue);
        payload.paymentMethod = pickupMode;
        payload.inKindDetails = {
          itemCategory: inKindCategory,
          itemName: inKindItemName || `${inKindQty} ${inKindUnit} of ${inKindCategory} Supplies`,
          quantity: Number(inKindQty),
          unit: inKindUnit,
          pickupAddress: pickupMode === 'InKind_Pickup' ? `${pickupAddress} (Contact: ${pickupPhone})` : 'Self Drop-off at NGO Regional Center',
          pickupDate,
          estimatedValue: Number(inKindEstValue)
        };
      } else if (donationType === 'recurring') {
        payload.amount = Number(recurringPlan);
        payload.paymentMethod = 'UPI_Autopay';
        payload.recurringDetails = {
          frequency: recurringFreq,
          durationMonths: Number(recurringDuration)
        };
      } else if (donationType === 'crypto') {
        const inr = calculateCryptoInr();
        payload.amount = inr;
        payload.paymentMethod = `Crypto_${cryptoCurrency}`;
        payload.cryptoDetails = {
          network: cryptoNetwork,
          cryptoCurrency,
          cryptoAmount: parseFloat(cryptoAmount) || 1,
          walletAddress: '0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a'
        };
      } else if (donationType === 'corporate_csr') {
        payload.amount = Number(corporateAmount);
        payload.paymentMethod = 'Corporate_CSR_NEFT';
        payload.corporateDetails = {
          companyName,
          cinGstin,
          csrRegistrationNo,
          matchingGrantMultiplier: Number(matchingMultiplier),
          totalEffectiveImpactAmount: Number(corporateAmount) * Number(matchingMultiplier)
        };
      } else if (donationType === 'impact_kit') {
        const total = selectedKit.count * selectedKit.unitPrice;
        payload.amount = total;
        payload.paymentMethod = 'Kit_Sponsorship_UPI';
        payload.itemKit = {
          kitType: selectedKit.kitType,
          kitCount: selectedKit.count,
          unitPrice: selectedKit.unitPrice
        };
      }

      const res = await api.processDonation(payload);

      if (res.success) {
        setReceipt(res.receipt);
        if (onSuccess) onSuccess();
      } else {
        alert(res.message || 'Donation process failed');
      }
    } catch (error) {
      console.error('Payment modal error:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const DONATION_MODES = [
    { id: 'monetary', label: 'Monetary Online', icon: CreditCard, tag: 'Instant 80G Tax Exemption' },
    { id: 'in_kind', label: 'In-Kind Relief Goods', icon: Package, tag: 'Food, Clothes & Household Goods' },
    { id: 'impact_kit', label: 'Sponsor Relief Kits', icon: Gift, tag: 'Meals, Blankets & Utensils' },
    { id: 'recurring', label: 'Monthly Social SIP', icon: Repeat, tag: 'Sponsor a Child' },
    { id: 'crypto', label: 'Web3 & Crypto', icon: Cpu, tag: 'Polygon PoS Ledger' },
    { id: 'corporate_csr', label: 'Corporate CSR', icon: Briefcase, tag: '1:1 MCA Matching Grant' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content relative border-indigo-200 rounded-xl p-6 sm:p-10 space-y-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={24} />
        </button>

        {!receipt ? (
          <div>
            
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck size={16} /> Sahayak Multi-Mode Philanthropy Hub
            </div>

            {/* Campaign Selection Header with Thumbnail */}
            <div className="space-y-4 mb-6">
              {allCampaigns.length > 1 && (
                <div>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Selected Campaign to Support:</label>
                  <select
                    value={currentCamp._id || ''}
                    onChange={(e) => {
                      const found = allCampaigns.find(c => c._id === e.target.value);
                      if (found) setSelectedCampaign(found);
                    }}
                    className="select-field text-sm font-bold bg-slate-50 border-indigo-300 text-slate-900 rounded-xl py-2.5 w-full"
                  >
                    {allCampaigns.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.title} ({c.ngo?.ngoName || 'NGO'} • {c.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Campaign Visual Banner Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex gap-4 items-center">
                <div className="w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300 relative">
                  <CampaignImage
                    src={currentCamp.imageUrl}
                    alt={currentCamp.title}
                    category={currentCamp.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-verified text-[10px] px-2.5 py-0.5">
                      {currentCamp.category || 'Social Impact'}
                    </span>
                    <span className="text-xs text-indigo-600 font-bold truncate">
                      {currentCamp.ngo?.ngoName || 'Verified NGO Partner'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate font-heading">
                    {currentCamp.title || 'Support Community Drive'}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    {currentCamp.location && <span>📍 {currentCamp.location}</span>}
                    {currentCamp.targetAmount && (
                      <span className="text-emerald-600 font-semibold">
                        Goal: ₹{currentCamp.targetAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Mode Selector Tabs */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="input-label text-xs font-bold text-slate-700">Choose Your Contribution Channel</label>
                <span className="text-[11px] text-emerald-600 font-medium">✓ Money & In-Kind Goods Supported</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DONATION_MODES.map(mode => {
                  const Icon = mode.icon;
                  const isActive = donationType === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setDonationType(mode.id)}
                      className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-slate-900 border-indigo-400 shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-slate-900' : 'bg-slate-100 text-indigo-600'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate">{mode.label}</div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>{mode.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-6">
              
              {/* ============================================================== */}
              {/* MODE 1: MONETARY ONLINE (MONEY)                                */}
              {/* ============================================================== */}
              {donationType === 'monetary' && (
                <div className="space-y-6 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
                      <CreditCard size={16} /> Instant Monetary Giving (UPI, Card, NetBanking)
                    </div>
                    <span className="badge badge-verified text-[10px]"><ShieldCheck size={12} /> 100% Tax Deductible (80G)</span>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Select Contribution Amount (₹)</label>
                    <div className="grid grid-cols-4 gap-2.5 mb-3">
                      {[500, 1000, 2500, 5000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(val)}
                          className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            amount === val
                              ? 'bg-indigo-600 text-white border border-indigo-400 shadow-md'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-600'
                          }`}
                        >
                          ₹{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Custom Amount (₹)"
                      className="input-field text-sm"
                      min="10"
                      required
                    />
                  </div>

                  {/* Payment Channel Sub-Tabs */}
                  <div>
                    <label className="input-label mb-2 block">Choose Payment Method</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'UPI', label: 'UPI / QR', icon: QrCode, sub: 'GPay, PhonePe, Paytm' },
                        { id: 'Card', label: 'Card', icon: CreditCard, sub: 'Debit & Credit' },
                        { id: 'NetBanking', label: 'NetBanking', icon: Building2, sub: 'All Indian Banks' },
                        { id: 'DigitalWallet', label: 'Wallets', icon: Wallet, sub: 'Paytm, Amazon Pay' },
                      ].map(method => {
                        const Icon = method.icon;
                        const isMethodActive = monetaryMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setMonetaryMethod(method.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isMethodActive
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <Icon size={16} className={isMethodActive ? 'text-indigo-600' : 'text-slate-500'} />
                            <div className="text-xs font-bold mt-1 text-slate-900">{method.label}</div>
                            <div className="text-[10px] text-slate-500 truncate">{method.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* UPI QR Simulation */}
                  {monetaryMethod === 'UPI' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sahayak.ngo@icici&pn=SahayakAI&am=${amount}&cu=INR`} 
                          alt="UPI QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                          <QrCode size={14} className="text-indigo-600" /> Scan with Any UPI App
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Google Pay, PhonePe, Paytm, BHIM, CRED or WhatsApp Pay.
                        </p>
                        <div className="text-[11px] font-mono text-emerald-600 font-semibold">
                          UPI VPA: <span className="text-slate-900">sahayak.impact@icici</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* MODE 2: IN-KIND PHYSICAL GOODS (FOOD, CLOTHES, HOUSEHOLD GOODS) */}
              {/* ============================================================== */}
              {donationType === 'in_kind' && (
                <div className="space-y-6 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
                      <Package size={16} /> Donate Physical Goods, Rations & Relief Supplies
                    </div>
                    <span className="badge badge-warning text-[10px]"><Truck size={12} /> Doorstep NGO Pickup Included</span>
                  </div>

                  {/* Visual Category Selector */}
                  <div>
                    <label className="input-label mb-2 block">1. Select Goods Domain</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {IN_KIND_CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isCatSelected = inKindCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setInKindCategory(cat.id);
                              // Auto set sample item name if empty
                              if (cat.id === 'Food & Groceries') {
                                setInKindItemName('50kg Dry Food Ration Pack (Rice, Dal, Flour & Oil)');
                                setInKindUnit('kg');
                                setInKindQty(50);
                                setInKindEstValue(2500);
                              } else if (cat.id === 'Clothes & Footwear') {
                                setInKindItemName('25 Winter Warm Blankets & Thermal Sweaters');
                                setInKindUnit('units');
                                setInKindQty(25);
                                setInKindEstValue(4000);
                              } else if (cat.id === 'Household Goods & Utensils') {
                                setInKindItemName('Family Kitchen Stainless Cookware & Utensils Set');
                                setInKindUnit('sets');
                                setInKindQty(2);
                                setInKindEstValue(2400);
                              } else if (cat.id === 'Books & Education') {
                                setInKindItemName('15 Waterproof School Backpacks with Notebook Sets');
                                setInKindUnit('kits');
                                setInKindQty(15);
                                setInKindEstValue(3500);
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isCatSelected
                                ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-md'
                                : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={16} className={isCatSelected ? 'text-amber-600' : 'text-slate-500'} />
                              <div className="text-xs font-bold text-slate-900 truncate">{cat.label}</div>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">{cat.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* One-Click Quick Presets Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-600" /> Quick-Pick Popular Presets
                      </label>
                      <span className="text-[10px] text-slate-500">Click to auto-fill details</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {IN_KIND_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(p)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-amber-50 border border-slate-300 hover:border-amber-500/60 text-slate-700 hover:text-amber-600 transition-all flex items-center gap-1.5"
                        >
                          <span>{p.chip}</span>
                          <span className="text-[10px] text-emerald-600 font-mono">₹{p.estValue}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Description & Quantities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group sm:col-span-2">
                      <label className="input-label">Detailed Items Description</label>
                      <input
                        type="text"
                        value={inKindItemName}
                        onChange={(e) => setInKindItemName(e.target.value)}
                        placeholder="e.g. 50kg Basmati Rice, 20 Blankets, Stainless Steel Cookware Set"
                        className="input-field text-xs font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">Quantity & Unit</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={inKindQty}
                          onChange={(e) => setInKindQty(e.target.value)}
                          className="input-field text-xs w-28 shrink-0"
                          min="1"
                          required
                        />
                        <select
                          value={inKindUnit}
                          onChange={(e) => setInKindUnit(e.target.value)}
                          className="select-field text-xs flex-1"
                        >
                          <option value="kg">kg (Kilograms)</option>
                          <option value="units">units / pcs</option>
                          <option value="sets">sets (Cookware/Bedding)</option>
                          <option value="kits">kits / hampers</option>
                          <option value="boxes">boxes / cartons</option>
                          <option value="pairs">pairs (Clothes / Shoes)</option>
                          <option value="bags">bags / sacks (Grains)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Estimated Market Valuation (₹)</label>
                      <input
                        type="number"
                        value={inKindEstValue}
                        onChange={(e) => setInKindEstValue(e.target.value)}
                        className="input-field text-xs"
                        placeholder="For official 80G in-kind certificate"
                        required
                      />
                      <div className="text-[10px] text-slate-500 mt-1">Used for Section 80G in-kind valuation certificate</div>
                    </div>
                  </div>

                  {/* Logistics Delivery Option */}
                  <div className="form-group pt-2 border-t border-slate-200">
                    <label className="input-label">2. Logistics Pickup Option</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setPickupMode('InKind_Pickup')}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-bold text-left transition-all ${
                          pickupMode === 'InKind_Pickup'
                            ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-md'
                            : 'bg-slate-100 border-slate-300 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        <Truck size={22} className="shrink-0 text-amber-600" />
                        <div>
                          <div>Free Doorstep NGO Pickup Van</div>
                          <div className="text-[10px] text-slate-500 font-normal">Volunteer pickup vehicle arrives at your location</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPickupMode('InKind_Dropoff')}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-bold text-left transition-all ${
                          pickupMode === 'InKind_Dropoff'
                            ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-md'
                            : 'bg-slate-100 border-slate-300 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        <Building2 size={22} className="shrink-0 text-amber-600" />
                        <div>
                          <div>Self Drop-off at NGO Hub</div>
                          <div className="text-[10px] text-slate-500 font-normal">Deliver goods to {currentCamp.ngo?.ngoName || 'NGO'} local depot</div>
                        </div>
                      </button>
                    </div>

                    {pickupMode === 'InKind_Pickup' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">Pickup Address</label>
                          <input
                            type="text"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            className="input-field text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">Contact Phone</label>
                          <input
                            type="text"
                            value={pickupPhone}
                            onChange={(e) => setPickupPhone(e.target.value)}
                            className="input-field text-xs font-mono"
                            required
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">Preferred Pickup Date</label>
                          <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="input-field text-xs"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODE 3: SPONSOR DIRECT IMPACT KIT                              */}
              {/* ============================================================== */}
              {donationType === 'impact_kit' && (
                <div className="space-y-5 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
                    <Gift size={16} /> Sponsor Specific Tangible Impact Kits
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Know exactly where your contribution goes. Sponsor tangible food, clothes, utensils, educational, or healthcare packs for immediate field distribution.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { type: '10 Hot Mid-Day Meals', price: 500, desc: 'Hot nutritious meals cooked in community kitchen' },
                      { type: 'Warm Clothes & Blanket Kit', price: 800, desc: 'Winter woolen sweater, thermal inner & heavy fleece blanket' },
                      { type: 'Family Kitchen Cookware & Utensil Kit', price: 1500, desc: 'Stainless steel cooker, kadai, frying pan, plates & bowls' },
                      { type: 'Slum Student School Kit & Bag', price: 1200, desc: 'Waterproof backpack, textbooks, notebooks & geometry kit' },
                      { type: 'Household Bedding & Shelter Pack', price: 2000, desc: 'Cotton mattresses, double bedsheets, pillows & mosquito net' },
                      { type: 'Family Comprehensive Health Camp', price: 2500, desc: 'Doctor triage, blood testing, free antibiotics & vitamins' },
                    ].map(kit => (
                      <button
                        key={kit.type}
                        type="button"
                        onClick={() => setSelectedKit({ kitType: kit.type, unitPrice: kit.price, count: selectedKit.count || 1 })}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between gap-3 transition-all ${
                          selectedKit.kitType === kit.type
                            ? 'bg-pink-50 border-pink-500 text-slate-900 shadow-lg'
                            : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">{kit.type}</div>
                          <div className="text-xs text-slate-500 mt-1">{kit.desc}</div>
                        </div>
                        <div className="text-lg font-extrabold text-pink-300">
                          ₹{kit.price.toLocaleString()} <span className="text-xs text-slate-500 font-normal">per kit</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 border border-slate-300">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Number of Kits to Sponsor</div>
                      <div className="text-[11px] text-slate-500">Total: ₹{(selectedKit.count * selectedKit.unitPrice).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedKit(prev => ({ ...prev, count: Math.max(1, prev.count - 1) }))}
                        className="w-8 h-8 rounded-lg bg-slate-200 text-slate-900 font-bold flex items-center justify-center hover:bg-slate-600"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-lg text-slate-900 w-6 text-center">{selectedKit.count}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedKit(prev => ({ ...prev, count: prev.count + 1 }))}
                        className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center hover:bg-indigo-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODE 4: RECURRING MONTHLY SIP                                  */}
              {/* ============================================================== */}
              {donationType === 'recurring' && (
                <div className="space-y-5 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                    <Repeat size={16} /> Automated Monthly Social SIP / Giving Mandate
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Build sustained long-term impact. Automate a monthly sponsorship to fund orphan nutrition, child education, or animal shelters.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { amount: 500, title: 'Nourish a Child', impact: '30 Hot Mid-Day Meals' },
                      { amount: 1000, title: 'Educate a Student', impact: 'Tuition + Books + Uniform' },
                      { amount: 2500, title: 'Elderly Care', impact: 'Monthly Diagnostics & Meds' },
                    ].map(plan => (
                      <button
                        key={plan.amount}
                        type="button"
                        onClick={() => setRecurringPlan(plan.amount)}
                        className={`p-4 rounded-lg border text-left flex flex-col justify-between gap-3 transition-all ${
                          recurringPlan === plan.amount
                            ? 'bg-purple-50 border-purple-500 text-slate-900 shadow-lg'
                            : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-purple-600">{plan.title}</div>
                          <div className="text-xl font-extrabold text-slate-900 mt-1">₹{plan.amount}<span className="text-xs text-slate-500 font-normal">/mo</span></div>
                        </div>
                        <div className="text-[11px] text-slate-500">{plan.impact}</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Commitment Duration</label>
                      <select
                        value={recurringDuration}
                        onChange={(e) => setRecurringDuration(e.target.value)}
                        className="select-field text-xs"
                      >
                        <option value="3">3 Months (Trial SIP)</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months (Recommended)</option>
                        <option value="24">24 Months (Full Sponsor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="input-label">Autopay Channel</label>
                      <select className="select-field text-xs">
                        <option>UPI Autopay (GPay / PhonePe / Paytm)</option>
                        <option>Debit / Credit Card e-Mandate</option>
                        <option>e-NACH NetBanking Mandate</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-500/30 text-xs text-purple-200">
                    ✓ You can pause, modify, or cancel your monthly pledge anytime directly from your Donor Workspace.
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODE 5: CRYPTO & WEB3 BLOCKCHAIN                               */}
              {/* ============================================================== */}
              {donationType === 'crypto' && (
                <div className="space-y-5 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold">
                      <Cpu size={16} /> Polygon & Ethereum Web3 Philanthropy Ledger
                    </div>
                    <span className="badge badge-ai text-[10px]">On-Chain Proof</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { coin: 'MATIC', name: 'Polygon', net: 'Polygon Mainnet' },
                      { coin: 'ETH', name: 'Ethereum', net: 'Ethereum Mainnet' },
                      { coin: 'USDT', name: 'Tether USD', net: 'Polygon (PoS)' },
                      { coin: 'BTC', name: 'Bitcoin', net: 'Bitcoin Lightning' },
                    ].map(c => (
                      <button
                        key={c.coin}
                        type="button"
                        onClick={() => {
                          setCryptoCurrency(c.coin);
                          setCryptoNetwork(c.net);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                          cryptoCurrency === c.coin
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-300 shadow-md'
                            : 'bg-slate-100 border-slate-300 text-slate-500 hover:border-slate-600'
                        }`}
                      >
                        <span className="font-extrabold text-sm">{c.coin}</span>
                        <span className="text-[10px] text-slate-500">{c.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Crypto Token Amount</label>
                      <input
                        type="number"
                        step="any"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="Amount"
                        className="input-field text-sm"
                        required
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 flex flex-col justify-center">
                      <div className="text-[11px] text-slate-500">Equivalent INR Valuation</div>
                      <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                        ≈ ₹{calculateCryptoInr().toLocaleString()}
                      </div>
                      <div className="text-[10px] text-cyan-600">Rate: 1 {cryptoCurrency} ≈ ₹{CRYPTO_RATES[cryptoCurrency]?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>NGO Verified Multisig Vault ({cryptoNetwork})</span>
                      <button
                        type="button"
                        onClick={handleCopyWallet}
                        className="text-cyan-600 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                      >
                        <Copy size={12} /> {copiedAddress ? 'Copied!' : 'Copy Address'}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-slate-700 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      0x71C2B9a528eE62D0b484556F5Fa6Ce61726EB49a
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50/30 border border-cyan-500/30 text-xs">
                    <span className="text-slate-700">
                      Web3 Wallet: <span className="font-semibold text-slate-900">{walletConnected ? 'MetaMask (Connected: 0x3F2...8aB9)' : 'Not Connected'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setWalletConnected(!walletConnected)}
                      className={`btn btn-sm px-3 py-1.5 text-xs rounded-lg ${walletConnected ? 'btn-secondary text-rose-400' : 'btn-primary'}`}
                    >
                      {walletConnected ? 'Disconnect' : 'Connect MetaMask'}
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* MODE 6: CORPORATE CSR GRANT & MATCHING                         */}
              {/* ============================================================== */}
              {donationType === 'corporate_csr' && (
                <div className="space-y-5 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                    <Briefcase size={16} /> Corporate Social Responsibility & 1:1 Matching Grant
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Enterprises can contribute CSR budgets with MCA Form CSR-1 compliance and offer employee matching grants.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Enterprise / Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="input-field text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">CIN / GSTIN Number</label>
                      <input
                        type="text"
                        value={cinGstin}
                        onChange={(e) => setCinGstin(e.target.value)}
                        className="input-field text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">CSR Registration No (Form CSR-1)</label>
                      <input
                        type="text"
                        value={csrRegistrationNo}
                        onChange={(e) => setCsrRegistrationNo(e.target.value)}
                        className="input-field text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Corporate Matching Multiplier</label>
                      <select
                        value={matchingMultiplier}
                        onChange={(e) => setMatchingMultiplier(Number(e.target.value))}
                        className="select-field text-xs"
                      >
                        <option value="1">1x (Standard Direct Corporate Grant)</option>
                        <option value="2">2x (1:1 Matching Grant - Impact Doubled!)</option>
                        <option value="3">3x (2:1 Corporate Anchor Multiplier)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Corporate Pledge Capital (₹)</label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[25000, 50000, 100000, 250000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCorporateAmount(val)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            corporateAmount === val
                              ? 'bg-emerald-600 text-slate-900'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          ₹{(val / 1000)}k
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={corporateAmount}
                      onChange={(e) => setCorporateAmount(e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                  </div>

                  {matchingMultiplier > 1 && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-300">
                      🚀 <strong>Matching Grant Active:</strong> Your corporate pledge of ₹{Number(corporateAmount).toLocaleString()} is matched {matchingMultiplier}x, deploying a total of <strong>₹{(corporateAmount * matchingMultiplier).toLocaleString()}</strong> in effective social impact capital!
                    </div>
                  )}
                </div>
              )}

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="anonymousCheck" className="text-xs sm:text-sm text-slate-700 font-medium cursor-pointer">
                  Make this contribution anonymous on public donor ledger
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-emerald py-4 rounded-lg flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold shadow-xl transition-all"
              >
                {loading ? (
                  <span>Processing Philanthropic Contribution...</span>
                ) : (
                  <>
                    <Lock size={18} /> Confirm {donationType.replace('_', ' ').toUpperCase()} Contribution & Generate Certificate
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* RICH TAILORED RECEIPT / CERTIFICATE SCREEN                     */
          /* ============================================================== */
          <div className="text-center py-2 space-y-6">
            <div className="w-18 h-18 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200 shadow-lg">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Contribution Successful!</h3>
              <p className="text-xs sm:text-sm text-slate-700">
                {receipt.impactSummaryText || 'Thank you for empowering social service with Sahayak AI Platform.'}
              </p>
            </div>

            {/* Certificate Card */}
            <div className="glass-card p-6 sm:p-7 text-left space-y-3.5 text-xs sm:text-sm border-slate-200 bg-slate-50 rounded-lg shadow-xl">
              
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">Contribution Type:</span>
                <span className="badge badge-verified text-xs capitalize">
                  {receipt.donationType?.replace('_', ' ')} ({receipt.paymentMethod})
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span className="text-slate-500">Official Certificate / Receipt No:</span>
                <span className="font-mono text-emerald-600 font-bold">{receipt.receiptNumber}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span className="text-slate-500">Internal Reference ID:</span>
                <span className="font-mono text-slate-700">{receipt.transactionId}</span>
              </div>

              {receipt.blockchainTxHash && (
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-slate-500">Polygon Blockchain Hash:</span>
                  <span className="font-mono text-[11px] text-cyan-600 truncate max-w-[200px] sm:max-w-xs">
                    {receipt.blockchainTxHash}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span className="text-slate-500">Donor / Contributor:</span>
                <span className="font-semibold text-slate-900">{receipt.donorName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span className="text-slate-500">Verified NGO Partner:</span>
                <span className="font-semibold text-slate-900">{receipt.ngoName}</span>
              </div>

              {receipt.inKindDetails && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-200 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-600">
                    <Truck size={15} /> In-Kind Physical Goods Scheduled for Doorstep Pickup:
                  </div>
                  <div>Category: <span className="font-semibold text-slate-900">{receipt.inKindDetails.itemCategory || 'Relief Goods'}</span></div>
                  <div>Item Details: <span className="font-semibold text-slate-900">{receipt.inKindDetails.quantity} {receipt.inKindDetails.unit}</span> of {receipt.inKindDetails.itemName}</div>
                  <div>Logistics Address: <span className="font-semibold text-slate-900">{receipt.inKindDetails.pickupAddress}</span></div>
                  <div>Scheduled Pickup: <span className="font-semibold text-slate-900">{receipt.inKindDetails.pickupDate}</span></div>
                  <div className="text-[11px] text-amber-600 font-mono font-bold pt-1">
                    Logistics Tracking Code: LGT-{Date.now().toString().slice(-6)} • Status: <span className="text-emerald-600 uppercase">Volunteer Vehicle Scheduled</span>
                  </div>
                </div>
              )}

              {receipt.recurringDetails && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><Repeat size={14} /> Monthly SIP Mandate Active:</div>
                  <div>Frequency: {receipt.recurringDetails.frequency} for {receipt.recurringDetails.durationMonths} months</div>
                  <div>Mandate ID: {receipt.recurringDetails.mandateId}</div>
                </div>
              )}

              {receipt.cryptoDetails && (
                <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-500/30 text-xs text-cyan-200 space-y-1 font-mono">
                  <div className="font-bold font-sans flex items-center gap-1.5"><Cpu size={14} /> On-Chain Web3 Ledger Entry:</div>
                  <div>Network: {receipt.cryptoDetails.network}</div>
                  <div>Token: {receipt.cryptoDetails.cryptoAmount} {receipt.cryptoDetails.cryptoCurrency}</div>
                  <div>Block: #{receipt.cryptoDetails.blockNumber}</div>
                </div>
              )}

              {receipt.corporateDetails && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5"><Briefcase size={14} /> Corporate CSR Compliance Record:</div>
                  <div>Company: {receipt.corporateDetails.companyName} (CIN/GST: {receipt.corporateDetails.cinGstin})</div>
                  <div>CSR Form: {receipt.corporateDetails.csrRegistrationNo} ({receipt.corporateDetails.matchingGrantMultiplier}x Match)</div>
                </div>
              )}

              <div className="flex justify-between border-b border-slate-200 pb-2.5">
                <span className="text-slate-500">Total Effective Impact Valuation:</span>
                <span className="text-lg font-extrabold text-emerald-600">₹{receipt.amount?.toLocaleString()}</span>
              </div>

              <div className="text-xs text-emerald-600 pt-1 italic font-medium">
                ✓ {receipt.taxExemptionText}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="btn btn-secondary flex-1 text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download Official Certificate
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary flex-1 text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md"
              >
                Return to Workspace
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
