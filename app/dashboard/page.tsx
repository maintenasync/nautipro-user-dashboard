// app/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Import layout components
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Import page components
import DashboardHome from './components/pages/DashboardHome';
import CrewManagement from './components/pages/CrewManagement';
import Companies from './components/pages/Companies';
import Vessels from './components/pages/Vessels';
import License from './components/pages/License';
import Invitations from './components/pages/Invitations';
import NotificationSetting from './components/pages/NotificationSetting';
import UserSettings from './components/pages/UserSettings';
import CreateCompany from './components/pages/CreateCompany';
import CreateVessel from './components/pages/CreateVessel';
import VesselDetail from './components/pages/VesselDetail';

// Import icons
import {
    HomeIcon,
    CrewIcon,
    BuildingIcon,
    ShipIcon,
    LicenseIcon,
    InvitationIcon,
    NotificationIcon,
    SettingsIcon
} from './components/icons/Icons';

// Menu items configuration
const menuItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon, component: DashboardHome },
    { id: 'crew', label: 'Crew Management', icon: CrewIcon, component: CrewManagement },
    { id: 'companies', label: 'Companies', icon: BuildingIcon, component: Companies },
    { id: 'vessels', label: 'Vessels', icon: ShipIcon, component: Vessels },
    { id: 'license', label: 'License', icon: LicenseIcon, component: License },
    { id: 'invitations', label: 'Invitations', icon: InvitationIcon, component: Invitations },
    { id: 'notification', label: 'Notification Setting', icon: NotificationIcon, component: NotificationSetting },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, component: UserSettings },
];

// Dashboard Content Component (protected content)
function DashboardContent() {
    const { state, refreshUserData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState('home');
    const [currentView, setCurrentView] = useState<'main' | 'create-company' | 'create-vessel' | 'vessel-detail'>('main');
    const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);

    // Auto refresh user data setiap 10 menit
    useEffect(() => {
        const interval = setInterval(() => {
            if (state.isAuthenticated) {
                refreshUserData();
            }
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, [state.isAuthenticated, refreshUserData]);

    // Handle window resize untuk sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation handlers
    const handleBackToMain = () => {
        setCurrentView('main');
        setSelectedVesselId(null);
    };

    const handleNavigateToCreateCompany = () => {
        setCurrentView('create-company');
    };

    const handleNavigateToCreateVessel = () => {
        setCurrentView('create-vessel');
    };

    const handleNavigateToVesselDetail = (vesselId: number) => {
        setSelectedVesselId(vesselId);
        setCurrentView('vessel-detail');
    };

    // Handle form submissions
    const handleCreateCompany = async (companyData: unknown) => {
        try {
            console.log('Creating company:', companyData);
            // Here you would typically make an API call to save the company
            // For now, we'll just go back to the main view
            setCurrentView('main');
            setActiveMenuItem('companies');

            // Refresh user data untuk update statistics jika perlu
            await refreshUserData();
        } catch (error) {
            console.error('Error creating company:', error);
        }
    };

    const handleCreateVessel = async (vesselData: unknown) => {
        try {
            console.log('Creating vessel:', vesselData);
            // Here you would typically make an API call to save the vessel
            // For now, we'll just go back to the main view
            setCurrentView('main');
            setActiveMenuItem('vessels');

            // Refresh user data untuk update statistics jika perlu
            await refreshUserData();
        } catch (error) {
            console.error('Error creating vessel:', error);
        }
    };

    // Get the active component based on current view
    const getActiveComponent = () => {
        if (currentView === 'create-company') {
            return (
                <CreateCompany
                    onBack={handleBackToMain}
                    onSubmit={handleCreateCompany}
                />
            );
        }

        if (currentView === 'create-vessel') {
            return (
                <CreateVessel
                    onBack={handleBackToMain}
                    onSubmit={handleCreateVessel}
                />
            );
        }

        if (currentView === 'vessel-detail' && selectedVesselId) {
            return (
                <VesselDetail
                    vesselId={selectedVesselId}
                    onBack={handleBackToMain}
                />
            );
        }

        // Main view - render the selected menu component
        const menuItem = menuItems.find(item => item.id === activeMenuItem);
        if (!menuItem) return <DashboardHome />;

        const Component = menuItem.component;

        // Pass navigation handlers sebagai props jika diperlukan
        const componentProps: any = {};

        if (activeMenuItem === 'companies') {
            componentProps.onNavigateToCreate = handleNavigateToCreateCompany;
        }

        if (activeMenuItem === 'vessels') {
            componentProps.onNavigateToCreate = handleNavigateToCreateVessel;
            componentProps.onNavigateToDetail = handleNavigateToVesselDetail;
        }

        return <Component {...componentProps} />;
    };

    // Loading state untuk operations
    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 [data-theme='dark']_&:bg-gray-900">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                menuItems={menuItems}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <TopBar
                    menuItems={menuItems}
                    activeMenuItem={activeMenuItem}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 [data-theme='dark']_&:bg-gray-900">
                    <div className="p-6">
                        {getActiveComponent()}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Dashboard Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Something went wrong
                            </h2>

                            <p className="text-gray-600 mb-6">
                                An error occurred while loading the dashboard.
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Main Dashboard Page Component
export default function DashboardPage() {
    return (
        <DashboardErrorBoundary>
            <ProtectedRoute>
                <DashboardContent />
            </ProtectedRoute>
        </DashboardErrorBoundary>
    );
}

// Export individual route guards untuk specific pages jika diperlukan
// export const AdminDashboard = () => (
//     <ProtectedRoute requiredRole="Admin">
//         <DashboardContent />
//     </ProtectedRoute>
// );
//
// export const ManagerDashboard = () => (
//     <ProtectedRoute requiredRole="Manager">
//         <DashboardContent />
//     </ProtectedRoute>
// );
//
// export const SuperintendentDashboard = () => (
//     <ProtectedRoute requiredRole="Superintendent">
//         <DashboardContent />
//     </ProtectedRoute>
// );