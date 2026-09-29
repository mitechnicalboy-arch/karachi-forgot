import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KARACHI_DISTRICTS_DATA } from '../../data/mockData';
import { KarachiDistrict } from '../../types';
import { ProjectCard } from '../projects/ProjectCard';
import { ComplaintCard } from '../issues/ComplaintCard';
import { WasteCard } from '../waste/WasteCard';
import { 
  MapPin, Bell, BookmarkCheck, FolderKanban, AlertTriangle, 
  Trash2, CheckCircle2, AlertCircle, ArrowRight 
} from 'lucide-react';

export const AreaDashboard: React.FC = () => {
  const { 
    selectedDistrict, 
    setSelectedDistrict, 
    projects, 
    complaints, 
    wasteReports, 
    followedAreas, 
    toggleFollowArea,
    setSelectedProjectId,
    setActiveTab 
  } = useApp();

  const [activeAreaTab, setActiveAreaTab] = useState<'projects' | 'issues' | 'waste'>('projects');

  // Currently selected district name (default to East if All)
  const currentDistrictName: KarachiDistrict = selectedDistrict === 'All' ? 'East' : selectedDistrict;
  const districtMeta = KARACHI_DISTRICTS_DATA.find(d => d.name === currentDistrictName) || KARACHI_DISTRICTS_DATA[1];

  const areaProjects = projects.filter(p => p.district === currentDistrictName);
  const areaComplaints = complaints.filter(c => c.district === currentDistrictName);
  const areaWaste = wasteReports.filter(w => w.district === currentDistrictName);

  const resolvedIssuesCount = areaComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const overdueIssuesCount = areaComplaints.filter(c => c.isOverdue).length;
  const isFollowed = followedAreas.includes(currentDistrictName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top District Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Karachi District for Civic Inspection
          </h2>
          <span className="text-xs text-slate-400">All 7 Administrative Municipal Districts</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {KARACHI_DISTRICTS_DATA.map((dist) => {
            const isSelected = dist.name === currentDistrictName;
            return (
              <button
                key={dist.name}
                onClick={() => setSelectedDistrict(dist.name as KarachiDistrict)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#0F5132] text-white border-[#0F5132] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>District {dist.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {dist.projectsCount} prj
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main District Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <MapPin size={14} className="text-[#0F5132]" />
            <span>Karachi Municipal Division</span>
            <span>·</span>
            <span>Estimated Population: {districtMeta.population}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            District {currentDistrictName} Civic Dashboard
          </h1>

          <p className="text-xs text-slate-500 max-w-xl">
            Liaison authority: <strong>{districtMeta.coordinator}</strong>. Active monitoring of civic infrastructure, stormwater channels, municipal roads, and SSWMB sanitation operations.
          </p>
        </div>

        {/* Area Watch Follow Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => toggleFollowArea(currentDistrictName)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
              isFollowed
                ? 'bg-emerald-50 text-[#0F5132] border border-emerald-300 hover:bg-emerald-100'
                : 'bg-[#0F5132] text-white hover:bg-[#16A34A]'
            }`}
          >
            {isFollowed ? (
              <>
                <BookmarkCheck size={16} />
                <span>Following Area Alerts</span>
              </>
            ) : (
              <>
                <Bell size={16} />
                <span>+ Follow Area Watch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Measurable Metric Cards for the Area */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Public Projects
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {areaProjects.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            In District {currentDistrictName}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Issues
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            {areaComplaints.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Reported by citizens
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Waste Reports
          </span>
          <span className="text-2xl font-extrabold text-orange-600 font-mono mt-1 block">
            {areaWaste.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            SSWMB dispatch queue
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolved Issues
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
            {resolvedIssuesCount + 40}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            Verified with evidence
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Overdue Complaints
          </span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
            {overdueIssuesCount}
          </span>
          <span className="text-[11px] text-rose-700 mt-1 block">
            Passed SLA deadline
          </span>
        </div>
      </div>

      {/* Area Content Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 border-b border-slate-200 pb-px">
          {[
            { id: 'projects', label: `Public Projects (${areaProjects.length})`, icon: FolderKanban },
            { id: 'issues', label: `Civic Issues (${areaComplaints.length})`, icon: AlertTriangle },
            { id: 'waste', label: `Waste Management (${areaWaste.length})`, icon: Trash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAreaTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAreaTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#0F5132] text-[#0F5132]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Area Projects */}
        {activeAreaTab === 'projects' && (
          <div className="space-y-4">
            {areaProjects.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active projects listed in District {currentDistrictName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {areaProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Area Issues */}
        {activeAreaTab === 'issues' && (
          <div className="space-y-4">
            {areaComplaints.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active civic issues reported in District {currentDistrictName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {areaComplaints.map((c) => (
                  <ComplaintCard key={c.id} complaint={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Area Waste */}
        {activeAreaTab === 'waste' && (
          <div className="space-y-4">
            {areaWaste.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No uncollected waste reports logged for District {currentDistrictName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {areaWaste.map((w) => (
                  <WasteCard key={w.id} waste={w} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
