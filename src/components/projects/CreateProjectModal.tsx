import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCategory, KarachiDistrict, ProjectStatus } from '../../types';
import { X, Building2, Calendar, MapPin, DollarSign, AlertCircle } from 'lucide-react';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectModalOpen, setIsCreateProjectModalOpen, addProject } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Roads');
  const [district, setDistrict] = useState<KarachiDistrict>('East');
  const [neighborhood, setNeighborhood] = useState('');
  const [budgetPKR, setBudgetPKR] = useState('75.0');
  const [department, setDepartment] = useState('Karachi Metropolitan Corporation (KMC)');
  const [contractor, setContractor] = useState('');
  const [description, setDescription] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('2027-06-30');
  const [latitude, setLatitude] = useState('24.8607');
  const [longitude, setLongitude] = useState('67.0011');
  const [error, setError] = useState('');

  if (!isCreateProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !neighborhood.trim() || !description.trim()) {
      setError('Please provide a complete project title, neighborhood location, and project description.');
      return;
    }

    addProject({
      name: name.trim(),
      category,
      district,
      neighborhood: neighborhood.trim(),
      budgetPKR: parseFloat(budgetPKR) || 50.0,
      department: department.trim(),
      contractor: contractor.trim() || 'Pre-qualification Tendering in Progress',
      description: description.trim(),
      expectedEndDate,
      latitude: parseFloat(latitude) || 24.8607,
      longitude: parseFloat(longitude) || 67.0011,
      status: 'Proposed',
      verificationStatus: 'Unverified',
      progressPercent: 0,
    });

    setIsCreateProjectModalOpen(false);
  };

  const departmentsList = [
    'Karachi Metropolitan Corporation (KMC)',
    'Karachi Development Authority (KDA)',
    'Karachi Water & Sewerage Corporation (KW&SC)',
    'Sindh Solid Waste Management Board (SSWMB)',
    'Karachi Port Trust (KPT)',
    'Sindh Environmental Protection Agency (SEPA)',
    'Sindh Transport & Mass Transit Dept',
    'Local Government & Housing Town Planning'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-mono font-semibold text-emerald-800 uppercase tracking-wide">
              Official Infrastructure Registry
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Register New Karachi Public Project
            </h3>
          </div>
          <button
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Project Title */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Official Project Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. University Road Stormwater Drainage & Median Landscaping"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
              required
            />
          </div>

          {/* Category & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
              >
                <option value="Roads">Roads & Flyovers</option>
                <option value="Bridges">Bridges</option>
                <option value="Parks">Parks & Green Spaces</option>
                <option value="Flood Management">Flood Management</option>
                <option value="Water">Water Supply</option>
                <option value="Sewerage">Sewerage & Sanitation</option>
                <option value="Public Buildings">Public Buildings</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                District (Karachi)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as KarachiDistrict)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
              >
                <option value="Central">District Central</option>
                <option value="East">District East</option>
                <option value="South">District South</option>
                <option value="West">District West</option>
                <option value="Korangi">District Korangi</option>
                <option value="Malir">District Malir</option>
                <option value="Keamari">District Keamari</option>
              </select>
            </div>
          </div>

          {/* Neighborhood & Location */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Neighborhood / Sector / Street Address *
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g. Gulshan Block 13-D near Expo Centre"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Department & Contractor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Executing Department / Authority
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
              >
                {departmentsList.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Contractor / Vendor
              </label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="e.g. FWO / Habib Rafiq / Tendering"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Budget & Target Completion Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Sanctioned Budget (PKR Millions)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={budgetPKR}
                onChange={(e) => setBudgetPKR(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={expectedEndDate}
                onChange={(e) => setExpectedEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Public Description & Scope of Works *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the engineering scope, beneficiaries, and technical objectives..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateProjectModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Publish Project Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
