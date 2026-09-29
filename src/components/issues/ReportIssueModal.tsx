import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueCategory, KarachiDistrict } from '../../types';
import { 
  X, AlertTriangle, MapPin, Camera, CheckCircle2, ChevronRight, 
  ChevronLeft, Building, ShieldAlert, Sparkles, Navigation 
} from 'lucide-react';

export const ReportIssueModal: React.FC = () => {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    addComplaint, 
    projects,
    showToast,
    currentUser
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<IssueCategory>('Road Damage');
  const [district, setDistrict] = useState<KarachiDistrict>(currentUser?.district || 'Korangi');
  const [neighborhood, setNeighborhood] = useState('');
  const [latitude, setLatitude] = useState(24.8340);
  const [longitude, setLongitude] = useState(67.1160);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [reporterName, setReporterName] = useState(currentUser?.name || 'Tariq Siddiqui');
  const [reporterContact, setReporterContact] = useState(currentUser?.email || currentUser?.phone || '+92 300 8291044');
  const [relatedProjectId, setRelatedProjectId] = useState<string>('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [error, setError] = useState('');

  if (!isReportModalOpen) return null;

  const categoriesList: { cat: IssueCategory; icon: string; desc: string }[] = [
    { cat: 'Road Damage', icon: '🛣️', desc: 'Potholes, broken asphalt, craters, cave-ins' },
    { cat: 'Water Leakage', icon: '💧', desc: 'Burst main pipelines, leaking meters, wastage' },
    { cat: 'Drainage Blockage', icon: '🌊', desc: 'Clogged stormwater culverts, flooded roads' },
    { cat: 'Sewerage Issue', icon: '🚰', desc: 'Overflowing gutters, broken manholes, stench' },
    { cat: 'Streetlight Problem', icon: '💡', desc: 'Unlit high-masts, broken cables, dark highways' },
    { cat: 'Bridge Issue', icon: '🌉', desc: 'Damaged expansion joints, guardrails, ramp cracks' },
    { cat: 'Waste Accumulation', icon: '🗑️', desc: 'Uncollected refuse heaps, illegal dumping' },
    { cat: 'Overflowing Bin', icon: '📦', desc: 'Municipal dumpster overflowing onto sidewalk' },
    { cat: 'Park Damage', icon: '🌳', desc: 'Broken play equipment, dried lawns, damaged fence' },
    { cat: 'Construction Issue', icon: '🏗️', desc: 'Unmarked trenches, missing warning barriers' },
    { cat: 'Safety Concern', icon: '⚠️', desc: 'Exposed live cables, open deep holes' },
    { cat: 'Other', icon: '📌', desc: 'Other municipal infrastructure defects' },
  ];

  const handleNext = () => {
    setError('');
    if (step === 2 && !neighborhood.trim()) {
      setError('Please provide specific street or landmark details in Karachi.');
      return;
    }
    if (step === 3 && (!title.trim() || !description.trim() || description.length < 15)) {
      setError('Please provide a title and at least 15 characters describing the issue clearly.');
      return;
    }
    if (step === 4 && evidenceImages.length === 0) {
      setError('Photographic evidence is required to prevent ungrounded spam complaints.');
      return;
    }
    if (step === 5 && !reporterName.trim()) {
      setError('Please provide your name or citizen handle.');
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleBrowserGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          showToast('GPS coordinates pinned from device location', 'info');
        },
        () => {
          showToast('Geolocation permission denied. Defaulting to Karachi center.', 'warning');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createdId = addComplaint({
      category,
      title: title.trim(),
      description: description.trim(),
      district,
      neighborhood: neighborhood.trim(),
      latitude,
      longitude,
      reporterName: reporterName.trim() || 'Concerned Citizen',
      reporterContact: reporterContact.trim() || undefined,
      relatedProjectId: relatedProjectId || undefined,
      evidenceImages,
      priority
    });

    setIsReportModalOpen(false);
    // Reset state
    setStep(1);
    setTitle('');
    setDescription('');
    setNeighborhood('');
  };

  const addPhoto = () => {
    if (customPhotoUrl.trim()) {
      setEvidenceImages(prev => [...prev, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
                Step {step} of 6
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-slate-600">
                {step === 1 && 'Select Issue Category'}
                {step === 2 && 'Location & Coordinates'}
                {step === 3 && 'Issue Description'}
                {step === 4 && 'Evidence Photos'}
                {step === 5 && 'Related Project & Reporter'}
                {step === 6 && 'Review & Verification Disclaimer'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Report a Civic Issue in Karachi
            </h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="h-1 w-full bg-slate-100 shrink-0">
          <div 
            className="h-full bg-[#0F5132] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="m-6 mb-0 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Choose the primary category that best reflects the civic problem:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categoriesList.map((item) => (
                  <button
                    type="button"
                    key={item.cat}
                    onClick={() => setCategory(item.cat)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      category === item.cat
                        ? 'border-[#0F5132] bg-emerald-50/60 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <h4 className="font-bold text-slate-900 text-xs">{item.cat}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as KarachiDistrict)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
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

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Severity / Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="Urgent">Urgent (Safety Risk / Road Block)</option>
                    <option value="High">High (Major Inconvenience)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Neighborhood / Landmark / Street Location *
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Sector 7 Korangi Industrial Area near Main Chowk"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              {/* Pin Coordinates & Geolocation */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#0F5132]" />
                    Geographic Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={handleBrowserGeolocation}
                    className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
                  >
                    <Navigation size={12} />
                    Use Device GPS
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-600 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Latitude</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Longitude</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DESCRIPTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep asphalt potholes damaging vehicles on main avenue"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Detailed Description & Public Impact *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue size, hazard for motorists or pedestrians, how long it has persisted, and immediate dangers..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 4: EVIDENCE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2">
                <Camera size={16} className="text-[#0F5132] shrink-0 mt-0.5" />
                <p>
                  <strong>Evidence-First Policy:</strong> Unsubstantiated claims cannot be processed. Please provide clear photographic evidence showing the defect.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  Evidence Photos ({evidenceImages.length} attached)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {evidenceImages.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-100 group">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setEvidenceImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900"
                  >
                    Add Image
                  </button>
                </div>

                {/* Quick Samples */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 py-1">Quick Demo Photos:</span>
                  {[
                    { label: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Drainage', url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' }
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setEvidenceImages(prev => [...prev, s.url])}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-medium text-slate-700"
                    >
                      + {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: RELATED PROJECT & REPORTER */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Link to Ongoing Public Project (Optional)
                </label>
                <select
                  value={relatedProjectId}
                  onChange={(e) => setRelatedProjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="">-- No related project / Standalone issue --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name} ({p.district})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  If this issue occurs within a designated project site, linking it routes alerts to the assigned project officer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Your Name / Handle *
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Asad Siddiqui"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Contact Email / Phone (Confidential)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="e.g. asad@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & VERIFICATION DISCLAIMER */}
          {step === 6 && (
            <div className="space-y-5">
              
              {/* Mandatory Prompt Requirement Box */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <ShieldAlert size={16} className="text-amber-700" />
                  Verification & Civic Neutrality Policy
                </div>
                <p className="text-xs leading-relaxed">
                  "This report will be reviewed before being marked as verified."
                  <br />
                  Under KARACHI FORGOT standards, citizen submissions are cataloged as <strong>Citizen Reports</strong> and are not treated as proven facts until official ground inspection or third-party audit verification.
                </p>
              </div>

              {/* Summary of Report */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <strong className="text-slate-900">{category}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900 font-medium">{neighborhood}, {district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-bold text-rose-700">{priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Title:</span>
                  <span className="text-slate-900 font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evidence:</span>
                  <span className="text-emerald-700 font-semibold">{evidenceImages.length} photos attached</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Status:</span>
                  <span className="font-mono text-amber-700 font-bold">SUBMITTED (Unverified)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl font-bold text-xs transition-colors shadow-md"
            >
              <CheckCircle2 size={16} />
              <span>Submit Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
