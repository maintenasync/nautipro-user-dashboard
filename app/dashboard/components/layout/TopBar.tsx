// app/dashboard/components/layout/TopBar.tsx

import { SearchIcon, BellIcon, UserIcon } from '../icons/Icons';
import { useAuth } from '@/app/contexts/AuthContext';

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
    const { state, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

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

                    {/* Profile Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                            {state.user?.avatar ? (
                                <img
                                    src={state.user.avatar}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <UserIcon />
                            )}
                            <div className="text-left">
                <span className="text-sm font-medium text-gray-700 block">
                  {state.user?.name || 'User'}
                </span>
                                <span className="text-xs text-gray-500">
                  {state.user?.role || 'Role'}
                </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="px-4 py-2 border-b">
                                <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                                <p className="text-sm text-gray-500">{state.user?.email}</p>
                            </div>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Profile Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Account Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Help & Support
                            </a>
                            <div className="border-t">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}