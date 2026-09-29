import * as XLSX from 'xlsx';
import { Complaint, WasteReport, Project, RegisteredUserRecord } from '../types';

/**
 * Generates and triggers an Excel (.xlsx) download of all Submitted Issues / Citizen Complaints
 * including Reporter ID, full Issue Details, and Current Verification Status.
 */
export function exportSubmittedIssuesReportToExcel(complaints: Complaint[], customTitle?: string) {
  const data = complaints.map((c, index) => {
    const currentVerificationStatus = c.verificationStatus || (
      c.isVerifiedFact ? 'Verified' : 
      c.status === 'Under Review' ? 'Under Review' : 
      c.status === 'Rejected' ? 'Rejected' : 
      'Unverified'
    );

    const reporterId = c.reporterId || `CITIZEN-${c.id ? c.id.replace('KF-ISSUE-', '') : 1000 + index}`;

    return {
      'S.No': index + 1,
      'Reporter ID': reporterId,
      'Reporter Name': c.reporterName,
      'Reporter Contact': c.reporterContact || 'Not Provided',
      'Reporter Email': c.reporterEmail || (c.reporterContact?.includes('@') ? c.reporterContact : 'N/A'),
      'Issue ID': c.id,
      'Category / Issue Type': c.category,
      'Issue Title': c.title,
      'Issue Description': c.description,
      'Current Verification Status': currentVerificationStatus,
      'Officially Verified Fact?': c.isVerifiedFact ? 'YES (Verified Fact)' : 'NO (Citizen Claim)',
      'Action Status': c.status,
      'Priority Level': c.priority,
      'Karachi District': c.district,
      'Neighborhood / Street Location': c.neighborhood,
      'GPS Coordinates': `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`,
      'Submission Date': c.submittedDate,
      'SLA Target Deadline': c.expectedSlaDate,
      'SLA Overdue?': c.isOverdue ? 'YES (OVERDUE)' : 'NO (Within SLA)',
      'Assigned Department': c.assignedDepartment || 'Pending Department Assignment',
      'Assigned Officer': c.assignedOfficer || 'Unassigned',
      'Citizens Affected (Count)': c.citizenReportCount || 1,
      'Related Project ID': c.relatedProjectId || 'None',
      'Resolution Status': c.resolution ? 'Resolved with Proof' : 'Pending Resolution',
      'Resolution Date': c.resolution?.resolutionDate || 'Pending Field Work',
      'Resolution Proof Notes': c.resolution?.description || 'Pending resolution verification'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submitted Issues');

  // Set column widths for professional presentation
  worksheet['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 18 }, // Reporter ID
    { wch: 22 }, // Reporter Name
    { wch: 18 }, // Reporter Contact
    { wch: 24 }, // Reporter Email
    { wch: 16 }, // Issue ID
    { wch: 24 }, // Category
    { wch: 38 }, // Title
    { wch: 60 }, // Description
    { wch: 26 }, // Current Verification Status
    { wch: 26 }, // Officially Verified Fact?
    { wch: 18 }, // Action Status
    { wch: 14 }, // Priority
    { wch: 16 }, // District
    { wch: 30 }, // Neighborhood
    { wch: 22 }, // GPS Coordinates
    { wch: 15 }, // Submission Date
    { wch: 18 }, // SLA Deadline
    { wch: 16 }, // SLA Overdue
    { wch: 38 }, // Department
    { wch: 24 }, // Officer
    { wch: 14 }, // Affected
    { wch: 18 }, // Project
    { wch: 20 }, // Resolution Status
    { wch: 16 }, // Resolution Date
    { wch: 45 }  // Resolution Notes
  ];

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = customTitle || `KARACHI_FORGOT_Submitted_Issues_Report_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Standard alias for backward compatibility
 */
export function exportComplaintsToExcel(complaints: Complaint[]) {
  exportSubmittedIssuesReportToExcel(complaints);
}

/**
 * Generates and triggers an Excel (.xlsx) download of Registered Users Database
 */
export function exportUsersToExcel(users: RegisteredUserRecord[]) {
  const data = users.map((u, index) => ({
    'S.No': index + 1,
    'User ID': u.id,
    'Full Name': u.name,
    'Email Address': u.email,
    'Account Role': u.role.toUpperCase(),
    'Primary District': u.district || 'All Districts',
    'Department': u.department || 'N/A',
    'Designation': u.designation || 'N/A',
    'Badge / ID Number': u.badgeNumber || 'N/A',
    'Contact Phone': u.phone || 'N/A',
    'Account Status': u.status,
    'Joined Date': u.joinedDate
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Users');

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 24 },
    { wch: 28 },
    { wch: 16 },
    { wch: 16 },
    { wch: 32 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 }
  ];

  const fileName = `KARACHI_FORGOT_User_Database_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generates complete multi-sheet civic audit workbook
 */
export function exportCompleteCivicAuditToExcel(
  complaints: Complaint[], 
  wasteReports: WasteReport[], 
  projects: Project[], 
  users: RegisteredUserRecord[]
) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Citizen Complaints / Issues Report
  const complaintsData = complaints.map((c, index) => {
    const verificationStatus = c.verificationStatus || (
      c.isVerifiedFact ? 'Verified' : 
      c.status === 'Under Review' ? 'Under Review' : 
      c.status === 'Rejected' ? 'Rejected' : 
      'Unverified'
    );
    return {
      'S.No': index + 1,
      'Issue ID': c.id,
      'Reporter ID': c.reporterId || `CITIZEN-${c.id ? c.id.replace('KF-ISSUE-', '') : 1000 + index}`,
      'Reporter Name': c.reporterName,
      'Contact': c.reporterContact || '',
      'Date': c.submittedDate,
      'Category': c.category,
      'Title': c.title,
      'Description': c.description,
      'Verification Status': verificationStatus,
      'Action Status': c.status,
      'Priority': c.priority,
      'District': c.district,
      'Neighborhood': c.neighborhood,
      'SLA Overdue': c.isOverdue ? 'YES' : 'NO',
      'Department': c.assignedDepartment || ''
    };
  });
  const wsComplaints = XLSX.utils.json_to_sheet(complaintsData);
  XLSX.utils.book_append_sheet(workbook, wsComplaints, 'Citizen Problems');

  // Sheet 2: Waste Reports
  const wasteData = wasteReports.map((w) => ({
    'Waste ID': w.id,
    'Date': w.reportedDate,
    'Reporter': w.reporterName || 'Citizen',
    'District': w.district,
    'Location': w.locationName,
    'Category': w.category,
    'Density': w.densityLevel,
    'Status': w.status,
    'Assigned Vehicle': w.assignedVehicle || 'Pending'
  }));
  const wsWaste = XLSX.utils.json_to_sheet(wasteData);
  XLSX.utils.book_append_sheet(workbook, wsWaste, 'Waste Reports');

  // Sheet 3: Infrastructure Projects
  const projectsData = projects.map((p) => ({
    'Project Code': p.code,
    'Project Name': p.name,
    'Category': p.category,
    'District': p.district,
    'Department': p.department,
    'Budget PKR (M)': p.budgetPKR,
    'Progress %': p.progressPercent,
    'Status': p.status,
    'Verification': p.verificationStatus
  }));
  const wsProjects = XLSX.utils.json_to_sheet(projectsData);
  XLSX.utils.book_append_sheet(workbook, wsProjects, 'Public Projects');

  // Sheet 4: Users Registry
  const usersData = users.map((u) => ({
    'User ID': u.id,
    'Name': u.name,
    'Email': u.email,
    'Role': u.role.toUpperCase(),
    'District': u.district || '',
    'Department': u.department || '',
    'Joined Date': u.joinedDate,
    'Status': u.status
  }));
  const wsUsers = XLSX.utils.json_to_sheet(usersData);
  XLSX.utils.book_append_sheet(workbook, wsUsers, 'Registered Users');

  const fileName = `KARACHI_FORGOT_Full_Civic_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
