import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ReportVerificationIndicator } from '../common/VerificationBadge';
import { 
  MapPin, Clock, Users, AlertTriangle, ArrowRight, ShieldCheck, 
  UserCheck, AlertCircle, ChevronDown, ChevronUp, SplitSquareVertical 
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const { 
    role, 
    verifyComplaint, 
    assignComplaint, 
    updateComplaintStatus, 
    setSelectedComplaintId, 
    setIsResolveModalOpen,
    projects,
    setSelectedProjectId,
    setActiveTab
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [assigneeName, setAssigneeName] = useState('Engr. Farooq Sheikh (KDA)');
  const [departmentName, setDepartmentName] = useState('KDA Works & Services');

  const relatedProject = projects.find(p => p.id === complaint.relatedProjectId);

  const handleResolveClick = () => {
    setSelectedComplaintId(complaint.id);
    setIsResolveModalOpen(true);
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
      complaint.isOverdue ? 'border-rose-300 shadow-rose-500/5' : 'border-slate-200 hover:border-slate-300 shadow-xs'
    }`}>
      {/* Top Banner if Overdue */}
      {complaint.isOverdue && complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
        <div className="bg-rose-50 text-rose-800 px-4 py-1.5 border-b border-rose-200 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle size={14} className="text-rose-600" />
            Response SLA Overdue (Target was: {complaint.expectedSlaDate})
          </span>
          <span className="font-mono text-[10px] bg-rose-200/70 px-2 py-0.5 rounded text-rose-900">
            ESCALATION LEVEL 2
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
              {complaint.id}
            </span>
            <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200" title={`Reporter ID: ${complaint.reporterId || `CITIZEN-${complaint.id.replace('KF-ISSUE-', '')}`}`}>
              {complaint.reporterId || `CITIZEN-${complaint.id.replace('KF-ISSUE-', '')}`}
            </span>
            <span>·</span>
            <span>{complaint.category}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><MapPin size={12} /> {complaint.district}</span>
          </div>

          <div className="flex items-center gap-2">
            <ReportVerificationIndicator isVerifiedFact={complaint.isVerifiedFact} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {complaint.description}
        </p>

        {/* Citizen Report Grouping & SLA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen Co-Reports</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Users size={13} className="text-emerald-700" />
              {complaint.citizenReportCount} Citizens Reported This
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Date</span>
            <span className="font-mono text-slate-700 text-xs mt-0.5 block">
              {complaint.submittedDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Response Deadline (SLA)</span>
            <span className={`font-mono text-xs mt-0.5 block font-bold ${complaint.isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
              {complaint.expectedSlaDate} {complaint.isOverdue && '(Overdue)'}
            </span>
          </div>
        </div>

        {/* Linked Project if applicable */}
        {relatedProject && (
          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded shrink-0">
                LINKED PROJECT
              </span>
              <span className="font-semibold text-emerald-950 truncate">
                {relatedProject.name}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedProjectId(relatedProject.id);
                setActiveTab('project-detail');
              }}
              className="text-[11px] font-bold text-[#0F5132] hover:underline shrink-0"
            >
              View Project →
            </button>
          </div>
        )}

        {/* Before / After Photo if resolved */}
        {complaint.resolution && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#0F5132]" />
                Resolution Evidence Verified
              </span>
              <span className="font-mono text-[11px] text-emerald-800">
                Resolved: {complaint.resolution.resolutionDate}
              </span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              "{complaint.resolution.description}"
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Before Report</span>
                <img 
                  src={complaint.resolution.beforeImageUrl || complaint.evidenceImages[0]} 
                  alt="Before" 
                  className="w-full h-24 object-cover rounded-lg border border-slate-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">After Resolution</span>
                <img 
                  src={complaint.resolution.afterImageUrl} 
                  alt="After" 
                  className="w-full h-24 object-cover rounded-lg border border-emerald-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Details: History, Duplicate list, Evidence Photos */}
        {isExpanded && (
          <div className="pt-4 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-150">
            {/* Ground Evidence Photos */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-2">
                Citizen Photographic Ground Evidence ({complaint.evidenceImages.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {complaint.evidenceImages.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt={`Evidence ${i}`} 
                    className="w-28 h-20 object-cover rounded-lg border border-slate-200" 
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            {/* Duplicate Reports grouping breakdown */}
            {complaint.duplicateReports && complaint.duplicateReports.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-2">
                  Co-Reporting Log ({complaint.duplicateReports.length} additional reports grouped):
                </span>
                <div className="space-y-1.5">
                  {complaint.duplicateReports.map((dup, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 flex items-baseline justify-between border-b border-slate-100 pb-1">
                      <span><strong>{dup.reporter}:</strong> {dup.note}</span>
                      <span className="font-mono text-slate-400 shrink-0 ml-2">{dup.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History Timeline */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-2">
                Audit Status Timeline
              </span>
              <div className="space-y-2 pl-3 border-l-2 border-slate-200">
                {complaint.statusHistory.map((hist, i) => (
                  <div key={i} className="text-[11px] space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{hist.status}</span>
                      <span className="text-slate-400 font-mono">({hist.date})</span>
                      <span className="text-slate-400">by {hist.updatedBy}</span>
                    </div>
                    <p className="text-slate-600">{hist.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span>{isExpanded ? 'Hide Details' : 'View Audit History & Photos'}</span>
        </button>

        {/* Role-Specific Actions */}
        <div className="flex items-center gap-2">
          
          {/* Officer & Supervisor verification action */}
          {(role === 'officer' || role === 'supervisor' || role === 'admin') && !complaint.isVerifiedFact && complaint.status !== 'Resolved' && (
            <button
              onClick={() => verifyComplaint(complaint.id, true, 'Officer physical field audit confirmed reported condition.')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition-colors"
            >
              Verify Issue
            </button>
          )}

          {/* Supervisor Assignment Action */}
          {(role === 'supervisor' || role === 'admin') && complaint.status === 'Submitted' && (
            <button
              onClick={() => assignComplaint(complaint.id, assigneeName, departmentName)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
            >
              Assign to Officer
            </button>
          )}

          {/* Escalation Action if overdue */}
          {(role === 'supervisor' || role === 'admin') && complaint.isOverdue && complaint.status !== 'Escalated' && complaint.status !== 'Resolved' && (
            <button
              onClick={() => updateComplaintStatus(complaint.id, 'Escalated', 'Supervisor escalated complaint due to exceeded SLA response deadline.')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold transition-colors"
            >
              Escalate to Dept Head
            </button>
          )}

          {/* Officer Resolve with Evidence */}
          {(role === 'officer' || role === 'admin') && complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
            <button
              onClick={handleResolveClick}
              className="px-3 py-1 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-md font-bold transition-colors shadow-xs"
            >
              Resolve with Evidence →
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
