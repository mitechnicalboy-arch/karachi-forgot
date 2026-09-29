import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  PlusCircle, FileCheck, AlertTriangle, Clock, FolderKanban, 
  ArrowRight, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { 
    projects, 
    complaints, 
    setIsCreateProjectModalOpen, 
    setIsUpdateProgressModalOpen, 
    setSelectedProjectId,
    setSelectedComplaintId,
    setIsResolveModalOpen,
    setActiveTab 
  } = useApp();

  const myProjects = projects.slice(0, 4);
  const projectsNeedingUpdate = projects.filter(p => p.health.dataFreshness !== 'Recently Updated');
  const overdueComplaints = complaints.filter(c => c.isOverdue && c.status !== 'Resolved');
  const nearCompletion = projects.filter(p => p.progressPercent >= 70 && p.status !== 'Completed');

  return (
    <div className="space-y-8">
      
      {/* Officer Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              ROLE: PROJECT OFFICER (DESK #104)
            </span>
            <span className="text-xs text-slate-400">· KDA & KMC Engineering Bureau</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Municipal Works Operations Center
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Record physical field progress with photographic evidence, review citizen defect reports, enforce contractor specifications, and upload laboratory test reports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle size={15} />
            <span>Create New Project</span>
          </button>

          <button
            onClick={() => {
              setSelectedProjectId(myProjects[0]?.id || null);
              setIsUpdateProgressModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileCheck size={15} />
            <span>Update Progress with Evidence</span>
          </button>
        </div>
      </div>

      {/* 5 Indicator Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            My Assigned Projects
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            {myProjects.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">In District East / Korangi</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Updates Due / Overdue
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            {projectsNeedingUpdate.length}
          </span>
          <span className="text-xs text-amber-700 mt-1 block">Bi-weekly photo required</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Overdue Complaints
          </span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
            {overdueComplaints.length}
          </span>
          <span className="text-xs text-rose-700 mt-1 block">SLA turnaround breached</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Near Completion (&gt;70%)
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 block">
            {nearCompletion.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Final commissioning stage</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Assigned Issues
          </span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono mt-1 block">
            {complaints.filter(c => c.status === 'Assigned' || c.status === 'Action In Progress').length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Field crews dispatched</span>
        </div>
      </div>

      {/* Table 1: My Managed Public Projects */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Project Portfolios Under Management
            </h3>
            <p className="text-xs text-slate-500">Click any project to inspect documentation, edit materials, or log progress.</p>
          </div>
          <button
            onClick={() => { setSelectedProjectId(null); setActiveTab('projects'); }}
            className="text-xs font-bold text-[#0F5132] hover:underline"
          >
            All Projects →
          </button>
        </div>

        {myProjects.length === 0 ? (
          <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <FolderKanban size={32} className="mx-auto text-slate-300" />
            <h4 className="text-xs font-bold text-slate-700">No Projects in Portfolio Yet</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Click "+ Create New Project" above to register an infrastructure development project with budget, contractor, and milestones.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Project Code</th>
                  <th className="py-2.5 px-3">Name & District</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Data Freshness</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">{p.code}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.district} · {p.neighborhood}</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 font-mono">{p.progressPercent}%</span>
                    </td>
                    <td className="py-3 px-3 font-mono">PKR {p.budgetPKR}M</td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold ${
                        p.health.dataFreshness === 'Recently Updated' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {p.health.dataFreshness} ({p.health.daysSinceLastUpdate}d)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setIsUpdateProgressModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] rounded font-bold transition-colors"
                      >
                        + Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Table 2: Recent Field Complaints Assigned to Officer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Citizen Issue Queue Requiring Action
            </h3>
            <p className="text-xs text-slate-500">Resolve with photographic evidence once repair works are verified.</p>
          </div>
          <button
            onClick={() => setActiveTab('issues')}
            className="text-xs font-bold text-[#0F5132] hover:underline"
          >
            All Issues →
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-slate-300" />
            <h4 className="text-xs font-bold text-slate-700">No Action Items in Field Queue</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              All citizen defect reports will appear here when submitted. You can assign contractors, update milestones, and upload completion proof.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Title & Location</th>
                  <th className="py-2.5 px-3">Co-Reports</th>
                  <th className="py-2.5 px-3">SLA Deadline</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {complaints.slice(0, 4).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-amber-900">{c.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-slate-400">{c.neighborhood} ({c.district})</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {c.citizenReportCount} citizens
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={c.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {c.expectedSlaDate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {c.status !== 'Resolved' ? (
                        <button
                          onClick={() => {
                            setSelectedComplaintId(c.id);
                            setIsResolveModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded font-bold transition-colors"
                        >
                          Resolve with Proof
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold">Resolved ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
