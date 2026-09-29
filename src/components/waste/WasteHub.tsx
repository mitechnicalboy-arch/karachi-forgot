import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCard } from './WasteCard';
import { WasteHotspotMap } from './WasteHotspotMap';
import { 
  Trash2, PlusCircle, Layers, CheckCircle2, AlertTriangle, 
  Truck, ShieldCheck, MapPin 
} from 'lucide-react';

export const WasteHub: React.FC = () => {
  const { wasteReports, setIsReportWasteModalOpen } = useApp();

  const [activeView, setActiveView] = useState<'cards' | 'hotspots'>('cards');

  const activeReports = wasteReports.length;
  const collectionPending = wasteReports.filter(w => w.status === 'Reported' || w.status === 'Verified' || w.status === 'Assigned' || w.status === 'Collection Scheduled').length;
  const resolvedCount = wasteReports.filter(w => w.status === 'Action Completed' || w.status === 'Verified Resolution').length;
  const criticalHotspots = wasteReports.filter(w => w.densityLevel === 'Critical Hotspot' || w.densityLevel === 'Severe').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-orange-800 uppercase tracking-wide">
              Smart Municipal Solid Waste Management
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-800 border border-orange-200 px-1.5 py-0.5 rounded font-medium">
              SSWMB Operational Fleet
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Karachi Solid Waste Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking neighborhood bins, roadside rubble, commercial illegal dumping, and municipal compactor sweeps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveView('cards')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeView === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dispatch Queue
            </button>
            <button
              onClick={() => setActiveView('hotspots')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeView === 'hotspots' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hotspot Density Map
            </button>
          </div>

          <button
            onClick={() => setIsReportWasteModalOpen(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Report Waste</span>
          </button>
        </div>
      </div>

      {/* 5 Required Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Waste Reports
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {activeReports}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">In 7 districts</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Collection Pending
          </span>
          <span className="text-2xl font-extrabold text-orange-600 font-mono mt-1 block">
            {collectionPending}
          </span>
          <span className="text-[11px] text-orange-700 mt-1 block">Scheduled for sweep</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Critical Hotspots
          </span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
            {criticalHotspots}
          </span>
          <span className="text-[11px] text-rose-700 mt-1 block">Severe accumulation</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolved Today
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">Cleaned & verified</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Deployment
          </span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono mt-1 block">
            18
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Compactor vehicles active</span>
        </div>
      </div>

      {/* Main Content View */}
      {activeView === 'hotspots' ? (
        <div className="space-y-4">
          <WasteHotspotMap />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Municipal Sweep & Collection Queue
            </h3>
            <span className="text-xs text-slate-500">
              {wasteReports.length} incidents logged
            </span>
          </div>

          {wasteReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <Trash2 size={36} className="mx-auto text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">No Waste Incidents Reported Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Clean municipal slate. Spot an overflowing dumpster, roadside debris, or missed municipal collection? Report it now.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setIsReportWasteModalOpen(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <PlusCircle size={14} />
                  <span>Report Waste Hotspot</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wasteReports.map((w) => (
                <WasteCard key={w.id} waste={w} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
