import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationStatus, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationBadge } from '../common/VerificationBadge';
import { ProjectHealthCard } from './ProjectHealthCard';
import L from 'leaflet';
import { 
  ArrowLeft, MapPin, Building, Calendar, DollarSign, CheckCircle2, 
  FileText, ShieldCheck, Users, Wrench, Clock, AlertTriangle, Eye, 
  PlusCircle, Download, FileSpreadsheet, History, MessageSquare 
} from 'lucide-react';

export const ProjectDetailView: React.FC = () => {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    setActiveTab,
    role,
    setIsUpdateProgressModalOpen,
    verifyProject,
    complaints,
    auditLogs
  } = useApp();

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];
  const [activeTabSection, setActiveTabSection] = useState<
    'overview' | 'timeline' | 'budget' | 'team' | 'materials' | 'documents' | 'updates' | 'reports' | 'map' | 'history'
  >('overview');

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyStatusChoice, setVerifyStatusChoice] = useState<VerificationStatus>('Verified');
  const [verifyNote, setVerifyNote] = useState('');

  const miniMapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Filter complaints linked to this project
  const linkedComplaints = complaints.filter(c => c.relatedProjectId === project?.id);

  // Filter audit logs linked to this project
  const linkedAuditLogs = auditLogs.filter(a => a.targetId === project?.id);

  // Leaflet mini-map initializer
  useEffect(() => {
    if (!project || activeTabSection !== 'map' || !miniMapRef.current) return;
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(miniMapRef.current).setView([project.latitude, project.longitude], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const pinIcon = L.divIcon({
      html: `
        <div style="width: 32px; height: 38px; transform: translate(-16px, -38px);">
          <svg viewBox="0 0 32 38" width="32" height="38" fill="none">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 27.2 16 38 16 38C16 38 32 27.2 32 16C32 7.16 24.84 0 16 0Z" fill="#0F5132" />
            <circle cx="16" cy="15" r="6" fill="#FFFFFF" />
          </svg>
        </div>
      `,
      className: 'mini-map-pin',
      iconSize: [32, 38],
      iconAnchor: [16, 38]
    });

    L.marker([project.latitude, project.longitude], { icon: pinIcon })
      .addTo(map)
      .bindPopup(`<b>${project.name}</b><br/>${project.neighborhood}`)
      .openPopup();

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [project, activeTabSection]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Project not found.</p>
        <button
          onClick={() => setActiveTab('projects')}
          className="mt-4 px-4 py-2 bg-[#0F5132] text-white rounded-lg text-xs font-semibold"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyProject(project.id, verifyStatusChoice, verifyNote);
    setVerifyModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedProjectId(null);
            setActiveTab('projects');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects Explorer</span>
        </button>

        {/* Role-specific Actions */}
        <div className="flex items-center gap-2">
          {(role === 'officer' || role === 'admin') && (
            <button
              onClick={() => setIsUpdateProgressModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <PlusCircle size={15} />
              <span>Update Progress with Evidence</span>
            </button>
          )}

          {(role === 'supervisor' || role === 'admin') && (
            <button
              onClick={() => setVerifyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <ShieldCheck size={15} />
              <span>Audit & Verify Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {project.code}
              </span>
              <span>·</span>
              <span>{project.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {project.neighborhood}, District {project.district}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {project.name}
            </h1>

            <p className="text-xs text-slate-500 flex items-center gap-2 pt-0.5">
              <Building size={14} className="text-slate-400" />
              <span>Executing Agency: <strong>{project.department}</strong></span>
              <span>·</span>
              <span>Contractor: <strong>{project.contractor}</strong></span>
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status} size="md" />
              <VerificationBadge status={project.verificationStatus} size="md" />
            </div>
            {project.verifiedBy && (
              <span className="text-[11px] text-slate-400 text-right">
                Verified by {project.verifiedBy} ({project.verificationDate})
              </span>
            )}
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Project Progress Overview</span>
            <span className="font-extrabold text-[#0F5132] font-mono text-sm">{project.progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                project.status === 'Completed' ? 'bg-emerald-600' : project.status === 'Delayed' ? 'bg-amber-500' : 'bg-[#0F5132]'
              }`}
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Budget</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                PKR {project.budgetPKR} Million
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</span>
              <span className="text-xs font-semibold text-slate-800 font-mono">
                {project.startDate}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected End Date</span>
              <span className="text-xs font-semibold text-slate-800 font-mono">
                {project.expectedEndDate}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Record Reference</span>
              <span className="text-xs font-semibold text-emerald-800 font-mono truncate block">
                {project.informationSources.officialRecordRef}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Health Card */}
      <ProjectHealthCard 
        health={project.health} 
        openIssuesCount={project.openIssuesCount} 
        lastUpdated={project.lastUpdated} 
      />

      {/* 10 Navigation Section Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max pb-px">
          {[
            { id: 'overview', label: '1. Overview' },
            { id: 'timeline', label: '2. Timeline' },
            { id: 'budget', label: '3. Budget & Tender' },
            { id: 'team', label: '4. Project Team' },
            { id: 'materials', label: '5. Materials' },
            { id: 'documents', label: '6. Documents' },
            { id: 'updates', label: `7. Progress Updates (${project.progressUpdates.length})` },
            { id: 'reports', label: `8. Citizen Reports (${linkedComplaints.length})` },
            { id: 'map', label: '9. Project Map' },
            { id: 'history', label: `10. Change History (${linkedAuditLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTabSection === tab.id
                  ? 'border-[#0F5132] text-[#0F5132]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTabSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Engineering Scope & Objective
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>

            {/* Information Sources Box (Mandatory Requirement) */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#0F5132]" />
                Information Sources & Verification Record
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Official Record Ref</span>
                  <span className="font-mono text-slate-800 font-semibold">{project.informationSources.officialRecordRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tender Notice ID</span>
                  <span className="font-mono text-slate-800 font-semibold">{project.informationSources.tenderRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last Physical Inspection</span>
                  <span className="font-mono text-slate-800 font-semibold">{project.informationSources.lastInspectionDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTabSection === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">
            Project Lifecycle Milestones
          </h3>
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {project.timeline.map((event) => (
              <div key={event.id} className="relative group">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-[#0F5132] shadow-xs" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-400">{event.date}</span>
                    <StatusBadge status={event.statusTag} size="sm" />
                    <span className="text-xs font-bold text-slate-900">{event.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Updated by: <strong>{event.updatedBy}</strong>
                    {event.evidenceNote && <span> · {event.evidenceNote}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Budget */}
      {activeTabSection === 'budget' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Fiscal Sanction & Funding Allocation
              </h3>
              <p className="text-xs text-slate-500">Provincial Annual Development Programme (ADP) Record</p>
            </div>
            <VerificationBadge status={project.verificationStatus} size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-semibold uppercase text-emerald-800 block">Total Sanctioned Budget</span>
              <span className="text-2xl font-extrabold text-emerald-950 font-mono mt-1 block">
                PKR {project.budgetPKR}M
              </span>
              <span className="text-[11px] text-emerald-700 mt-1 block">100% Capital Outlay Authorized</span>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-[11px] font-semibold uppercase text-blue-800 block">Disbursed Expenditure (Demo)</span>
              <span className="text-2xl font-extrabold text-blue-950 font-mono mt-1 block">
                PKR {(project.budgetPKR * (project.progressPercent / 100)).toFixed(1)}M
              </span>
              <span className="text-[11px] text-blue-700 mt-1 block">Directly tied to verified progress stages</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold uppercase text-slate-600 block">Tendering Compliance</span>
              <span className="text-base font-bold text-slate-900 mt-2 block">
                SPPRA Rules 2010
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block font-mono">Ref: {project.informationSources.tenderRef}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Team */}
      {activeTabSection === 'team' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Assigned Public Project Officers
            </h3>
            <p className="text-xs text-slate-500">Public transparency disclosures for municipal engineering accountability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.team.map((member) => (
              <div key={member.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                    <span className="text-[11px] text-slate-500">{member.designation}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <p><strong>Department:</strong> {member.department}</p>
                  <p className="mt-1"><strong>Role:</strong> {member.responsibility}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Materials */}
      {activeTabSection === 'materials' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Construction Materials & Specifications
              </h3>
              <p className="text-xs text-slate-500">Technical BoQ verification metrics and source references.</p>
            </div>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
              Demo BoQ Quantities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Specification</th>
                  <th className="py-2.5 px-3">Estimated Quantity</th>
                  <th className="py-2.5 px-3">Source Reference</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {project.materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{mat.material}</td>
                    <td className="py-3 px-3 font-mono text-[11px]">{mat.specification}</td>
                    <td className="py-3 px-3 font-mono">{mat.quantity}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{mat.sourceReference}</td>
                    <td className="py-3 px-3">
                      <VerificationBadge status={mat.verificationStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Documents */}
      {activeTabSection === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Official Project Document Repository
            </h3>
            <p className="text-xs text-slate-500">PC-1 Sanction files, SPPRA tenders, contractor agreements, and testing certificates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doc.type} · Version {doc.version} · {doc.fileSize}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <VerificationBadge status={doc.verificationStatus} size="sm" />
                      <span className="text-[10px] text-slate-400">By {doc.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Simulated secure preview of: ${doc.name} (${doc.version})`)}
                  className="p-2 text-slate-500 hover:text-[#0F5132] hover:bg-emerald-50 rounded-lg transition-colors shrink-0"
                  title="Preview / Download Document"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Progress Updates with Evidence */}
      {activeTabSection === 'updates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Verified Physical Progress Updates & Evidence
                </h3>
                <p className="text-xs text-slate-500">Every progress update requires photographic proof and physical task logs.</p>
              </div>

              {(role === 'officer' || role === 'admin') && (
                <button
                  onClick={() => setIsUpdateProgressModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  + Add Progress Evidence
                </button>
              )}
            </div>

            <div className="space-y-6">
              {project.progressUpdates.map((update) => (
                <div key={update.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {update.progressPercent}% Achieved
                      </span>
                      <span className="text-slate-400 font-mono">{update.date}</span>
                    </div>
                    <VerificationBadge status={update.verificationStatus} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {update.description}
                  </p>

                  {/* Photo Evidence */}
                  {update.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 max-w-md h-48 bg-slate-900">
                      <img 
                        src={update.imageUrl} 
                        alt="Progress Evidence" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Photographic Audit Proof · {update.date}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Logged by: <strong>{update.authorName}</strong> ({update.authorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Linked Citizen Reports */}
      {activeTabSection === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Citizen Issue Reports Linked to this Project
            </h3>
            <p className="text-xs text-slate-500">Ground complaints filed by citizens regarding worksite safety, detours, or delays.</p>
          </div>

          {linkedComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No active citizen complaints filed against this project.
            </div>
          ) : (
            <div className="space-y-3">
              {linkedComplaints.map((cmp) => (
                <div key={cmp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {cmp.id}
                      </span>
                      <StatusBadge status={cmp.status} size="sm" />
                      <span className="text-xs font-semibold text-slate-500">
                        {cmp.citizenReportCount} citizen co-reports
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{cmp.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{cmp.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('issues');
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    View Complaint
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 9: Project Map */}
      {activeTabSection === 'map' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Geographic Worksite Coordinates
              </h3>
              <p className="text-xs text-slate-500">
                {project.neighborhood}, District {project.district} (Lat: {project.latitude}, Lng: {project.longitude})
              </p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-[#0F5132] hover:underline"
            >
              Open in Full Karachi GIS Map →
            </button>
          </div>

          <div ref={miniMapRef} className="w-full h-80 rounded-xl overflow-hidden border border-slate-200" />
        </div>
      )}

      {/* Tab 10: Change History & Audit Logs */}
      {activeTabSection === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Immutable Project Audit Ledger
            </h3>
            <p className="text-xs text-slate-500">All administrative modifications, budget updates, and progress logs are preserved.</p>
          </div>

          {linkedAuditLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Initial baseline record. No revisions recorded.</p>
          ) : (
            <div className="space-y-3">
              {linkedAuditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600">
                    Changed by <strong>{log.changedBy}</strong> ({log.userRole})
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

      {/* Supervisor Audit / Verification Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              Department Verification Audit
            </h3>
            <p className="text-slate-500">
              Verify this project's documents, engineering budget, and physical completion records.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Verification Status
                </label>
                <select
                  value={verifyStatusChoice}
                  onChange={(e) => setVerifyStatusChoice(e.target.value as VerificationStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  <option value="Verified">Verified (Official Field Audit Passed)</option>
                  <option value="Partially Verified">Partially Verified (Pending Documents)</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Audit Findings Note *
                </label>
                <textarea
                  rows={3}
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  placeholder="Detail SPPRA tender verification, asphalt test certs, or why documents are incomplete..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold"
                >
                  Save Verification Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
