import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, Complaint, WasteReport, KarachiDistrict, ProjectCategory } from '../../types';
import L from 'leaflet';
import { 
  Filter, Search, MapPin, Eye, CheckCircle2, Clock, AlertTriangle, 
  Trash2, Droplets, Layers, ChevronDown, ChevronUp, RefreshCw 
} from 'lucide-react';

export const CivicMapComponent: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = true }) => {
  const { 
    projects, 
    complaints, 
    wasteReports, 
    setSelectedProjectId, 
    setSelectedComplaintId, 
    setActiveTab 
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filters state
  const [selectedDistrict, setSelectedDistrict] = useState<KarachiDistrict | 'All'>('All');
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'projects' | 'issues' | 'waste'>('all');
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<ProjectCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  // Marker colors specified in requirement:
  // GREEN: Completed projects
  // BLUE: Projects in progress
  // YELLOW: Delayed projects
  // RED: Open civic issues
  // ORANGE: Waste hotspots
  // PURPLE: Water/drainage issues
  const createCustomIcon = (type: 'green' | 'blue' | 'yellow' | 'red' | 'orange' | 'purple', label?: string) => {
    let hex = '#16A34A'; // default green
    if (type === 'blue') hex = '#2563EB';
    if (type === 'yellow') hex = '#F59E0B';
    if (type === 'red') hex = '#DC2626';
    if (type === 'orange') hex = '#EA580C';
    if (type === 'purple') hex = '#9333EA';

    const html = `
      <div style="position: relative; width: 32px; height: 38px; transform: translate(-16px, -38px);">
        <svg viewBox="0 0 32 38" width="32" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 27.2 16 38 16 38C16 38 32 27.2 32 16C32 7.16 24.84 0 16 0Z" fill="${hex}" />
          <circle cx="16" cy="15" r="7" fill="#FFFFFF" />
          <circle cx="16" cy="15" r="4.5" fill="${hex}" />
        </svg>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-map-pin',
      iconSize: [32, 38],
      iconAnchor: [16, 38],
      popupAnchor: [0, -36],
    });
  };

  // Filter items
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Filter Projects
    const filteredProjects = projects.filter(p => {
      if (selectedLayer === 'issues' || selectedLayer === 'waste') return false;
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
      if (selectedProjectCategory !== 'All' && p.category !== selectedProjectCategory) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q) && !p.neighborhood.toLowerCase().includes(q)) return false;
      return true;
    });

    // 2. Filter Complaints
    const filteredComplaints = complaints.filter(c => {
      if (selectedLayer === 'projects' || selectedLayer === 'waste') return false;
      if (selectedDistrict !== 'All' && c.district !== selectedDistrict) return false;
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q) && !c.neighborhood.toLowerCase().includes(q)) return false;
      return true;
    });

    // 3. Filter Waste Reports
    const filteredWaste = wasteReports.filter(w => {
      if (selectedLayer === 'projects' || selectedLayer === 'issues') return false;
      if (selectedDistrict !== 'All' && w.district !== selectedDistrict) return false;
      if (selectedStatus !== 'All' && w.status !== selectedStatus) return false;
      if (q && !w.locationName.toLowerCase().includes(q) && !w.id.toLowerCase().includes(q)) return false;
      return true;
    });

    return { projects: filteredProjects, complaints: filteredComplaints, waste: filteredWaste };
  }, [projects, complaints, wasteReports, selectedLayer, selectedDistrict, selectedProjectCategory, selectedStatus, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Karachi Coordinates: 24.8607° N, 67.0011° E
    const map = L.map(mapContainerRef.current, {
      center: [24.8700, 67.0400],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Clean OpenStreetMap tiles (standard free open civic map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Karachi Civic GIS',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Projects
    filteredData.projects.forEach((prj) => {
      let pinType: 'green' | 'blue' | 'yellow' = 'blue';
      if (prj.status === 'Completed') pinType = 'green';
      else if (prj.status === 'Delayed') pinType = 'yellow';

      const icon = createCustomIcon(pinType);
      const marker = L.marker([prj.latitude, prj.longitude], { icon });

      const popupHtml = `
        <div style="padding: 14px; min-width: 250px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #0F5132; background: #ECFDF5; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${prj.code}</span>
            <span style="font-size: 11px; font-weight: 600; color: #475569;">${prj.status}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0; line-height: 1.3;">${prj.name}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">📍 ${prj.neighborhood} (${prj.district})</p>
          
          <div style="background: #F8FAFC; padding: 8px; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Category:</span>
              <strong style="color: #0F172A;">${prj.category}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Progress:</span>
              <strong style="color: #0F172A;">${prj.progressPercent}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Open Issues:</span>
              <strong style="color: ${prj.openIssuesCount > 0 ? '#DC2626' : '#16A34A'};">${prj.openIssuesCount}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Last Updated:</span>
              <span style="color: #475569; font-family: monospace;">${prj.lastUpdated}</span>
            </div>
          </div>

          <button id="view-prj-${prj.id}" style="width: 100%; background: #0F5132; color: #ffffff; border: none; padding: 7px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            View Project Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-prj-${prj.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedProjectId(prj.id);
            setActiveTab('project-detail');
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    // 2. Complaints (RED for general issues, PURPLE for water/drainage issues)
    filteredData.complaints.forEach((cmp) => {
      const isWaterDrainage = cmp.category === 'Water Leakage' || cmp.category === 'Drainage Blockage' || cmp.category === 'Sewerage Issue';
      const pinType: 'purple' | 'red' = isWaterDrainage ? 'purple' : 'red';

      const icon = createCustomIcon(pinType);
      const marker = L.marker([cmp.latitude, cmp.longitude], { icon });

      const popupHtml = `
        <div style="padding: 14px; min-width: 250px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #B45309; background: #FEF3C7; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${cmp.id}</span>
            <span style="font-size: 11px; font-weight: 600; color: ${cmp.status === 'Resolved' ? '#16A34A' : '#DC2626'};">${cmp.status}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0; line-height: 1.3;">${cmp.title}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">📍 ${cmp.neighborhood} (${cmp.district})</p>
          
          <div style="background: #F8FAFC; padding: 8px; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Category:</span>
              <strong style="color: #0F172A;">${cmp.category}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Citizen Reports:</span>
              <strong style="color: #0F172A;">${cmp.citizenReportCount} citizens</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Status:</span>
              <span>${cmp.isVerifiedFact ? '✓ Verified Issue' : 'Citizen Report (Under Review)'}</span>
            </div>
          </div>

          <button id="view-cmp-${cmp.id}" style="width: 100%; background: #0F172A; color: #ffffff; border: none; padding: 7px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            View Issue Report →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-cmp-${cmp.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedComplaintId(cmp.id);
            setActiveTab('issues');
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    // 3. Waste Reports (ORANGE)
    filteredData.waste.forEach((wst) => {
      const icon = createCustomIcon('orange');
      const marker = L.marker([wst.latitude, wst.longitude], { icon });

      const popupHtml = `
        <div style="padding: 14px; min-width: 250px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #EA580C; background: #FFEDD5; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${wst.id}</span>
            <span style="font-size: 11px; font-weight: 600; color: #EA580C;">${wst.densityLevel}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0; line-height: 1.3;">${wst.locationName}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0;">📍 District ${wst.district}</p>
          
          <div style="background: #F8FAFC; padding: 8px; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748B;">Category:</span>
              <strong style="color: #0F172A;">${wst.category}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Status:</span>
              <strong style="color: #0F172A;">${wst.status}</strong>
            </div>
          </div>

          <button id="view-wst-${wst.id}" style="width: 100%; background: #EA580C; color: #ffffff; border: none; padding: 7px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            View Waste Hotspot →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-wst-${wst.id}`);
        if (btn) {
          btn.onclick = () => {
            setActiveTab('waste');
          };
        }
      });

      markersLayer.addLayer(marker);
    });

  }, [filteredData, setSelectedProjectId, setSelectedComplaintId, setActiveTab]);

  const resetFilters = () => {
    setSelectedDistrict('All');
    setSelectedLayer('all');
    setSelectedProjectCategory('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  const totalVisible = filteredData.projects.length + filteredData.complaints.length + filteredData.waste.length;

  return (
    <div className={`relative w-full ${fullScreen ? 'h-[calc(100vh-4rem)]' : 'h-[540px]'} bg-slate-100 overflow-hidden`}>
      
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Control & Filter Card (Top Left) */}
      <div className="absolute top-4 left-4 z-20 w-80 sm:w-96 max-h-[calc(100%-2rem)] flex flex-col pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden pointer-events-auto flex flex-col">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0F5132] text-white flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Karachi Civic GIS Map
                </h3>
                <span className="text-[11px] text-slate-500">
                  {totalVisible} active civic markers visible
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetFilters}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Reset filters"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                title={isFilterPanelOpen ? "Collapse filters" : "Expand filters"}
              >
                {isFilterPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Collapsible Filter Body */}
          {isFilterPanelOpen && (
            <div className="p-3.5 space-y-3 overflow-y-auto max-h-[60vh] text-xs">
              
              {/* Search bar */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project, issue, road, area..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              {/* Layer Selection Tabs */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Layer Filter
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'issues', label: 'Issues' },
                    { id: 'waste', label: 'Waste' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedLayer(tab.id as any)}
                      className={`py-1 text-[11px] font-medium rounded-md transition-colors ${
                        selectedLayer === tab.id 
                          ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
                >
                  <option value="All">All 7 Karachi Districts</option>
                  <option value="Central">District Central</option>
                  <option value="East">District East</option>
                  <option value="South">District South</option>
                  <option value="West">District West</option>
                  <option value="Korangi">District Korangi</option>
                  <option value="Malir">District Malir</option>
                  <option value="Keamari">District Keamari</option>
                </select>
              </div>

              {/* Project Category Filter (if projects visible) */}
              {(selectedLayer === 'all' || selectedLayer === 'projects') && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Project Category
                  </label>
                  <select
                    value={selectedProjectCategory}
                    onChange={(e) => setSelectedProjectCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Roads">Roads & Flyovers</option>
                    <option value="Bridges">Bridges</option>
                    <option value="Parks">Parks & Green Spaces</option>
                    <option value="Flood Management">Flood Management / Culverts</option>
                    <option value="Water">Water Infrastructure</option>
                    <option value="Sewerage">Sewerage & Effluent</option>
                    <option value="Public Buildings">Public Buildings</option>
                    <option value="Waste Management">Waste Management</option>
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0F5132]"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress / Action In Progress</option>
                  <option value="Delayed">Delayed / Overdue</option>
                  <option value="Completed">Completed / Resolved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-3 text-xs">
          <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers size={13} className="text-[#0F5132]" />
            Official Map Marker Legend
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <span className="text-slate-700">Completed Project</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
              <span className="text-slate-700">Project in Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-700">Delayed Project</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
              <span className="text-slate-700">Open Civic Issue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
              <span className="text-slate-700">Waste Hotspot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
              <span className="text-slate-700">Water / Drainage</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
