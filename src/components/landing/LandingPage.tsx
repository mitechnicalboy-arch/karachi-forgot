import React from 'react';
import { useApp } from '../../context/AppContext';
import { KarachiSkylineIllustration } from '../common/CivicIllustrations';
import { ProjectCard } from '../projects/ProjectCard';
import { ComplaintCard } from '../issues/ComplaintCard';
import { 
  PlusCircle, Compass, ShieldCheck, CheckCircle2, Search, 
  MapPin, ArrowRight, Building2, Droplets, Waves, Trees, 
  Trash2, Lightbulb, Construction, Eye, FileText, Check 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    projects, 
    complaints, 
    wasteReports,
    setActiveTab, 
    setIsReportModalOpen, 
    setSelectedProjectId 
  } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Procurement').length;
  const resolvedComplaintsCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const infrastructureCategories = [
    { name: 'Roads & Flyovers', desc: 'Carriageway dualization, flyovers, resurfacing', icon: '🛣️', count: '14 Active' },
    { name: 'Bridges & Culverts', desc: 'Port connectors, river overhauls, expansion joints', icon: '🌉', count: '8 Active' },
    { name: 'Stormwater & Drainage', desc: 'Nullah widening, silt traps, monsoon flood bunds', icon: '🌊', count: '12 Active' },
    { name: 'Water Supply', desc: 'Bulk raw water conduits, pipelines, pumping stations', icon: '💧', count: '16 Active' },
    { name: 'Sewerage & Effluent', desc: 'Trunk gravity interceptors, treatment plants', icon: '🚰', count: '9 Active' },
    { name: 'Parks & Urban Green', desc: 'Eco-revitalization, native trees, walking tracks', icon: '🌳', count: '11 Active' },
    { name: 'Smart Waste', desc: 'GTS transfer stations, compactor trucks, bin sweeps', icon: '🗑️', count: '15 Active' },
    { name: 'Public Buildings', desc: 'Civic dispensaries, fire stations, community centers', icon: '🏛️', count: '6 Active' },
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Karachi Civic Transparency Initiative</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                See What's Happening in Karachi.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Track public projects, report civic issues, monitor waste problems, and follow actions in one transparent platform.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-6 py-3.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Compass size={18} />
                  <span>Explore Karachi Map</span>
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-extrabold transition-all shadow-sm flex items-center gap-2"
                >
                  <PlusCircle size={18} />
                  <span>Report an Issue</span>
                </button>
              </div>

              {/* Tagline micro-quote */}
              <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider pt-2">
                "See It. Report It. Track It. Improve Karachi."
              </p>
            </div>

            {/* Right City Vector Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <KarachiSkylineIllustration className="w-full h-auto" />
              </div>
              <div className="text-[10px] text-center text-slate-400 mt-2 font-mono">
                Karachi Flyover & Urban Infrastructure GIS Visualization
              </div>
            </div>

          </div>

          {/* Live-Looking Demo Statistics Row (Clearly labeled Demo Data as required) */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                City-Wide Civic Telemetry
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Demo Data
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Projects Tracked</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                  {projects.length > 0 ? projects.length : 0}
                </span>
                <span className="text-[10px] text-slate-400">All 7 Districts</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Active Projects</span>
                <span className="text-2xl font-black text-[#0F5132] font-mono mt-1 block">
                  {activeProjectsCount}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">In execution</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Issues Reported</span>
                <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                  {complaints.length}
                </span>
                <span className="text-[10px] text-amber-700">Citizen submissions</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Issues Resolved</span>
                <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                  {resolvedComplaintsCount}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">With photo proof</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 font-medium block">Waste Reports</span>
                <span className="text-2xl font-black text-orange-600 font-mono mt-1 block">
                  {wasteReports.length}
                </span>
                <span className="text-[10px] text-orange-700">SSWMB route logs</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: How KARACHI FORGOT Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
            Evidence-Based Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How KARACHI FORGOT Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A structured civic pipeline transforming citizen vigilance into audited municipal accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Discover',
              desc: 'Explore public projects across all 7 districts of Karachi. Review approved budgets, contractors, engineering milestones, and GIS locations.',
              icon: Search,
              color: 'text-blue-700 bg-blue-50 border-blue-200'
            },
            {
              step: '02',
              title: 'Report',
              desc: 'Submit evidence-backed civic issues and waste hotspots with exact coordinates, photos, and severity ratings. Group duplicates to avoid spam.',
              icon: PlusCircle,
              color: 'text-amber-700 bg-amber-50 border-amber-200'
            },
            {
              step: '03',
              title: 'Verify',
              desc: 'Submissions are treated as citizen reports until verified by department supervisors or independent field inspectors. Factual neutrality guaranteed.',
              icon: ShieldCheck,
              color: 'text-purple-700 bg-purple-50 border-purple-200'
            },
            {
              step: '04',
              title: 'Resolve',
              desc: 'Public officers cannot unilaterally close complaints without uploading after-action visual evidence of completed civil works.',
              icon: CheckCircle2,
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#0F5132] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black font-mono text-slate-300 group-hover:text-[#0F5132] transition-colors">
                    {item.step}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Everything Karachi Needs, In One Place */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
            Comprehensive City Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything Karachi Needs, In One Place
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From heavy highway dualization to localized overflowing dumpsters, unified under one civic platform.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {infrastructureCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveTab('projects');
              }}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-left group"
            >
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#0F5132] transition-colors">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                {cat.desc}
              </p>
              <div className="mt-3 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                {cat.count}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: Built Around Evidence (Mandatory Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Integrity & Neutrality Constitution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Built Around Evidence, Not Allegations.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              KARACHI FORGOT is fundamentally non-political and neutral. The platform strictly distinguishes between <strong>Official Project Information</strong>, <strong>Citizen Reports</strong>, <strong>Verified Field Evidence</strong>, and <strong>Administrative Actions</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">1. Citizen Reports</span>
                <p className="text-slate-400 text-[11px]">
                  Treated as unverified submissions. Citizens cannot unilaterally brand contractors or authorities without inspection.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <span className="font-bold text-purple-400 block text-xs">2. Independent Verification</span>
                <p className="text-slate-400 text-[11px]">
                  Supervisors audit physical field proof against SPPRA tenders, asphalt testing certificates, and GPS tags.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <span className="font-bold text-emerald-400 block text-xs">3. Resolution Proof</span>
                <p className="text-slate-400 text-[11px]">
                  Officers cannot close issues by typing words alone. High-resolution before & after photos are mandatory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Karachi Infrastructure Projects
            </h2>
            <p className="text-xs text-slate-500">Live public engineering investments under active civic monitoring.</p>
          </div>
          <button
            onClick={() => { setSelectedProjectId(null); setActiveTab('projects'); }}
            className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1"
          >
            <span>Explore All Projects</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-1 md:col-span-3 text-center py-12 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-2">
              <Building2 className="mx-auto text-slate-300" size={36} />
              <h3 className="text-sm font-bold text-slate-700">No Infrastructure Projects Registered Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                The civic ledger begins clean. Municipal Project Officers and Administrators can register public infrastructure works and PC-1 budget allocations.
              </p>
            </div>
          ) : (
            projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Help Make Karachi Better, Block by Block.
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto">
            Whether it's an unpaved road crater in Korangi, an uncollected garbage pile in Saddar, or a major highway bridge in Keamari, track real change today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-extrabold transition-all shadow-md"
            >
              Explore Karachi
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-extrabold transition-all border border-slate-300"
            >
              Report an Issue
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
