import React, { useState } from 'react';

export const CATEGORY_FALLBACK_IMAGES = {
  'Education': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  'Healthcare': 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
  'Environment': 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&q=80&w=800',
  'Women Empowerment': 'https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=800',
  'Animal Care': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800',
  'Disaster Relief': 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
  'Poverty Relief': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&q=80&w=800',
  'General': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
};

const SVG_OFFLINE_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="800" height="450" fill="url(%23g)"/><circle cx="400" cy="180" r="50" fill="%236366f1" opacity="0.35"/><text x="400" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="%23e2e8f0" text-anchor="middle">Sahayak AI Social Drive</text><text x="400" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="%2394a3b8" text-anchor="middle">Verified Impact Initiative</text></svg>`;

export const CampaignImage = ({
  src,
  alt = 'Campaign Thumbnail',
  category = 'General',
  className = 'w-full h-full object-cover',
  loading = 'lazy'
}) => {
  const defaultImg = CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES['General'];
  const [imgSrc, setImgSrc] = useState(src && src.trim() ? src.trim() : defaultImg);
  const [errorStage, setErrorStage] = useState(0);

  const handleError = () => {
    if (errorStage === 0) {
      setErrorStage(1);
      setImgSrc(defaultImg);
    } else if (errorStage === 1) {
      setErrorStage(2);
      setImgSrc(SVG_OFFLINE_FALLBACK);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={className}
    />
  );
};
