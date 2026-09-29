import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCard } from './ProjectCard';
import { ProjectCategory, KarachiDistrict, ProjectStatus, VerificationStatus } from '../../types';
import { 
  Search, Filter, PlusCircle, LayoutGrid, Map as MapIcon, 
  RotateCcw, FolderKanban, Info 
} from 'lucide-react';
import { CivicMapComponent } from '../map/CivicMapComponent';

export const ProjectExplorer: React.FC = () => {
  const { projects, setIsCreateProjectModalOpen, role } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<KarachiDistrict | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'All'>('All');
  const [selectedVerification, setSelectedVerification] = useState<VerificationStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (selectedVerification !== 'All' && p.verificationStatus !== selectedVerification) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q) && !p.neighborhood.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [projects, searchQuery, selectedCategory, selectedDistrict, selectedStatus, selectedVerification]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDistrict('All');
    setSelectedStatus('All');
    setSelectedVerification('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
              Civic Infrastructure Transparency
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
              Demo Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Explore Karachi Projects
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring {projects.length} public capital projects across roads, flood drainage, water, and sanitation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon size={14} />
              <span>Map</span>
            </button>
          </div>

          {(role === 'officer' || role === 'admin') && (
            <button
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="px-4 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-faceted Search and Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, code (e.g. KF-PRJ-101), contractor, neighborhood..."
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
            <option value="Roads">Roads & Flyovers</option>
            <option value="Bridges">Bridges</option>
            <option value="Parks">Parks</option>
            <option value="Flood Management">Flood Management</option>
            <option value="Water">Water Infrastructure</option>
            <option value="Sewerage">Sewerage</option>
            <option value="Public Buildings">Public Buildings</option>
            <option value="Waste Management">Waste Management</option>
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
            <option value="Proposed">Proposed</option>
            <option value="Approved">Approved</option>
            <option value="Procurement">Procurement</option>
            <option value="In Progress">In Progress</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Verification Status */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Verification States</option>
            <option value="Verified">Verified (Official Audit)</option>
            <option value="Partially Verified">Partially Verified</option>
            <option value="Unverified">Unverified</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="col-span-2 sm:col-span-4 lg:col-span-1 p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'map' ? (
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <CivicMapComponent fullScreen={false} />
        </div>
      ) : (
        <div>
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <FolderKanban size={36} className="mx-auto text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">
                {projects.length === 0 ? 'No Infrastructure Projects Registered Yet' : 'No public projects match current filters'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {projects.length === 0 
                  ? 'The portal starts with a clean database. Once an authorized Project Officer or Admin logs in, they can register municipal infrastructure works.' 
                  : 'Try broadening your search term or selecting "All Districts".'}
              </p>
              {projects.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
