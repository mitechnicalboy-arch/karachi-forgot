import React from 'react';
import { WasteReport, WasteStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Truck, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface WasteCardProps {
  waste: WasteReport;
}

export const WasteCard: React.FC<WasteCardProps> = ({ waste }) => {
  const { role, updateWasteStatus } = useApp();

  let densityColor = 'bg-blue-50 text-blue-800 border-blue-200';
  if (waste.densityLevel === 'Moderate') densityColor = 'bg-amber-50 text-amber-800 border-amber-200';
  else if (waste.densityLevel === 'Severe') densityColor = 'bg-orange-50 text-orange-900 border-orange-300';
  else if (waste.densityLevel === 'Critical Hotspot') densityColor = 'bg-rose-50 text-rose-900 border-rose-300';

  const workflowStages: WasteStatus[] = [
    'Reported',
    'Verified',
    'Assigned',
    'Collection Scheduled',
    'Action Completed',
    'Verified Resolution'
  ];

  const currentStageIndex = workflowStages.indexOf(waste.status);

  const handleAdvanceStatus = () => {
    if (currentStageIndex < workflowStages.length - 1) {
      const nextStatus = workflowStages[currentStageIndex + 1];
      const resImg = nextStatus === 'Action Completed' || nextStatus === 'Verified Resolution' 
        ? 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80'
        : undefined;
      updateWasteStatus(waste.id, nextStatus, resImg);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-mono font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded">
              {waste.id}
            </span>
            <span>·</span>
            <span>{waste.category}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><MapPin size={12} /> {waste.district}</span>
          </div>

          <StatusBadge status={waste.status} size="sm" />
        </div>

        {/* Location Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {waste.locationName}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {waste.description}
        </p>

        {/* Density & SLA pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className={`px-2 py-0.5 rounded border font-semibold text-[11px] ${densityColor}`}>
            Density: {waste.densityLevel}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Reported: {waste.reportedDate}
          </span>
          {waste.isOverdue && (
            <span className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              SLA Overdue
            </span>
          )}
        </div>

        {/* Image Evidence */}
        {waste.imageUrl && (
          <div className="h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-4 relative">
            <img 
              src={waste.imageUrl} 
              alt="Waste Evidence" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
              Field Report Photo
            </div>
          </div>
        )}

        {/* Resolution Image if completed */}
        {waste.resolutionImage && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-4 text-xs space-y-1.5">
            <span className="font-bold text-emerald-900 flex items-center gap-1 text-[11px]">
              <ShieldCheck size={14} className="text-[#0F5132]" />
              Collection Completed & Verified
            </span>
            <div className="h-24 rounded-lg overflow-hidden border border-emerald-300">
              <img src={waste.resolutionImage} alt="Resolved" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        )}

        {/* Municipal Fleet Assignment */}
        {waste.assignedVehicle && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2 mb-2">
            <Truck size={14} className="text-slate-500" />
            <span className="truncate">
              Dispatched: <strong>{waste.assignedVehicle}</strong> ({waste.assignedTeam})
            </span>
          </div>
        )}
      </div>

      {/* Workflow Stage Progress & Action Button */}
      <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>SSWMB Dispatch Flow:</span>
          <span className="font-semibold text-slate-800">{waste.status}</span>
        </div>

        {/* Officer/Supervisor Action to advance workflow */}
        {(role === 'officer' || role === 'supervisor' || role === 'admin') && currentStageIndex < workflowStages.length - 1 && (
          <button
            onClick={handleAdvanceStatus}
            className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Advance to "{workflowStages[currentStageIndex + 1]}" →
          </button>
        )}
      </div>
    </div>
  );
};
