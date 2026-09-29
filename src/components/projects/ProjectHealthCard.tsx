import React from 'react';
import { Project } from '../../types';
import { Clock, Calendar, CheckCircle2, AlertTriangle, FileText, AlertCircle } from 'lucide-react';

interface ProjectHealthCardProps {
  health: Project['health'];
  openIssuesCount: number;
  lastUpdated: string;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({ 
  health, 
  openIssuesCount, 
  lastUpdated 
}) => {
  // Timeline color
  let timelineColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (health.timelineStatus === 'Delayed') {
    timelineColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  // Freshness color
  let freshnessColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let freshnessText = `Updated ${health.daysSinceLastUpdate} days ago`;
  if (health.dataFreshness === 'Update Due') {
    freshnessColor = 'text-amber-700 bg-amber-50 border-amber-200';
    freshnessText = `Update Due (${health.daysSinceLastUpdate}d ago)`;
  } else if (health.dataFreshness === 'Update Overdue') {
    freshnessColor = 'text-rose-700 bg-rose-50 border-rose-200';
    freshnessText = `Update Overdue (${health.daysSinceLastUpdate}d ago)`;
  }

  // Documents status
  let docsColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (health.documentsStatus === 'Partially Verified') {
    docsColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (health.documentsStatus === 'Missing Documents') {
    docsColor = 'text-slate-700 bg-slate-100 border-slate-200';
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Calendar size={14} className="text-[#0F5132]" />
          Measurable Project Health
        </h4>
        <span className="text-[11px] text-slate-400 font-mono">
          Last record: {lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Timeline */}
        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${timelineColor}`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            Timeline
          </span>
          <span className="font-bold text-xs mt-1 flex items-center gap-1">
            {health.timelineStatus === 'Delayed' ? (
              <AlertTriangle size={13} />
            ) : (
              <CheckCircle2 size={13} />
            )}
            {health.timelineStatus}
          </span>
        </div>

        {/* Metric 2: Data Freshness */}
        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${freshnessColor}`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            Data Freshness
          </span>
          <span className="font-bold text-xs mt-1 flex items-center gap-1">
            <Clock size={13} />
            {freshnessText}
          </span>
        </div>

        {/* Metric 3: Documents */}
        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${docsColor}`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            Tender / Docs
          </span>
          <span className="font-bold text-xs mt-1 flex items-center gap-1 truncate">
            <FileText size={13} />
            {health.documentsStatus}
          </span>
        </div>

        {/* Metric 4: Open Issues */}
        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
          openIssuesCount > 0 ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
        }`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
            Open Issues
          </span>
          <span className="font-bold text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={13} />
            {openIssuesCount === 0 ? '0 Open' : `${openIssuesCount} Active Issues`}
          </span>
        </div>
      </div>
    </div>
  );
};
