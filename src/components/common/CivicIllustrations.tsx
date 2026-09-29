import React from 'react';

export const KarachiSkylineIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 800 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F1F5F9" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="roadGrad" x1="0" y1="280" x2="800" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A" />
        <stop offset="0.5" stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="emeraldBridge" x1="0" y1="240" x2="800" y2="240" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F5132" />
        <stop offset="0.5" stopColor="#16A34A" />
        <stop offset="1" stopColor="#0F5132" />
      </linearGradient>
    </defs>

    {/* Sky & Sun */}
    <rect width="800" height="360" rx="16" fill="url(#skyGrad)" />
    <circle cx="680" cy="90" r="48" fill="#FEF08A" opacity="0.4" />
    <circle cx="680" cy="90" r="32" fill="#FDE047" opacity="0.6" />

    {/* Distant Urban Silhouette */}
    <path d="M40 280V200H65V280H90V160H125V280H160V190H185V280H220V140H260V280H300V180H335V280H380V120H415V280H460V170H490V280H530V150H565V280H610V185H645V280H690V130H725V280H770V280" fill="#CBD5E1" opacity="0.7" />

    {/* Midground Civic & Port Architecture */}
    {/* Port Cranes (Keamari) */}
    <path d="M50 280L90 170H110L140 280" stroke="#94A3B8" strokeWidth="3" />
    <line x1="80" y1="170" x2="160" y2="170" stroke="#94A3B8" strokeWidth="4" />
    <line x1="160" y1="170" x2="160" y2="210" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

    {/* Modern Civic Towers & Clock Tower Tribute */}
    <rect x="230" y="110" width="46" height="170" rx="3" fill="#64748B" />
    <rect x="240" y="125" width="26" height="15" fill="#E2E8F0" />
    <line x1="253" y1="110" x2="253" y2="85" stroke="#475569" strokeWidth="2.5" />
    {/* Grid windows */}
    <g fill="#94A3B8" opacity="0.8">
      <rect x="236" y="150" width="8" height="6" />
      <rect x="248" y="150" width="8" height="6" />
      <rect x="260" y="150" width="8" height="6" />
      <rect x="236" y="165" width="8" height="6" />
      <rect x="248" y="165" width="8" height="6" />
      <rect x="260" y="165" width="8" height="6" />
      <rect x="236" y="180" width="8" height="6" />
      <rect x="248" y="180" width="8" height="6" />
      <rect x="260" y="180" width="8" height="6" />
      <rect x="236" y="195" width="8" height="6" />
      <rect x="248" y="195" width="8" height="6" />
      <rect x="260" y="195" width="8" height="6" />
      <rect x="236" y="210" width="8" height="6" />
      <rect x="248" y="210" width="8" height="6" />
      <rect x="260" y="210" width="8" height="6" />
    </g>

    <rect x="365" y="95" width="55" height="185" rx="3" fill="#475569" />
    <g fill="#CBD5E1">
      <rect x="375" y="110" width="10" height="8" />
      <rect x="395" y="110" width="10" height="8" />
      <rect x="375" y="125" width="10" height="8" />
      <rect x="395" y="125" width="10" height="8" />
      <rect x="375" y="140" width="10" height="8" />
      <rect x="395" y="140" width="10" height="8" />
      <rect x="375" y="155" width="10" height="8" />
      <rect x="395" y="155" width="10" height="8" />
      <rect x="375" y="170" width="10" height="8" />
      <rect x="395" y="170" width="10" height="8" />
      <rect x="375" y="185" width="10" height="8" />
      <rect x="395" y="185" width="10" height="8" />
    </g>

    <rect x="520" y="130" width="50" height="150" fill="#64748B" />
    <rect x="580" y="155" width="40" height="125" fill="#475569" />

    {/* Elevated Expressway Flyover (Karachi Flyover Iconography) */}
    <path d="M0 240C200 240 320 220 500 220C680 220 750 235 800 235" stroke="url(#emeraldBridge)" strokeWidth="12" strokeLinecap="round" />
    <path d="M0 244C200 244 320 224 500 224C680 224 750 239 800 239" stroke="#22C55E" strokeWidth="2" strokeDasharray="14 10" />

    {/* Flyover Support Columns */}
    <rect x="180" y="246" width="18" height="44" fill="#334155" rx="2" />
    <rect x="340" y="230" width="18" height="60" fill="#334155" rx="2" />
    <rect x="500" y="226" width="18" height="64" fill="#334155" rx="2" />
    <rect x="660" y="236" width="18" height="54" fill="#334155" rx="2" />

    {/* Ground Highway & Green Median */}
    <rect x="0" y="280" width="800" height="80" fill="url(#roadGrad)" />
    {/* Highway lane markings */}
    <line x1="0" y1="318" x2="800" y2="318" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="24 16" />

    {/* Green Landscaped Median with Trees */}
    <rect x="0" y="278" width="800" height="8" fill="#15803D" />
    <circle cx="120" cy="275" r="10" fill="#16A34A" />
    <circle cx="125" cy="272" r="8" fill="#22C55E" />
    <circle cx="280" cy="275" r="11" fill="#16A34A" />
    <circle cx="285" cy="270" r="9" fill="#22C55E" />
    <circle cx="440" cy="275" r="10" fill="#16A34A" />
    <circle cx="600" cy="275" r="12" fill="#16A34A" />
    <circle cx="740" cy="275" r="10" fill="#16A34A" />

    {/* Civic Vehicle Silhouette (SSWMB Green Truck / Transit) */}
    <g transform="translate(610, 290)">
      <rect x="0" y="6" width="46" height="22" rx="2" fill="#16A34A" />
      <rect x="36" y="10" width="18" height="18" rx="2" fill="#22C55E" />
      <rect x="42" y="12" width="10" height="8" rx="1" fill="#E2E8F0" />
      <circle cx="14" cy="28" r="5" fill="#0F172A" />
      <circle cx="44" cy="28" r="5" fill="#0F172A" />
      <circle cx="14" cy="28" r="2" fill="#94A3B8" />
      <circle cx="44" cy="28" r="2" fill="#94A3B8" />
    </g>

    {/* Inspection Pin / Verification Badge in Sky */}
    <g transform="translate(390, 48)">
      <circle cx="14" cy="14" r="18" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
      <circle cx="14" cy="14" r="14" fill="#0F5132" />
      <path d="M9 14L13 18L20 10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);
