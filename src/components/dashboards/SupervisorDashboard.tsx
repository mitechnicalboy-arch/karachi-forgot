import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  ShieldCheck, Eye, AlertTriangle, Clock, CheckCircle2, 
  ArrowUpRight, AlertCircle, FileSpreadsheet, UserCheck 
} from 'lucide-react';

export const SupervisorDashboard: React.FC = () => {
  const { 
    projects, 
    complaints, 
    verifyProject, 
    updateComplaintStatus,
    setSelectedProjectId,
    setActiveTab,
    showToast 
  } = useApp();

  const awaitingVerification = projects.filter(p => p.verificationStatus !== 'Verified');
  const delayedProjects = projects.filter(p => p.status === 'Delayed');
  const overdueComplaints = complaints.filter(c => c.isOverdue && c.status !== 'Resolved');

  const handleQuickApprove = (prjId: string, prjName: string) => {
    verifyProject(prjId, 'Verified', 'Supervisor verified tender compliance and physical milestone execution.');
  };

  const handleEscalateComplaint = (cmpId: string) => {
    updateComplaintStatus(cmpId, 'Escalated', 'Supervisor escalated to Director General due to overdue SLA resolution.');
    showToast(`Complaint ${cmpId} escalated to Department Directorate!`, 'warning');
  };

  return (
    <div className="space-y-8">
      
      {/* Supervisor Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
              ROLE: DEPARTMENT SUPERVISOR / AUDITOR
            </span>
            <span className="text-xs text-slate-400">· Independent Verification Cell</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supervisory Oversight & Quality Audit
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Independent verification gatekeeper. Review field officer submissions, audit asphalt compression and concrete strength tests, approve public disclosures, and escalate lagging civic complaints.
          </p>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center gap-2 shrink-0">
          <ShieldCheck size={20} className="text-purple-700 shrink-0" />
          <div>
            <span className="font-bold block">Integrity Mandate</span>
            <span className="text-[11px]">Unverified claims are isolated from public records</span>
          </div>
        </div>
      </div>

      {/* 4 Audit Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Awaiting Verification
          </span>
          <span className="text-2xl font-extrabold text-purple-700 font-mono mt-1 block">
            {awaitingVerification.length}
          </span>
          <span className="text-xs text-purple-800 mt-1 block">Pending field audit</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Delayed Projects
          </span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">
            {delayedProjects.length}
          </span>
          <span className="text-xs text-rose-700 mt-1 block">Requires intervention</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Overdue Complaints
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
            {overdueComplaints.length}
          </span>
          <span className="text-xs text-amber-700 mt-1 block">Immediate escalation</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Verified Projects
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 block">
            {projects.filter(p => p.verificationStatus === 'Verified').length}
          </span>
          <span className="text-xs text-emerald-700 mt-1 block">Meets SPPRA standards</span>
        </div>
      </div>

      {/* Table 1: Projects Awaiting Verification Approval */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Public Projects Awaiting Verification Audit
            </h3>
            <p className="text-xs text-slate-500">
              Audit BoQ compliance, verify contractor documents, and authorize official publication.
            </p>
          </div>
          <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
            {awaitingVerification.length} In Review Queue
          </span>
        </div>

        {awaitingVerification.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            All active projects have received full verification audit clearance.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Project Code</th>
                  <th className="py-2.5 px-3">Title & Executing Agency</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Current Verification</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3 text-right">Supervisor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {awaitingVerification.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">{p.code}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.department} ({p.district})</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <VerificationBadge status={p.verificationStatus} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono">PKR {p.budgetPKR}M</td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('project-detail');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors"
                      >
                        Inspect BoQ
                      </button>
                      <button
                        onClick={() => handleQuickApprove(p.id, p.name)}
                        className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold transition-colors shadow-xs"
                      >
                        Authorize & Verify ✓
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Table 2: Overdue Complaints Requiring Supervisory Escalation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Lagging Complaints Exceeding Mandatory SLA
            </h3>
            <p className="text-xs text-slate-500">
              Department supervisors can issue formal red notices to field executive engineers.
            </p>
          </div>
          <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
            {overdueComplaints.length} Overdue
          </span>
        </div>

        {overdueComplaints.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No complaints are currently overdue for municipal response.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Title & District</th>
                  <th className="py-2.5 px-3">Citizen Reports</th>
                  <th className="py-2.5 px-3">Assigned Department</th>
                  <th className="py-2.5 px-3">SLA Target Date</th>
                  <th className="py-2.5 px-3 text-right">Escalation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {overdueComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-rose-700">{c.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-slate-400">{c.neighborhood} ({c.district})</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {c.citizenReportCount} citizens
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {c.assignedDepartment}
                    </td>
                    <td className="py-3 px-3 font-mono text-rose-600 font-bold">
                      {c.expectedSlaDate}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {c.status !== 'Escalated' ? (
                        <button
                          onClick={() => handleEscalateComplaint(c.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors shadow-xs"
                        >
                          Escalate Issue ⚡
                        </button>
                      ) : (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          Escalated Level 2
                        </span>
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
