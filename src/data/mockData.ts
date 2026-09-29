import { Project, Complaint, WasteReport, AuditLog, NotificationItem, RegisteredUserRecord } from '../types';

export const INITIAL_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    id: 'usr-admin-root',
    name: 'Karachi Chief Administrator',
    email: 'admin@karachiforgot.gov.pk',
    role: 'admin',
    department: 'Karachi Civic Oversight & Infrastructure Governance Board',
    designation: 'Root Platform Administrator & Chief Inspector',
    badgeNumber: 'KF-ADMIN-01',
    phone: '+92 300 0000001',
    district: 'Central',
    joinedDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    passwordHash: 'sha256:Admin@123',
    status: 'Active',
    isImmutable: true
  },
  {
    id: 'usr-sup-103',
    name: 'Dr. Ayesha Rehman',
    email: 'supervisor@sindh.gov.pk',
    role: 'supervisor',
    department: 'Karachi Independent Quality & Materials Audit Cell',
    designation: 'Chief Inspection Auditor',
    badgeNumber: 'SINDH-AUD-88',
    phone: '+92 301 5556677',
    district: 'Central',
    joinedDate: '2024-02-15',
    createdAt: '2024-02-15T00:00:00Z',
    passwordHash: 'sha256:Supervisor@123',
    status: 'Active'
  },
  {
    id: 'usr-off-102',
    name: 'Engr. Farhan Hashmi',
    email: 'officer@kmc.gov.pk',
    role: 'officer',
    department: 'KMC Works & Services Bureau',
    designation: 'Senior Sub-Divisional Officer (SDO)',
    badgeNumber: 'KMC-ENG-204',
    phone: '+92 333 9876543',
    district: 'East',
    joinedDate: '2024-03-01',
    createdAt: '2024-03-01T00:00:00Z',
    passwordHash: 'sha256:Officer@123',
    status: 'Active'
  },
  {
    id: 'usr-cit-101',
    name: 'Tariq Siddiqui',
    email: 'citizen@karachiforgot.org',
    role: 'citizen',
    department: 'Karachi Citizen Participant & Neighborhood Watch',
    designation: 'Civic Reporter',
    badgeNumber: 'CIT-7842',
    phone: '+92 321 2345678',
    district: 'East',
    joinedDate: '2024-04-10',
    createdAt: '2024-04-10T00:00:00Z',
    passwordHash: 'sha256:Citizen@123',
    status: 'Active'
  }
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    code: 'KF-PRJ-101',
    name: 'Korangi Road Dualization & Causeway Rehabilitation',
    category: 'Roads',
    district: 'Korangi',
    neighborhood: 'Korangi Industrial Area Sector 7',
    latitude: 24.8322,
    longitude: 67.1145,
    status: 'In Progress',
    progressPercent: 68,
    budgetPKR: 145.5,
    startDate: '2026-01-15',
    expectedEndDate: '2026-11-30',
    verificationStatus: 'Verified',
    verifiedBy: 'Engr. Tariq Mehmood (Dir. Works KDA)',
    verificationDate: '2026-09-18',
    department: 'Karachi Development Authority (KDA)',
    contractor: 'Habib Rafiq Infrastructure Ltd.',
    description: 'Reconstruction and widening of 4.2 km dual carriageway including reinforced concrete culverts to prevent seasonal flooding at the Malir River crossing.',
    openIssuesCount: 3,
    lastUpdated: '2026-09-24',
    health: {
      timelineStatus: 'On Schedule',
      dataFreshness: 'Recently Updated',
      documentsStatus: 'Verified',
      daysSinceLastUpdate: 5,
    },
    team: [
      { id: 'tm-1', name: 'Engr. Farooq Sheikh', designation: 'Executive Engineer', department: 'KDA Works & Services', responsibility: 'Civil works oversight & quality assurance' },
      { id: 'tm-2', name: 'Naveed Akhtar', designation: 'Sub-Divisional Officer', department: 'Traffic Engineering Bureau', responsibility: 'Traffic detour management & safety barriers' },
      { id: 'tm-3', name: 'Zeeshan Baig', designation: 'Senior Material Inspector', department: 'Third-Party Verification Lab', responsibility: 'Asphalt compaction and bitumen testing' }
    ],
    materials: [
      { id: 'm-1', material: 'Bituminous Asphalt Concrete (Wearing Course)', specification: 'AASHTO M-320 Grade PG 70-10', quantity: '18,500 Metric Tons (Demo)', sourceReference: 'Spec Ref: KDA/ENG/2026-W-44', verificationStatus: 'Verified' },
      { id: 'm-2', material: 'Reinforced Concrete Pre-Cast Culverts', specification: 'Class A-1 4000 PSI Compressive Strength', quantity: '320 Linear Meters (Demo)', sourceReference: 'Spec Ref: ASTM C1577-20', verificationStatus: 'Verified' },
      { id: 'm-3', material: 'LED High-Mast Street Lighting Fixtures', specification: '150W IP66 Marine Grade Powder Coated', quantity: '140 Units (Demo)', sourceReference: 'Procurement Notice #891', verificationStatus: 'Partially Verified' }
    ],
    documents: [
      { id: 'doc-1', name: 'PC-1 Government Administrative Approval', type: 'Approval Document', uploadedDate: '2026-01-10', version: 'v2.1', verificationStatus: 'Verified', uploadedBy: 'Officer #104 (Engr. Tariq)', fileSize: '4.2 MB' },
      { id: 'doc-2', name: 'Final Tender Award & Contractor Agreement', type: 'Contract', uploadedDate: '2026-01-22', version: 'v1.0', verificationStatus: 'Verified', uploadedBy: 'Officer #104 (Engr. Tariq)', fileSize: '12.8 MB' },
      { id: 'doc-3', name: 'Q3 Independent Material Testing Report', type: 'Progress Report', uploadedDate: '2026-09-20', version: 'v3.0', verificationStatus: 'Verified', uploadedBy: 'Inspector #88 (Third Party)', fileSize: '6.1 MB' }
    ],
    progressUpdates: [
      { id: 'pu-1', date: '2026-09-22', progressPercent: 68, description: 'Completed wearing asphalt course on northbound track (2.1 km). Guardrails and reflective median studs installed up to Sector 8.', imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80', authorName: 'Engr. Farooq Sheikh', authorRole: 'Executive Engineer', verificationStatus: 'Verified' },
      { id: 'pu-2', date: '2026-08-14', progressPercent: 55, description: 'Culvert casting complete on river tributary overflow segment. Sub-base compaction verified by lab testing.', imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80', authorName: 'Engr. Farooq Sheikh', authorRole: 'Executive Engineer', verificationStatus: 'Verified' }
    ],
    timeline: [
      { id: 'tl-1', date: '2026-01-10', title: 'PC-1 Project Sanctioned', description: 'Provincial Planning & Development Board granted administrative approval.', updatedBy: 'Chief Engineer KDA', statusTag: 'Approved' },
      { id: 'tl-2', date: '2026-02-01', title: 'Tendering Finalized', description: 'Contract awarded following competitive bidding in compliance with SPPRA rules.', updatedBy: 'Procurement Committee', statusTag: 'Procurement' },
      { id: 'tl-3', date: '2026-02-18', title: 'Groundbreaking & Earthwork', description: 'Heavy earthmovers mobilized; clearing of ROW commenced.', updatedBy: 'Site In-charge', statusTag: 'In Progress' },
      { id: 'tl-4', date: '2026-09-22', title: 'Major Segment Asphalt Layer Laid', description: 'Northbound carriageway achieved 68% milestone.', updatedBy: 'Engr. Farooq Sheikh', statusTag: 'In Progress' }
    ],
    informationSources: {
      officialRecordRef: 'SPPRA PPRA-KDA-2026-00912',
      tenderRef: 'TND-WORKS-KDA-COR-77',
      lastInspectionDate: '2026-09-22'
    }
  },
  {
    id: 'prj-2',
    code: 'KF-PRJ-102',
    name: 'Gujjar Nullah Stormwater Culvert & Flood Bund Rehabilitation',
    category: 'Flood Management',
    district: 'Central',
    neighborhood: 'Nazimabad Block 3 / Liaquatabad',
    latitude: 24.9185,
    longitude: 67.0342,
    status: 'Delayed',
    progressPercent: 42,
    budgetPKR: 210.0,
    startDate: '2025-11-01',
    expectedEndDate: '2026-08-30',
    verificationStatus: 'Partially Verified',
    verifiedBy: 'Provincial Disaster Management Authority (PDMA)',
    verificationDate: '2026-08-10',
    department: 'Karachi Metropolitan Corporation (KMC)',
    contractor: 'National Engineering Associates',
    description: 'Widening of natural drainage channel, construction of concrete retaining walls, and desilting sediment traps along 6.8 km vulnerable monsoon corridor.',
    openIssuesCount: 7,
    lastUpdated: '2026-09-12',
    health: {
      timelineStatus: 'Delayed',
      dataFreshness: 'Update Due',
      documentsStatus: 'Partially Verified',
      daysSinceLastUpdate: 17,
    },
    team: [
      { id: 'tm-4', name: 'Dr. Salman Hashmi', designation: 'Chief Hydrologist', department: 'KMC Flood Control Cell', responsibility: 'Hydraulic flow modeling and flood catchment assessment' },
      { id: 'tm-5', name: 'Arshad Baloch', designation: 'Project Manager', department: 'National Engineering', responsibility: 'Contractor site execution' }
    ],
    materials: [
      { id: 'm-4', material: 'Sulfate Resistant Cement (SRC)', specification: 'ASTM C150 Type V For Saline Sewage Contact', quantity: '24,000 Bags (Demo)', sourceReference: 'Site Inventory Log #40', verificationStatus: 'Verified' },
      { id: 'm-5', material: 'Deformed Steel Rebar 60-Grade', specification: 'ASTM A615 60 KSI Yield Strength', quantity: '850 Metric Tons (Demo)', sourceReference: 'Mill Test Cert 2026', verificationStatus: 'Partially Verified' }
    ],
    documents: [
      { id: 'doc-4', name: 'Environmental Impact Assessment (EIA)', type: 'Project Plan', uploadedDate: '2025-10-14', version: 'v1.0', verificationStatus: 'Verified', uploadedBy: 'Officer #102 (SEPA Liaison)', fileSize: '18.4 MB' },
      { id: 'doc-5', name: 'Revised Monsoon Contingency Schedule', type: 'Progress Report', uploadedDate: '2026-07-05', version: 'v1.2', verificationStatus: 'Partially Verified', uploadedBy: 'Officer #102 (KMC)', fileSize: '3.9 MB' }
    ],
    progressUpdates: [
      { id: 'pu-3', date: '2026-08-25', progressPercent: 42, description: 'Work slowed due to underground utility line relocation (gas & fiber cables) between Bridge 2 and Bridge 4. Revised shoring design approved.', imageUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80', authorName: 'Dr. Salman Hashmi', authorRole: 'Chief Hydrologist', verificationStatus: 'Partially Verified' }
    ],
    timeline: [
      { id: 'tl-5', date: '2025-11-01', title: 'Work Order Issued', description: 'Mobilization of site cranes and trench excavation started.', updatedBy: 'KMC Engineering Dept', statusTag: 'In Progress' },
      { id: 'tl-6', date: '2026-06-15', title: 'Schedule Delay Logged', description: 'Utility conflicts required redesign of retaining footings.', updatedBy: 'Site In-charge', statusTag: 'Delayed' }
    ],
    informationSources: {
      officialRecordRef: 'KMC/FLOOD/GN-2025-081',
      tenderRef: 'TND-KMC-ENG-2025-90',
      lastInspectionDate: '2026-08-25'
    }
  },
  {
    id: 'prj-3',
    code: 'KF-PRJ-103',
    name: 'Gulshan-e-Iqbal Central Civic Park Eco-Revitalization',
    category: 'Parks',
    district: 'East',
    neighborhood: 'Gulshan Block 6 near University Road',
    latitude: 24.9204,
    longitude: 67.0988,
    status: 'Completed',
    progressPercent: 100,
    budgetPKR: 48.0,
    startDate: '2025-08-10',
    expectedEndDate: '2026-06-30',
    actualEndDate: '2026-07-15',
    verificationStatus: 'Verified',
    verifiedBy: 'Sindh Environmental Protection Agency & Parks Directorate',
    verificationDate: '2026-07-20',
    department: 'Parks & Horticulture Department KMC',
    contractor: 'GreenUrban Landscaping Consortium',
    description: 'Transformation of 14 acres degraded municipal open ground into an urban green lung featuring 4,000 native indigenous trees (Moringa, Neem, Peepal), solar walking tracks, and drip-irrigated zones using treated effluent.',
    openIssuesCount: 0,
    lastUpdated: '2026-09-15',
    health: {
      timelineStatus: 'Completed',
      dataFreshness: 'Recently Updated',
      documentsStatus: 'Verified',
      daysSinceLastUpdate: 14,
    },
    team: [
      { id: 'tm-6', name: 'Yasmeen Lari Jr.', designation: 'Landscape Architect', department: 'Horticulture Bureau', responsibility: 'Indigenous floral plan and rainwater swales' },
      { id: 'tm-7', name: 'Kashif Abbasi', designation: 'Operations Supervisor', department: 'Parks Maintenance Wing', responsibility: 'Drip irrigation infrastructure and perimeter security' }
    ],
    materials: [
      { id: 'm-6', material: 'Recycled Composite Permeable Jogging Track Paving', specification: 'Shock Absorbing Crushed Rubber & Porous Paving Blocks', quantity: '3,200 Sq. Meters (Demo)', sourceReference: 'Green Spec #Eco-PK-2025', verificationStatus: 'Verified' },
      { id: 'm-7', material: 'Solar LED Bollards & Mast Luminaires', specification: 'Standalone LiFePO4 Battery with 40W Solar Module', quantity: '95 Units (Demo)', sourceReference: 'Invoice Batch Green-44', verificationStatus: 'Verified' }
    ],
    documents: [
      { id: 'doc-6', name: 'Handover & Formal Commissioning Certificate', type: 'Completion Report', uploadedDate: '2026-07-18', version: 'v1.0 Final', verificationStatus: 'Verified', uploadedBy: 'Supervisor #41 (Parks Director)', fileSize: '5.4 MB' },
      { id: 'doc-7', name: 'Post-Completion 12-Month Maintenance Plan', type: 'Maintenance Report', uploadedDate: '2026-07-22', version: 'v1.0', verificationStatus: 'Verified', uploadedBy: 'Supervisor #41 (Parks Director)', fileSize: '2.1 MB' }
    ],
    progressUpdates: [
      { id: 'pu-4', date: '2026-07-15', progressPercent: 100, description: 'All jogging tracks, children play equipment with certified soft turf, solar lighting, and treated water drip systems operational. Park officially open to citizens.', imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80', authorName: 'Kashif Abbasi', authorRole: 'Operations Supervisor', verificationStatus: 'Verified' }
    ],
    timeline: [
      { id: 'tl-7', date: '2025-08-10', title: 'Ground Cleared & Soil Reconditioned', description: 'Debris removal and grading finished.', updatedBy: 'Parks Wing', statusTag: 'In Progress' },
      { id: 'tl-8', date: '2026-03-20', title: '4,000 Native Trees Planted', description: 'Neem and Moringa plantation drive completed.', updatedBy: 'Horticulture Team', statusTag: 'In Progress' },
      { id: 'tl-9', date: '2026-07-15', title: 'Project 100% Commissioned', description: 'Final inspection audit signed by KMC Director General.', updatedBy: 'Supervisor #41', statusTag: 'Completed' }
    ],
    informationSources: {
      officialRecordRef: 'KMC/PARKS/GULSHAN-6-2025',
      tenderRef: 'TND-PRK-2025-412',
      lastInspectionDate: '2026-07-18'
    }
  },
  {
    id: 'prj-4',
    code: 'KF-PRJ-104',
    name: 'District South Municipal Solid Waste Transfer Station (GTS)',
    category: 'Waste Management',
    district: 'South',
    neighborhood: 'Near Lyari Riverbank / Mauripur Road',
    latitude: 24.8489,
    longitude: 66.9856,
    status: 'In Progress',
    progressPercent: 54,
    budgetPKR: 88.0,
    startDate: '2026-02-10',
    expectedEndDate: '2026-12-15',
    verificationStatus: 'Verified',
    verifiedBy: 'Sindh Solid Waste Management Board (SSWMB)',
    verificationDate: '2026-09-05',
    department: 'Sindh Solid Waste Management Board (SSWMB)',
    contractor: 'Hangzhou Jinjiang Waste Engineering JV',
    description: 'Enclosed sanitary garbage transfer station with hydraulic compactors, odor neutralization misters, and leachate treatment sump to eliminate roadside open dumping.',
    openIssuesCount: 2,
    lastUpdated: '2026-09-26',
    health: {
      timelineStatus: 'On Schedule',
      dataFreshness: 'Recently Updated',
      documentsStatus: 'Verified',
      daysSinceLastUpdate: 3,
    },
    team: [
      { id: 'tm-8', name: 'Imran Murtaza', designation: 'Director Operations South', department: 'SSWMB', responsibility: 'Municipal fleet dispatch & transfer logistics' },
      { id: 'tm-9', name: 'Suhail Qureshi', designation: 'Environmental Engineer', department: 'SEPA Monitoring', responsibility: 'Leachate containment & ambient air quality testing' }
    ],
    materials: [
      { id: 'm-8', material: 'Hydraulic Compaction Units (Heavy Duty 25-Ton)', specification: 'Twin Ram Continuous Compactor with Bio-Filter', quantity: '4 Assemblies (Demo)', sourceReference: 'Customs Import Bill Entry #9912', verificationStatus: 'Verified' },
      { id: 'm-9', material: 'HDPE Leachate Storage Membrane 2.0mm', specification: 'GRI GM13 High Density Polyethylene', quantity: '4,500 Sq. Meters (Demo)', sourceReference: 'Spec Ref: Geo-SSWMB-26', verificationStatus: 'Verified' }
    ],
    documents: [
      { id: 'doc-8', name: 'SSWMB Board Resolution & Site Allocation Deed', type: 'Approval Document', uploadedDate: '2026-02-01', version: 'v1.0', verificationStatus: 'Verified', uploadedBy: 'SSWMB Sec (Admin)', fileSize: '3.1 MB' },
      { id: 'doc-9', name: 'Civil Works Foundations Structural Audit', type: 'Progress Report', uploadedDate: '2026-08-30', version: 'v2.0', verificationStatus: 'Verified', uploadedBy: 'Officer #112 (Engr. Imran)', fileSize: '7.8 MB' }
    ],
    progressUpdates: [
      { id: 'pu-5', date: '2026-09-24', progressPercent: 54, description: 'Steel canopy superstructure erected. Concrete foundations for two primary hydraulic compactor bins poured and curing.', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', authorName: 'Imran Murtaza', authorRole: 'Director Operations', verificationStatus: 'Verified' }
    ],
    timeline: [
      { id: 'tl-10', date: '2026-02-10', title: 'Civil Works Initiated', description: 'Piling and retaining perimeter wall begun.', updatedBy: 'SSWMB Field Staff', statusTag: 'In Progress' }
    ],
    informationSources: {
      officialRecordRef: 'SSWMB/SOUTH/GTS-2026-01',
      tenderRef: 'SSWMB-NIT-2025-110',
      lastInspectionDate: '2026-09-24'
    }
  },
  {
    id: 'prj-5',
    code: 'KF-PRJ-105',
    name: 'Hub Canal Conduit Water Supply Feeder Repair',
    category: 'Water',
    district: 'West',
    neighborhood: 'Manghopir / Orangi Interlink',
    latitude: 24.9810,
    longitude: 67.0124,
    status: 'In Progress',
    progressPercent: 35,
    budgetPKR: 195.0,
    startDate: '2026-03-01',
    expectedEndDate: '2027-01-30',
    verificationStatus: 'Partially Verified',
    verifiedBy: 'Karachi Water & Sewerage Corporation (KW&SC)',
    verificationDate: '2026-08-15',
    department: 'Karachi Water & Sewerage Corporation (KW&SC)',
    contractor: 'Indus Waterway Engineering Works',
    description: 'Rehabilitation of critical 100 MGD raw water conduit from Hub Dam to Manghopir Pumping Station, sealing structural fractures to restore 35 MGD lost supply to West & Keamari districts.',
    openIssuesCount: 4,
    lastUpdated: '2026-09-02',
    health: {
      timelineStatus: 'On Schedule',
      dataFreshness: 'Update Overdue',
      documentsStatus: 'Partially Verified',
      daysSinceLastUpdate: 27,
    },
    team: [
      { id: 'tm-10', name: 'Engr. Asif Memon', designation: 'Superintending Engineer (Bulk Water)', department: 'KW&SC', responsibility: 'Conduit hydraulic pressure and raw intake regulation' }
    ],
    materials: [
      { id: 'm-10', material: 'Spiral Welded Mild Steel Pipe (84-inch Dia)', specification: 'API 5L Grade B with External Coal-Tar Epoxy', quantity: '1,800 Meters (Demo)', sourceReference: 'P&I Pipeline Cert 2026', verificationStatus: 'Partially Verified' }
    ],
    documents: [
      { id: 'doc-10', name: 'KW&SC Board Administrative Feasibility Sanction', type: 'Approval Document', uploadedDate: '2026-02-15', version: 'v1.0', verificationStatus: 'Verified', uploadedBy: 'KW&SC Desk', fileSize: '8.7 MB' }
    ],
    progressUpdates: [
      { id: 'pu-6', date: '2026-09-01', progressPercent: 35, description: 'First 600m segment relined with high-durability polyurea liner. Hydrostatic test showed zero seepage along Section A.', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', authorName: 'Engr. Asif Memon', authorRole: 'Superintending Engineer', verificationStatus: 'Partially Verified' }
    ],
    timeline: [
      { id: 'tl-11', date: '2026-03-01', title: 'Pipeline Segment Dewatered', description: 'Diversion siphon created to allow internal relining without fully cutting city supply.', updatedBy: 'KW&SC Works', statusTag: 'In Progress' }
    ],
    informationSources: {
      officialRecordRef: 'KWSC/BULK/HUB-CONDUIT-26',
      tenderRef: 'KWSC-PROC-2026-89',
      lastInspectionDate: '2026-09-01'
    }
  },
  {
    id: 'prj-6',
    code: 'KF-PRJ-106',
    name: 'Malir Riverbed Sewerage Interceptor & Trunk Line',
    category: 'Sewerage',
    district: 'Malir',
    neighborhood: 'Shah Faisal Colony / Malir Halt Link',
    latitude: 24.8789,
    longitude: 67.1654,
    status: 'Proposed',
    progressPercent: 12,
    budgetPKR: 160.0,
    startDate: '2026-08-01',
    expectedEndDate: '2027-06-30',
    verificationStatus: 'Unverified',
    department: 'KW&SC & Sindh Local Govt',
    contractor: 'Tendering In Progress',
    description: 'Design and installation of 5.5 km deep gravity trunk sewer to intercept raw domestic effluent discharging into Malir River, routing it toward Treatment Plant 3 (TP-3).',
    openIssuesCount: 1,
    lastUpdated: '2026-09-10',
    health: {
      timelineStatus: 'On Schedule',
      dataFreshness: 'Update Due',
      documentsStatus: 'Missing Documents',
      daysSinceLastUpdate: 19,
    },
    team: [
      { id: 'tm-11', name: 'Shabbir Shah', designation: 'Tender Evaluation Officer', department: 'Sindh Local Govt Dept', responsibility: 'Pre-qualification bidder screening' }
    ],
    materials: [
      { id: 'm-11', material: 'Reinforced Concrete Jacking Pipes 72-inch', specification: 'BS 5911 Class L Heavy Duty', quantity: 'Demo Quantity Pending Award', sourceReference: 'Draft BoQ', verificationStatus: 'Unverified' }
    ],
    documents: [
      { id: 'doc-11', name: 'Draft Concept Paper & Scope of Works', type: 'Project Plan', uploadedDate: '2026-08-05', version: 'Draft v0.3', verificationStatus: 'Unverified', uploadedBy: 'Planner #19', fileSize: '1.4 MB' }
    ],
    progressUpdates: [
      { id: 'pu-7', date: '2026-08-12', progressPercent: 12, description: 'Topographical drone survey and geotechnical soil core boreholes completed at 14 test locations.', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', authorName: 'Shabbir Shah', authorRole: 'Evaluation Officer', verificationStatus: 'Unverified' }
    ],
    timeline: [
      { id: 'tl-12', date: '2026-08-01', title: 'PC-1 Draft Submitted', description: 'Submitted to Sindh Finance Dept for fiscal allocation.', updatedBy: 'LG Dept', statusTag: 'Proposed' }
    ],
    informationSources: {
      officialRecordRef: 'DRAFT-LG-MALIR-SEW-26',
      tenderRef: 'PRE-QUAL-2026-004',
      lastInspectionDate: '2026-08-12'
    }
  },
  {
    id: 'prj-7',
    code: 'KF-PRJ-107',
    name: 'Keamari Harbor Road & Port Access Bridge Deck Overhaul',
    category: 'Bridges',
    district: 'Keamari',
    neighborhood: 'Keamari Port Entrance / Jinnah Flyover Ramp',
    latitude: 24.8198,
    longitude: 66.9745,
    status: 'In Progress',
    progressPercent: 78,
    budgetPKR: 112.0,
    startDate: '2025-10-15',
    expectedEndDate: '2026-10-31',
    verificationStatus: 'Verified',
    verifiedBy: 'Karachi Port Trust (KPT) & KMC Engineering',
    verificationDate: '2026-09-14',
    department: 'Karachi Port Trust (KPT)',
    contractor: 'Harbor Marine Civil Tech',
    description: 'Seismic bearing pad replacement, expansion joint overhaul, and anti-corrosion marine polyurethane coating on heavy cargo flyover connecting Karachi Port with Mauripur bypass.',
    openIssuesCount: 1,
    lastUpdated: '2026-09-27',
    health: {
      timelineStatus: 'On Schedule',
      dataFreshness: 'Recently Updated',
      documentsStatus: 'Verified',
      daysSinceLastUpdate: 2,
    },
    team: [
      { id: 'tm-12', name: 'Engr. Jameel Durrani', designation: 'Bridge Structural Consultant', department: 'KPT Civil Wing', responsibility: 'Structural integrity load stress testing' }
    ],
    materials: [
      { id: 'm-12', material: 'Elastomeric Laminated Bridge Bearings', specification: 'AASHTO M251 Certified 500-Ton Rating', quantity: '48 Sets (Demo)', sourceReference: 'KPT Marine Quality Cert', verificationStatus: 'Verified' }
    ],
    documents: [
      { id: 'doc-12', name: 'NDT Structural Ultrasound Health Report', type: 'Progress Report', uploadedDate: '2026-09-10', version: 'v1.4', verificationStatus: 'Verified', uploadedBy: 'Engr. Jameel Durrani', fileSize: '4.8 MB' }
    ],
    progressUpdates: [
      { id: 'pu-8', date: '2026-09-25', progressPercent: 78, description: '42 of 48 elastomeric bearings replaced using hydraulic synchronized jacks without closing night port traffic.', imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80', authorName: 'Engr. Jameel Durrani', authorRole: 'Consultant', verificationStatus: 'Verified' }
    ],
    timeline: [
      { id: 'tl-13', date: '2025-10-15', title: 'Traffic Rerouting Approved', description: 'Night-only work schedule implemented to protect national freight movement.', updatedBy: 'Traffic Police Liaison', statusTag: 'In Progress' }
    ],
    informationSources: {
      officialRecordRef: 'KPT/CIVIL/BR-2025-099',
      tenderRef: 'TND-KPT-EXP-2025',
      lastInspectionDate: '2026-09-25'
    }
  }
];

export const INITIAL_PROJECTS: Project[] = SAMPLE_PROJECTS;

export const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'KF-ISSUE-1024',
    category: 'Road Damage',
    title: 'Severe Craters & Broken Concrete on Korangi Sector 7 Main Road',
    description: 'Deep road potholes spanning over 40 meters near the leather industrial zone intersection. Multiple freight trucks and motorbikes have sustained severe rim damage. Rainwater pooling makes craters invisible at night.',
    district: 'Korangi',
    neighborhood: 'Korangi Industrial Area Sector 7',
    latitude: 24.8340,
    longitude: 67.1160,
    status: 'Action In Progress',
    priority: 'Urgent',
    isVerifiedFact: true,
    verificationStatus: 'Verified',
    submittedDate: '2026-09-12',
    expectedSlaDate: '2026-09-18',
    isOverdue: true,
    reporterId: 'usr-004',
    reporterName: 'M. Kashif Rauf',
    reporterContact: '0300-8273641',
    reporterEmail: 'kashif.rauf@gmail.com',
    relatedProjectId: 'prj-1',
    assignedOfficer: 'Engr. Farooq Sheikh (KDA)',
    assignedDepartment: 'KDA Works & Services',
    evidenceImages: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    citizenReportCount: 47,
    duplicateReports: [
      { date: '2026-09-13', reporter: 'Ahsan Qureshi', note: 'Two delivery vans got stuck this morning.' },
      { date: '2026-09-15', reporter: 'Taimoor Shah', note: 'Water logging makes it hazardous for motorcyclists.' },
      { date: '2026-09-18', reporter: 'Syed Hamza', note: 'Traffic backed up past Sector 8 signal.' }
    ],
    statusHistory: [
      { status: 'Submitted', date: '2026-09-12', updatedBy: 'Citizen Portal', comment: 'Initial report filed with geotagged photo.' },
      { status: 'Under Review', date: '2026-09-13', updatedBy: 'Desk Officer #09', comment: 'Reviewed by complaint intake team.' },
      { status: 'Verified', date: '2026-09-14', updatedBy: 'Site Inspector Ali (KDA)', comment: 'Physical inspection confirmed hazardous road depression measuring 14 inches deep.' },
      { status: 'Assigned', date: '2026-09-15', updatedBy: 'KDA Works Dept', comment: 'Assigned to Korangi Road Project contractor Habib Rafiq for emergency patch leveling.' },
      { status: 'Action In Progress', date: '2026-09-20', updatedBy: 'Engr. Farooq Sheikh', comment: 'Excavation of muddy sub-base commenced; dry aggregate backfilling underway.' },
      { status: 'Escalated', date: '2026-09-24', updatedBy: 'Automated SLA System', comment: 'Resolution exceeded 7-day target window. Supervisor notified.' }
    ]
  },
  {
    id: 'KF-ISSUE-1025',
    category: 'Water Leakage',
    title: 'High-Pressure Water Trunk Line Burst at University Road',
    description: 'A 24-inch water main has developed a continuous fissure near NIPA Chowrangi, wasting thousands of gallons of clean drinking water daily while flooding the service road.',
    district: 'East',
    neighborhood: 'Gulshan-e-Iqbal Block 11',
    latitude: 24.9192,
    longitude: 67.0945,
    status: 'Resolved',
    priority: 'High',
    isVerifiedFact: true,
    verificationStatus: 'Verified',
    submittedDate: '2026-09-18',
    expectedSlaDate: '2026-09-22',
    isOverdue: false,
    reporterId: 'usr-002',
    reporterName: 'Fatima Zahra',
    reporterContact: '0321-9988223',
    reporterEmail: 'f.zahra@yahoo.com',
    relatedProjectId: 'prj-3',
    assignedOfficer: 'Saeed Anwar (KW&SC East)',
    assignedDepartment: 'Karachi Water & Sewerage Corporation',
    evidenceImages: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    citizenReportCount: 29,
    resolution: {
      description: 'KW&SC Rapid Response emergency welding team excavated the faulty pipe sleeve, welded a 24-inch ductile iron collar clamp, re-pressurized the line, and restored asphalt paving over the service road trench.',
      resolutionDate: '2026-09-21',
      resolvedBy: 'Saeed Anwar (Assistant Executive Engineer KW&SC)',
      beforeImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      afterImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80',
      documentRef: 'KWSC-RR-JOB-2026-881',
      verifiedBySupervisor: true
    },
    statusHistory: [
      { status: 'Submitted', date: '2026-09-18', updatedBy: 'Citizen Portal', comment: 'Report received with video evidence.' },
      { status: 'Verified', date: '2026-09-19', updatedBy: 'KW&SC Dispatch', comment: 'Confirmed burst pipe on 24-inch feeder line.' },
      { status: 'Assigned', date: '2026-09-19', updatedBy: 'KW&SC Dispatch', comment: 'Assigned to East Division Rapid Repair Crew.' },
      { status: 'Action In Progress', date: '2026-09-20', updatedBy: 'Saeed Anwar', comment: 'Excavation completed, ductile collar welded.' },
      { status: 'Resolved', date: '2026-09-21', updatedBy: 'Saeed Anwar', comment: 'Pipe pressure verified at 3.5 bar, backfill and road patch finalized.' },
      { status: 'Closed', date: '2026-09-23', updatedBy: 'Citizen Portal', comment: 'Reporter confirmed water leakage has completely ceased.' }
    ]
  },
  {
    id: 'KF-ISSUE-1026',
    category: 'Drainage Blockage',
    title: 'Solid Plastic Waste Clogging Liaquatabad Underpass Drain',
    description: 'Stormwater inlets under the Liaquatabad Flyover are completely blocked with plastic sacks and uncollected debris, creating standing dirty water during morning rush hour.',
    district: 'Central',
    neighborhood: 'Liaquatabad Underpass',
    latitude: 24.9082,
    longitude: 67.0421,
    status: 'Under Review',
    priority: 'High',
    isVerifiedFact: false, // Citizen report until verified
    verificationStatus: 'Under Review',
    submittedDate: '2026-09-27',
    expectedSlaDate: '2026-09-30',
    isOverdue: false,
    reporterId: 'usr-005',
    reporterName: 'Waqas Ahmed',
    reporterContact: '0333-4129881',
    reporterEmail: 'waqas.ahmed99@gmail.com',
    relatedProjectId: 'prj-2',
    assignedDepartment: 'KMC Mechanical & Drainage Wing',
    evidenceImages: [
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80'
    ],
    citizenReportCount: 14,
    statusHistory: [
      { status: 'Submitted', date: '2026-09-27', updatedBy: 'Citizen Portal', comment: 'Citizen filed geotagged complaint.' },
      { status: 'Under Review', date: '2026-09-28', updatedBy: 'Central Desk', comment: 'Dispatched zone officer for physical ground check.' }
    ]
  },
  {
    id: 'KF-ISSUE-1027',
    category: 'Streetlight Problem',
    title: 'Non-Functional High-Mast Luminaires on Shahrah-e-Faisal',
    description: 'Seven consecutive high-mast streetlights from Nursery bridge to Baloch Colony exit are completely unlit, reducing nighttime highway visibility and posing safety hazards for fast traffic.',
    district: 'East',
    neighborhood: 'Baloch Colony Flyover Exit',
    latitude: 24.8680,
    longitude: 67.0720,
    status: 'Assigned',
    priority: 'Medium',
    isVerifiedFact: true,
    verificationStatus: 'Verified',
    submittedDate: '2026-09-23',
    expectedSlaDate: '2026-09-28',
    isOverdue: true,
    reporterId: 'usr-006',
    reporterName: 'Danish Raza',
    reporterContact: '0345-2190014',
    reporterEmail: 'danish.raza@live.com',
    assignedOfficer: 'Khalid Bhatti (Electrical KMC)',
    assignedDepartment: 'KMC Electrical Engineering Department',
    evidenceImages: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    citizenReportCount: 19,
    statusHistory: [
      { status: 'Submitted', date: '2026-09-23', updatedBy: 'Citizen Portal', comment: 'Geotagged report submitted.' },
      { status: 'Verified', date: '2026-09-24', updatedBy: 'KMC Patrol', comment: 'Faulty underground transformer feeder cable located.' },
      { status: 'Assigned', date: '2026-09-25', updatedBy: 'KMC Electrical', comment: 'Work order #KMC-EL-49 issued for cable splicing.' }
    ]
  },
  {
    id: 'KF-ISSUE-1028',
    category: 'Bridge Issue',
    title: 'Damaged Expansion Joint on Mauripur Flyover Ramp',
    description: 'Heavy container vehicles have loosened the steel teeth of the southern bridge expansion joint. Exposed metal creates jarring thuds and tire punctures.',
    district: 'Keamari',
    neighborhood: 'Mauripur Port Access',
    latitude: 24.8210,
    longitude: 66.9760,
    status: 'Verified',
    priority: 'Urgent',
    isVerifiedFact: true,
    verificationStatus: 'Verified',
    submittedDate: '2026-09-25',
    expectedSlaDate: '2026-09-29',
    isOverdue: false,
    reporterId: 'usr-007',
    reporterName: 'Sardar Gul Khan (Karachi Goods Transport Assoc.)',
    reporterContact: '0301-5544332',
    reporterEmail: 'kgta.office@gmail.com',
    relatedProjectId: 'prj-7',
    assignedOfficer: 'Engr. Jameel Durrani',
    assignedDepartment: 'KPT Civil Wing & KMC',
    evidenceImages: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    ],
    citizenReportCount: 38,
    statusHistory: [
      { status: 'Submitted', date: '2026-09-25', updatedBy: 'Citizen Portal', comment: 'Transport union filed alert.' },
      { status: 'Verified', date: '2026-09-26', updatedBy: 'Engr. Jameel Durrani', comment: 'Verified during bridge patrol. Scheduled for night shift replacement.' }
    ]
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = SAMPLE_COMPLAINTS;

export const SAMPLE_WASTE_REPORTS: WasteReport[] = [
  {
    id: 'KF-WASTE-401',
    category: 'Overflowing Bin',
    locationName: 'Tariq Road Commercial Market (Near Liberty Chowk)',
    district: 'East',
    latitude: 24.8715,
    longitude: 67.0601,
    status: 'Collection Scheduled',
    densityLevel: 'Severe',
    description: 'Three 1100L SSWMB municipal containers overflowing onto the pedestrian footpath. Commercial shopping bags scattered by stray animals.',
    reportedDate: '2026-09-28',
    slaDate: '2026-09-29',
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1611288870280-4a80ebb90768?auto=format&fit=crop&w=800&q=80',
    assignedVehicle: 'SSWMB Compactor Truck #KZ-4412',
    assignedTeam: 'Jamshed Zone Night Shift Team C'
  },
  {
    id: 'KF-WASTE-402',
    category: 'Illegal Dumping',
    locationName: 'Lyari Expressway Riverbank Slope near Hassan Square',
    district: 'Central',
    latitude: 24.9010,
    longitude: 67.0735,
    status: 'Reported',
    densityLevel: 'Critical Hotspot',
    description: 'Unidentified commercial trucks repeatedly dumping construction rubble and demolished concrete alongside green belt verge during midnight hours.',
    reportedDate: '2026-09-27',
    slaDate: '2026-09-29',
    isOverdue: true,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'KF-WASTE-403',
    category: 'Garbage Pile',
    locationName: 'Burns Road Food Street Alley 4',
    district: 'South',
    latitude: 24.8562,
    longitude: 67.0189,
    status: 'Verified Resolution',
    densityLevel: 'Moderate',
    description: 'Food waste packaging and plastic containers piled up behind culinary shops after festival weekend.',
    reportedDate: '2026-09-24',
    slaDate: '2026-09-25',
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    assignedVehicle: 'South Compact Sweeper #S-109',
    assignedTeam: 'Saddar Morning Sanitary Crew',
    resolutionImage: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    resolvedDate: '2026-09-25'
  },
  {
    id: 'KF-WASTE-404',
    category: 'Missed Collection',
    locationName: 'Federal B Area Block 14 Residential Rows',
    district: 'Central',
    latitude: 24.9312,
    longitude: 67.0678,
    status: 'Assigned',
    densityLevel: 'Moderate',
    description: 'Door-to-door municipal collection skipped for 3 consecutive days in street numbers 12 through 16.',
    reportedDate: '2026-09-26',
    slaDate: '2026-09-28',
    isOverdue: true,
    imageUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80',
    assignedVehicle: 'Gulberg Mechanical Dumper #G-88',
    assignedTeam: 'Gulberg Zone Day Team'
  },
  {
    id: 'KF-WASTE-405',
    category: 'Waste on Road',
    locationName: 'Sea View Beach Boulevard Service Lane',
    district: 'South',
    latitude: 24.7950,
    longitude: 67.0450,
    status: 'Action Completed',
    densityLevel: 'Low',
    description: 'Wind-blown plastic beverage cups and single-use bags accumulating along the beach promenade median.',
    reportedDate: '2026-09-26',
    slaDate: '2026-09-27',
    isOverdue: false,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    assignedVehicle: 'Clifton Beach Sweeper #CL-04',
    assignedTeam: 'CBC / SSWMB Joint Beach Taskforce',
    resolutionImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    resolvedDate: '2026-09-27'
  }
];

export const INITIAL_WASTE_REPORTS: WasteReport[] = SAMPLE_WASTE_REPORTS;

export const SAMPLE_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-27 16:45',
    action: 'Progress Update Submitted',
    targetType: 'Project',
    targetId: 'prj-7',
    targetName: 'Keamari Harbor Road Bridge Overhaul',
    changedBy: 'Engr. Jameel Durrani',
    userRole: 'officer',
    oldValue: 'Progress 70%',
    newValue: 'Progress 78%',
    reason: 'Completed 42nd elastomeric bearing replacement under supervision with test log.'
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-26 11:20',
    action: 'Complaint Escalated',
    targetType: 'Complaint',
    targetId: 'KF-ISSUE-1024',
    targetName: 'Korangi Sector 7 Main Road Craters',
    changedBy: 'System Automation',
    userRole: 'admin',
    oldValue: 'Status: Action In Progress',
    newValue: 'Status: Escalated to Supervisor',
    reason: 'SLA response deadline exceeded by 6 days without resolution certification.'
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-25 14:10',
    action: 'Budget Revision Approved',
    targetType: 'Project',
    targetId: 'prj-1',
    targetName: 'Korangi Road Dualization',
    changedBy: 'Dir. Works Tariq Mehmood',
    userRole: 'supervisor',
    oldValue: 'Budget: PKR 138.0M',
    newValue: 'Budget: PKR 145.5M',
    reason: 'Approved revised PC-1 adding 2 additional high-volume stormwater culverts after monsoon study.'
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-21 17:30',
    action: 'Complaint Resolved With Evidence',
    targetType: 'Complaint',
    targetId: 'KF-ISSUE-1025',
    targetName: 'University Road Burst Water Trunk',
    changedBy: 'Saeed Anwar (KW&SC East)',
    userRole: 'officer',
    oldValue: 'Status: Action In Progress',
    newValue: 'Status: Resolved',
    reason: 'Weld collar installed, pressure verified 3.5 bar, road surface reinstated with after-action photo evidence.'
  },
  {
    id: 'aud-5',
    timestamp: '2026-09-18 09:15',
    action: 'Project Verified & Published',
    targetType: 'Project',
    targetId: 'prj-1',
    targetName: 'Korangi Road Dualization',
    changedBy: 'Dir. Works Tariq Mehmood',
    userRole: 'supervisor',
    oldValue: 'Verification: Partially Verified',
    newValue: 'Verification: Verified',
    reason: 'Verified all 3 SPPRA tender documents, asphalt batch tickets, and third-party lab compression audits.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = SAMPLE_AUDIT_LOGS;

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent Complaint Escalation Alert',
    message: 'Complaint KF-ISSUE-1024 (Korangi Road Potholes) has passed SLA by 6 days. 47 citizens have co-reported this location.',
    category: 'complaint',
    targetRole: 'supervisor',
    targetDistrict: 'Korangi',
    timestamp: '15 minutes ago',
    isRead: false,
    linkId: 'KF-ISSUE-1024'
  },
  {
    id: 'notif-2',
    title: 'Project Data Freshness Warning',
    message: 'Project KF-PRJ-105 (Hub Canal Conduit) has not posted a verified progress report in 27 days. Update due.',
    category: 'project',
    targetRole: 'officer',
    targetDistrict: 'West',
    timestamp: '2 hours ago',
    isRead: false,
    linkId: 'prj-5'
  },
  {
    id: 'notif-3',
    title: 'Complaint Resolved in East District',
    message: 'Water trunk burst near NIPA Chowrangi (KF-ISSUE-1025) has been repaired and verified with after-action evidence.',
    category: 'complaint',
    targetRole: 'citizen',
    targetDistrict: 'East',
    timestamp: '1 day ago',
    isRead: false,
    linkId: 'KF-ISSUE-1025'
  },
  {
    id: 'notif-4',
    title: 'New Waste Hotspot Cluster Detected',
    message: 'Multiple illegal dumping reports logged along Lyari Expressway verge. Dispatch scheduled.',
    category: 'waste',
    targetRole: 'officer',
    targetDistrict: 'Central',
    timestamp: '2 days ago',
    isRead: true,
    linkId: 'KF-WASTE-402'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = SAMPLE_NOTIFICATIONS;

export const KARACHI_DISTRICTS_DATA = [
  { name: 'Central', projectsCount: 14, activeIssues: 22, wasteReports: 14, resolvedIssues: 58, overdueCount: 3, population: '3.8M', coordinator: 'KMC Central Zone Office' },
  { name: 'East', projectsCount: 18, activeIssues: 19, wasteReports: 11, resolvedIssues: 72, overdueCount: 1, population: '3.2M', coordinator: 'KDA & KMC East Directorate' },
  { name: 'South', projectsCount: 16, activeIssues: 25, wasteReports: 18, resolvedIssues: 81, overdueCount: 2, population: '2.1M', coordinator: 'District South Municipal Corporation' },
  { name: 'West', projectsCount: 11, activeIssues: 31, wasteReports: 15, resolvedIssues: 44, overdueCount: 6, population: '3.9M', coordinator: 'KW&SC & West Works Board' },
  { name: 'Korangi', projectsCount: 12, activeIssues: 28, wasteReports: 12, resolvedIssues: 51, overdueCount: 4, population: '2.6M', coordinator: 'Korangi Industrial Development Cell' },
  { name: 'Malir', projectsCount: 9, activeIssues: 16, wasteReports: 9, resolvedIssues: 38, overdueCount: 2, population: '1.9M', coordinator: 'Malir Development Authority (MDA)' },
  { name: 'Keamari', projectsCount: 8, activeIssues: 18, wasteReports: 10, resolvedIssues: 29, overdueCount: 3, population: '1.8M', coordinator: 'KPT & Keamari District Council' },
];
