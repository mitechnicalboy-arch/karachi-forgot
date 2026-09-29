import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Bell, Search, PlusCircle, Shield, User, Briefcase, Eye, 
  LogIn, LogOut, ChevronDown, UserCheck, Sparkles, MapPin, Building
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    role, 
    notifications, 
    setIsNotificationOpen, 
    setIsSearchModalOpen,
    setIsReportModalOpen,
    setSelectedProjectId,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'map', label: 'Civic Map' },
    { id: 'issues', label: 'Issues' },
    { id: 'waste', label: 'Waste' },
    { id: 'area', label: 'Districts' },
    { id: 'analytics', label: 'Analytics' },
    ...(role === 'admin' 
      ? [{ id: 'admin' as NavTab, label: 'Admin Console' }] 
      : [{ id: 'dashboard' as NavTab, label: 'Dashboard' }]
    ),
  ];

  const getRoleBadgeStyle = (r: UserRole) => {
    switch (r) {
      case 'officer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'supervisor':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111318]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Wordmark Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-hidden cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-xs group-hover:bg-emerald-400 transition-colors">
              KF
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans whitespace-nowrap block leading-none">
                KARACHI FORGOT
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                CIVIC LEDGER
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.id === 'projects' && activeTab === 'project-detail');
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'projects') setSelectedProjectId(null);
                  setActiveTab(link.id);
                }}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'text-white bg-slate-800/90 font-bold border border-slate-700 shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Search + Auth / Role Profile + Notifications */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Search projects, issues, waste (Cmd/Ctrl+K)"
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            aria-label="View notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Dropdown Menu (Strict single-account, no role switching) */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/50"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="max-w-[100px] sm:max-w-[120px] truncate font-semibold text-slate-100">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm border ${getRoleBadgeStyle(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {/* Dropdown Menu - Strictly single session, NO other roles displayed */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    
                    {/* User Info Header */}
                    <div className="px-4 pb-3 border-b border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-sm font-black">
                            {currentUser.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate font-mono">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                          Role: {currentUser.role}
                        </span>
                        {currentUser.district && (
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                            Dist. {currentUser.district}
                          </span>
                        )}
                      </div>

                      {currentUser.department && (
                        <div className="text-[10px] text-slate-400 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/60 mt-1 truncate">
                          {currentUser.department}
                        </div>
                      )}
                    </div>

                    {/* Quick Link to My Dashboard */}
                    <div className="px-2 py-2 border-b border-slate-800">
                      <button
                        onClick={() => {
                          setActiveTab(currentUser.role === 'admin' ? 'admin' : 'dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl font-medium flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield size={14} className="text-emerald-400" />
                          <span>Open {currentUser.role.toUpperCase()} Dashboard</span>
                        </span>
                        <ArrowRight size={13} className="text-slate-500" />
                      </button>
                    </div>

                    {/* Sign Out Button (Role switching is disabled while logged in) */}
                    <div className="px-2 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out (Exit Session)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out / Guest state: Show Log In & Sign Up buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer border border-slate-800"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Register
              </button>
            </div>
          )}

          {/* Primary Action Button: Report an Issue */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer hover:shadow-emerald-500/20"
          >
            <PlusCircle size={15} />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800 bg-[#111318] no-scrollbar">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id || (link.id === 'projects' && activeTab === 'project-detail');
          return (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === 'projects') setSelectedProjectId(null);
                setActiveTab(link.id);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-white font-bold border border-slate-700' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

function ArrowRight(props: { size?: number; className?: string }) {
  return (
    <svg 
      width={props.size || 16} 
      height={props.size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
