import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCard } from './ComplaintCard';
import { IssueCategory, KarachiDistrict, ComplaintStatus } from '../../types';
import { 
  Search, PlusCircle, Filter, RotateCcw, AlertTriangle, 
  ShieldCheck, Clock, Users 
} from 'lucide-react';

export const IssuesExplorer: React.FC = () => {
  const { complaints, setIsReportModalOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<KarachiDistrict | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'All'>('All');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);

  const filteredComplaints = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return complaints.filter(c => {
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedDistrict !== 'All' && c.district !== selectedDistrict) return false;
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
      if (filterOverdueOnly && !c.isOverdue) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q) && !c.neighborhood.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [complaints, searchQuery, selectedCategory, selectedDistrict, selectedStatus, filterOverdueOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDistrict('All');
    setSelectedStatus('All');
    setFilterOverdueOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wide">
              Citizen Reporting & Verification
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
              Neutral Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Karachi Civic Issue Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking {complaints.length} active and resolved community complaints with SLA countdowns and photographic resolution evidence.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints by ID (e.g. KF-ISSUE-1024), defect keyword, street name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Drainage Blockage">Drainage Blockage</option>
            <option value="Sewerage Issue">Sewerage Issue</option>
            <option value="Streetlight Problem">Streetlight Problem</option>
            <option value="Bridge Issue">Bridge Issue</option>
            <option value="Waste Accumulation">Waste Accumulation</option>
            <option value="Safety Concern">Safety Concern</option>
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All 7 Districts</option>
            <option value="Central">District Central</option>
            <option value="East">District East</option>
            <option value="South">District South</option>
            <option value="West">District West</option>
            <option value="Korangi">District Korangi</option>
            <option value="Malir">District Malir</option>
            <option value="Keamari">District Keamari</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted (Citizen Report)</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified Issue</option>
            <option value="Assigned">Assigned to Officer</option>
            <option value="Action In Progress">Action In Progress</option>
            <option value="Resolved">Resolved (With Proof)</option>
            <option value="Escalated">Escalated (Overdue)</option>
          </select>

          {/* Overdue checkbox */}
          <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              checked={filterOverdueOnly}
              onChange={(e) => setFilterOverdueOnly(e.target.checked)}
              className="accent-rose-600 rounded"
            />
            <span className="font-semibold text-rose-700">Overdue SLA Only</span>
          </label>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="col-span-2 sm:col-span-4 lg:col-span-1 p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Issues Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <AlertTriangle size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">
            {complaints.length === 0 ? 'No Civic Issues Reported Yet' : 'No issues match current filters'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {complaints.length === 0 
              ? 'The platform begins clean. Click "Report an Issue" to submit your first community report with photos and coordinates.'
              : 'Clear filters to view all reported civic problems.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            {complaints.length === 0 ? (
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle size={14} />
                <span>Submit First Report</span>
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComplaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}

    </div>
  );
};
