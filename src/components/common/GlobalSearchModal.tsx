import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, FolderKanban, AlertCircle, Trash2, MapPin, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    projects, 
    complaints, 
    wasteReports, 
    setSelectedProjectId, 
    setSelectedComplaintId, 
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { projects: [], complaints: [], waste: [] };
    const q = query.toLowerCase();

    const matchedProjects = projects.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedComplaints = complaints.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.neighborhood.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedWaste = wasteReports.filter(w => 
      w.locationName.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.district.toLowerCase().includes(q)
    ).slice(0, 4);

    return { projects: matchedProjects, complaints: matchedComplaints, waste: matchedWaste };
  }, [query, projects, complaints, wasteReports]);

  if (!isSearchModalOpen) return null;

  const totalResults = filteredResults.projects.length + filteredResults.complaints.length + filteredResults.waste.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search size={22} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, complaint IDs (e.g. KF-ISSUE-1024), areas, waste..."
            autoFocus
            className="flex-1 bg-transparent border-none text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium">Quick suggestions for Karachi search:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['Korangi Road', 'Gujjar Nullah', 'Gulshan-e-Iqbal', 'KF-ISSUE-1024', 'Water Leakage', 'SSWMB'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium">No matching records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by district (e.g. East, Korangi) or code (e.g. KF-PRJ-101)</p>
            </div>
          ) : (
            <>
              {/* Projects */}
              {filteredResults.projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FolderKanban size={14} className="text-emerald-600" />
                    Public Infrastructure Projects ({filteredResults.projects.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredResults.projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('project-detail');
                          setIsSearchModalOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {p.code}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {p.district} · {p.neighborhood}
                            </span>
                            <span>·</span>
                            <span>PKR {p.budgetPKR}M</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={p.status} size="sm" />
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complaints */}
              {filteredResults.complaints.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-600" />
                    Civic Issue Complaints ({filteredResults.complaints.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredResults.complaints.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setActiveTab('issues');
                          setIsSearchModalOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                              {c.id}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                              {c.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{c.category}</span>
                            <span>·</span>
                            <span>{c.district}</span>
                            <span>·</span>
                            <span>{c.citizenReportCount} citizen reports</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={c.status} size="sm" />
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Waste Reports */}
              {filteredResults.waste.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Trash2 size={14} className="text-orange-600" />
                    Waste Management Reports ({filteredResults.waste.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredResults.waste.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setActiveTab('waste');
                          setIsSearchModalOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded">
                              {w.id}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                              {w.locationName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{w.category}</span>
                            <span>·</span>
                            <span>{w.district}</span>
                            <span>·</span>
                            <span className="font-medium text-orange-600">{w.densityLevel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={w.status} size="sm" />
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
