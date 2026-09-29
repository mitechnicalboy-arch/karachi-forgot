import React from 'react';
import { useApp } from '../../context/AppContext';
import { KARACHI_DISTRICTS_DATA } from '../../data/mockData';
import { BarChart3, PieChart, Activity, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { projects, complaints, wasteReports } = useApp();

  // 1. Projects by Category
  const categoryCounts: Record<string, number> = {};
  projects.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // 2. Projects by Status
  const statusCounts: Record<string, number> = {};
  projects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  // 3. Complaints by Category
  const complaintCatCounts: Record<string, number> = {};
  complaints.forEach(c => {
    complaintCatCounts[c.category] = (complaintCatCounts[c.category] || 0) + 1;
  });

  // 4. Data Freshness metrics
  const recentlyUpdated = projects.filter(p => p.health.dataFreshness === 'Recently Updated').length;
  const updateDue = projects.filter(p => p.health.dataFreshness === 'Update Due').length;
  const updateOverdue = projects.filter(p => p.health.dataFreshness === 'Update Overdue').length;

  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const openComplaints = complaints.length - resolvedComplaints;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
          <Activity size={15} />
          Civic Intelligence & Transparency Metrics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Karachi Civic Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl mt-1">
          Objective factual data regarding municipal response rates, infrastructure project adherence, public complaints, and waste logistics across Karachi.
        </p>
      </div>

      {/* Top High-Level Indicator Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Public Capital Monitored
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            PKR {projects.reduce((acc, p) => acc + p.budgetPKR, 0).toFixed(1)}M
          </span>
          <span className="text-xs text-emerald-700 mt-1 block">Across {projects.length} major civil projects</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Citizen Co-Reports Tracked
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {complaints.reduce((acc, c) => acc + c.citizenReportCount, 0)}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">From verified civic locations</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average SLA Turnaround
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 block">
            4.2 Days
          </span>
          <span className="text-xs text-slate-500 mt-1 block">From report to verified action</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Resolution Evidence Rate
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            100%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Requires after-action photo</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Projects by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BarChart3 size={15} className="text-[#0F5132]" />
              Projects by Infrastructure Category
            </h3>
            <span className="text-xs text-slate-400 font-mono">{projects.length} Total</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / projects.length) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900 font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0F5132] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Project Lifecycle Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <PieChart size={15} className="text-[#0F5132]" />
              Project Lifecycle Status
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time status</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(statusCounts).map(([stat, count]) => {
              const pct = Math.round((count / projects.length) * 100);
              let barColor = 'bg-blue-600';
              if (stat === 'Completed') barColor = 'bg-emerald-600';
              if (stat === 'Delayed') barColor = 'bg-amber-500';
              if (stat === 'Proposed') barColor = 'bg-slate-400';

              return (
                <div key={stat} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{stat}</span>
                    <span className="text-slate-900 font-mono font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Complaints by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-600" />
              Citizen Complaints by Issue Type
            </h3>
            <span className="text-xs text-slate-400 font-mono">{complaints.length} Total</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(complaintCatCounts).map(([cat, count]) => {
              const pct = Math.round((count / complaints.length) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900 font-mono font-bold">{count} reports</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Data Freshness Distribution (Mandatory Requirement) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Clock size={15} className="text-blue-600" />
              Project Data Freshness Audit
            </h3>
            <span className="text-xs text-slate-400 font-mono">Transparency SLA</span>
          </div>

          <p className="text-xs text-slate-500">
            Measures compliance with mandatory bi-weekly engineering progress updates.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">Recently Updated</span>
              <span className="text-xl font-extrabold text-emerald-950 font-mono mt-1 block">
                {recentlyUpdated}
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block">&lt; 14 days</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">Update Due</span>
              <span className="text-xl font-extrabold text-amber-950 font-mono mt-1 block">
                {updateDue}
              </span>
              <span className="text-[10px] text-amber-700 mt-1 block">15–25 days</span>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <span className="text-xs font-bold text-rose-800 block">Update Overdue</span>
              <span className="text-xl font-extrabold text-rose-950 font-mono mt-1 block">
                {updateOverdue}
              </span>
              <span className="text-[10px] text-rose-700 mt-1 block">&gt; 25 days</span>
            </div>
          </div>
        </div>

      </div>

      {/* District-by-District Comparative Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Karachi 7-District Civic Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Population</th>
                <th className="py-2.5 px-3">Tracked Projects</th>
                <th className="py-2.5 px-3">Active Issues</th>
                <th className="py-2.5 px-3">Waste Hotspots</th>
                <th className="py-2.5 px-3">Overdue Actions</th>
                <th className="py-2.5 px-3">Resolved Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {KARACHI_DISTRICTS_DATA.map((d) => (
                <tr key={d.name} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">District {d.name}</td>
                  <td className="py-3 px-3 font-mono">{d.population}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-800">{d.projectsCount}</td>
                  <td className="py-3 px-3 font-mono text-amber-700">{d.activeIssues}</td>
                  <td className="py-3 px-3 font-mono text-orange-700">{d.wasteReports}</td>
                  <td className="py-3 px-3 font-mono text-rose-600 font-bold">{d.overdueCount}</td>
                  <td className="py-3 px-3 font-mono text-emerald-700">{d.resolvedIssues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
