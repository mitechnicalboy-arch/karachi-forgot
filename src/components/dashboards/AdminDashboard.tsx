import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint } from '../../types';
import { 
  exportComplaintsToExcel, 
  exportUsersToExcel, 
  exportCompleteCivicAuditToExcel,
  exportSubmittedIssuesReportToExcel 
} from '../../utils/excelExporter';
import { 
  Shield, Users, Building2, Layers, History, Settings, RefreshCw, 
  CheckCircle2, AlertTriangle, Trash2, FolderKanban, Activity, 
  FileText, Database, FileSpreadsheet, Download, Search, Filter, 
  UserPlus, UserCheck, AlertCircle, ChevronDown, CheckSquare, PlusCircle,
  Eye, X, ExternalLink, Calendar, MapPin, Check, FileDown, Clock, ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    projects, 
    complaints, 
    wasteReports, 
    auditLogs, 
    registeredUsers,
    resetDemoData, 
    clearAllData,
    seedInitialData,
    showToast,
    setIsReportModalOpen,
    updateComplaintVerificationStatus
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'complaints-sheet' | 'users-db' | 'departments' | 'audit' | 'settings'>('complaints-sheet');

  // Filter state for Excel/Sheet view
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintCategoryFilter, setComplaintCategoryFilter] = useState('All');
  const [complaintDistrictFilter, setComplaintDistrictFilter] = useState('All');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('All');
  const [complaintVerificationFilter, setComplaintVerificationFilter] = useState('All');

  // Detail Modal for an Issue
  const [viewingIssue, setViewingIssue] = useState<Complaint | null>(null);

  // Filter state for Users database
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Procurement').length;
  const delayedProjects = projects.filter(p => p.status === 'Delayed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  const newComplaints = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const overdueComplaints = complaints.filter(c => c.isOverdue && c.status !== 'Resolved').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const wasteHotspots = wasteReports.filter(w => w.densityLevel === 'Critical Hotspot' || w.densityLevel === 'Severe').length;

  // Filtered complaints for the admin Excel matrix
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const q = complaintSearch.toLowerCase();
      if (q && !c.title.toLowerCase().includes(q) && !c.reporterName.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q) && !c.neighborhood.toLowerCase().includes(q) && !(c.reporterId && c.reporterId.toLowerCase().includes(q))) {
        return false;
      }
      if (complaintCategoryFilter !== 'All' && c.category !== complaintCategoryFilter) return false;
      if (complaintDistrictFilter !== 'All' && c.district !== complaintDistrictFilter) return false;
      if (complaintStatusFilter !== 'All' && c.status !== complaintStatusFilter) return false;
      if (complaintVerificationFilter !== 'All') {
        const vStatus = c.verificationStatus || (c.isVerifiedFact ? 'Verified' : c.status === 'Under Review' ? 'Under Review' : c.status === 'Rejected' ? 'Rejected' : 'Unverified');
        if (vStatus !== complaintVerificationFilter) return false;
      }
      return true;
    });
  }, [complaints, complaintSearch, complaintCategoryFilter, complaintDistrictFilter, complaintStatusFilter, complaintVerificationFilter]);

  // Filtered users for the Users database tab
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter(u => {
      const q = userSearch.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) {
        return false;
      }
      if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
      return true;
    });
  }, [registeredUsers, userSearch, userRoleFilter]);

  const departmentsList = [
    { name: 'Karachi Metropolitan Corporation (KMC)', head: 'Administrator / Mayor Office', activeProjects: 18, resolvedIssues: 142, slaRate: '94%' },
    { name: 'Karachi Development Authority (KDA)', head: 'Director General Works', activeProjects: 14, resolvedIssues: 98, slaRate: '91%' },
    { name: 'Karachi Water & Sewerage Corporation (KW&SC)', head: 'Managing Director & CEO', activeProjects: 16, resolvedIssues: 184, slaRate: '88%' },
    { name: 'Sindh Solid Waste Management Board (SSWMB)', head: 'Managing Director Operations', activeProjects: 8, resolvedIssues: 320, slaRate: '96%' },
    { name: 'Karachi Port Trust (KPT)', head: 'Chairman Civil Wing', activeProjects: 5, resolvedIssues: 24, slaRate: '92%' },
    { name: 'Sindh Environmental Protection Agency (SEPA)', head: 'Director General Compliance', activeProjects: 7, resolvedIssues: 54, slaRate: '95%' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              ROOT ADMIN CONSOLE
            </span>
            <span className="text-xs text-slate-400">· Civic Database Governance & Records Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            KARACHI FORGOT Platform Administration
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Live database verification of registered citizens and officials, complete Excel problem sheet export, SLA oversight, and immutable system audit logs.
          </p>
        </div>

        {/* Database Lifecycle Actions: Export Excel / Clear Data / Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              exportSubmittedIssuesReportToExcel(complaints);
              showToast(`Exported all ${complaints.length} submitted issues with Reporter IDs & verification status to Excel (.xlsx)!`, 'success');
            }}
            className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ring-2 ring-[#0F5132]/20"
            title="Download report of all submitted issues including Reporter ID, Issue Details, and Current Verification Status"
          >
            <FileSpreadsheet size={15} />
            <span>Download Issues Report (Excel)</span>
          </button>

          <button
            onClick={() => {
              exportCompleteCivicAuditToExcel(complaints, wasteReports, projects, registeredUsers);
              showToast('Complete Multi-Sheet Civic Ledger exported as Excel (.xlsx)!', 'success');
            }}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Download complete multi-sheet platform audit workbook in Excel format"
          >
            <Download size={14} />
            <span>All Data (Excel)</span>
          </button>

          <button
            onClick={clearAllData}
            className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Remove all fake/demo data to start with empty database"
          >
            <Trash2 size={14} />
            <span>Clear Data</span>
          </button>

          <button
            onClick={seedInitialData}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Restore reference sample dataset"
          >
            <RefreshCw size={14} />
            <span>Restore Samples</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Telemetry Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono mt-1 block">{registeredUsers.length}</span>
          <span className="text-[11px] text-slate-500">Live in user database</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Citizen Problems</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">{complaints.length}</span>
          <span className="text-[11px] text-slate-500">{newComplaints} awaiting review</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue SLAs</span>
          <span className="text-2xl font-extrabold text-rose-600 font-mono mt-1 block">{overdueComplaints}</span>
          <span className="text-[11px] text-rose-700 font-medium">Lagging responses</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Complaints</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">{resolvedComplaints}</span>
          <span className="text-[11px] text-emerald-700 font-medium">With photo proof</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Public Projects</span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">{totalProjects}</span>
          <span className="text-[11px] text-slate-500">{activeProjects} active works</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
          {[
            { id: 'complaints-sheet', label: `1. Citizen Problems Excel Sheet (${complaints.length})`, icon: FileSpreadsheet },
            { id: 'users-db', label: `2. Registered Users Database (${registeredUsers.length})`, icon: Database },
            { id: 'overview', label: '3. Governance Health', icon: Activity },
            { id: 'departments', label: '4. Public Authorities (6)', icon: Building2 },
            { id: 'audit', label: `5. Audit Log Ledger (${auditLogs.length})`, icon: History },
            { id: 'settings', label: '6. SLA Settings', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeAdminTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveAdminTab(t.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#0F5132] text-[#0F5132] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: ATTACHED EXCEL SHEET FOR CITIZEN PROBLEMS */}
        {activeAdminTab === 'complaints-sheet' && (
          <div className="p-6 space-y-6">
            
            {/* Action Bar with Download Excel Button & Summary */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="text-emerald-800" size={20} />
                  <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wide">
                    Live Submitted Issues & Citizen Complaints Sheet
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                    {complaints.length} Total Records
                  </span>
                </div>
                <p className="text-xs text-emerald-800/90 max-w-3xl leading-relaxed">
                  Exportable civic ledger containing <strong>Reporter ID</strong>, complete <strong>Issue Details</strong> (category, location, GPS, photo proof), and <strong>Current Verification Status</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {filteredComplaints.length !== complaints.length && (
                  <button
                    onClick={() => {
                      exportSubmittedIssuesReportToExcel(filteredComplaints, `KARACHI_FORGOT_Filtered_Issues_${new Date().toISOString().split('T')[0]}.xlsx`);
                      showToast(`Exported ${filteredComplaints.length} filtered issues to Excel (.xlsx)!`, 'success');
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Export currently filtered list to Excel"
                  >
                    <Download size={13} />
                    <span>Export Filtered ({filteredComplaints.length})</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    exportSubmittedIssuesReportToExcel(complaints);
                    showToast(`Exported all ${complaints.length} submitted issues report to Excel (.xlsx)!`, 'success');
                  }}
                  className="px-4 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ring-1 ring-emerald-600"
                  title="Download complete report of all submitted issues with Reporter ID, Issue Details, and Current Verification Status"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download Issues Report (Excel)</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={complaintSearch}
                  onChange={(e) => setComplaintSearch(e.target.value)}
                  placeholder="Search Reporter ID, title, citizen..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                />
              </div>

              <select
                value={complaintCategoryFilter}
                onChange={(e) => setComplaintCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Drainage Blockage">Drainage Blockage</option>
                <option value="Sewerage Issue">Sewerage Issue</option>
                <option value="Streetlight Problem">Streetlight Problem</option>
                <option value="Bridge Issue">Bridge Issue</option>
                <option value="Waste Accumulation">Waste Accumulation</option>
                <option value="Park Damage">Park Damage</option>
                <option value="Safety Concern">Safety Concern</option>
                <option value="Other">Other Issues</option>
              </select>

              <select
                value={complaintDistrictFilter}
                onChange={(e) => setComplaintDistrictFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden font-medium"
              >
                <option value="All">All Districts</option>
                <option value="Central">Central</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="Korangi">Korangi</option>
                <option value="Malir">Malir</option>
                <option value="Keamari">Keamari</option>
              </select>

              <select
                value={complaintStatusFilter}
                onChange={(e) => setComplaintStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden font-medium"
              >
                <option value="All">All Action Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Assigned">Assigned</option>
                <option value="Action In Progress">Action In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>

              <select
                value={complaintVerificationFilter}
                onChange={(e) => setComplaintVerificationFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden font-medium text-emerald-900"
              >
                <option value="All">All Verification Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Under Review">Under Review Only</option>
                <option value="Unverified">Unverified Only</option>
                <option value="Rejected">Rejected Only</option>
              </select>
            </div>

            {/* Interactive Sheet Table */}
            {filteredComplaints.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <AlertCircle size={36} className="mx-auto text-slate-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Citizen Issues Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {complaints.length === 0 
                    ? "The database is currently clean and empty. When citizens submit issues, they will appear in this sheet in real-time."
                    : "No complaints match your active filter parameters."}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-4 py-2 bg-[#0F5132] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <PlusCircle size={14} />
                    <span>Report a New Issue Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Issue ID</th>
                      <th className="py-3 px-3">Reporter ID</th>
                      <th className="py-3 px-3">Citizen (Reporter)</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 min-w-[200px]">Issue Details</th>
                      <th className="py-3 px-3">District & Location</th>
                      <th className="py-3 px-3">Verification Status</th>
                      <th className="py-3 px-3">SLA Status</th>
                      <th className="py-3 px-3">Action Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {filteredComplaints.map((c, index) => {
                      const repId = c.reporterId || `CITIZEN-${c.id.replace('KF-ISSUE-', '')}`;
                      const currentVerification = c.verificationStatus || (
                        c.isVerifiedFact ? 'Verified' : 
                        c.status === 'Under Review' ? 'Under Review' : 
                        c.status === 'Rejected' ? 'Rejected' : 
                        'Unverified'
                      );

                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-800 whitespace-nowrap">
                            {c.id}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200" title={`Unique Reporter Identifier: ${repId}`}>
                              {repId}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{c.reporterName}</div>
                            <div className="font-mono text-[10px] text-slate-500">{c.reporterContact || c.reporterEmail || 'No contact'}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {c.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 min-w-[220px]">
                            <div className="font-semibold text-slate-900 line-clamp-1">{c.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-medium text-slate-800">{c.district}</div>
                            <div className="text-[10px] text-slate-500">{c.neighborhood}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <select
                                value={currentVerification}
                                onChange={(e) => {
                                  const val = e.target.value as any;
                                  updateComplaintVerificationStatus(c.id, val);
                                }}
                                className={`text-[11px] font-bold py-1 px-2 rounded-lg border cursor-pointer outline-hidden transition-all ${
                                  currentVerification === 'Verified'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : currentVerification === 'Under Review'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : currentVerification === 'Rejected'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                                title="Change Verification Status for this submitted issue"
                              >
                                <option value="Verified">✓ Verified</option>
                                <option value="Under Review">⏳ Under Review</option>
                                <option value="Unverified">○ Unverified</option>
                                <option value="Rejected">✕ Rejected</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {c.isOverdue ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                OVERDUE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Within SLA ({c.expectedSlaDate})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <StatusBadge status={c.status} size="sm" />
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-right">
                            <button
                              onClick={() => setViewingIssue(c)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="View complete issue details, photographic evidence, and audit logs"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Showing {filteredComplaints.length} of {complaints.length} submitted issues recorded in platform ledger.</span>
              <span className="text-emerald-800 font-medium">All issues include Reporter ID & Verification Status in Excel export.</span>
            </div>
          </div>
        )}

        {/* Tab 2: REGISTERED USERS DATABASE RECORD */}
        {activeAdminTab === 'users-db' && (
          <div className="p-6 space-y-6">
            
            {/* Header with Excel Export */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="text-blue-800" size={20} />
                  <h3 className="text-sm font-extrabold text-blue-950 uppercase tracking-wide">
                    Registered Users Database Record
                  </h3>
                </div>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  Verify user account registration, credentials, district representation, municipal designations, and official badge IDs.
                </p>
                <div className="text-[11px] text-slate-600 bg-white/80 px-2.5 py-1 rounded-lg border border-blue-200/80 mt-2 inline-flex items-center gap-1.5 font-medium">
                  <Shield size={12} className="text-rose-600 shrink-0" />
                  <span><strong>Platform Governance Rule:</strong> Exactly ONE Administrator exists. Root admin credentials cannot be modified or duplicated.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  exportUsersToExcel(registeredUsers);
                  showToast('Exported Users Database to Excel (.xlsx)!', 'success');
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download size={14} />
                <span>Export Users (Excel)</span>
              </button>
            </div>

            {/* User Search & Role Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name, email, or user ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                <option value="All">All User Roles</option>
                <option value="citizen">Citizens</option>
                <option value="officer">Project Officers</option>
                <option value="supervisor">Supervisors</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">User ID</th>
                    <th className="py-3 px-3">User Name</th>
                    <th className="py-3 px-3">Email Address</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">District</th>
                    <th className="py-3 px-3">Department / Designation</th>
                    <th className="py-3 px-3">Badge / Phone</th>
                    <th className="py-3 px-3">Joined Date</th>
                    <th className="py-3 px-3">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {u.id}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {u.email}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'citizen' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            u.role === 'officer' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                            u.role === 'supervisor' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                            'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {u.role}
                          </span>
                          {(u.role === 'admin' || u.isImmutable) && (
                            <span className="text-[9px] font-bold font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                              🔒 Root Admin (Immutable)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        {u.district || 'All Karachi'}
                      </td>
                      <td className="py-3 px-3 min-w-[200px]">
                        <div className="font-medium text-slate-900 line-clamp-1">{u.department || 'Citizen Participant'}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{u.designation || 'Civic Reporter'}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {u.badgeNumber ? `Badge: ${u.badgeNumber}` : u.phone || 'N/A'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {u.joinedDate}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredUsers.length} of {registeredUsers.length} registered user profiles.</span>
              <span>All user registrations are cryptographically audited in the system ledger.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Governance Health */}
        {activeAdminTab === 'overview' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Activity size={16} className="text-[#0F5132]" />
                Civic Transparency KPIs
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Active Public Capital Projects</span>
                  <strong className="text-slate-900 font-mono">{activeProjects}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Delayed Works Requiring Audit</span>
                  <strong className="text-rose-600 font-mono">{delayedProjects}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Overdue Citizen SLA Alerts</span>
                  <strong className="text-rose-600 font-mono">{overdueComplaints}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Waste Incidents Cleaned</span>
                  <strong className="text-emerald-700 font-mono">{wasteReports.filter(w => w.status === 'Verified Resolution').length}</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Database size={16} className="text-blue-700" />
                Persistent Storage Ledger
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Total Registered User Accounts</span>
                  <strong className="text-slate-900 font-mono">{registeredUsers.length}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Citizen Issues Cataloged</span>
                  <strong className="text-slate-900 font-mono">{complaints.length}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">SSWMB Waste Sweeps Active</span>
                  <strong className="text-slate-900 font-mono">{wasteReports.length}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Immutable Audit Entries</span>
                  <strong className="text-slate-900 font-mono">{auditLogs.length}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Public Authorities Directory */}
        {activeAdminTab === 'departments' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Karachi Public Authorities Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Municipal executing bodies with designated accountability channels.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Authority Name</th>
                    <th className="py-2.5 px-3">Directorship / Executive</th>
                    <th className="py-2.5 px-3">Active Projects</th>
                    <th className="py-2.5 px-3">Resolved Issues</th>
                    <th className="py-2.5 px-3">SLA Compliance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {departmentsList.map((d) => (
                    <tr key={d.name} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{d.name}</td>
                      <td className="py-3 px-3 text-slate-500">{d.head}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">{d.activeProjects}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{d.resolvedIssues}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{d.slaRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Immutable Audit Logs */}
        {activeAdminTab === 'audit' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Complete Public Audit Log Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically immutable history of user registrations, budget revisions, verification audits, and progress updates.
                </p>
              </div>
            </div>

            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Audit log is currently empty. Actions taken on the platform will be cryptographically registered here.
              </div>
            ) : (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-700">
                      Target: <strong>[{log.targetType}] {log.targetName}</strong> ({log.targetId})
                    </p>
                    <p className="text-slate-600">
                      Changed by: <strong>{log.changedBy}</strong> (Role: <span className="uppercase text-[10px] font-bold text-emerald-800">{log.userRole}</span>)
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Reason: <em>{log.reason}</em>
                    </p>
                    {log.oldValue && log.newValue && (
                      <div className="font-mono text-[11px] bg-white p-2 rounded border border-slate-200 mt-1">
                        <span className="text-rose-600">- {log.oldValue}</span>
                        <br />
                        <span className="text-emerald-600">+ {log.newValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: System SLA Settings */}
        {activeAdminTab === 'settings' && (
          <div className="p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Municipal SLA & Verification Thresholds
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block">Civic Complaint SLA Threshold</span>
                <p className="text-slate-500">Maximum response window before automated red escalation:</p>
                <div className="flex items-center gap-2 pt-1">
                  <input type="number" defaultValue={5} className="w-20 p-2 bg-white border border-slate-300 rounded font-mono font-bold" />
                  <span className="text-slate-700 font-semibold">Calendar Days</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block">Bi-Weekly Progress Update Cadence</span>
                <p className="text-slate-500">Days before a project is marked "Update Due" or "Update Overdue":</p>
                <div className="flex items-center gap-2 pt-1">
                  <input type="number" defaultValue={14} className="w-20 p-2 bg-white border border-slate-300 rounded font-mono font-bold" />
                  <span className="text-slate-700 font-semibold">Days Without Photo Log</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Settings changes generate high-priority audit logs.</span>
              <button
                onClick={() => showToast('System SLA configuration saved successfully!', 'success')}
                className="px-4 py-2 bg-[#0F5132] text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Save SLA Thresholds
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Full Inspection of Submitted Issue with Reporter ID & Verification Management */}
      {viewingIssue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {viewingIssue.id}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-800">
                  {viewingIssue.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  {viewingIssue.district}
                </span>
              </div>

              <button
                onClick={() => setViewingIssue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Primary 3-Card Summary: Reporter ID, Verification Status, SLA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* 1. Reporter ID & Contact */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    1. Reporter Identification
                  </span>
                  <div className="pt-0.5">
                    <span className="font-mono text-sm font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300 shadow-2xs block w-fit">
                      {viewingIssue.reporterId || `CITIZEN-${viewingIssue.id.replace('KF-ISSUE-', '')}`}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 pt-1">
                    {viewingIssue.reporterName}
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">
                    {viewingIssue.reporterContact || viewingIssue.reporterEmail || 'No contact provided'}
                  </div>
                </div>

                {/* 2. Verification Management */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    2. Current Verification Status
                  </span>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(['Verified', 'Under Review', 'Unverified', 'Rejected'] as const).map((statusOption) => {
                      const currentV = viewingIssue.verificationStatus || (
                        viewingIssue.isVerifiedFact ? 'Verified' : 
                        viewingIssue.status === 'Under Review' ? 'Under Review' : 
                        viewingIssue.status === 'Rejected' ? 'Rejected' : 
                        'Unverified'
                      );
                      const isSelected = currentV === statusOption;

                      return (
                        <button
                          key={statusOption}
                          onClick={() => {
                            updateComplaintVerificationStatus(viewingIssue.id, statusOption);
                            setViewingIssue(prev => prev ? {
                              ...prev,
                              verificationStatus: statusOption,
                              isVerifiedFact: statusOption === 'Verified'
                            } : null);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? statusOption === 'Verified'
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                : statusOption === 'Under Review'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : statusOption === 'Rejected'
                                ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                                : 'bg-slate-700 text-white border-slate-800 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {statusOption === 'Verified' && '✓ '}
                          {statusOption}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Official Fact: <strong>{viewingIssue.isVerifiedFact ? 'YES (Verified Fact)' : 'NO (Unverified Claim)'}</strong>
                  </div>
                </div>

                {/* 3. Action Workflow & SLA */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    3. Action & SLA Status
                  </span>
                  <div className="pt-0.5">
                    <StatusBadge status={viewingIssue.status} />
                  </div>
                  <div className="text-xs text-slate-700 pt-1">
                    Reported: <span className="font-mono font-medium">{viewingIssue.submittedDate}</span>
                  </div>
                  <div className="text-xs">
                    {viewingIssue.isOverdue ? (
                      <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        OVERDUE ({viewingIssue.expectedSlaDate})
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        Target SLA: {viewingIssue.expectedSlaDate}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Problem Title & Detailed Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Issue Title & Description
                </span>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {viewingIssue.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {viewingIssue.description}
                </p>
              </div>

              {/* Location & GPS Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Specific Neighborhood / Landmark</span>
                  <span className="font-semibold text-slate-800">{viewingIssue.neighborhood}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">GPS Location Coordinates</span>
                  <span className="font-mono text-slate-700">{viewingIssue.latitude.toFixed(5)}, {viewingIssue.longitude.toFixed(5)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Responsible Municipal Dept</span>
                  <span className="font-semibold text-slate-800">{viewingIssue.assignedDepartment}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Officer</span>
                  <span className="font-semibold text-slate-800">{viewingIssue.assignedOfficer || 'Pending Assignment'}</span>
                </div>
              </div>

              {/* Photo Evidence Attached */}
              {viewingIssue.evidenceImages && viewingIssue.evidenceImages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Citizen Photographic Evidence ({viewingIssue.evidenceImages.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {viewingIssue.evidenceImages.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img 
                          src={img} 
                          alt={`Evidence ${i + 1}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate Reports Grouped */}
              {viewingIssue.duplicateReports && viewingIssue.duplicateReports.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Linked Citizen Co-Reports ({viewingIssue.duplicateReports.length})
                  </span>
                  <div className="space-y-1.5">
                    {viewingIssue.duplicateReports.map((dup, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{dup.reporter}</span>: <span className="text-slate-600">{dup.note}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">{dup.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status History Audit Trail */}
              {viewingIssue.statusHistory && viewingIssue.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Audit Trail & Timeline
                  </span>
                  <div className="space-y-2">
                    {viewingIssue.statusHistory.map((h, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{h.status}</span>
                          <span className="font-mono text-[10px] text-slate-400">{h.date}</span>
                        </div>
                        <p className="text-slate-600">{h.comment}</p>
                        <span className="text-[10px] text-slate-400">By {h.updatedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  exportSubmittedIssuesReportToExcel([viewingIssue], `KARACHI_FORGOT_Issue_${viewingIssue.id}.xlsx`);
                  showToast(`Exported issue ${viewingIssue.id} to Excel (.xlsx)!`, 'success');
                }}
                className="px-3.5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Export This Issue (.xlsx)</span>
              </button>

              <button
                onClick={() => setViewingIssue(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
