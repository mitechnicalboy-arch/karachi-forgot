import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, KarachiDistrict, WasteReport } from '../../types';
import { X, Trash2, Camera, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ReportWasteModal: React.FC = () => {
  const { isReportWasteModalOpen, setIsReportWasteModalOpen, addWasteReport } = useApp();

  const [category, setCategory] = useState<WasteCategory>('Overflowing Bin');
  const [district, setDistrict] = useState<KarachiDistrict>('East');
  const [locationName, setLocationName] = useState('');
  const [densityLevel, setDensityLevel] = useState<WasteReport['densityLevel']>('Moderate');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1611288870280-4a80ebb90768?auto=format&fit=crop&w=800&q=80');
  const [latitude, setLatitude] = useState(24.8715);
  const [longitude, setLongitude] = useState(67.0601);
  const [error, setError] = useState('');

  if (!isReportWasteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !description.trim()) {
      setError('Please provide the exact street location and a brief description of the waste accumulation.');
      return;
    }

    addWasteReport({
      category,
      district,
      locationName: locationName.trim(),
      densityLevel,
      description: description.trim(),
      latitude,
      longitude,
      imageUrl: imageUrl.trim() || undefined,
    });

    setIsReportWasteModalOpen(false);
  };

  const samplePhotos = [
    { label: 'Overflowing Bin', url: 'https://images.unsplash.com/photo-1611288870280-4a80ebb90768?auto=format&fit=crop&w=800&q=80' },
    { label: 'Illegal Dumping', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
    { label: 'Roadside Rubble', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Trash2 size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-orange-800 uppercase tracking-wide">
                Smart Municipal Solid Waste Portal
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Report Waste or Garbage Hotspot
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsReportWasteModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Waste Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WasteCategory)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
              >
                <option value="Overflowing Bin">Overflowing Municipal Bin</option>
                <option value="Garbage Pile">Uncollected Garbage Pile</option>
                <option value="Illegal Dumping">Illegal Commercial Dumping</option>
                <option value="Missed Collection">Missed Door-to-Door Collection</option>
                <option value="Waste on Road">Litter / Waste on Highway</option>
                <option value="Construction Waste">Construction & Demolition Debris</option>
                <option value="Other">Other Solid Waste Problem</option>
              </select>
            </div>

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
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Location / Street / Market Landmark *
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Tariq Road Commercial Area near Liberty signal"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Estimated Waste Accumulation Density
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { lvl: 'Low', color: 'border-blue-300 text-blue-800' },
                { lvl: 'Moderate', color: 'border-amber-300 text-amber-800' },
                { lvl: 'Severe', color: 'border-orange-400 text-orange-900' },
                { lvl: 'Critical Hotspot', color: 'border-rose-400 text-rose-900' }
              ].map(({ lvl, color }) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setDensityLevel(lvl as any)}
                  className={`p-2 rounded-lg border font-semibold text-center transition-all ${
                    densityLevel === lvl ? 'bg-orange-50 border-orange-600 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Description & Field Notes *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State how many bins are overflowing, foul odor, or if roadway passage is obstructed..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-600"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Photographic Evidence
            </label>
            <div className="flex items-center gap-2 mb-2">
              {samplePhotos.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`p-1 rounded-lg border flex items-center gap-1.5 ${
                    imageUrl === p.url ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-6 h-6 object-cover rounded" referrerPolicy="no-referrer" />
                  <span className="text-[10px] text-slate-700">{p.label}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Photo URL..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReportWasteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Submit Waste Alert to SSWMB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
