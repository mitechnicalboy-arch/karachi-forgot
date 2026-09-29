import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, CheckCircle2, AlertCircle, FileText, SplitSquareVertical } from 'lucide-react';

export const ResolveComplaintModal: React.FC = () => {
  const { 
    isResolveModalOpen, 
    setIsResolveModalOpen, 
    complaints, 
    selectedComplaintId, 
    resolveComplaintWithEvidence 
  } = useApp();

  const complaint = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  const [description, setDescription] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80');
  const [documentRef, setDocumentRef] = useState('');
  const [error, setError] = useState('');

  if (!isResolveModalOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 15) {
      setError('Please provide a descriptive engineering resolution summary (minimum 15 characters).');
      return;
    }
    if (!afterImageUrl) {
      setError('Mandatory resolution evidence: An after-action photograph is required to certify repair.');
      return;
    }

    resolveComplaintWithEvidence(complaint.id, {
      description: description.trim(),
      afterImageUrl,
      documentRef: documentRef.trim() || undefined
    });

    setIsResolveModalOpen(false);
  };

  const sampleResolutionPhotos = [
    { label: 'Re-Asphalted Pothole', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Welded Clean Pipe Line', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' },
    { label: 'Desilted Clean Culvert Drain', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Repaired Bridge Ramp', url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
              Official Resolution Evidence Certification
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Certify Resolution: {complaint.id}
            </h3>
          </div>
          <button
            onClick={() => setIsResolveModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-[#0F5132] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Evidence Policy:</strong> In accordance with KARACHI FORGOT standards, officers cannot unilaterally close complaints without uploading after-action visual evidence of completed civil works.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Before & After Visual Preview */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                BEFORE (Citizen Report)
              </span>
              <div className="h-28 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 relative">
                <img 
                  src={complaint.evidenceImages[0]} 
                  alt="Before" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Reported
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1.5">
                AFTER (Resolution Proof)
              </span>
              <div className="h-28 rounded-lg overflow-hidden border border-emerald-400 bg-emerald-50 relative">
                <img 
                  src={afterImageUrl} 
                  alt="After" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 left-1 bg-emerald-800 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  Repaired
                </span>
              </div>
            </div>
          </div>

          {/* Description of Resolution */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Field Resolution Actions & Repair Details *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="State the technical remedies deployed (e.g. excavation backfilled with 40mm aggregate, wearing course laid, pipeline collar welded and pressure verified)..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
              required
            />
          </div>

          {/* After Photo selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Select After-Action Photographic Evidence *
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {sampleResolutionPhotos.map((photo, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAfterImageUrl(photo.url)}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    afterImageUrl === photo.url 
                      ? 'border-[#0F5132] bg-emerald-50 text-[#0F5132] font-semibold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-8 h-8 object-cover rounded shrink-0" referrerPolicy="no-referrer" />
                  <span className="truncate text-[10px]">{photo.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Camera size={16} className="text-slate-400" />
              <input
                type="text"
                value={afterImageUrl}
                onChange={(e) => setAfterImageUrl(e.target.value)}
                placeholder="Or paste inspection photo URL..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Optional Document ref */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Work Order / Inspection Completion Certificate Reference
            </label>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              <input
                type="text"
                value={documentRef}
                onChange={(e) => setDocumentRef(e.target.value)}
                placeholder="e.g. KMC-WO-2026-9021 / KWSC-INSP-CERT"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsResolveModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Certify & Resolve Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
