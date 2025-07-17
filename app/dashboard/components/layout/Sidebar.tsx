// app/dashboard/components/layout/Sidebar.tsx

import { MenuIcon, XIcon } from '../icons/Icons';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    menuItems: MenuItem[];
    activeMenuItem: string;
    setActiveMenuItem: (id: string) => void;
}

export default function Sidebar({
                                    sidebarOpen,
                                    setSidebarOpen,
                                    menuItems,
                                    activeMenuItem,
                                    setActiveMenuItem
                                }: SidebarProps) {
    const toggleSidebar = () => {
        console.log('Toggle sidebar clicked, current state:', sidebarOpen);
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className={`font-bold text-xl text-gray-800 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        Dashboard
                    </h1>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {sidebarOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveMenuItem(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                            activeMenuItem === item.id
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        title={item.label}
                                    >
                                        <Icon />
                                        <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                      {item.label}
                    </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}