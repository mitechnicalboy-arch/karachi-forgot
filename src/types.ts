export type UserRole = 'citizen' | 'officer' | 'supervisor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: KarachiDistrict;
  department?: string;
  designation?: string;
  badgeNumber?: string;
  phone?: string;
  cnic?: string;
  avatar?: string;
  joinedDate: string;
  isImmutable?: boolean;
}

export interface RegisteredUserRecord extends UserProfile {
  passwordHash: string; // Stored securely in database registry
  createdAt: string;
  status: 'Active' | 'Pending Verification' | 'Suspended';
  isImmutable?: boolean;
}

export type ProjectCategory = 
  | 'Roads'
  | 'Bridges'
  | 'Parks'
  | 'Flood Management'
  | 'Water'
  | 'Sewerage'
  | 'Public Buildings'
  | 'Waste Management'
  | 'Other';

export type ProjectStatus = 
  | 'Proposed'
  | 'Approved'
  | 'Procurement'
  | 'In Progress'
  | 'Delayed'
  | 'Completed'
  | 'Under Maintenance'
  | 'Closed';

export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Unverified';

export type KarachiDistrict = 
  | 'Central'
  | 'East'
  | 'South'
  | 'West'
  | 'Korangi'
  | 'Malir'
  | 'Keamari';

export interface ProjectTeamMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  responsibility: string;
}

export interface ProjectMaterial {
  id: string;
  material: string;
  specification: string;
  quantity: string;
  sourceReference: string;
  verificationStatus: VerificationStatus;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 
    | 'Approval Document'
    | 'Budget Document'
    | 'Tender Document'
    | 'Contract'
    | 'Project Plan'
    | 'Progress Report'
    | 'Completion Report'
    | 'Maintenance Report';
  uploadedDate: string;
  version: string;
  verificationStatus: VerificationStatus;
  uploadedBy: string;
  fileSize: string;
  downloadUrl?: string;
}

export interface ProgressUpdate {
  id: string;
  date: string;
  progressPercent: number;
  description: string;
  imageUrl?: string;
  documentRef?: string;
  authorName: string;
  authorRole: string;
  verificationStatus: VerificationStatus;
}

export interface ProjectTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  updatedBy: string;
  evidenceNote?: string;
  statusTag: ProjectStatus;
}

export interface Project {
  id: string;
  code: string; // e.g. KF-PRJ-102
  name: string;
  category: ProjectCategory;
  district: KarachiDistrict;
  neighborhood: string;
  latitude: number;
  longitude: number;
  status: ProjectStatus;
  progressPercent: number;
  budgetPKR: number; // In millions PKR
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  department: string;
  contractor: string;
  description: string;
  openIssuesCount: number;
  lastUpdated: string;
  // Project Health Indicators (measurable, not subjective score)
  health: {
    timelineStatus: 'On Schedule' | 'Delayed' | 'Completed';
    dataFreshness: 'Recently Updated' | 'Update Due' | 'Update Overdue';
    documentsStatus: 'Verified' | 'Partially Verified' | 'Missing Documents';
    daysSinceLastUpdate: number;
  };
  team: ProjectTeamMember[];
  materials: ProjectMaterial[];
  documents: ProjectDocument[];
  progressUpdates: ProgressUpdate[];
  timeline: ProjectTimelineEvent[];
  informationSources: {
    officialRecordRef: string;
    tenderRef: string;
    lastInspectionDate: string;
  };
}

export type IssueCategory = 
  | 'Road Damage'
  | 'Bridge Issue'
  | 'Drainage Blockage'
  | 'Water Leakage'
  | 'Sewerage Issue'
  | 'Streetlight Problem'
  | 'Park Damage'
  | 'Waste Accumulation'
  | 'Overflowing Bin'
  | 'Construction Issue'
  | 'Safety Concern'
  | 'Other';

export type ComplaintStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'Action In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected'
  | 'Duplicate'
  | 'Insufficient Evidence'
  | 'Escalated';

export interface ResolutionEvidence {
  description: string;
  resolutionDate: string;
  resolvedBy: string;
  beforeImageUrl?: string;
  afterImageUrl: string;
  documentRef?: string;
  verifiedBySupervisor?: boolean;
}

export interface Complaint {
  id: string; // e.g. KF-ISSUE-1024
  category: IssueCategory;
  title: string;
  description: string;
  district: KarachiDistrict;
  neighborhood: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  isVerifiedFact: boolean; // false until official verification
  verificationStatus?: 'Verified' | 'Under Review' | 'Unverified' | 'Rejected';
  submittedDate: string;
  expectedSlaDate: string;
  isOverdue: boolean;
  reporterId?: string; // Unique Reporter / Citizen ID
  reporterName: string;
  reporterContact?: string;
  reporterEmail?: string;
  relatedProjectId?: string;
  assignedOfficer?: string;
  assignedDepartment: string;
  evidenceImages: string[];
  citizenReportCount: number; // for duplicates grouping
  duplicateReports?: {
    date: string;
    reporter: string;
    note: string;
  }[];
  resolution?: ResolutionEvidence;
  statusHistory: {
    status: ComplaintStatus;
    date: string;
    updatedBy: string;
    comment: string;
  }[];
}

export type WasteCategory = 
  | 'Overflowing Bin'
  | 'Garbage Pile'
  | 'Illegal Dumping'
  | 'Missed Collection'
  | 'Waste on Road'
  | 'Construction Waste'
  | 'Other';

export type WasteStatus = 
  | 'Reported'
  | 'Verified'
  | 'Assigned'
  | 'Collection Scheduled'
  | 'Action Completed'
  | 'Verified Resolution';

export interface WasteReport {
  id: string; // e.g. KF-WASTE-501
  category: WasteCategory;
  locationName: string;
  district: KarachiDistrict;
  latitude: number;
  longitude: number;
  status: WasteStatus;
  densityLevel: 'Low' | 'Moderate' | 'Severe' | 'Critical Hotspot';
  description: string;
  reportedDate: string;
  slaDate: string;
  isOverdue: boolean;
  reporterName?: string;
  imageUrl?: string;
  assignedVehicle?: string;
  assignedTeam?: string;
  resolutionImage?: string;
  resolvedDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  targetType: 'Project' | 'Complaint' | 'WasteReport' | 'System' | 'RegisteredUser';
  targetId: string;
  targetName: string;
  changedBy: string;
  userRole: UserRole;
  oldValue?: string;
  newValue?: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'project' | 'complaint' | 'waste' | 'system';
  targetRole?: UserRole;
  targetDistrict?: KarachiDistrict;
  timestamp: string;
  isRead: boolean;
  linkId?: string;
}
