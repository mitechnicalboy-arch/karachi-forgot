import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { ReportIssueModal } from './components/issues/ReportIssueModal';
import { ResolveComplaintModal } from './components/issues/ResolveComplaintModal';
import { ReportWasteModal } from './components/waste/ReportWasteModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { UpdateProgressModal } from './components/projects/UpdateProgressModal';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { ProjectExplorer } from './components/projects/ProjectExplorer';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { CivicMapComponent } from './components/map/CivicMapComponent';
import { IssuesExplorer } from './components/issues/IssuesExplorer';
import { WasteHub } from './components/waste/WasteHub';
import { AreaDashboard } from './components/dashboards/AreaDashboard';
import { AnalyticsDashboard } from './components/dashboards/AnalyticsDashboard';

// Role Dashboards
import { CitizenDashboard } from './components/dashboards/CitizenDashboard';
import { OfficerDashboard } from './components/dashboards/OfficerDashboard';
import { SupervisorDashboard } from './components/dashboards/SupervisorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { activeTab, selectedProjectId, role } = useApp();

  const renderContent = () => {
    // If a project detail is active, prioritize it
    if (activeTab === 'project-detail' || (activeTab === 'projects' && selectedProjectId)) {
      return <ProjectDetailView />;
    }

    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'projects':
        return <ProjectExplorer />;
      case 'map':
        return <CivicMapComponent fullScreen={true} />;
      case 'issues':
        return <IssuesExplorer />;
      case 'waste':
        return <WasteHub />;
      case 'area':
        return <AreaDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'admin':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDashboard />
          </div>
        );
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {role === 'citizen' && <CitizenDashboard />}
            {role === 'officer' && <OfficerDashboard />}
            {role === 'supervisor' && <SupervisorDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {renderContent()}
      </main>

      {activeTab !== 'map' && <Footer />}

      {/* Global Modals & Notifications */}
      <AuthModal />
      <ReportIssueModal />
      <ReportWasteModal />
      <CreateProjectModal />
      <UpdateProgressModal />
      <ResolveComplaintModal />
      <GlobalSearchModal />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
