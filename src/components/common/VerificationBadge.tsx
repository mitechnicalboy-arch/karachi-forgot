import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const iconSize = isSm ? 12 : 14;

  if (status === 'Verified') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded border bg-emerald-50 text-emerald-800 border-emerald-300 ${sizeClasses}`}>
        <CheckCircle2 size={iconSize} className="text-emerald-600 shrink-0" />
        <span>Verified</span>
      </span>
    );
  }

  if (status === 'Partially Verified') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded border bg-amber-50 text-amber-800 border-amber-300 ${sizeClasses}`}>
        <AlertTriangle size={iconSize} className="text-amber-600 shrink-0" />
        <span>Partially Verified</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded border bg-slate-100 text-slate-700 border-slate-300 ${sizeClasses}`}>
      <HelpCircle size={iconSize} className="text-slate-500 shrink-0" />
      <span>Unverified</span>
    </span>
  );
};

interface ReportVerificationIndicatorProps {
  isVerifiedFact: boolean;
  size?: 'sm' | 'md';
}

export const ReportVerificationIndicator: React.FC<ReportVerificationIndicatorProps> = ({ isVerifiedFact, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const iconSize = isSm ? 12 : 14;

  if (isVerifiedFact) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded border bg-emerald-50 text-emerald-800 border-emerald-300 ${sizeClasses}`}>
        <CheckCircle2 size={iconSize} className="text-emerald-600 shrink-0" />
        <span>Verified Issue</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded border bg-amber-50 text-amber-900 border-amber-300 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span>Citizen Report (Unverified)</span>
    </span>
  );
};
