// app/dashboard/page.tsx

'use client';

import {useState} from 'react';
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
import Settings from './components/pages/Settings';
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
    {id: 'home', label: 'Dashboard', icon: HomeIcon, component: DashboardHome},
    {id: 'crew', label: 'Crew Management', icon: CrewIcon, component: CrewManagement},
    {id: 'companies', label: 'Companies', icon: BuildingIcon, component: Companies},
    {id: 'vessels', label: 'Vessels', icon: ShipIcon, component: Vessels},
    {id: 'license', label: 'License', icon: LicenseIcon, component: License},
    {id: 'invitations', label: 'Invitations', icon: InvitationIcon, component: Invitations},
    {id: 'notification', label: 'Notification Setting', icon: NotificationIcon, component: NotificationSetting},
    {id: 'settings', label: 'Settings', icon: SettingsIcon, component: Settings},
];

// interface ComponentProps {
//     onNavigateToCreate?: () => void
// }

function DashboardContent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState('home');
    const [currentView, setCurrentView] = useState<'main' | 'create-company' | 'create-vessel' | 'vessel-detail'>('main');
    const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);

    // Navigation handlers
    // const handleNavigateToCreateCompany = () => {
    //     setCurrentView('create-company');
    // };
    //
    // const handleNavigateToCreateVessel = () => {
    //     setCurrentView('create-vessel');
    // };
    //
    // const handleNavigateToVesselDetail = (vesselId: number) => {
    //     setSelectedVesselId(vesselId);
    //     setCurrentView('vessel-detail');
    // };

    const handleBackToMain = () => {
        setCurrentView('main');
        setSelectedVesselId(null);
    };

    // Handle form submissions
    const handleCreateCompany = (companyData: unknown) => {
        console.log('Creating company:', companyData);
        // Here you would typically make an API call to save the company
        // For now, we'll just go back to the main view
        setCurrentView('main');
        setActiveMenuItem('companies');
    };

    const handleCreateVessel = (vesselData: unknown) => {
        console.log('Creating vessel:', vesselData);
        // Here you would typically make an API call to save the vessel
        // For now, we'll just go back to the main view
        setCurrentView('main');
        setActiveMenuItem('vessels');
    };

    // Get the active component based on current view
    const getActiveComponent = () => {
        if (currentView === 'create-company') {
            return <CreateCompany onBack={handleBackToMain} onSubmit={handleCreateCompany}/>;
        }

        if (currentView === 'create-vessel') {
            return <CreateVessel onBack={handleBackToMain} onSubmit={handleCreateVessel}/>;
        }

        if (currentView === 'vessel-detail' && selectedVesselId) {
            return <VesselDetail vesselId={selectedVesselId} onBack={handleBackToMain}/>;
        }

        // Main view - render the selected menu component
        const menuItem = menuItems.find(item => item.id === activeMenuItem);
        if (!menuItem) return <DashboardHome/>;

        const Component = menuItem.component;

        return <Component/>;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                menuItems={menuItems}
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <TopBar
                    menuItems={menuItems}
                    activeMenuItem={activeMenuItem}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {getActiveComponent()}
                </main>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent/>
        </ProtectedRoute>
    );
}