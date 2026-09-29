import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Info, FileSpreadsheet, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedDistrict, setSelectedProjectId } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-slate-800">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs">
                KF
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                KARACHI FORGOT
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              "See It. Report It. Track It. Improve Karachi." A civic transparency and public infrastructure monitoring platform. Neutral, evidence-backed, and dedicated to municipal accountability across all 7 districts of Karachi.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                <ShieldCheck size={13} />
                Strict Evidence & Audit Separation
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                <Info size={13} />
                Student-Built Civic Tech MVP
              </span>
            </div>
          </div>

          {/* Districts */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              Karachi Districts
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {['Central', 'East', 'South', 'West', 'Korangi', 'Malir', 'Keamari'].map((dist) => (
                <li key={dist}>
                  <button
                    onClick={() => {
                      setSelectedDistrict(dist as any);
                      setActiveTab('area');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    District {dist}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileSpreadsheet size={14} className="text-emerald-400" />
              Platform Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => { setSelectedProjectId(null); setActiveTab('projects'); }} className="hover:text-emerald-400 transition-colors">
                  Public Infrastructure Projects
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 transition-colors">
                  Interactive Civic Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('waste')} className="hover:text-emerald-400 transition-colors">
                  Smart Waste Management
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('issues')} className="hover:text-emerald-400 transition-colors">
                  Citizen Issue Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-400 transition-colors">
                  Civic Analytics & SLA Metrics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Role Operations Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 KARACHI FORGOT. Open Civic Technology Initiative for Karachi.
          </p>
          <p className="text-[11px] text-slate-500">
            Factual civic transparency platform. Citizen complaints are recorded as citizen reports until independent physical verification.
          </p>
        </div>
      </div>
    </footer>
  );
};
