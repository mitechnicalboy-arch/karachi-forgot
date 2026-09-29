import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, KarachiDistrict } from '../../types';
import { DEMO_USERS } from '../../data/demoUsers';
import { 
  X, User, Shield, Briefcase, Eye as EyeIcon, Lock, 
  Mail, MapPin, Building, Key, CheckCircle, ArrowRight, 
  Smartphone, Award, AlertCircle 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    signup, 
    registeredUsers 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Sign Up fields
  const [name, setName] = useState('');
  const [district, setDistrict] = useState<KarachiDistrict>('East');
  const [department, setDepartment] = useState('Karachi Metropolitan Corporation');
  const [designation, setDesignation] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your email address or username.');
      return;
    }

    if (!password || password.length < 4) {
      setFormError('Please provide your password (at least 4 characters).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = login(email, password, selectedRole);
      if (!success) {
        setFormError('Invalid credentials. Please verify your email and password.');
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signup({
        name,
        email,
        role: selectedRole,
        district,
        department: selectedRole !== 'citizen' ? department : undefined,
        designation: selectedRole !== 'citizen' ? designation : undefined,
        badgeNumber: selectedRole !== 'citizen' ? badgeNumber : undefined,
        phone,
        password
      });
    }, 450);
  };

  const districts: KarachiDistrict[] = ['Central', 'East', 'South', 'West', 'Korangi', 'Malir', 'Keamari'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              KF
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {authModalMode === 'login' ? 'Sign In to KARACHI FORGOT' : 'Create Civic Account'}
              </h2>
              <p className="text-xs text-slate-500">
                Civic Transparency & Public Infrastructure Monitoring
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setFormError('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalMode === 'login'
                ? 'border-[#0F5132] text-[#0F5132] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setFormError('');
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalMode === 'signup'
                ? 'border-[#0F5132] text-[#0F5132] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Designated Platform Roles (Only Roles Displayed) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" />
                <span>Select Role</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                4 Official Roles
              </span>
            </div>

            {/* 4 Roles Only Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Role 1: Platform Admin */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('admin@karachiforgot.gov.pk');
                  setPassword('Admin@123');
                  setFormError('');
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-1 ring-rose-500/60 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Shield size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Administrator</span>
              </button>

              {/* Role 2: Department Supervisor */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('supervisor');
                  setEmail('supervisor@sindh.gov.pk');
                  setPassword('Supervisor@123');
                  setFormError('');
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'supervisor'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 ring-1 ring-purple-500/60 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'supervisor' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                  <EyeIcon size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Supervisor</span>
              </button>

              {/* Role 3: Municipal Project Officer */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('officer');
                  setEmail('officer@kmc.gov.pk');
                  setPassword('Officer@123');
                  setFormError('');
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'officer'
                    ? 'bg-blue-950/60 border-blue-500 text-blue-300 ring-1 ring-blue-500/60 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'officer' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Briefcase size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Project Officer</span>
              </button>

              {/* Role 4: Karachi Citizen */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('citizen');
                  setEmail('citizen@karachiforgot.org');
                  setPassword('Citizen@123');
                  setFormError('');
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'citizen'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/60 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${selectedRole === 'citizen' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <User size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">Citizen</span>
              </button>

            </div>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Login Form */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email, Username, or CNIC
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tariq.siddiqui@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-transparent outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Secure credentials
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-transparent outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <EyeIcon size={14} />
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Shield size={14} className="text-[#0F5132] shrink-0" />
                <span>
                  Role & permissions are authenticated directly from your registered account.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Platform</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('signup')}
                    className="text-[#0F5132] font-bold hover:underline"
                  >
                    Register as Citizen or Official
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Siddiqui"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Category
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden font-medium"
                  >
                    <option value="citizen">Karachi Citizen</option>
                    <option value="officer">Municipal Project Officer</option>
                    <option value="supervisor">Department Supervisor</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as KarachiDistrict)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                  >
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedRole !== 'citizen' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={13} className="text-blue-600" />
                    Official Department Credentials
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. KMC Works & Services"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Sub-Engineer"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Official Badge #</label>
                      <input
                        type="text"
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="e.g. KMC-104"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Set Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] outline-hidden"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  By registering, you acknowledge that KARACHI FORGOT is a neutral civic audit portal. All reported evidence must reflect genuine ground realities.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-[#0F5132] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
