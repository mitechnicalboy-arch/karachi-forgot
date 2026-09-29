import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Camera, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const UpdateProgressModal: React.FC = () => {
  const { 
    isUpdateProgressModalOpen, 
    setIsUpdateProgressModalOpen, 
    projects, 
    selectedProjectId, 
    updateProjectProgress 
  } = useApp();

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const [percent, setPercent] = useState<number>(currentProject ? currentProject.progressPercent : 0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80');
  const [documentRef, setDocumentRef] = useState('');
  const [error, setError] = useState('');

  if (!isUpdateProgressModalOpen || !currentProject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 15) {
      setError('A descriptive field progress summary (at least 15 characters) is required for audit transparency.');
      return;
    }
    if (!imageUrl) {
      setError('Progress evidence photo is mandatory. Officers cannot increment completion without photographic audit records.');
      return;
    }

    updateProjectProgress(currentProject.id, {
      percent: Number(percent),
      description: description.trim(),
      imageUrl,
      documentRef: documentRef.trim() || undefined
    });

    setIsUpdateProgressModalOpen(false);
  };

  const sampleEvidencePhotos = [
    { label: 'Fresh Asphalt Layer', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Concrete Foundation', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' },
    { label: 'Reinforcement Steel Structure', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Park Landscaping', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-mono font-semibold text-emerald-800 uppercase tracking-wide">
              Officer Progress Evidence Portal
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Update Progress: {currentProject.code}
            </h3>
          </div>
          <button
            onClick={() => setIsUpdateProgressModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Informational callout on evidence requirement */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-[#0F5132] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Civic Transparency Rule:</strong> Progress increments cannot be submitted without accompanying photographic evidence and detailed physical task notes. All updates are logged in the public audit ledger.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Progress Slider / Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800 text-xs">
                New Completion Percentage (%)
              </label>
              <span className="text-sm font-extrabold text-[#0F5132] font-mono">
                {percent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full accent-[#0F5132] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Current: {currentProject.progressPercent}%</span>
              <span>Target: 100% (Commissioned)</span>
            </div>
          </div>

          {/* Description of works */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Field Execution Summary & Milestones Achieved *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="Detail specific physical activities completed (e.g. 500m asphalt wearing layer laid, load test performed, utility lines cleared)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
              required
            />
          </div>

          {/* Photographic Evidence Attachment */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Mandatory Photographic Evidence *
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {sampleEvidencePhotos.map((photo, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(photo.url)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    imageUrl === photo.url 
                      ? 'border-[#0F5132] bg-emerald-50/50 text-[#0F5132] font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.label} 
                    className="w-9 h-9 object-cover rounded-md shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate text-[11px]">{photo.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Camera size={16} className="text-slate-400" />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste site camera inspection URL..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Optional Document / Test Report Ref */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Testing Report or Inspection Ref (Optional)
            </label>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              <input
                type="text"
                value={documentRef}
                onChange={(e) => setDocumentRef(e.target.value)}
                placeholder="e.g. LAB-AUDIT-2026-Q3 / SPPRA-PASS-441"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsUpdateProgressModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Submit Progress Evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
