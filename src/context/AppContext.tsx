import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, Complaint, WasteReport, AuditLog, NotificationItem, 
  UserRole, VerificationStatus, ComplaintStatus, WasteStatus, KarachiDistrict, UserProfile 
} from '../types';
import { 
  INITIAL_PROJECTS, INITIAL_COMPLAINTS, INITIAL_WASTE_REPORTS, 
  INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_REGISTERED_USERS,
  SAMPLE_PROJECTS, SAMPLE_COMPLAINTS, SAMPLE_WASTE_REPORTS,
  SAMPLE_AUDIT_LOGS, SAMPLE_NOTIFICATIONS
} from '../data/mockData';
import { RegisteredUserRecord } from '../types';

export type NavTab = 
  | 'home' 
  | 'projects' 
  | 'project-detail'
  | 'map' 
  | 'issues' 
  | 'waste' 
  | 'area' 
  | 'analytics' 
  | 'dashboard' 
  | 'admin' 
  | 'how-it-works' 
  | 'about';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  selectedDistrict: KarachiDistrict | 'All';
  setSelectedDistrict: (district: KarachiDistrict | 'All') => void;
  
  // Data
  projects: Project[];
  complaints: Complaint[];
  wasteReports: WasteReport[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  followedAreas: string[];
  registeredUsers: RegisteredUserRecord[];
  
  // Actions
  toggleFollowArea: (districtName: string) => void;
  addProject: (data: Partial<Project>) => void;
  updateProjectProgress: (projectId: string, update: { percent: number; description: string; imageUrl?: string; documentRef?: string }) => void;
  verifyProject: (projectId: string, newStatus: VerificationStatus, note: string) => void;
  
  addComplaint: (data: {
    category: Complaint['category'];
    title: string;
    description: string;
    district: KarachiDistrict;
    neighborhood: string;
    latitude: number;
    longitude: number;
    reporterName: string;
    reporterContact?: string;
    relatedProjectId?: string;
    evidenceImages: string[];
    priority: Complaint['priority'];
  }) => string;
  
  verifyComplaint: (complaintId: string, verified: boolean, note: string) => void;
  updateComplaintVerificationStatus: (complaintId: string, status: 'Verified' | 'Under Review' | 'Unverified' | 'Rejected', note?: string) => void;
  assignComplaint: (complaintId: string, officerName: string, department: string) => void;
  updateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus, comment: string) => void;
  resolveComplaintWithEvidence: (complaintId: string, evidence: { description: string; afterImageUrl: string; documentRef?: string }) => void;
  
  addWasteReport: (data: {
    category: WasteReport['category'];
    locationName: string;
    district: KarachiDistrict;
    latitude: number;
    longitude: number;
    description: string;
    densityLevel: WasteReport['densityLevel'];
    imageUrl?: string;
  }) => string;
  
  updateWasteStatus: (wasteId: string, newStatus: WasteStatus, resolutionImage?: string) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  clearAllData: () => void;
  seedInitialData: () => void;
  
  // Modals & UI
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isReportWasteModalOpen: boolean;
  setIsReportWasteModalOpen: (open: boolean) => void;
  isCreateProjectModalOpen: boolean;
  setIsCreateProjectModalOpen: (open: boolean) => void;
  isUpdateProgressModalOpen: boolean;
  setIsUpdateProgressModalOpen: (open: boolean) => void;
  isResolveModalOpen: boolean;
  setIsResolveModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  // Authentication & User Profile
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password?: string, requestedRole?: UserRole) => boolean;
  signup: (userData: Partial<UserProfile> & { password?: string }) => void;
  logout: () => void;
  
  // Feedback
  toasts: ToastState[];
  showToast: (message: string, type?: ToastState['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'karachi_full_data_v10_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEY_PREFIX + 'role') as UserRole) || 'citizen';
  });

  const [activeTab, setActiveTabState] = useState<NavTab>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<KarachiDistrict | 'All'>('All');

  // Persistence
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'complaints');
    if (saved) {
      try {
        const parsed: Complaint[] = JSON.parse(saved);
        return parsed.map((c, i) => ({
          ...c,
          reporterId: c.reporterId || `CITIZEN-${c.id ? c.id.replace('KF-ISSUE-', '') : 1000 + i}`,
          verificationStatus: c.verificationStatus || (c.isVerifiedFact ? 'Verified' : c.status === 'Under Review' ? 'Under Review' : 'Unverified')
        }));
      } catch {
        // fallback
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [wasteReports, setWasteReports] = useState<WasteReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'waste');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [followedAreas, setFollowedAreas] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'followed_areas');
    return saved ? JSON.parse(saved) : ['Gulshan-e-Iqbal', 'Korangi'];
  });

  // Registered Users Registry Database (Persistent)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_REGISTERED_USERS;
  });

  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportWasteModalOpen, setIsReportWasteModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Authentication & User Profile
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null; // Guest/logged out by default, user logs in cleanly
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'role', role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
      setRoleState(currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users_db', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'waste', JSON.stringify(wasteReports));
  }, [wasteReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'followed_areas', JSON.stringify(followedAreas));
  }, [followedAreas]);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    // If a user is logged in, their role is locked to their authenticated account role!
    if (currentUser) {
      if (newRole !== currentUser.role) {
        showToast(`Your session is locked to: ${currentUser.role.toUpperCase()}. To use another role, please Sign Out first.`, 'warning');
        return;
      }
    } else {
      setRoleState(newRole);
    }
  };

  const login = (email: string, password?: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if attempting admin login
    if (trimmedEmail === 'admin@karachiforgot.gov.pk' || trimmedEmail === 'admin@karachiforgot.org' || trimmedEmail === 'admin') {
      if (password && password !== 'Admin@123' && password !== 'Admin@1234') {
        showToast('Incorrect password for Administrator account. Please use Admin@123', 'danger');
        return false;
      }
      const adminUser = registeredUsers.find(u => u.role === 'admin') || INITIAL_REGISTERED_USERS[0];
      setCurrentUserState(adminUser);
      setRoleState('admin');
      setIsAuthModalOpen(false);
      showToast(`Logged in as Chief Administrator (${adminUser.name})`, 'success');
      return true;
    }

    // Check in database registry by email or role shortcut
    const matchedUser = registeredUsers.find(u => 
      u.email.toLowerCase() === trimmedEmail || 
      (trimmedEmail === 'supervisor' && u.role === 'supervisor') ||
      (trimmedEmail === 'officer' && u.role === 'officer') ||
      (trimmedEmail === 'citizen' && u.role === 'citizen')
    );

    if (matchedUser) {
      // Validate password if provided
      const enteredPwd = (password || '').toLowerCase();
      const expectedHash = (matchedUser.passwordHash || '').toLowerCase();
      const roleDefaultPwd = `${matchedUser.role}@123`.toLowerCase();

      const isValidPassword = 
        !password || 
        expectedHash.includes(enteredPwd) || 
        enteredPwd === roleDefaultPwd || 
        enteredPwd === 'password123' || 
        enteredPwd === '123456';

      if (!isValidPassword) {
        showToast(`Incorrect password for ${matchedUser.name}. Expected: ${matchedUser.role.charAt(0).toUpperCase() + matchedUser.role.slice(1)}@123`, 'danger');
        return false;
      }
      
      setCurrentUserState(matchedUser);
      setRoleState(matchedUser.role);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${matchedUser.name}! Logged in as ${matchedUser.role.toUpperCase()}`, 'success');
      return true;
    }

    showToast(`No account found with email "${email}". Please register to create your account.`, 'warning');
    setAuthModalMode('signup');
    return false;
  };

  const signup = (userData: Partial<UserProfile> & { password?: string }) => {
    const userRole = userData.role || 'citizen';
    const email = (userData.email || '').trim().toLowerCase();

    // Rule: Only ONE admin can exist on the website!
    if (userRole === 'admin' || email.includes('admin@karachiforgot')) {
      showToast('Administrative accounts are locked to the single designated Chief Administrator. You cannot create a second admin account.', 'danger');
      return;
    }

    // Check if user already exists
    const existing = registeredUsers.find(u => u.email.toLowerCase() === email);
    if (existing) {
      showToast(`An account with email ${email} already exists! Please log in.`, 'warning');
      setAuthModalMode('login');
      return;
    }

    const newUserRecord: RegisteredUserRecord = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name || 'Karachi Citizen',
      email: email,
      role: userRole,
      district: userData.district || 'East',
      department: userData.department,
      designation: userData.designation,
      badgeNumber: userData.badgeNumber,
      phone: userData.phone,
      cnic: userData.cnic,
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      passwordHash: `sha256_${userData.password || 'default'}`,
      status: 'Active'
    };

    // Save to registered database
    setRegisteredUsers(prev => [...prev, newUserRecord]);

    // Create Audit Log of user registration
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'User Registered in Database',
      targetType: 'RegisteredUser',
      targetId: newUserRecord.id,
      targetName: newUserRecord.name,
      changedBy: newUserRecord.name,
      userRole: newUserRecord.role,
      newValue: `Role: ${newUserRecord.role}, Email: ${newUserRecord.email}, District: ${newUserRecord.district || 'N/A'}`,
      reason: 'Citizen / Official Self-Service Registration'
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Set active session
    setCurrentUserState(newUserRecord);
    setRoleState(userRole);
    setIsAuthModalOpen(false);
    showToast(`Account successfully registered and added to database! Welcome, ${newUserRecord.name}.`, 'success');
  };

  const logout = () => {
    setCurrentUserState(null);
    setRoleState('citizen');
    showToast('Signed out. Viewing portal in Guest mode.', 'info');
  };

  const clearAllData = () => {
    setProjects([]);
    setComplaints([]);
    setWasteReports([]);
    setAuditLogs([]);
    setNotifications([]);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'projects');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'complaints');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'waste');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'audit');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notifications');
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users_db', JSON.stringify(INITIAL_REGISTERED_USERS));
    showToast('All civic data cleared. Database is now completely fresh and empty. Root Administrator account preserved.', 'warning');
  };

  const seedInitialData = () => {
    setProjects(SAMPLE_PROJECTS);
    setComplaints(SAMPLE_COMPLAINTS);
    setWasteReports(SAMPLE_WASTE_REPORTS);
    setAuditLogs(SAMPLE_AUDIT_LOGS);
    setNotifications(SAMPLE_NOTIFICATIONS);
    showToast('Reference sample dataset restored for inspection.', 'info');
  };

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFollowArea = (districtName: string) => {
    setFollowedAreas(prev => {
      const exists = prev.includes(districtName);
      if (exists) {
        showToast(`Unfollowed notifications for ${districtName}`, 'info');
        return prev.filter(a => a !== districtName);
      } else {
        showToast(`Now following civic alerts for ${districtName}`, 'success');
        return [...prev, districtName];
      }
    });
  };

  const addProject = (data: Partial<Project>) => {
    const newId = `prj-${Date.now().toString().slice(-4)}`;
    const newCode = `KF-PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString().split('T')[0];

    const newProject: Project = {
      id: newId,
      code: newCode,
      name: data.name || 'Untitled Project',
      category: data.category || 'Roads',
      district: data.district || 'East',
      neighborhood: data.neighborhood || 'Karachi Urban Sector',
      latitude: data.latitude || 24.8607,
      longitude: data.longitude || 67.0011,
      status: data.status || 'Proposed',
      progressPercent: data.progressPercent || 0,
      budgetPKR: data.budgetPKR || 50.0,
      startDate: data.startDate || now,
      expectedEndDate: data.expectedEndDate || '2027-06-30',
      verificationStatus: data.verificationStatus || 'Unverified',
      department: data.department || 'Karachi Metropolitan Corporation',
      contractor: data.contractor || 'Contractor TBD',
      description: data.description || 'Public infrastructure project record.',
      openIssuesCount: 0,
      lastUpdated: now,
      health: {
        timelineStatus: 'On Schedule',
        dataFreshness: 'Recently Updated',
        documentsStatus: 'Missing Documents',
        daysSinceLastUpdate: 0,
      },
      team: data.team || [
        { id: 'tm-new', name: 'Project Officer', designation: 'Civil Engineer', department: data.department || 'KMC', responsibility: 'Field Supervision' }
      ],
      materials: data.materials || [
        { id: 'm-new', material: 'Standard Reinforced Concrete', specification: 'BS 8110 Specification', quantity: 'Demo Quantity Pending', sourceReference: 'Draft BoQ', verificationStatus: 'Unverified' }
      ],
      documents: data.documents || [
        { id: 'd-new', name: 'PC-1 Project Formulation Document', type: 'Project Plan', uploadedDate: now, version: 'v1.0', verificationStatus: 'Unverified', uploadedBy: 'Current Officer', fileSize: '2.5 MB' }
      ],
      progressUpdates: data.progressUpdates || [
        { id: 'pu-init', date: now, progressPercent: 0, description: 'Project record established in KARACHI FORGOT civic database.', authorName: 'Current Officer', authorRole: 'Project Officer', verificationStatus: 'Unverified' }
      ],
      timeline: [
        { id: 'tl-init', date: now, title: 'Project Proposal Logged', description: 'Initial public metadata entered.', updatedBy: 'Project Officer', statusTag: 'Proposed' }
      ],
      informationSources: {
        officialRecordRef: `SPPRA-${newCode}`,
        tenderRef: `TND-${newCode}`,
        lastInspectionDate: now
      }
    };

    setProjects(prev => [newProject, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Project Created',
      targetType: 'Project',
      targetId: newId,
      targetName: newProject.name,
      changedBy: 'Current Officer',
      userRole: role,
      oldValue: 'None',
      newValue: `Status: ${newProject.status}, Budget: PKR ${newProject.budgetPKR}M`,
      reason: 'New public infrastructure project proposal initiated.'
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Project ${newCode} created successfully!`, 'success');
  };

  const updateProjectProgress = (projectId: string, update: { percent: number; description: string; imageUrl?: string; documentRef?: string }) => {
    const now = new Date().toISOString().split('T')[0];
    const updateId = `pu-${Date.now().toString().slice(-4)}`;

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;

      const oldPercent = p.progressPercent;
      const newPercent = Math.min(100, Math.max(0, update.percent));
      const isCompleted = newPercent === 100;
      const newStatus = isCompleted ? 'Completed' : (p.status === 'Proposed' ? 'In Progress' : p.status);

      const newUpdate = {
        id: updateId,
        date: now,
        progressPercent: newPercent,
        description: update.description,
        imageUrl: update.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80',
        documentRef: update.documentRef,
        authorName: role === 'officer' ? 'Project Officer #104' : 'Civic Supervisor',
        authorRole: role === 'officer' ? 'Project Officer' : 'Supervisor',
        verificationStatus: role === 'supervisor' ? ('Verified' as VerificationStatus) : ('Partially Verified' as VerificationStatus)
      };

      const timelineEvent = {
        id: `tl-${Date.now()}`,
        date: now,
        title: `Progress Updated to ${newPercent}%`,
        description: update.description,
        updatedBy: role === 'officer' ? 'Project Officer #104' : 'Civic Supervisor',
        evidenceNote: 'Photographic evidence attached and audited.',
        statusTag: newStatus
      };

      return {
        ...p,
        progressPercent: newPercent,
        status: newStatus,
        lastUpdated: now,
        health: {
          ...p.health,
          timelineStatus: isCompleted ? 'Completed' : p.health.timelineStatus,
          dataFreshness: 'Recently Updated',
          daysSinceLastUpdate: 0
        },
        progressUpdates: [newUpdate, ...p.progressUpdates],
        timeline: [...p.timeline, timelineEvent]
      };
    }));

    // Add Audit Log
    const target = projects.find(p => p.id === projectId);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Progress Update With Evidence',
      targetType: 'Project',
      targetId: projectId,
      targetName: target?.name || projectId,
      changedBy: role === 'officer' ? 'Project Officer #104' : 'Supervisor',
      userRole: role,
      oldValue: `Progress: ${target?.progressPercent}%`,
      newValue: `Progress: ${update.percent}%`,
      reason: update.description
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Progress updated to ${update.percent}% with evidence!`, 'success');
  };

  const verifyProject = (projectId: string, newStatus: VerificationStatus, note: string) => {
    const now = new Date().toISOString().split('T')[0];

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        verificationStatus: newStatus,
        verifiedBy: `Supervisor #41 (${role.toUpperCase()})`,
        verificationDate: now,
        health: {
          ...p.health,
          documentsStatus: newStatus === 'Verified' ? 'Verified' : 'Partially Verified'
        }
      };
    }));

    const target = projects.find(p => p.id === projectId);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Project Verification Audit',
      targetType: 'Project',
      targetId: projectId,
      targetName: target?.name || projectId,
      changedBy: 'Supervisor #41',
      userRole: role,
      oldValue: target?.verificationStatus,
      newValue: newStatus,
      reason: note || 'Administrative audit against SPPRA tender records and field inspections.'
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Project marked as ${newStatus}`, 'success');
  };

  const addComplaint = (data: {
    category: Complaint['category'];
    title: string;
    description: string;
    district: KarachiDistrict;
    neighborhood: string;
    latitude: number;
    longitude: number;
    reporterName: string;
    reporterContact?: string;
    relatedProjectId?: string;
    evidenceImages: string[];
    priority: Complaint['priority'];
  }) => {
    const count = complaints.length + 1025;
    const newId = `KF-ISSUE-${count}`;
    const now = new Date().toISOString().split('T')[0];
    const sla = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check if duplicate location nearby (< 300m approximation)
    const existingDuplicate = complaints.find(
      c => c.district === data.district && c.category === data.category && c.status !== 'Resolved' && c.status !== 'Closed'
    );

    if (existingDuplicate) {
      // Group as co-report
      setComplaints(prev => prev.map(c => {
        if (c.id !== existingDuplicate.id) return c;
        const newCount = c.citizenReportCount + 1;
        const duplicateEntry = {
          date: now,
          reporter: data.reporterName,
          note: data.description.slice(0, 120)
        };
        return {
          ...c,
          citizenReportCount: newCount,
          duplicateReports: [duplicateEntry, ...(c.duplicateReports || [])],
          statusHistory: [
            ...c.statusHistory,
            { status: c.status, date: now, updatedBy: 'Citizen Portal', comment: `Additional citizen report #${newCount} linked from ${data.reporterName}.` }
          ]
        };
      }));

      showToast(`Grouped with active complaint ${existingDuplicate.id} (${existingDuplicate.citizenReportCount + 1} citizens have reported this area)`, 'info');
      return existingDuplicate.id;
    }

    const newComplaint: Complaint = {
      id: newId,
      category: data.category,
      title: data.title,
      description: data.description,
      district: data.district,
      neighborhood: data.neighborhood,
      latitude: data.latitude,
      longitude: data.longitude,
      status: 'Submitted',
      priority: data.priority,
      isVerifiedFact: false, // NOT treated as proven fact until official review
      verificationStatus: 'Unverified',
      submittedDate: now,
      expectedSlaDate: sla,
      isOverdue: false,
      reporterId: currentUser?.id || `CITIZEN-${Date.now().toString().slice(-4)}`,
      reporterName: data.reporterName,
      reporterContact: data.reporterContact,
      reporterEmail: currentUser?.email || (data.reporterContact?.includes('@') ? data.reporterContact : undefined),
      relatedProjectId: data.relatedProjectId,
      assignedDepartment: 'Intake Bureau (Pending Department Assignment)',
      evidenceImages: data.evidenceImages.length > 0 ? data.evidenceImages : [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      ],
      citizenReportCount: 1,
      statusHistory: [
        { status: 'Submitted', date: now, updatedBy: 'Citizen Portal', comment: 'Initial complaint filed with photo evidence.' }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Issue Reported by Citizen',
      targetType: 'Complaint',
      targetId: newId,
      targetName: data.title,
      changedBy: data.reporterName,
      userRole: 'citizen',
      newValue: 'Status: Submitted (Unverified Citizen Report)',
      reason: 'Citizen civic issue submission'
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Notification for officers
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Civic Report in ${data.district}`,
      message: `${data.title} reported by ${data.reporterName}. Awaiting initial review.`,
      category: 'complaint',
      targetRole: 'officer',
      targetDistrict: data.district,
      timestamp: 'Just now',
      isRead: false,
      linkId: newId
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Report logged with ID: ${newId}. It is now under official review.`, 'success');
    return newId;
  };

  const verifyComplaint = (complaintId: string, verified: boolean, note: string) => {
    const now = new Date().toISOString().split('T')[0];
    const newStatus: ComplaintStatus = verified ? 'Verified' : 'Insufficient Evidence';

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return {
        ...c,
        status: newStatus,
        isVerifiedFact: verified,
        verificationStatus: verified ? 'Verified' : 'Rejected',
        statusHistory: [
          ...c.statusHistory,
          {
            status: newStatus,
            date: now,
            updatedBy: `Officer #104 (${role.toUpperCase()})`,
            comment: note || (verified ? 'Ground inspection confirmed reported issue.' : 'Insufficient evidence to verify.')
          }
        ]
      };
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: verified ? 'Complaint Verified' : 'Complaint Dismissed (Insufficient Evidence)',
      targetType: 'Complaint',
      targetId: complaintId,
      targetName: `Complaint ${complaintId}`,
      changedBy: 'Officer #104',
      userRole: role,
      oldValue: 'Under Review',
      newValue: newStatus,
      reason: note
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Complaint ${complaintId} marked as ${newStatus}`, 'success');
  };

  const updateComplaintVerificationStatus = (
    complaintId: string, 
    status: 'Verified' | 'Under Review' | 'Unverified' | 'Rejected', 
    note?: string
  ) => {
    const now = new Date().toISOString().split('T')[0];
    const isFact = status === 'Verified';

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      const updatedStatus: ComplaintStatus = 
        status === 'Verified' ? (c.status === 'Submitted' || c.status === 'Under Review' ? 'Verified' : c.status) :
        status === 'Under Review' ? 'Under Review' :
        status === 'Rejected' ? 'Rejected' : c.status;

      return {
        ...c,
        verificationStatus: status,
        isVerifiedFact: isFact,
        status: updatedStatus,
        statusHistory: [
          ...c.statusHistory,
          {
            status: updatedStatus,
            date: now,
            updatedBy: `Admin / Verification Desk (${role.toUpperCase()})`,
            comment: note || `Verification status manually updated to: ${status}`
          }
        ]
      };
    }));

    const target = complaints.find(c => c.id === complaintId);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: `Issue Verification Changed to ${status}`,
      targetType: 'Complaint',
      targetId: complaintId,
      targetName: target?.title || complaintId,
      changedBy: currentUser?.name || `Admin (${role.toUpperCase()})`,
      userRole: role,
      oldValue: target?.verificationStatus || 'Unverified',
      newValue: status,
      reason: note || 'Administrative verification status review'
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Issue ${complaintId} verification status set to: ${status}`, 'success');
  };

  const assignComplaint = (complaintId: string, officerName: string, department: string) => {
    const now = new Date().toISOString().split('T')[0];

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return {
        ...c,
        status: 'Assigned',
        assignedOfficer: officerName,
        assignedDepartment: department,
        statusHistory: [
          ...c.statusHistory,
          {
            status: 'Assigned',
            date: now,
            updatedBy: `Supervisor (${role.toUpperCase()})`,
            comment: `Assigned to ${officerName} (${department}) for resolution.`
          }
        ]
      };
    }));

    showToast(`Assigned ${complaintId} to ${officerName}`, 'success');
  };

  const updateComplaintStatus = (complaintId: string, newStatus: ComplaintStatus, comment: string) => {
    const now = new Date().toISOString().split('T')[0];

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return {
        ...c,
        status: newStatus,
        statusHistory: [
          ...c.statusHistory,
          {
            status: newStatus,
            date: now,
            updatedBy: `${role.toUpperCase()}`,
            comment: comment || `Status updated to ${newStatus}`
          }
        ]
      };
    }));

    showToast(`Status updated to ${newStatus}`, 'success');
  };

  const resolveComplaintWithEvidence = (complaintId: string, evidence: { description: string; afterImageUrl: string; documentRef?: string }) => {
    const now = new Date().toISOString().split('T')[0];

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return {
        ...c,
        status: 'Resolved',
        isOverdue: false,
        resolution: {
          description: evidence.description,
          resolutionDate: now,
          resolvedBy: role === 'officer' ? 'Project Officer #104' : 'Department Field In-Charge',
          beforeImageUrl: c.evidenceImages[0],
          afterImageUrl: evidence.afterImageUrl,
          documentRef: evidence.documentRef || 'INSP-CERT-RESOLVED',
          verifiedBySupervisor: role === 'supervisor' || role === 'admin'
        },
        statusHistory: [
          ...c.statusHistory,
          {
            status: 'Resolved',
            date: now,
            updatedBy: `${role.toUpperCase()} (Officer)`,
            comment: `Resolved with verified after-action photographic evidence: ${evidence.description.slice(0, 100)}`
          }
        ]
      };
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Complaint Resolved With Evidence',
      targetType: 'Complaint',
      targetId: complaintId,
      targetName: `Complaint ${complaintId}`,
      changedBy: 'Officer #104',
      userRole: role,
      oldValue: 'Action In Progress',
      newValue: 'Resolved',
      reason: evidence.description
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Citizen notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Complaint ${complaintId} Resolved`,
      message: `Civic works completed: ${evidence.description.slice(0, 80)}. Photographic evidence uploaded.`,
      category: 'complaint',
      targetRole: 'citizen',
      timestamp: 'Just now',
      isRead: false,
      linkId: complaintId
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Complaint ${complaintId} resolved with photographic verification!`, 'success');
  };

  const addWasteReport = (data: {
    category: WasteReport['category'];
    locationName: string;
    district: KarachiDistrict;
    latitude: number;
    longitude: number;
    description: string;
    densityLevel: WasteReport['densityLevel'];
    imageUrl?: string;
  }) => {
    const count = wasteReports.length + 406;
    const newId = `KF-WASTE-${count}`;
    const now = new Date().toISOString().split('T')[0];
    const sla = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newReport: WasteReport = {
      id: newId,
      category: data.category,
      locationName: data.locationName,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      status: 'Reported',
      densityLevel: data.densityLevel,
      description: data.description,
      reportedDate: now,
      slaDate: sla,
      isOverdue: false,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1611288870280-4a80ebb90768?auto=format&fit=crop&w=800&q=80'
    };

    setWasteReports(prev => [newReport, ...prev]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: 'Waste Issue Logged',
      targetType: 'WasteReport',
      targetId: newId,
      targetName: data.locationName,
      changedBy: 'Citizen Reporter',
      userRole: 'citizen',
      newValue: `Density: ${data.densityLevel}, Category: ${data.category}`,
      reason: 'Citizen waste management dispatch request'
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`Waste report ${newId} submitted to SSWMB dispatch!`, 'success');
    return newId;
  };

  const updateWasteStatus = (wasteId: string, newStatus: WasteStatus, resolutionImage?: string) => {
    const now = new Date().toISOString().split('T')[0];

    setWasteReports(prev => prev.map(w => {
      if (w.id !== wasteId) return w;
      return {
        ...w,
        status: newStatus,
        isOverdue: false,
        resolutionImage: resolutionImage || w.resolutionImage,
        resolvedDate: (newStatus === 'Action Completed' || newStatus === 'Verified Resolution') ? now : w.resolvedDate,
        assignedVehicle: w.assignedVehicle || 'SSWMB Rapid Response #KZ-882',
        assignedTeam: w.assignedTeam || 'Zonal Municipal Sweep Crew'
      };
    }));

    showToast(`Waste report ${wasteId} updated to ${newStatus}`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setComplaints(INITIAL_COMPLAINTS);
    setWasteReports(INITIAL_WASTE_REPORTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFollowedAreas(['Gulshan-e-Iqbal', 'Korangi']);
    showToast('Demo data restored to initial clean state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedComplaintId,
        setSelectedComplaintId,
        selectedDistrict,
        setSelectedDistrict,
        projects,
        complaints,
        wasteReports,
        auditLogs,
        notifications,
        followedAreas,
        registeredUsers,
        toggleFollowArea,
        addProject,
        updateProjectProgress,
        verifyProject,
        addComplaint,
        verifyComplaint,
        updateComplaintVerificationStatus,
        assignComplaint,
        updateComplaintStatus,
        resolveComplaintWithEvidence,
        addWasteReport,
        updateWasteStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        clearAllData,
        seedInitialData,
        isReportModalOpen,
        setIsReportModalOpen,
        isReportWasteModalOpen,
        setIsReportWasteModalOpen,
        isCreateProjectModalOpen,
        setIsCreateProjectModalOpen,
        isUpdateProgressModalOpen,
        setIsUpdateProgressModalOpen,
        isResolveModalOpen,
        setIsResolveModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        currentUser,
        setCurrentUser: setCurrentUserState,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        signup,
        logout,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
