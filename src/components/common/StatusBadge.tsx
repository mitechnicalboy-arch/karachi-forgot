import React from 'react';
import { ProjectStatus, ComplaintStatus, WasteStatus } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus | ComplaintStatus | WasteStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'Completed':
    case 'Resolved':
    case 'Verified Resolution':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-600';
      break;
    case 'In Progress':
    case 'Action In Progress':
    case 'Collection Scheduled':
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
      dotColor = 'bg-blue-600';
      break;
    case 'Delayed':
    case 'Overdue':
    case 'Escalated':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-600';
      break;
    case 'Approved':
    case 'Verified':
    case 'Assigned':
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
      dotColor = 'bg-teal-600';
      break;
    case 'Proposed':
    case 'Under Review':
    case 'Reported':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-600';
      break;
    case 'Procurement':
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-200';
      dotColor = 'bg-purple-600';
      break;
    case 'Under Maintenance':
      colorClasses = 'bg-cyan-50 text-cyan-800 border-cyan-200';
      dotColor = 'bg-cyan-600';
      break;
    case 'Rejected':
    case 'Insufficient Evidence':
      colorClasses = 'bg-stone-100 text-stone-700 border-stone-300';
      dotColor = 'bg-stone-500';
      break;
    case 'Duplicate':
      colorClasses = 'bg-orange-50 text-orange-800 border-orange-200';
      dotColor = 'bg-orange-600';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${sizeClasses} ${colorClasses} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
