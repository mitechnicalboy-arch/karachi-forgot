import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCard } from '../projects/ProjectCard';
import { ComplaintCard } from '../issues/ComplaintCard';
import { 
  PlusCircle, Trash2, MapPin, Bell, CheckCircle2, BookmarkCheck, 
  FolderKanban, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { 
    projects, 
    complaints, 
    followedAreas, 
    toggleFollowArea,
    setIsReportModalOpen, 
    setIsReportWasteModalOpen,
    setActiveTab,
    setSelectedProjectId
  } = useApp();

  const myComplaints = complaints.slice(0, 3);
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
            Citizen Civic Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, Citizen of Karachi
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Monitor public works in your neighborhood, submit verified complaints with photographic evidence, follow area civic alerts, and track municipal resolution.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle size={15} />
            <span>Report Civic Issue</span>
          </button>

          <button
            onClick={() => setIsReportWasteModalOpen(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Trash2 size={15} />
            <span>Report Waste Hotspot</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Monitored Projects
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {projects.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Across Karachi</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            My Submissions & Alerts
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            {myComplaints.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Under review / assigned</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolved with Proof
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-xs text-emerald-700 mt-1 block">Verified repair evidence</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Followed Areas
          </span>
          <span className="text-2xl font-extrabold text-purple-700 font-mono mt-1 block">
            {followedAreas.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Active notifications</span>
        </div>
      </div>

      {/* Followed Areas Watch Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck size={16} className="text-[#0F5132]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              My Area Watch Preferences
            </h3>
          </div>
          <button 
            onClick={() => setActiveTab('area')} 
            className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1"
          >
            <span>Manage All 7 Districts</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          You receive instant push alerts when new public projects or major civic issues are reported in followed districts:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {['Gulshan-e-Iqbal', 'Korangi', 'Clifton/Saddar', 'North Nazimabad', 'Malir'].map((area) => {
            const isSubscribed = followedAreas.includes(area);
            return (
              <button
                key={area}
                onClick={() => toggleFollowArea(area)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${
                  isSubscribed 
                    ? 'bg-emerald-50 text-[#0F5132] border-emerald-300 font-semibold' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{area}</span>
                <span className="text-[11px] font-bold">{isSubscribed ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Tracked Issues */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Tracked Complaints & Verified Resolutions
            </h2>
            <p className="text-xs text-slate-500">Live status progression through the civic verification pipeline.</p>
          </div>
          <button
            onClick={() => setActiveTab('issues')}
            className="text-xs font-bold text-[#0F5132] hover:underline"
          >
            View All Issues Tracker →
          </button>
        </div>

        {myComplaints.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Submissions Recorded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your citizen submission queue is currently clean. Have you spotted a road pothole, sewer burst, or damaged streetlight?
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-2 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <PlusCircle size={13} />
              <span>Report First Issue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myComplaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Infrastructure Projects Nearby */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Active Public Infrastructure in Karachi
            </h2>
            <p className="text-xs text-slate-500">Transparent budget, contractor, and progress disclosures.</p>
          </div>
          <button
            onClick={() => { setSelectedProjectId(null); setActiveTab('projects'); }}
            className="text-xs font-bold text-[#0F5132] hover:underline"
          >
            Explore All Projects →
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <FolderKanban size={32} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Active Projects Registered</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Public infrastructure works will be shown here once registered by authorized municipal authorities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
