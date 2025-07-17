// app/dashboard/components/layout/TopBar.tsx

import { SearchIcon, BellIcon, UserIcon } from '../icons/Icons';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

interface TopBarProps {
    menuItems: MenuItem[];
    activeMenuItem: string;
}

export default function TopBar({ menuItems, activeMenuItem }: TopBarProps) {
    return (
        <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {menuItems.find(item => item.id === activeMenuItem)?.label}
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search */}
                    {/*<div className="relative">*/}
                    {/*    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        placeholder="Search..."*/}
                    {/*        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Notifications */}
                    <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                        <BellIcon />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
                    </button>

                    {/* Profile */}
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                        <UserIcon />
                        <span className="text-sm font-medium text-gray-700">John Doe</span>
                    </button>
                </div>
            </div>
        </header>
    );
}