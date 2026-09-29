import React from 'react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationBadge } from '../common/VerificationBadge';
import { MapPin, Calendar, AlertCircle, ArrowRight, Building } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { setSelectedProjectId, setActiveTab } = useApp();

  const handleCardClick = () => {
    setSelectedProjectId(project.id);
    setActiveTab('project-detail');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group"
    >
      <div className="p-5">
        
        {/* Top Meta Line: Code, Category, District, Verification */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-mono text-emerald-800 font-semibold">{project.code}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5"><MapPin size={12} /> {project.district}</span>
          </div>

          <VerificationBadge status={project.verificationStatus} size="sm" />
        </div>

        {/* Project Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0F5132] transition-colors leading-snug mb-2 line-clamp-2">
          {project.name}
        </h3>

        {/* Department / Location description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar & Status */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Physical Progress</span>
            <span className="font-bold text-slate-900 tabular-nums">{project.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                project.status === 'Completed' 
                  ? 'bg-emerald-600' 
                  : project.status === 'Delayed' 
                  ? 'bg-amber-500' 
                  : 'bg-[#0F5132]'
              }`}
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Sanctioned Budget</span>
            <span className="font-bold text-slate-800 tabular-nums">
              PKR {project.budgetPKR}M
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Expected Finish</span>
            <span className="font-semibold text-slate-700 font-mono text-[11px]">
              {project.expectedEndDate}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Status Badge, Open Issues, Last Updated */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} size="sm" />
          {project.openIssuesCount > 0 ? (
            <span className="text-rose-600 font-semibold flex items-center gap-1 text-[11px]">
              <AlertCircle size={13} />
              {project.openIssuesCount} {project.openIssuesCount === 1 ? 'issue' : 'issues'}
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">No active issues</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#0F5132] font-semibold text-xs transition-colors">
          <span>Explore</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
