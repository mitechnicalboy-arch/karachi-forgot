import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KarachiDistrict, WasteCategory, WasteStatus } from '../../types';
import L from 'leaflet';
import { Layers, Filter, RefreshCw, AlertTriangle, Info } from 'lucide-react';

export const WasteHotspotMap: React.FC = () => {
  const { wasteReports } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('7days');
  const [districtFilter, setDistrictFilter] = useState<KarachiDistrict | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<WasteCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<WasteStatus | 'All'>('All');

  const filteredWaste = useMemo(() => {
    return wasteReports.filter(w => {
      if (districtFilter !== 'All' && w.district !== districtFilter) return false;
      if (categoryFilter !== 'All' && w.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && w.status !== statusFilter) return false;
      return true;
    });
  }, [wasteReports, districtFilter, categoryFilter, statusFilter]);

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [24.8700, 67.0400],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | SSWMB Civic Density Layer',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Density Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    filteredWaste.forEach((w) => {
      let radius = 280;
      let color = '#F59E0B'; // amber for moderate
      let fillOpacity = 0.45;

      if (w.densityLevel === 'Low') {
        radius = 180;
        color = '#3B82F6';
        fillOpacity = 0.35;
      } else if (w.densityLevel === 'Severe') {
        radius = 420;
        color = '#EA580C';
        fillOpacity = 0.55;
      } else if (w.densityLevel === 'Critical Hotspot') {
        radius = 650;
        color = '#DC2626';
        fillOpacity = 0.65;
      }

      // Density buffer circle (heat-glow effect)
      const circleGlow = L.circle([w.latitude, w.longitude], {
        radius: radius * 1.5,
        color: color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.15,
      });

      // Core density circle
      const circleCore = L.circle([w.latitude, w.longitude], {
        radius: radius,
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: fillOpacity,
      });

      const popupHtml = `
        <div style="padding: 12px; min-width: 220px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
          <div style="font-size: 11px; font-weight: 700; color: #EA580C; margin-bottom: 4px;">
            ${w.id} · ${w.densityLevel}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0;">${w.locationName}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 6px 0;">📍 District ${w.district}</p>
          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">Category: <strong>${w.category}</strong></div>
          <div style="font-size: 11px; color: #334155;">Status: <strong>${w.status}</strong></div>
        </div>
      `;

      circleCore.bindPopup(popupHtml);

      layerGroup.addLayer(circleGlow);
      layerGroup.addLayer(circleCore);
    });

  }, [filteredWaste]);

  return (
    <div className="relative w-full h-[500px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
      
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Mandatory Title & Scientific Disclaimer Card (Top Left) */}
      <div className="absolute top-4 left-4 z-20 w-80 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-slate-200 pointer-events-auto text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
            <Layers size={15} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
              Reported Waste Issues Density
            </h4>
            <span className="text-[10px] text-slate-500">
              {filteredWaste.length} localized hotspot clusters mapped
            </span>
          </div>
        </div>

        {/* Explicit prompt compliance callout */}
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-900 flex items-start gap-1.5 leading-snug">
          <Info size={13} className="text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> This map reflects the density of <em>citizen and municipal complaints</em>, not ambient air/chemical pollution measurements.
          </span>
        </div>

        {/* Filters Grid */}
        <div className="pt-1 space-y-2 text-[11px]">
          {/* Time range */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id as any)}
                className={`py-1 text-center font-semibold rounded-md transition-colors ${
                  timeFilter === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">District</label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value as any)}
                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
              >
                <option value="All">All Districts</option>
                <option value="Central">Central</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="Korangi">Korangi</option>
                <option value="Malir">Malir</option>
                <option value="Keamari">Keamari</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px]"
              >
                <option value="All">All Types</option>
                <option value="Overflowing Bin">Overflowing Bin</option>
                <option value="Garbage Pile">Garbage Pile</option>
                <option value="Illegal Dumping">Illegal Dumping</option>
                <option value="Missed Collection">Missed Collection</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 text-[10px] pointer-events-auto">
        <span className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
          Reported Density Scale
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <span className="text-slate-600">Severe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-600">Critical Hotspot</span>
          </div>
        </div>
      </div>

    </div>
  );
};
