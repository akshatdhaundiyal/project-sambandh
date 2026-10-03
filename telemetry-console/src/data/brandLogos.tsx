import React from 'react';

export interface BrandLogoProps {
  className?: string;
  size?: number;
}

// 🟢 Pine Labs Plural Official Logo
export const PineLabsLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#007A3D" />
    {/* Stylized P mark */}
    <path
      d="M9 7H18.5C21.5 7 24 9.5 24 12.5C24 15.5 21.5 18 18.5 18H14V25H9V7Z"
      fill="#FFFFFF"
    />
    <path
      d="M14 11H18C19.1 11 20 11.9 20 13C20 14.1 19.1 15 18 15H14V11Z"
      fill="#007A3D"
    />
    {/* Orange Plural Accent Dot */}
    <circle cx="23" cy="22" r="3" fill="#FF7900" />
  </svg>
);

// 🔴 Delhivery CMU Official Logistics Logo
export const DelhiveryLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#E41C38" />
    {/* Delhivery Express Box & Arrow Motif */}
    <path
      d="M7 11.5L16 6.5L25 11.5L16 16.5L7 11.5Z"
      fill="#FFFFFF"
      fillOpacity="0.95"
    />
    <path
      d="M7 13.5V20.5L15 25V18L7 13.5Z"
      fill="#FFFFFF"
      fillOpacity="0.75"
    />
    <path
      d="M17 18V25L25 20.5V13.5L17 18Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
    {/* Speed arrow inside */}
    <path
      d="M13 11L19 14.5L16 16L13 11Z"
      fill="#E41C38"
    />
  </svg>
);

// 🎙️ Gnani.ai Full-Duplex Indic Voice Telephony Rail Logo
export const GnaniLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="gnaniGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4338CA" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#gnaniGrad)" />
    {/* Concentric Full-Duplex Speech & Acoustic Waveform */}
    <circle cx="16" cy="16" r="12" stroke="#A5F3FC" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" />
    <path
      d="M7 16H9M11 11V21M15 7V25M19 10V22M23 13V19M25 16H27"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="15" cy="16" r="2.2" fill="#22D3EE" />
  </svg>
);

// 🩺 ABDM (Ayushman Bharat Digital Mission) Health Authority Logo
export const AbdmLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#0D9488" />
    {/* Healthcare Cross & Digital Bridge */}
    <rect x="13" y="7" width="6" height="18" rx="2" fill="#FFFFFF" />
    <rect x="7" y="13" width="18" height="6" rx="2" fill="#FFFFFF" />
    {/* Digital Health Pulse inside */}
    <circle cx="16" cy="16" r="2.5" fill="#0D9488" />
    {/* National Health Tricolor Accents */}
    <circle cx="8" cy="8" r="1.5" fill="#FF9933" />
    <circle cx="24" cy="24" r="1.5" fill="#138808" />
  </svg>
);

// ✈️ Telegram Care Receptor Official Logo
export const TelegramLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#24A1DE" />
    {/* Official Telegram Paper Airplane */}
    <path
      d="M7 15.5L23.5 9L19.5 24L14.5 19L11 21.5V17.5L20 12L10.5 16.5L7 15.5Z"
      fill="#FFFFFF"
    />
  </svg>
);

// 🧠 MedGemma 4B / Google DeepMind Clinical Emblem Logo
export const MedGemmaLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="url(#medgemma-grad)" />
    {/* DeepMind Gemma Geometric Clinical Star */}
    <path
      d="M16 6L18.8 12.2L25 15L18.8 17.8L16 24L13.2 17.8L7 15L13.2 12.2L16 6Z"
      fill="#FFFFFF"
    />
    <circle cx="16" cy="15" r="2.5" fill="#C084FC" />
    <defs>
      <linearGradient id="medgemma-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6D28D9" />
        <stop offset="1" stopColor="#4338CA" />
      </linearGradient>
    </defs>
  </svg>
);

// 📶 Reliance Jio PSTN Telephony Trunk Official Logo
export const JioLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#00579E" />
    {/* Jio Circle Emblem */}
    <circle cx="16" cy="16" r="10" fill="#E41C38" />
    <text
      x="16"
      y="19"
      textAnchor="middle"
      fontSize="9"
      fontFamily="sans-serif"
      fontWeight="900"
      fill="#FFFFFF"
      letterSpacing="-0.5"
    >
      Jio
    </text>
  </svg>
);

// 🚨 Acoustic Fraud Tripwire Security Logo
export const TripwireLogo: React.FC<BrandLogoProps> = ({ className = "w-5 h-5", size }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="32" height="32" rx="8" fill="#DC2626" />
    {/* Security Shield & Intercept Bolt */}
    <path
      d="M16 6L24 9.5V16C24 21 20.5 24.5 16 26C11.5 24.5 8 21 8 16V9.5L16 6Z"
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="#991B1B"
    />
    <path
      d="M17 11L13 17H18L14 22"
      stroke="#FDE047"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

