// app/dashboard/components/layout/TopBar.tsx - QUICK MOBILE FIX

import { BellIcon, UserIcon } from '../icons/Icons';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSafeTheme } from '@/app/hooks/useSafeTheme';
import { useState } from 'react';

// TAMBAHAN: MenuIcon untuk mobile menu button
const MenuIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

interface TopBarProps {
    menuItems: MenuItem[];
    activeMenuItem: string;
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

export default function TopBar({
                                   menuItems,
                                   activeMenuItem,
                                   sidebarOpen,
                                   setSidebarOpen
                               }: TopBarProps) {
    const { state, logout } = useAuth();
    const { theme, setTheme, mounted } = useSafeTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

    // Get active menu label for title
    const activeMenuLabel = menuItems.find(item => item.id === activeMenuItem)?.label || 'Dashboard';

    const handleLogout = () => {
        logout();
    };

    const themes = [
        {
            value: 'light' as const,
            label: 'Light',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            value: 'dark' as const,
            label: 'Dark',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
        },
        {
            value: 'auto' as const,
            label: 'Auto',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    if (!mounted) return null;

    return (
        <header className="bg-white [data-theme='dark']_&:bg-gray-800 border-b border-gray-100 [data-theme='dark']_&:border-gray-700 shadow-sm z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* LEFT SECTION - Mobile Menu + Title */}
                    <div className="flex items-center space-x-4">
                        {/* MOBILE MENU BUTTON - CRITICAL FIX */}
                        <button
                            onClick={() => setSidebarOpen?.(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-600 [data-theme='dark']_&:text-gray-400 hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>

                        {/* PAGE TITLE */}
                        <div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 [data-theme='dark']_&:text-white">
                                {activeMenuLabel}
                            </h1>
                        </div>
                    </div>

                    {/* RIGHT SECTION - Theme, Notifications, User */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* THEME SELECTOR */}
                        <div className="relative">
                            <button
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                className="p-2 rounded-md text-gray-600 [data-theme='dark']_&:text-gray-400 hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700 transition-colors"
                                aria-label="Change theme"
                            >
                                {themes.find(t => t.value === theme)?.icon || themes[0].icon}
                            </button>

                            {/* Theme Dropdown */}
                            {isThemeMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsThemeMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 bg-white [data-theme='dark']_&:bg-gray-800 rounded-md border border-gray-100 [data-theme='dark']_&:border-gray-600 shadow-lg py-1 z-20">
                                        {themes.map((themeOption) => (
                                            <button
                                                key={themeOption.value}
                                                onClick={() => {
                                                    setTheme(themeOption.value);
                                                    setIsThemeMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700 transition-colors ${
                                                    theme === themeOption.value
                                                        ? 'bg-blue-50 [data-theme=\'dark\']_&:bg-blue-900/20 text-blue-600 [data-theme=\'dark\']_&:text-blue-400'
                                                        : 'text-gray-700 [data-theme=\'dark\']_&:text-gray-300'
                                                }`}
                                            >
                                                <span className="mr-2">{themeOption.icon}</span>
                                                {themeOption.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* NOTIFICATIONS - Hidden on small screens */}
                        <button className="hidden sm:block p-2 rounded-md text-gray-600 [data-theme='dark']_&:text-gray-400 hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700 transition-colors relative">
                            <BellIcon />
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* USER MENU */}
                        <div className="relative group">
                            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700 transition-colors">
                                {/* User Avatar */}
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-300 [data-theme='dark']_&:bg-gray-600 flex items-center justify-center">
                                    {state.user?.avatar ? (
                                        <img
                                            src={state.user.avatar}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon/>
                                    )}
                                </div>

                                {/* User Name - Hidden on small screens */}
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">
                                        {state.user?.name || 'User'}
                                    </p>
                                </div>

                                {/* Dropdown Arrow */}
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border-gray-100 shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 [data-theme='dark']_&:bg-gray-800 border border-gray-100 [data-theme='dark']_&:border-gray-600">
                                <div className="px-4 py-2 border-b border-gray-100 [data-theme='dark']_&:border-gray-600">
                                    <p className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{state.user?.name}</p>
                                    <p className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{state.user?.email}</p>
                                </div>
                                <a href="#" className="block px-4 py-2 border-gray-100 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                    Profile Settings
                                </a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                    Account Settings
                                </a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                    Help & Support
                                </a>
                                <div className="border-t border-gray-100 [data-theme='dark']_&:border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:bg-gray-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}