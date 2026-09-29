import { UserProfile } from '../types';

export const OFFICIAL_ADMIN: UserProfile = {
  id: 'usr-admin-root',
  name: 'Chief Platform Administrator',
  email: 'admin@karachiforgot.gov.pk',
  role: 'admin',
  district: 'Central',
  department: 'Karachi Civic Oversight & Infrastructure Governance Board',
  designation: 'Root Platform Administrator & Chief Inspector',
  badgeNumber: 'KF-ADMIN-01',
  phone: '+92 300 0000001',
  joinedDate: '2024-01-01',
  isImmutable: true
};

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: OFFICIAL_ADMIN
};
